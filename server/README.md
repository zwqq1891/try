# reloop Backend

這個後端負責帳號登入、MySQL 資料儲存、碳幣餘額、回收紀錄、本月回收重量、本月減碳量、獎勵兌換，以及之後要接的 AI 圖片辨識。

## Setup

### 1. 建立資料庫與資料表（MySQL）
由於 Windows 環境經常未配置 MySQL 環境變數，建議直接使用圖形化工具：
1. 打開 **MySQL Workbench** 並連線。
2. 點擊左上角選單 `File -> Open SQL Script...`。
3. 選取本專案資料夾中的 `sql/schema.sql`。
4. 點擊工具列的 **「黃色閃電」圖示 (Execute)** 執行。
5. 查看下方 Output 視窗，確認皆亮起綠燈即完成資料庫建立。

*(若你的 Mac/Linux 命令列環境已配置好 MySQL，亦可在根目錄直接執行：`mysql -u root -p < sql/schema.sql`)*

### 2. 建立環境設定 (.env)
在專案根目錄下打開終端機，執行以下指令來複製設定檔：

* **Windows (CMD):**
  ```bash
  copy server\.env.example server\.env
Mac / Linux:
Bash
cp server/.env.example server/.env
複製完成後，請用 VS Code 或記事本打開 server/.env，將裡面的資料庫密碼（DB_PASSWORD）修改為你本地端的 MySQL 密碼並存檔。
3. 安裝套件並啟動後端
在專案根目錄下打開終端機，依序執行：
Bash
cd server
npm install
npm start
(或者也可以在根目錄直接使用 Node 執行主程式：node server/app.js)
啟動成功後，後端 API 伺服器會運行在：
Plaintext
http://localhost:3000
4. 啟動前端網頁
⚠️ 請勿直接雙擊點開 index.html（會觸發瀏覽器的 file:/// 安全限制，導致 API 無法連線）。
推薦做法：使用 VS Code 的 Live Server 插件開啟 index.html，透過 http://127.0.0.1:5500 來瀏覽網頁並與後端 API 進行互動。
Main APIs
Plaintext
POST /api/auth/register       # 帳號註冊
POST /api/auth/login          # 帳號登入
GET  /api/me                  # 獲取當前用戶資料
GET  /api/waste-types         # 獲取回收類別標準
GET  /api/summary             # 獲取本月回收摘要 (重量、減碳量、碳幣)
GET  /api/records             # 獲取歷史回收紀錄
POST /api/records             # 新增回收紀錄
GET  /api/rewards             # 獲取獎勵兌換品項
POST /api/rewards/:id/redeem  # 兌換指定獎勵商品
POST /api/classify            # AI 圖片辨識 (預留接口)
AI 辨識接口說明 (/api/classify)

### /api/classify 已經先留好位置，之後會接 OpenAI 或 Gemini 的 API。AI 只要分析照片後回傳 itemId、size、cleanliness、confidence，後端就能自動對應 MySQL 裡的標準數據，精準計算出用戶應得的碳幣點數與減碳量。