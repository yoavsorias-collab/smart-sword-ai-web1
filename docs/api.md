# 📚 Smart Sword AI - API Documentation

## 🔌 Base URL
http://192.168.1.100:5000/
---

## 🛡️ Sword Control

### Open Blade

```http
POST /api/sword/open{
  "success": true,
  "action": "OPEN"
}POST /api/sword/closePOST /api/sword/stab
Content-Type: application/json

{
  "count": 3
}GET /api/ai/analyze{
  "threats": [...],
  "recommendation": {
    "ability": "מכת מוות",
    "sword_action": "PULSE_5",
    "message": "⚡ קרוב מאד! דקור!"
  }
}GET /api/battles/summary{
  "total_battles": 42,
  "victories": 30,
  "defeats": 10,
  "draws": 2,
  "win_rate": 71.4
}GET /api/training/modes
