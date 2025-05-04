### リポジトリ構成（GitHub で 2 つ）

- `shooting-game-frontend`（React + Tailwind）
- `shooting-game-backend`（FastAPI）

---

## ディレクトリ構成（React + Vite）

```pgsql
shooting-game-frontend/
├── public/                  # 画像・faviconなど
├── src/
│   ├── components/          # UI部品
│   ├── pages/               # Home, Ranking など
│   ├── api/                 # API呼び出し（fetch wrapper）
│   └── App.tsx
├── tailwind.config.js
├── vite.config.ts
├── Dockerfile               # フロント用Docker
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions for frontend
└── README.md
```

- 🎯 **Render**でデプロイ
- API URL は .env で設定：`VITE_API_URL=https://your-api.render.com`

---
