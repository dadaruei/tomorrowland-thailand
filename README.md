# Tomorrowland Thailand 2026 — Our Journey

這是手機優先的靜態旅遊行程網站。**原始 Google Sheets 不會被修改。**

## 目前提供
- 2026/12/09–12/17 九天行程、日期切換、泰國時區倒數、地圖搜尋連結、狀態標籤。
- `data.json` 是根據試算表人工整理的第一版快照，尚非即時資料；部分活動時間、訂位與接駁須再次核實。
- **沒有**護照姓名、訂單號碼、個人分攤、電話或私人住址資料。

## 立即預覽
在本資料夾執行 `python3 -m http.server 8000`，開啟 `http://localhost:8000`。直接雙擊 HTML 時瀏覽器可能阻止讀取 JSON。

## 發布到 GitHub Pages
1. 建立新的 GitHub repository，將此資料夾所有檔案（包括 `.github/workflows/sync.yml`）上傳至 repository 根目錄。
2. Repository → Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save。
3. 等待 Pages 建置完成，再使用 GitHub 顯示的網址。公開 repository 的所有檔案皆可被他人讀取。

## 設定 Google Sheets 自動同步（選用，先確認資料格式）
1. 前往 [script.google.com](https://script.google.com) 建立 Apps Script 專案，貼上 `Code.gs`。
2. Apps Script → Deploy → New deployment → Web app → Execute as **Me**；Who has access 選 **Anyone**。這會公開此程式輸出的資料，**務必先審核 Code.gs 的欄位白名單與輸出內容**。
3. 複製部署產生的 Web app URL（`/exec`），在 GitHub repository → Settings → Secrets and variables → Actions 新增 secret `PUBLIC_ITINERARY_FEED_URL`，貼上 URL。
4. GitHub Actions → Sync public itinerary → Run workflow，檢查 `data.json` 更新後網站呈現。
5. 之後 GitHub Actions 約每 15 分鐘執行一次（排程可能延遲），網頁每 5 分鐘重新讀取 `data.json`。因此**不是即時同步**。

### 注意：同步後呈現方式
`Code.gs` 目前是**安全、保守的初版轉換器**：直接讀取原始表格 A8:J16 中的 A、D、E、F、G、H 欄，將上午、下午、晚上作為三張活動卡片；不會猜測文字中的精確時間或是否已訂位。因此開啟自動同步後，網站會以三時段卡片取代第一版人工整理的逐項時間軸。若要保留精細時間軸，需另外建立獨立的網站資料表，或擴充解析器，仍不必改動原始表格。

### 重要限制
- GitHub Pages 不提供存取控制，勿上傳個人拆帳、證件、私人地址或訂單憑證。
- Google Apps Script Web app 若設定 Anyone，任何取得網址的人都能讀取白名單資料。
- GitHub Actions 的 cron 並不保證準點執行，若 Actions 長期無活動可能停用。
- 目前地圖連結是 Google Maps 搜尋，不是已驗證的精確地點座標。
- `Code.gs` 不會寫入或修改來源試算表。
