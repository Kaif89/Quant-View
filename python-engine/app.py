"""
app.py — Flask server for the QuantView ML microservice.

Exposes endpoints:
  GET /predict?ticker={symbol}  — runs ML pipeline and returns prediction JSON
  GET /health                   — service health check

Returns JSON matching the full QuantView response schema, including fields
needed by both the frontend (historical_prices, predicted_prices, sma_20, ema_20)
and the spec (currentPrice, predictedPrice, regressionCoefficients, etc.).
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import pandas as pd

from data_fetcher import fetch_stock_data
from model import train_and_predict

app = Flask(__name__)

# Allow CORS from Spring Boot (8080) and React dev server (5173)
CORS(app, origins=["http://localhost:8080", "http://localhost:5173"])


@app.route('/stock', methods=['GET'])
def get_stock():
    """
    Acts as a yfinance wrapper for Spring Boot. 
    Fetches raw OHLCV data without running predictions.
    """
    ticker = request.args.get('ticker', '').strip().upper()
    if not ticker:
        return jsonify({"error": "Missing 'ticker' query parameter"}), 400

    try:
        df = fetch_stock_data(ticker)
        historical_prices = []
        for _, row in df.iterrows():
            historical_prices.append({
                "date": row['date'],
                "open": round(float(row['open']), 2),
                "high": round(float(row['high']), 2),
                "low": round(float(row['low']), 2),
                "close": round(float(row['close']), 2),
                "volume": int(row['volume']),
            })
        return jsonify(historical_prices), 200

    except TimeoutError as e:
        return jsonify({"error": str(e)}), 503
    except ValueError as e:
        err_msg = str(e)
        if "No data" in err_msg:
            return jsonify({"error": "Ticker not found on exchange"}), 404
        return jsonify({"error": err_msg}), 400
    except Exception as e:
        return jsonify({"error": f"Internal wrapper error: {str(e)}"}), 500

@app.route('/predict', methods=['GET'])
def predict():
    """
    Main prediction endpoint. Fetches stock data, trains model,
    and returns comprehensive analysis JSON.
    """
    ticker = request.args.get('ticker', '').strip().upper()

    if not ticker:
        return jsonify({"error": "Missing 'ticker' query parameter"}), 400

    print(f"\n{'='*60}")
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Request: /predict?ticker={ticker}")
    print(f"{'='*60}")

    try:
        # 1. Fetch and clean data via yfinance
        df = fetch_stock_data(ticker)

        # 2. Train model and generate predictions
        result = train_and_predict(df)

        # 3. Build the frontend-compatible response (historical_prices, sma_20, ema_20, etc.)
        historical_prices = []
        for _, row in df.iterrows():
            historical_prices.append({
                "date": row['date'],
                "open": round(float(row['open']), 2),
                "high": round(float(row['high']), 2),
                "low": round(float(row['low']), 2),
                "close": round(float(row['close']), 2),
                "volume": int(row['volume']),
            })

        # SMA-20 and EMA-20 series for chart overlays
        sma_20 = [{"date": row['date'], "value": round(float(row['sma_20']), 2)}
                   for _, row in df.iterrows() if not pd.isna(row.get('sma_20'))]

        ema_20 = [{"date": row['date'], "value": round(float(row['ema_20']), 2)}
                   for _, row in df.iterrows() if not pd.isna(row.get('ema_20'))]

        # 4. Build the spec-compliant historicalData array (with actual, predicted, sma50, sma200)
        pred_lookup = {p["date"]: p["value"] for p in result["predicted_prices"]}

        historical_data = []
        for _, row in df.iterrows():
            entry = {
                "date": row['date'],
                "actual": round(float(row['close']), 2),
                "predicted": pred_lookup.get(row['date']),
                "sma50": round(float(row['sma_50']), 2) if not pd.isna(row.get('sma_50')) else None,
                "sma200": round(float(row['sma_200']), 2) if not pd.isna(row.get('sma_200')) else None,
            }
            historical_data.append(entry)

        # 5. Compute price change values
        current_price = round(float(df.iloc[-1]['close']), 2)
        predicted_price = result["next_day_prediction"]
        price_change = round(predicted_price - current_price, 2)
        price_change_pct = round((price_change / current_price) * 100, 2) if current_price != 0 else 0.0

        # 6. Assemble the full response
        response = {
            # === Spec fields ===
            "ticker": ticker,
            "currentPrice": current_price,
            "predictedPrice": predicted_price,
            "priceChange": price_change,
            "priceChangePercent": price_change_pct,
            "mse": result["mse"],
            "mae": result.get("mae"),
            "r2Score": result["r2_score"],
            "feature_importances": result.get("feature_importances"),
            "historicalData": historical_data,
            "regressionCoefficients": result["regressionCoefficients"],
            "dataPoints": result["dataPoints"],
            "trainingSize": result["trainingSize"],
            "lastUpdated": datetime.now().isoformat(),
            "modelUsed": result["model_used"],

            # === Frontend-compatible fields (kept for backward compat) ===
            "historical_prices": historical_prices,
            "predicted_prices": result["predicted_prices"],
            "sma_20": sma_20,
            "ema_20": ema_20,
            "next_day_prediction": result["next_day_prediction"],
            "r2_score": result["r2_score"],
        }

        print(f"[Response] {len(historical_prices)} data points, "
              f"T+1=${result['next_day_prediction']}, "
              f"R²={result['r2_score']}, "
              f"Model={result['model_used']}")

        return jsonify(response), 200

    except TimeoutError as e:
        print(f"[Error 503] {str(e)}")
        return jsonify({"error": str(e)}), 503

    except ValueError as e:
        err_msg = str(e)
        if "Insufficient" in err_msg:
            print(f"[Error 422] {err_msg}")
            return jsonify({"error": err_msg}), 422
        else:
            print(f"[Error 404] {err_msg}")
            return jsonify({"error": err_msg}), 404

    except RuntimeError as e:
        print(f"[Error 500] {str(e)}")
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        print(f"[Error 500] {str(e)}")
        return jsonify({"error": f"Prediction engine error: {str(e)}"}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint for Spring Boot startup probe."""
    return jsonify({"status": "ok", "service": "quantview-ml-engine"}), 200


if __name__ == '__main__':
    from market_poller import start_poller_thread
    print("\n" + "=" * 60)
    print("  QuantView ML Engine")
    print("  Running on http://localhost:5000")
    print("  Endpoints:")
    print("    GET /predict?ticker={symbol}")
    print("    GET /health")
    print("=" * 60 + "\n")

    # Initiate Real-time Market Polling background thread
    start_poller_thread()
    app.run(host='0.0.0.0', port=5000, debug=True)
