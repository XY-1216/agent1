# K-pop Fan Chant Guide

繁體中文 K-pop 官方應援資料查找網站，目前收錄 &TEAM 8 首歌曲。

## 功能
- 首頁、團體頁、專輯頁、歌曲頁與收藏頁
- 團體／專輯圖片、搜尋、LocalStorage 收藏
- 歌曲頁顯示應援口號、應援段落提示與官方來源
- Good Boy、Love Jang 提供官方 Weverse 應援示範影片直達連結
- 支援桌面與手機版

## 圖片
團體與專輯圖片使用官方網站／官方發行頁的圖片 URL，並設有備用圖。若官方圖片伺服器日後更改網址或限制外部載入，請更新 `data/groups/andteam/group.json` 的 `image`／`cover` URL。

## 應援內容說明
本版整理官方來源中可確認的短應援提示與段落定位。Good Boy、Love Jang 使用官方 Weverse 示範影片作為主要應援內容來源；請從歌曲頁直接開啟影片。歌詞不做整首轉錄，完整內容以官方頁面／影片為準。

## 本機預覽
在專案根目錄執行：
```bash
python3 -m http.server 8000
```
再開啟 `http://localhost:8000`。

## GitHub Pages 部署
1. 將 ZIP 解壓縮。
2. 將資料夾內的檔案與資料夾上傳至 Repository 根目錄。
3. 保留 `css/`、`js/`、`data/`、`assets/` 結構。
4. Settings → Pages → Deploy from a branch → `main` → `/(root)`。
