#!/usr/bin/env python3
"""
Sync new images from Tistory posts to local Jekyll posts.

Usage:
  python scripts/sync_tistory.py                        # sync all posts
  python scripts/sync_tistory.py --post-url URL         # sync specific post
"""
import re
import sys
import argparse
from pathlib import Path

try:
    import requests
except ImportError:
    print("requests not installed. Run: pip install requests")
    sys.exit(1)

POSTS_DIR = Path("_posts")
SOURCE_PATTERN = re.compile(r'Source:\s*\[https://sanghole\.tistory\.com/(\d+)\]')
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}


def extract_image_keys(html: str) -> list[str]:
    """Return ordered, deduplicated CDN image keys from HTML."""
    return list(dict.fromkeys(re.findall(r"/dna/([^/]+)/", html)))


def extract_figure_for_key(html: str, key: str) -> str | None:
    """Return the <figure>…</figure> block containing the given image key."""
    for line in html.splitlines():
        if f"/dna/{key}/" not in line:
            continue
        m = re.search(r"<figure[^>]*>.*?</figure>", line)
        if m:
            return m.group(0)
        # Fallback: slice from <figure to </figure>
        if "<figure" in line and "</figure>" in line:
            start = line.index("<figure")
            end = line.rindex("</figure>") + len("</figure>")
            return line[start:end]
    return None


def get_tistory_info(post_path: Path) -> tuple[str | None, str | None]:
    content = post_path.read_text(encoding="utf-8")
    m = SOURCE_PATTERN.search(content)
    if m:
        pid = m.group(1)
        return f"https://sanghole.tistory.com/{pid}", pid
    return None, None


def sync_post(post_path: Path) -> bool:
    url, pid = get_tistory_info(post_path)
    if not url:
        return False

    print(f"[#{pid}] {post_path.name}")

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except Exception as e:
        print(f"  ERROR fetching {url}: {e}")
        return False

    tistory_html = resp.text
    local_content = post_path.read_text(encoding="utf-8")

    tistory_keys = extract_image_keys(tistory_html)
    local_keys_set = set(extract_image_keys(local_content))
    new_keys = [k for k in tistory_keys if k not in local_keys_set]

    if not new_keys:
        print("  No new images.")
        return False

    print(f"  New images ({len(new_keys)}): {new_keys}")

    updated = local_content

    for new_key in new_keys:
        figure_html = extract_figure_for_key(tistory_html, new_key)
        if not figure_html:
            print(f"  WARNING: could not extract <figure> for {new_key}")
            continue

        t_idx = tistory_keys.index(new_key)
        current_local = set(extract_image_keys(updated))

        # Find the nearest successor key that already exists in local file
        successor = next(
            (tistory_keys[i] for i in range(t_idx + 1, len(tistory_keys))
             if tistory_keys[i] in current_local),
            None,
        )
        # Find the nearest predecessor key that already exists in local file
        predecessor = next(
            (tistory_keys[i] for i in range(t_idx - 1, -1, -1)
             if tistory_keys[i] in current_local),
            None,
        )

        inserted = False

        if successor:
            # Insert just before successor's <figure> tag
            succ_pos = updated.find(f"/dna/{successor}/")
            if succ_pos != -1:
                fig_start = updated.rfind("<figure", 0, succ_pos)
                if fig_start != -1:
                    updated = updated[:fig_start] + figure_html + "\n" + updated[fig_start:]
                    print(f"  Inserted {new_key} before {successor}")
                    inserted = True

        if not inserted and predecessor:
            # Insert just after predecessor's </figure>
            pred_pos = updated.find(f"/dna/{predecessor}/")
            if pred_pos != -1:
                close_pos = updated.find("</figure>", pred_pos)
                if close_pos != -1:
                    ins = close_pos + len("</figure>")
                    updated = updated[:ins] + "\n" + figure_html + updated[ins:]
                    print(f"  Inserted {new_key} after {predecessor}")
                    inserted = True

        if not inserted:
            print(f"  WARNING: no insertion point found for {new_key}")

    if updated != local_content:
        post_path.write_text(updated, encoding="utf-8")
        print(f"  Saved.")
        return True

    return False


def find_post_by_id(pid: str) -> Path | None:
    # Try glob with post ID in filename
    matches = list(POSTS_DIR.glob(f"*-{pid}-*.md"))
    if matches:
        return matches[0]
    # Fallback: search by source URL inside file
    for p in POSTS_DIR.glob("*.md"):
        _, file_pid = get_tistory_info(p)
        if file_pid == pid:
            return p
    return None


def main():
    parser = argparse.ArgumentParser(description="Sync Tistory images to Jekyll posts")
    parser.add_argument("--post-url", help="Specific Tistory post URL to sync")
    args = parser.parse_args()

    any_changed = False

    if args.post_url:
        m = re.search(r"/(\d+)$", args.post_url.rstrip("/"))
        if not m:
            print("ERROR: invalid Tistory URL")
            sys.exit(1)
        post_file = find_post_by_id(m.group(1))
        if not post_file:
            print(f"ERROR: no local post file found for Tistory #{m.group(1)}")
            sys.exit(1)
        any_changed = sync_post(post_file)
    else:
        for post_file in sorted(POSTS_DIR.glob("*.md")):
            if sync_post(post_file):
                any_changed = True

    print("\nDone." + (" Changes detected." if any_changed else " Nothing changed."))


if __name__ == "__main__":
    main()
