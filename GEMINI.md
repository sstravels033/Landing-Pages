# Artifact Generation Rule
When creating artifacts (such as markdown reports, generated files, or proposals), DO NOT save them in the system's default artifact directory (e.g., `.gemini/antigravity-cli/brain/...`). Instead, ALWAYS save project artifacts directly in the root folder of this project.

# Service Worker Cache Bumping Rule
Whenever modifying the site's code, structure, or assets, you MUST update the `CACHE_NAME` variable in `sw.js` to ensure the PWA cache resets. Instead of manual sequence numbers (v1, v2), use a timestamp-based versioning scheme (e.g., `sstravels-v1786847435070`) or actively increment the integer (v3, v4... v100+) before finalizing changes. This guarantees that users and developers instantly see the newest version without clearing their browser cache.
