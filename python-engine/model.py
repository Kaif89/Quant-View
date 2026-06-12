"""
model.py — ML pipeline: feature engineering, XGBoost training,
prediction generation, and metric calculation.

Returns a dict with predicted prices, T+1 prediction, metrics, feature 
importances, and training metadata for the API response.
"""

import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from xgboost import XGBRegressor

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

    try:
        # ── 1. XGBoost Pipeline ──
        xgb_model = XGBRegressor(
            n_estimators=50,
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

        # Metrics
        mse = mean_squared_error(y_test, pred_test_xgb)
        r2 = r2_score(y_test, pred_test_xgb)
        mae = mean_absolute_error(y_test, pred_test_xgb)

        print(f"[Model] XGBoost — MSE: {mse:.4f}, MAE: {mae:.4f}, R²: {r2:.4f}")

        # Assemble Full History
        predicted_prices = []
        dates = model_df['date'].values
        for i, date in enumerate(dates):
            predicted_prices.append({
                "date": str(date),
                "value": float(np.round(all_preds_xgb[i], 2)),
            })

        return {
            "predicted_prices": predicted_prices,
            "next_day_prediction": float(np.round(next_pred_xgb, 2)),
            "mse": float(np.round(mse, 4)),
            "mae": float(np.round(mae, 4)),
            "r2_score": float(np.round(r2, 4)),
            "model_used": "XGBoost",
            "feature_importances": importances,
            "regressionCoefficients": {"slope": 0.0, "intercept": 0.0},
            "dataPoints": len(model_df),
            "trainingSize": split_idx,
        }
    except Exception as e:
        raise RuntimeError(f"Prediction engine error: {str(e)}")
