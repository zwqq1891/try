# reloop Backend

這個後端負責帳號登入、MySQL 資料儲存、碳幣餘額、回收紀錄、本月回收重量、本月減碳量、獎勵兌換，以及之後要接的 AI 圖片辨識。

## Setup

1. 建立資料庫與資料表：

```zsh
mysql -u root -p < ../sql/schema.sql
```

2. 建立環境設定：

```zsh
cp .env.example .env
```

然後把 `.env` 裡的 MySQL 帳號密碼改成你的。

3. 安裝套件並啟動：

```zsh
npm install
npm start
```

啟動後會在：

```text
http://localhost:3000
```

## Main APIs

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/me
GET  /api/waste-types
GET  /api/summary
GET  /api/records
POST /api/records
GET  /api/rewards
POST /api/rewards/:id/redeem
POST /api/classify
```

`/api/classify` 已經先留好位置，之後會接 OpenAI 或 Gemini。AI 只要回傳 `itemId`、`size`、`cleanliness`、`confidence`，後端就能用 MySQL 裡的標準計算點數與減碳量。
