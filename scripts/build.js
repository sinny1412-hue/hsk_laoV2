// รวมไฟล์ใน src/ เป็นแอปไฟล์เดียวที่ dist/index.html แล้วคัดลอกไฟล์ใน src/static/ ไปด้วย
// วิธีใช้: npm run build
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");

// ลำดับสำคัญ: ข้อมูลบทเรียนต้องมาก่อนโค้ดแอป
const SCRIPT_FILES = [
  "data/lessons.js",
  "data/topics.js",
  "data/lao-translations.js",
  "app.js",
];

const script = SCRIPT_FILES.map((f) => `/* ===== ${f} ===== */\n${read(f)}`).join("\n");

// ตรวจว่าโค้ดไม่มีจุดผิด (syntax error) ก่อนสร้างไฟล์
try {
  new vm.Script(script, { filename: "app-bundle.js" });
} catch (e) {
  console.error("❌ โค้ดมีจุดผิด แก้ก่อนแล้วค่อย build ใหม่:\n", e.message);
  process.exit(1);
}

// ตรวจข้อมูลบทเรียนแบบคร่าวๆ
const sandbox = {};
vm.runInNewContext(read("data/lessons.js") + "\n;this.L=L;", sandbox);
const L = sandbox.L;
const problems = [];
L.forEach((x, i) => {
  if (!x.zh || !x.th || !x.lo) problems.push(`บทที่ ${i}: ขาดชื่อบท`);
  if (!Array.isArray(x.v) || !x.v.length) problems.push(`บทที่ ${i}: ไม่มีคำศัพท์`);
  (x.v || []).forEach((w, j) => { if (w.length !== 4) problems.push(`บทที่ ${i} คำที่ ${j}: ต้องมี 4 ช่อง [จีน, พินอิน, ไทย, ลาว]`); });
  (x.s || []).forEach((s, j) => { if (s.length !== 3) problems.push(`บทที่ ${i} ประโยคฝึกพูดที่ ${j}: ต้องมี 3 ช่อง`); });
});
if (problems.length) {
  console.error("❌ ข้อมูลบทเรียนมีปัญหา:\n - " + problems.join("\n - "));
  process.exit(1);
}

const html = read("index.template.html")
  .replace("/*@@STYLES@@*/", () => read("styles.css"))
  .replace("/*@@SCRIPTS@@*/", () => script);

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, "index.html"), html);
for (const f of fs.readdirSync(path.join(SRC, "static"))) {
  fs.copyFileSync(path.join(SRC, "static", f), path.join(DIST, f));
}
console.log(`✅ สร้างเสร็จ: dist/index.html (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB) · ${L.length} บทเรียน`);
