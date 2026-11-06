import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
index = json.loads((ROOT / "data/groups/index.json").read_text(encoding="utf-8"))
assert index, "團體索引不可為空"
for item in index:
    group_path = ROOT / item["file"]
    assert group_path.exists(), f"找不到團體資料：{item['file']}"
    group = json.loads(group_path.read_text(encoding="utf-8"))
    song_ids = {s["id"] for s in group["songs"]}
    album_ids = {a["id"] for a in group["albums"]}
    assert len(song_ids) == len(group["songs"]), "歌曲 ID 重複"
    assert len(album_ids) == len(group["albums"]), "專輯 ID 重複"
    for album in group["albums"]:
        for sid in album["songIds"]:
            assert sid in song_ids, f"{album['id']} 對應不到歌曲 {sid}"
    for song in group["songs"]:
        assert song["albumId"] in album_ids, f"{song['id']} 對應不到專輯"
        assert song.get("officialSource", "").startswith("https://"), f"{song['id']} 缺少官方來源"
        assert song.get("chantSections"), f"{song['id']} 尚無應援提示"
print("資料檢查完成：JSON、專輯歌曲對應、官方來源欄位及應援提示欄位均存在。")
print("注意：此腳本不會連線驗證外部圖片或官方網址是否仍可用。")
