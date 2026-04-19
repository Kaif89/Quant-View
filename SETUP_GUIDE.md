# QuantView — Setup & Run Guide

Step-by-step instructions to run all three services locally.

---

## Prerequisites

| Tool | Version | Check Command |
|---|---|---|
| **Node.js** | 18+ | `node --version` |
| **Python** | 3.10+ | `python3 --version` |
| **Java JDK** | 17+ | `java --version` |

> **Don't have Java?** Install it:
> ```bash
> # Ubuntu/Debian
> sudo apt install openjdk-17-jdk
>
> # Fedora
> sudo dnf install java-17-openjdk-devel
>
> # Arch
> sudo pacman -S jdk17-openjdk
> ```

---

## Startup Order (Important!)

**Start in this exact order:**

```
1. Python ML Engine  (port 5000)  ← must be first
2. Spring Boot       (port 8080)  ← connects to Python
3. React Frontend    (port 5173)  ← connects to Spring Boot
```

---

## Terminal 1 — Python ML Engine

```bash
cd python-engine

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies (first time only)
pip install -r requirements.txt

# Start the ML engine
python app.py
```

**Expected output:**
```
============================================================
  QuantView ML Engine
  Running on http://localhost:5000
  Endpoints:
    GET /predict?ticker={symbol}
    GET /health
============================================================
```

**Verify it works:**
```bash
# In a separate terminal:
curl http://localhost:5000/health
# Should return: {"service":"quantview-ml-engine","status":"ok"}
```

---

## Terminal 2 — Spring Boot Backend

```bash
cd backend

# Make mvnw executable (first time only)
chmod +x mvnw

# Start Spring Boot
./mvnw spring-boot:run
```

**Expected output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
...
Started QuantviewApplication in X seconds
```

**Verify it works:**
```bash
curl http://localhost:8080/api/health
# Should return: {"success":true,"data":{"status":"ok"},"timestamp":"..."}
```

---

## Terminal 3 — React Frontend

```bash
cd frontend

# Start dev server (already running if you see it)
npm run dev
```

**Open:** http://localhost:5173

---

## Quick Test: Full Pipeline

Once all 3 services are running, test the full prediction pipeline:

```bash
# 1. Test Python directly
curl "http://localhost:5000/predict?ticker=AAPL" | head -c 200

# 2. Test through Spring Boot (this is what React uses)
curl "http://localhost:8080/api/predict/AAPL" | head -c 200

# 3. Open the dashboard and search "AAPL" — you should see:
#    - Real stock chart with historical prices
#    - Prediction overlay (orange line)
#    - KPI cards: Current Price, T+1 Prediction, R², MSE
#    - Feature importances bar chart
#    - Model name: "XGBoost + LSTM (0.6/0.4 Ensemble)"
```

---

## Troubleshooting

### "ML Engine unavailable" on the dashboard
→ Python isn't running. Start it first (Terminal 1).

### "Connection refused" on port 8080
→ Spring Boot isn't running. Start it (Terminal 2).

### Java not found
```bash
# Check if Java is installed
java --version

# If not, install JDK 17:
sudo apt install openjdk-17-jdk   # Ubuntu
```

### Python package errors
```bash
cd python-engine
source venv/bin/activate
pip install --upgrade -r requirements.txt
```

### Port already in use
```bash
# Check what's using a port
lsof -i :5000   # Python
lsof -i :8080   # Spring Boot
lsof -i :5173   # React

# Kill it
kill -9 $(lsof -ti :5000)
```

### CORS errors in browser console
→ Make sure you're accessing the frontend at `http://localhost:5173` (not 127.0.0.1 or any other URL).

---

## Environment Variables (Optional)

| Variable | File | Purpose | Required |
|---|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | `frontend/.env` | Authentication | No (app works without) |
| `FINNHUB_API_KEY` | System env | Live market WebSocket | No (uses polling fallback) |

---

## Stop All Services

```bash
# Ctrl+C in each terminal, or:
kill $(lsof -ti :5000)   # Kill Python
kill $(lsof -ti :8080)   # Kill Spring Boot
kill $(lsof -ti :5173)   # Kill React
```
