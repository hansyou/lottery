const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 6688;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let url = decodeURIComponent(parsedUrl.pathname);
    if (url === "/") url = "/index.html";

    // API: 读取 namelist.txt
    if (url === "/api/namelist") {
        const namelistPath = path.join(ROOT, "namelist.txt");
        fs.readFile(namelistPath, "utf-8", (err, data) => {
            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8",
            });
            if (err) {
                res.end(JSON.stringify({ exists: false, names: [] }));
            } else {
                // 支持换行和英文逗号分隔
                const names = data
                    .split(/[\n,]/)
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0);
                res.end(JSON.stringify({ exists: true, names }));
            }
        });
        return;
    }

    const filePath = path.join(PUBLIC_DIR, url);

    // 防止目录遍历
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not Found");
            return;
        }
        const ext = path.extname(filePath);
        const mime = MIME_TYPES[ext] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": mime });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🎉 婚礼抽奖工具已启动`);
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`按 Ctrl+C 停止服务器`);
});
