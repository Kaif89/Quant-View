"""
test_model.py — End-to-end test for the QuantView ML pipeline.

Tests the full data_fetcher -> model pipeline with real tickers:
  - AAPL (US market)
  - RELIANCE.NS (NSE India)
  - INFY.NS (NSE India)

Prints the JSON response for each ticker and asserts key fields are present.
"""

import json
import sys
from data_fetcher import fetch_stock_data
from model import train_and_predict


# Required fields in the model result
REQUIRED_MODEL_FIELDS = [
    "predicted_prices", "next_day_prediction", "mse", "r2_score",
    "model_used", "regressionCoefficients", "dataPoints", "trainingSize",
]

# Tickers to test
TEST_TICKERS = ["AAPL", "RELIANCE.NS", "INFY.NS"]


def test_ticker(ticker: str) -> dict:
    """
    Run the full pipeline for one ticker and validate the result.

    Args:
        ticker: Stock symbol to test.

    Returns:
        The result dict from train_and_predict.

    Raises:
        AssertionError: If any required field is missing or invalid.
    """
    print(f"\n{'='*60}")
    print(f"  Testing ticker: {ticker}")
    print(f"{'='*60}")

    # Step 1: Fetch data
    df = fetch_stock_data(ticker)
    assert len(df) > 0, f"DataFrame is empty for {ticker}"
    assert 'close' in df.columns, f"Missing 'close' column for {ticker}"
    assert 'sma_50' in df.columns, f"Missing 'sma_50' column for {ticker}"
    assert 'sma_200' in df.columns, f"Missing 'sma_200' column for {ticker}"
    print(f"  Fetched {len(df)} rows")

    # Step 2: Train model and predict
    result = train_and_predict(df)

    # Step 3: Validate all required fields exist
    for field in REQUIRED_MODEL_FIELDS:
        assert field in result, f"Missing required field: '{field}' for {ticker}"
    print(f"  All required fields present")

    # Step 4: Validate field types and ranges
    assert isinstance(result["predicted_prices"], list), "predicted_prices should be a list"
    assert len(result["predicted_prices"]) > 0, "predicted_prices should not be empty"
    assert isinstance(result["next_day_prediction"], float), "next_day_prediction should be a float"
    assert result["next_day_prediction"] > 0, "next_day_prediction should be positive"
    assert isinstance(result["mse"], float), "mse should be a float"
    assert result["mse"] >= 0, "mse should be non-negative"
    assert isinstance(result["r2_score"], float), "r2_score should be a float"
    assert isinstance(result["regressionCoefficients"], dict), "regressionCoefficients should be a dict"
    assert "slope" in result["regressionCoefficients"], "Missing slope in regressionCoefficients"
    assert "intercept" in result["regressionCoefficients"], "Missing intercept in regressionCoefficients"
    assert isinstance(result["dataPoints"], int), "dataPoints should be an int"
    assert isinstance(result["trainingSize"], int), "trainingSize should be an int"
    assert result["trainingSize"] < result["dataPoints"], "trainingSize should be less than dataPoints"
    print(f"  All field validations passed")

    # Step 5: Print the full result as formatted JSON
    print(f"\n  JSON Response for {ticker}:")
    print(json.dumps({
        "ticker": ticker,
        "next_day_prediction": result["next_day_prediction"],
        "mse": result["mse"],
        "r2_score": result["r2_score"],
        "model_used": result["model_used"],
        "regressionCoefficients": result["regressionCoefficients"],
        "dataPoints": result["dataPoints"],
        "trainingSize": result["trainingSize"],
        "predicted_prices_count": len(result["predicted_prices"]),
        "first_prediction": result["predicted_prices"][0],
        "last_prediction": result["predicted_prices"][-1],
    }, indent=2))

    return result


def main():
    """Run tests for all tickers and print summary."""
    passed = 0
    failed = 0

    for ticker in TEST_TICKERS:
        try:
            test_ticker(ticker)
            passed += 1
            print(f"\n  PASSED: {ticker}")
        except Exception as e:
            failed += 1
            print(f"\n  FAILED: {ticker} -- {str(e)}")

    # Summary
    print(f"\n{'='*60}")
    print(f"  Test Summary: {passed} passed, {failed} failed out of {len(TEST_TICKERS)}")
    print(f"{'='*60}\n")

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
