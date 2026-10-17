// เซิร์ฟเวอร์เล็กๆ สำหรับเปิดแอปในเครื่องตัวเอง หรือใช้บน Render / Railway
// วิธีใช้: npm start  แล้วเปิด http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "dist");
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".json": "application/json",
};

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("ยังไม่มี dist/index.html ให้รัน npm run build ก่อน");
  process.exit(1);
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let file = path.normalize(path.join(DIST, urlPath));
    if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
    if (urlPath === "/" || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, "index.html");
    const ext = path.extname(file);
    res.writeHead(200, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" || file.endsWith("sw.js") ? "no-cache" : "public, max-age=86400",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`แอปเปิดอยู่ที่ http://localhost:${PORT}`));
