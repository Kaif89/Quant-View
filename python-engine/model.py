"""
model.py — ML pipeline: feature engineering, XGBoost training,
prediction generation, and metric calculation.

Returns a dict with predicted prices, T+1 prediction, metrics, feature 
importances, and training metadata for the API response.
"""

import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor
import torch
import torch.nn as nn
import torch.optim as optim

class SimpleLSTM(nn.Module):
    def __init__(self, input_size, hidden_size=64, num_layers=1):
        super(SimpleLSTM, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        out, _ = self.lstm(x)
        return self.fc(out[:, -1, :])


def train_and_predict(df: pd.DataFrame) -> dict:
    """
    Train XGBoost on the stock data and generate predictions.

    Args:
        df: DataFrame from data_fetcher with OHLCV + technical indicators.

    Returns:
        dict with predictions, metrics, feature_importances, etc.
    """
    # Convert date strings to ordinal integers (kept just for reference or plotting, not used in XGB)
    df = df.copy()
    df['date_ordinal'] = pd.to_datetime(df['date']).map(lambda d: d.toordinal())

    feature_cols = [
        'sma_50', 'sma_200', 'rsi_14', 'macd', 'macd_signal',
        'bb_upper', 'bb_lower', 'daily_return', 'volume_change',
        'lag_1', 'lag_2', 'lag_3', 'lag_5'
    ]
    target_col = 'close'

    # Drop rows with NaN (introduced by lags and moving averages)
    model_df = df[feature_cols + [target_col, 'date', 'date_ordinal']].dropna().copy()

    if len(model_df) < 60:
        raise ValueError("Insufficient historical data for prediction (need at least 60 rows after dropping NaNs)")

    X = model_df[feature_cols].values
    y = model_df[target_col].values

    # Use the last 30 days as the test set (time-series split)
    split_idx = len(X) - 30
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    # ── Map Exceptions ──
    try:
        # ── 1. XGBoost Pipeline ──
        xgb_model = XGBRegressor(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            objective='reg:squarederror'
        )
        xgb_model.fit(X_train, y_train)
        pred_test_xgb = xgb_model.predict(X_test)
        
        # XGB Feature Importances
        importances = {feat: float(np.round(imp, 4)) for feat, imp in zip(feature_cols, xgb_model.feature_importances_)}

        # XGB Full History
        all_preds_xgb = xgb_model.predict(X)

        # XGB T+1
        last_row = model_df.iloc[-1]
        next_features = np.array([[float(last_row[col]) for col in feature_cols]])
        next_pred_xgb = float(xgb_model.predict(next_features)[0])


        # ── 2. LSTM Pipeline ──
        # Sequences required for LSTM windowing
        seq_len = 10
        scaler_X = StandardScaler()
        scaler_y = StandardScaler()
        X_scaled = scaler_X.fit_transform(X)
        y_scaled = scaler_y.fit_transform(y.reshape(-1, 1)).flatten()
        
        X_seq, y_seq = [], []
        for i in range(len(X_scaled) - seq_len):
            X_seq.append(X_scaled[i:i+seq_len])
            y_seq.append(y_scaled[i+seq_len])
            
        X_seq = torch.FloatTensor(np.array(X_seq))
        y_seq = torch.FloatTensor(np.array(y_seq)).view(-1, 1)

        lstm_split_idx = split_idx - seq_len
        X_train_lstm, X_test_lstm = X_seq[:lstm_split_idx], X_seq[lstm_split_idx:]
        y_train_lstm, y_test_lstm = y_seq[:lstm_split_idx], y_seq[lstm_split_idx:]

        lstm_model = SimpleLSTM(input_size=len(feature_cols)).float()
        criterion = nn.MSELoss()
        optimizer = optim.Adam(lstm_model.parameters(), lr=0.01)

        # Train LSTM
        lstm_model.train()
        for epoch in range(150):
            optimizer.zero_grad()
            outputs = lstm_model(X_train_lstm)
            loss = criterion(outputs, y_train_lstm)
            loss.backward()
            optimizer.step()

        lstm_model.eval()
        with torch.no_grad():
            # Test set predictions
            pred_test_lstm_scaled = lstm_model(X_test_lstm).numpy()
            pred_test_lstm = scaler_y.inverse_transform(pred_test_lstm_scaled).flatten()
            
            # Full history predictions
            all_preds_lstm_scaled = lstm_model(X_seq).numpy()
            all_preds_lstm = scaler_y.inverse_transform(all_preds_lstm_scaled).flatten()
            
            # T+1 Prediction
            next_features_scaled = scaler_X.transform(X[-seq_len:])
            next_seq = torch.FloatTensor(next_features_scaled).unsqueeze(0)
            next_pred_lstm_scaled = lstm_model(next_seq).numpy()
            next_pred_lstm = scaler_y.inverse_transform(next_pred_lstm_scaled)[0][0]


        # ── 3. Combine Envelope (0.6 XGB + 0.4 LSTM) ──
        # Ensemble Test Set
        pred_test_ensemble = 0.6 * pred_test_xgb + 0.4 * pred_test_lstm

        mse = mean_squared_error(y_test, pred_test_ensemble)
        r2 = r2_score(y_test, pred_test_ensemble)
        mae = mean_absolute_error(y_test, pred_test_ensemble)

        print(f"[Model] Ensemble (60 XGB/40 LSTM) — MSE: {mse:.4f}, MAE: {mae:.4f}, R²: {r2:.4f}")

        # Ensemble Full History (Padding the first seq_len days with purely XGB)
        predicted_prices = []
        dates = model_df['date'].values
        for i, date in enumerate(dates):
            if i < seq_len:
                val = float(all_preds_xgb[i])
            else:
                val = 0.6 * float(all_preds_xgb[i]) + 0.4 * float(all_preds_lstm[i - seq_len])
                
            predicted_prices.append({
                "date": str(date),
                "value": float(np.round(val, 2)),
            })

        # Ensemble T+1 Prediction
        next_day_pred = 0.6 * next_pred_xgb + 0.4 * float(next_pred_lstm)

        return {
            "predicted_prices": predicted_prices,
            "next_day_prediction": float(np.round(next_day_pred, 2)),
            "mse": float(np.round(mse, 4)),
            "mae": float(np.round(mae, 4)),
            "r2_score": float(np.round(r2, 4)),
            "model_used": "XGBoost + LSTM (0.6/0.4 Ensemble)",
            "feature_importances": importances,
            "regressionCoefficients": {"slope": 0.0, "intercept": 0.0}, # Backwards compat
            "dataPoints": len(model_df),
            "trainingSize": split_idx,
        }
    except Exception as e:
        raise RuntimeError(f"Prediction engine error: {str(e)}")
