# AGENTS.md — K-pop Fan Chant Guide

## 專案目的
以繁體中文呈現 K-pop 團體、專輯、歌曲與官方應援資料的查找網站。本站目前收錄 &TEAM 精選 8 首歌，不宣稱是完整曲庫。

## 技術架構
- `index.html`：網站入口與共用版型。
- `css/style.css`：版面、色彩、字體與響應式設計。
- `js/main.js`：資料載入、導覽、搜尋、收藏與歌曲內容呈現。
- `data/groups/index.json`：團體索引。
- `data/groups/<group>/group.json`：團體、專輯、歌曲及應援提示資料。
- `assets/`：圖片載入失敗時的備用圖。
- 收藏與首次提示使用 LocalStorage。

## 固定資料格式
團體 JSON 頂層包含 `id`、`name`、`image`、`albums`、`songs`。
- 專輯：`id`、`title`、`cover`、`songIds`、`officialSource`。
- 歌曲：`id`、`title`、`albumId`、`officialSource`、`sourceLabel`、`lyricGuide`、`chantSections`。
- `chantSections` 每筆包含 `label`、`cue`、`detail`；若有官方示範影片，可增加 `guideVideo`。
- 所有 id 必須唯一；每個 songId 必須能對應 songs 中的歌曲；每首歌都要有官方來源。

## 官方來源查證規則
1. 優先使用團體／經紀公司官方網站、官方 Weverse、官方 YouTube。
2. 不得用搜尋摘要或粉絲自製資料冒充官方來源。
3. 若只有官方集合頁，需在資料中標明，並提供可辨識的單曲官方頁或官方示範影片。
4. 專輯歸屬以官方 discography 核對。
5. 圖片優先使用官方網站或官方發行頁的圖片 URL；需設置載入失敗備用圖。不可假稱備用圖是官方封面。
6. 不確定的應援文字不得自行補寫；以官方示範連結和段落定位代替。

## 內容呈現規則
- 珊瑚紅 `#E85D4A` 用於應援口號與提示。
- 歌詞段落可用定位描述，避免整首歌詞轉載。
- 只收錄已查證的短應援提示；不要將一般歌詞誤標為應援口號。
- 官方示範影片或官方應援頁要能從歌曲頁直接開啟。
- 不擅自補寫翻譯、韓文羅馬拼音、團員介紹或團體介紹。

## 新增歌曲標準流程
1. 確認使用者指定團體、歌曲及版本。
2. 搜尋並開啟官方應援頁或官方示範影片。
3. 核對官方 discography 的專輯歸屬。
4. 查找官方圖片 URL，並確認圖片可直接顯示；提供備用圖。
5. 依 schema 新增歌曲、更新專輯 songIds。
6. 測試團體頁、專輯頁、歌曲頁、官方連結、搜尋與收藏。
7. 回報新增資料、官方來源及尚未確認項目。

## 修改守則
- 保留首頁、團體、專輯、歌曲、收藏、搜尋、首次提示功能。
- GitHub Pages 專案部署在子路徑時，使用相對路徑載入本專案 CSS、JS、JSON。
- 外部連結需 `target="_blank"` 與 `rel="noopener"`。
- 不加入 API key、付費服務或後端依賴。
