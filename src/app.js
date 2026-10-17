const ALLV=[].concat(...L.slice(1).map(x=>x.v));

/* ---------- สมาชิก: รหัสเข้าใช้ผูกกับเครื่อง ---------- */
const FREE=3; /* บทที่ 0–2 เรียนฟรี */
const ADMIN={phone:"020 9410 8114",wa:"8562094108114",prices:[[1,"39,000"],[2,"69,000"],[3,"99,000"]]};
const TRIAL_DAYS=7;
const SECRET="e78d30354b4a482819c5b6551fc15622";
const ALPH="0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const todayDays=()=>{const d=new Date(); return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)};
const enc32=(n,len)=>{let s=""; for(let i=0;i<len;i++){s=ALPH[n%32]+s; n=Math.floor(n/32)} return s};
const dec32=s=>{let n=0; for(const c of s){const i=ALPH.indexOf(c); if(i<0) return -1; n=n*32+i} return n};
const norm=s=>String(s||"").toUpperCase().replace(/O/g,"0").replace(/[IL]/g,"1").replace(/[^0-9A-Z]/g,"");
const normU=s=>String(s||"").trim().toLowerCase().replace(/\s+/g,"");
async function sigOf(user,expStr){const b=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(SECRET+"|U|"+user+"|"+expStr))); let s=""; for(let i=0;i<8;i++) s+=ALPH[b[i]%32]; return s;}
async function readCode(code,user){const c=norm(code), u=normU(user); if(c.length!==11||!u) return null; const e=c.slice(0,3), ex=dec32(e); if(ex<0) return null; try{ return (await sigOf(u,e))===c.slice(3)? ex : null }catch(err){ return null }}
const fmtDay=d=>new Date(d*864e5).toLocaleDateString(S.lang==="lo"?"lo-LA":"th-TH",{timeZone:"UTC",day:"numeric",month:"long",year:"numeric"});
const fmtDev=d=>d.slice(0,4)+"-"+d.slice(4);
let memberExp=null;
const effToday=()=>Math.max(todayDays(),S.maxDay||0);
const isMember=()=>memberExp!==null&&memberExp>=effToday();
const trialLeftDays=()=>S.trial?S.trial+TRIAL_DAYS-effToday():0;
const inTrial=()=>trialLeftDays()>0;
const unlocked=li=>li<FREE||isMember()||inTrial();
const curLevel=()=>{const nx=nextIdx(); const x=L[nx<0?L.length-1:nx]; return x.lv||1};
/* ---------- รหัสสำรองความคืบหน้า ---------- */
const dayOf=s=>{if(!s) return 0; const [y,m,d]=s.split("-").map(Number); return Math.floor(Date.UTC(y,m-1,d)/864e5)};
const strOfDay=n=>n?new Date(n*864e5).toISOString().slice(0,10):"";
function encBig(b){if(b===0n) return "0"; let s=""; while(b>0n){s=ALPH[Number(b%32n)]+s; b/=32n} return s}
function decBig(s){let b=0n; for(const c of s){const i=ALPH.indexOf(c); if(i<0) return null; b=b*32n+BigInt(i)} return b}
function chk(s){let h=7; for(const c of s) h=(h*31+c.charCodeAt(0))%1024; return ALPH[h>>5]+ALPH[h&31]}
function makeBackup(){let m=0n; Object.keys(S.done).forEach(i=>{m|=1n<<BigInt(i)}); const body=[encBig(m),encBig(BigInt(S.pts||0)),encBig(BigInt(S.streak||0)),encBig(BigInt(dayOf(S.last)))].join("-"); return "P-"+body+"-"+chk(body);}
function readBackup(code){
  const p=String(code||"").toUpperCase().replace(/O/g,"0").replace(/[IL]/g,"1").replace(/[^0-9A-Z-]/g,"").split("-").filter(Boolean);
  if(p.length!==6||p[0]!=="P") return null; const body=p.slice(1,5).join("-"); if(chk(body)!==p[5]) return null;
  const v=p.slice(1,5).map(decBig); if(v.some(x=>x===null)) return null;
  const done={}; for(let i=0;i<L.length;i++) if((v[0]>>BigInt(i))&1n) done[i]=true;
  return {done,pts:Number(v[1]),streak:Number(v[2]),last:strOfDay(Number(v[3]))};
}

/* ---------- ข้อความหน้าแอป ไทย / ลาว ---------- */
const T={
 th:{app:"เรียนจีน",lessons:"บทเรียน",topics:"หัวข้อ",grammar:"ไวยากรณ์",practice:"ฝึกฝน",me:"ฉัน",hi:"สวัสดี! วันนี้เรียนภาษาจีนกัน",streak:"เรียนต่อเนื่อง",days:"วัน",points:"แต้ม",lesson:"บทที่",words:"คำ",doneOf:(a,b)=>`เรียนจบ ${a} จาก ${b} บท`,done:"จบแล้ว",cont:"เรียนต่อ",vocab:"คำศัพท์",gram:"ไวยากรณ์",dlg:"บทสนทนา",say:"ฝึกพูด",quiz:"แบบฝึกหัด",prev:"ก่อนหน้า",next:"ถัดไป",nextTo:x=>`ต่อไป: ${x}`,playAll:"ฟังทั้งหมด",sayHint:"กดฟัง แล้วพูดตามดัง ๆ 2–3 รอบ",said:"พูดแล้ว",qMean:"เลือกคำแปลที่ถูกต้อง",qRev:"เลือกคำภาษาจีนที่ถูกต้อง",qListen:"ฟังแล้วเลือกคำที่ได้ยิน",qOrder:"เรียงคำให้เป็นประโยค",listenAgain:"ฟังอีกครั้ง",check:"ตรวจคำตอบ",good:"ถูกต้อง! +10 แต้ม",bad:"ยังไม่ถูก คำตอบที่ถูกคือ",seeResult:"ดูผล",result:"ผลการทำแบบฝึกหัด",gotPts:n=>`ได้ ${n} แต้ม`,finish:"กลับหน้าบทเรียน",nextLesson:"เรียนบทถัดไป",retry:"ทำอีกครั้ง",exampleT:"ตัวอย่าง",topicsLead:"เลือกเรื่องที่อยากพูดได้ในชีวิตจริง",topicQuiz:"ทำแบบฝึกหัดหัวข้อนี้",goLesson:n=>`ไปเรียนบทที่ ${n}`,gramLead:"รวมไวยากรณ์ทุกบท กดเพื่อดูตัวอย่าง",pracTitle:"ทบทวนคำศัพท์",pracLead:n=>`สุ่มคำถาม 10 ข้อ จากคำที่เรียนแล้ว ${n} คำ`,pracAll:"ยังไม่ได้เรียนจบบทไหน จะสุ่มจากคำศัพท์ HSK 1 ทั้งหมด",start:"เริ่มทำ",lang:"ภาษาของแอป",install:"ติดตั้งแอปลงหน้าจอมือถือ",android:"Android (Chrome)",iphone:"iPhone (Safari)",and:["เปิดลิงก์แอปใน Chrome","กดปุ่ม ⋮ ที่มุมขวาบน","เลือก “เพิ่มลงในหน้าจอหลัก” หรือ “ติดตั้งแอป”","กด “เพิ่ม” แล้วไอคอนจะขึ้นบนหน้าจอ"],ios:["เปิดลิงก์แอปใน Safari","กดปุ่มแชร์ (สี่เหลี่ยมมีลูกศรชี้ขึ้น) ด้านล่าง","เลื่อนลงแล้วเลือก “เพิ่มไปยังหน้าจอโฮม”","กด “เพิ่ม” ที่มุมขวาบน"],sound:"ทดสอบเสียง",soundBtn:"กดฟัง 你好",soundNote:"ถ้ากดแล้วไม่มีเสียง ให้เข้าไปที่ การตั้งค่าเครื่อง → ภาษา หรือ การอ่านออกเสียงข้อความ แล้วเพิ่มภาษาจีน (จีนกลาง)",noVoice:"เครื่องนี้ยังไม่มีเสียงภาษาจีน ดูวิธีเปิดในหน้า “ฉัน”",reset:"ล้างความคืบหน้าทั้งหมด",resetSure:"กดอีกครั้งเพื่อยืนยันการล้าง",resetDone:"ล้างความคืบหน้าแล้ว",ver:"เวอร์ชันทดลอง · HSK 1–4 · ความคืบหน้าบันทึกไว้ในเครื่องนี้เท่านั้น",back:"ย้อนกลับ",close:"ปิด",progress:"ความคืบหน้า",listen:"ฟัง",member:"สมาชิก",trial:"ยังไม่เป็นสมาชิก: เรียนได้บทที่ 0–2",trialLeft:n=>`ทดลองใช้ฟรีทุกบท เหลืออีก ${n} วัน`,trialEnded:"ทดลองใช้ฟรี 7 วันหมดแล้ว สมัครสมาชิกเพื่อเรียนต่อทุกบท",waBtn:"ติดต่อแอดมินทาง WhatsApp",waMsg:"สวัสดีครับ/ค่ะ อยากสมัครสมาชิกแอปเรียนจีน",months:n=>`${n} เดือน`,kip:"กีบ",copied:"คัดลอกแล้ว",backupT:"สำรองความคืบหน้า",backupLead:"รหัสนี้เก็บบทที่เรียนจบ แต้ม และวันเรียนต่อเนื่องของคุณ กดคัดลอกแล้วส่งเก็บไว้ในแชตของตัวเอง ถ้าเปลี่ยนเครื่อง ให้นำรหัสมากรอกด้านล่าง",copyBackup:"คัดลอกรหัสสำรอง",restoreLabel:"กู้คืนจากรหัสสำรอง",restoreBtn:"กู้คืน",restoreSure:"กดอีกครั้งเพื่อแทนที่ความคืบหน้าในเครื่องนี้",restoreOk:(n,p)=>`กู้คืนแล้ว: เรียนจบ ${n} บท ${p} แต้ม`,restoreBad:"รหัสสำรองไม่ถูกต้อง ตรวจว่าคัดลอกมาครบทุกตัว",pracWhat:"ฝึกฝนคือแบบทดสอบทบทวนคำศัพท์ที่เรียนไปแล้ว ไม่ใช่บทเรียนใหม่ ทำวันละ 1–2 รอบ ช่วยให้จำได้ไม่ลืม",pracHow:["แอปสุ่มคำถาม 10 ข้อ จากบทที่คุณเรียนจบแล้ว","คำถามมี 4 แบบ: เลือกคำแปล เลือกตัวจีน ฟังแล้วเลือก และเรียงประโยค","ตอบถูกได้ 10 แต้ม ทำซ้ำได้เรื่อยๆ คำถามสุ่มใหม่ทุกครั้ง"],activeUntil:d=>`สมาชิกใช้ได้ถึง ${d}`,expired:d=>`สมาชิกหมดอายุแล้วเมื่อ ${d}`,daysLeft:n=>`สมาชิกเหลืออีก ${n} วัน ติดต่อแอดมินเพื่อต่ออายุ`,userLabel:"ชื่อผู้ใช้",memberName:u=>`สมาชิก: ${u}`,codeLabel:"รหัสเข้าใช้",activate:"เปิดใช้งาน",codeOk:d=>`เปิดใช้งานแล้ว เรียนได้ทุกบทถึง ${d}`,codeBad:"ชื่อผู้ใช้หรือรหัสไม่ถูกต้อง ตรวจตัวสะกดทั้งสองช่องอีกครั้ง",codeOld:d=>`รหัสนี้หมดอายุแล้วเมื่อ ${d} ติดต่อแอดมินเพื่อขอรหัสใหม่`,howJoin:"วิธีสมัครสมาชิก",joinSteps:["กดปุ่ม WhatsApp ด้านล่างเพื่อติดต่อแอดมิน แล้วชำระค่าสมาชิก","แอดมินส่งชื่อผู้ใช้และรหัสเข้าใช้ให้","กรอกทั้งสองช่องในหน้า “ฉัน” แล้วกด “เปิดใช้งาน”"],contact:"ติดต่อแอดมิน",price:"ค่าสมาชิก",lockedTitle:"บทนี้สำหรับสมาชิก",lockedLead:"ทดลองใช้ฟรี 7 วันหมดแล้ว บทที่ 0–2 ยังเรียนฟรี บทที่ 3 ขึ้นไปต้องสมัครสมาชิก",goJoin:"สมัครสมาชิก",keepNote:"เปลี่ยนเครื่องหรือลบข้อมูลเว็บ ให้กรอกชื่อผู้ใช้และรหัสเดิมอีกครั้ง"},
 lo:{app:"ຮຽນຈີນ",lessons:"ບົດຮຽນ",topics:"ຫົວຂໍ້",grammar:"ໄວຍາກອນ",practice:"ຝຶກຝົນ",me:"ຂ້ອຍ",hi:"ສະບາຍດີ! ມື້ນີ້ມາຮຽນພາສາຈີນກັນ",streak:"ຮຽນຕໍ່ເນື່ອງ",days:"ມື້",points:"ຄະແນນ",lesson:"ບົດທີ",words:"ຄຳ",doneOf:(a,b)=>`ຮຽນຈົບ ${a} ຈາກ ${b} ບົດ`,done:"ຈົບແລ້ວ",cont:"ຮຽນຕໍ່",vocab:"ຄຳສັບ",gram:"ໄວຍາກອນ",dlg:"ບົດສົນທະນາ",say:"ຝຶກເວົ້າ",quiz:"ແບບຝຶກຫັດ",prev:"ກ່ອນໜ້າ",next:"ຕໍ່ໄປ",nextTo:x=>`ຕໍ່ໄປ: ${x}`,playAll:"ຟັງທັງໝົດ",sayHint:"ກົດຟັງ ແລ້ວເວົ້າຕາມດັງໆ 2–3 ເທື່ອ",said:"ເວົ້າແລ້ວ",qMean:"ເລືອກຄຳແປທີ່ຖືກຕ້ອງ",qRev:"ເລືອກຄຳພາສາຈີນທີ່ຖືກຕ້ອງ",qListen:"ຟັງແລ້ວເລືອກຄຳທີ່ໄດ້ຍິນ",qOrder:"ລຽງຄຳໃຫ້ເປັນປະໂຫຍກ",listenAgain:"ຟັງອີກເທື່ອ",check:"ກວດຄຳຕອບ",good:"ຖືກຕ້ອງ! +10 ຄະແນນ",bad:"ຍັງບໍ່ຖືກ ຄຳຕອບທີ່ຖືກແມ່ນ",seeResult:"ເບິ່ງຜົນ",result:"ຜົນການເຮັດແບບຝຶກຫັດ",gotPts:n=>`ໄດ້ ${n} ຄະແນນ`,finish:"ກັບໜ້າບົດຮຽນ",nextLesson:"ຮຽນບົດຕໍ່ໄປ",retry:"ເຮັດອີກເທື່ອ",exampleT:"ຕົວຢ່າງ",topicsLead:"ເລືອກເລື່ອງທີ່ຢາກເວົ້າໄດ້ໃນຊີວິດຈິງ",topicQuiz:"ເຮັດແບບຝຶກຫັດຫົວຂໍ້ນີ້",goLesson:n=>`ໄປຮຽນບົດທີ ${n}`,gramLead:"ລວມໄວຍາກອນທຸກບົດ ກົດເພື່ອເບິ່ງຕົວຢ່າງ",pracTitle:"ທົບທວນຄຳສັບ",pracLead:n=>`ສຸ່ມຄຳຖາມ 10 ຂໍ້ ຈາກຄຳທີ່ຮຽນແລ້ວ ${n} ຄຳ`,pracAll:"ຍັງບໍ່ທັນຮຽນຈົບບົດໃດ ຈະສຸ່ມຈາກຄຳສັບ HSK 1 ທັງໝົດ",start:"ເລີ່ມເຮັດ",lang:"ພາສາຂອງແອັບ",install:"ຕິດຕັ້ງແອັບໃສ່ໜ້າຈໍມືຖື",android:"Android (Chrome)",iphone:"iPhone (Safari)",and:["ເປີດລິ້ງແອັບໃນ Chrome","ກົດປຸ່ມ ⋮ ຢູ່ມຸມຂວາເທິງ","ເລືອກ “ເພີ່ມໃສ່ໜ້າຈໍຫຼັກ” ຫຼື “ຕິດຕັ້ງແອັບ”","ກົດ “ເພີ່ມ” ແລ້ວໄອຄອນຈະຂຶ້ນໜ້າຈໍ"],ios:["ເປີດລິ້ງແອັບໃນ Safari","ກົດປຸ່ມແບ່ງປັນ (ສີ່ຫຼ່ຽມມີລູກສອນຊີ້ຂຶ້ນ) ທາງລຸ່ມ","ເລື່ອນລົງແລ້ວເລືອກ “ເພີ່ມໃສ່ໜ້າຈໍໂຮມ”","ກົດ “ເພີ່ມ” ຢູ່ມຸມຂວາເທິງ"],sound:"ທົດສອບສຽງ",soundBtn:"ກົດຟັງ 你好",soundNote:"ຖ້າກົດແລ້ວບໍ່ມີສຽງ ໃຫ້ເຂົ້າໄປທີ່ ການຕັ້ງຄ່າເຄື່ອງ → ພາສາ ຫຼື ການອ່ານອອກສຽງ ແລ້ວເພີ່ມພາສາຈີນ (ຈີນກາງ)",noVoice:"ເຄື່ອງນີ້ຍັງບໍ່ມີສຽງພາສາຈີນ ເບິ່ງວິທີເປີດໃນໜ້າ “ຂ້ອຍ”",reset:"ລຶບຄວາມຄືບໜ້າທັງໝົດ",resetSure:"ກົດອີກເທື່ອເພື່ອຢືນຢັນ",resetDone:"ລຶບຄວາມຄືບໜ້າແລ້ວ",ver:"ເວີຊັນທົດລອງ · HSK 1–4 · ຄວາມຄືບໜ້າບັນທຶກໄວ້ໃນເຄື່ອງນີ້ເທົ່ານັ້ນ",back:"ກັບຄືນ",close:"ປິດ",progress:"ຄວາມຄືບໜ້າ",listen:"ຟັງ",member:"ສະມາຊິກ",trial:"ຍັງບໍ່ເປັນສະມາຊິກ: ຮຽນໄດ້ບົດທີ 0–2",trialLeft:n=>`ທົດລອງໃຊ້ຟຣີທຸກບົດ ເຫຼືອອີກ ${n} ມື້`,trialEnded:"ທົດລອງໃຊ້ຟຣີ 7 ມື້ໝົດແລ້ວ ສະໝັກສະມາຊິກເພື່ອຮຽນຕໍ່ທຸກບົດ",waBtn:"ຕິດຕໍ່ແອັດມິນທາງ WhatsApp",waMsg:"ສະບາຍດີ ຢາກສະໝັກສະມາຊິກແອັບຮຽນຈີນ",months:n=>`${n} ເດືອນ`,kip:"ກີບ",copied:"ສຳເນົາແລ້ວ",backupT:"ສຳຮອງຄວາມຄືບໜ້າ",backupLead:"ລະຫັດນີ້ເກັບບົດທີ່ຮຽນຈົບ ຄະແນນ ແລະ ມື້ຮຽນຕໍ່ເນື່ອງຂອງເຈົ້າ ກົດສຳເນົາແລ້ວສົ່ງເກັບໄວ້ໃນແຊັດຂອງຕົນເອງ ຖ້າປ່ຽນເຄື່ອງ ໃຫ້ນຳລະຫັດມາປ້ອນຂ້າງລຸ່ມ",copyBackup:"ສຳເນົາລະຫັດສຳຮອງ",restoreLabel:"ກູ້ຄືນຈາກລະຫັດສຳຮອງ",restoreBtn:"ກູ້ຄືນ",restoreSure:"ກົດອີກເທື່ອເພື່ອແທນທີ່ຄວາມຄືບໜ້າໃນເຄື່ອງນີ້",restoreOk:(n,p)=>`ກູ້ຄືນແລ້ວ: ຮຽນຈົບ ${n} ບົດ ${p} ຄະແນນ`,restoreBad:"ລະຫັດສຳຮອງບໍ່ຖືກຕ້ອງ ກວດວ່າສຳເນົາມາຄົບທຸກຕົວ",pracWhat:"ຝຶກຝົນແມ່ນແບບທົດສອບທົບທວນຄຳສັບທີ່ຮຽນໄປແລ້ວ ບໍ່ແມ່ນບົດຮຽນໃໝ່ ເຮັດມື້ລະ 1–2 ຮອບ ຊ່ວຍໃຫ້ຈື່ໄດ້ບໍ່ລືມ",pracHow:["ແອັບສຸ່ມຄຳຖາມ 10 ຂໍ້ ຈາກບົດທີ່ເຈົ້າຮຽນຈົບແລ້ວ","ຄຳຖາມມີ 4 ແບບ: ເລືອກຄຳແປ ເລືອກຕົວຈີນ ຟັງແລ້ວເລືອກ ແລະ ລຽງປະໂຫຍກ","ຕອບຖືກໄດ້ 10 ຄະແນນ ເຮັດຊ້ຳໄດ້ເລື້ອຍໆ ຄຳຖາມສຸ່ມໃໝ່ທຸກເທື່ອ"],activeUntil:d=>`ສະມາຊິກໃຊ້ໄດ້ຮອດ ${d}`,expired:d=>`ສະມາຊິກໝົດອາຍຸແລ້ວເມື່ອ ${d}`,daysLeft:n=>`ສະມາຊິກເຫຼືອອີກ ${n} ມື້ ຕິດຕໍ່ແອັດມິນເພື່ອຕໍ່ອາຍຸ`,userLabel:"ຊື່ຜູ້ໃຊ້",memberName:u=>`ສະມາຊິກ: ${u}`,codeLabel:"ລະຫັດເຂົ້າໃຊ້",activate:"ເປີດໃຊ້ງານ",codeOk:d=>`ເປີດໃຊ້ງານແລ້ວ ຮຽນໄດ້ທຸກບົດຮອດ ${d}`,codeBad:"ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດບໍ່ຖືກຕ້ອງ ກວດຕົວສະກົດທັງສອງຊ່ອງອີກເທື່ອ",codeOld:d=>`ລະຫັດນີ້ໝົດອາຍຸແລ້ວເມື່ອ ${d} ຕິດຕໍ່ແອັດມິນເພື່ອຂໍລະຫັດໃໝ່`,howJoin:"ວິທີສະໝັກສະມາຊິກ",joinSteps:["ກົດປຸ່ມ WhatsApp ຂ້າງລຸ່ມເພື່ອຕິດຕໍ່ແອັດມິນ ແລ້ວຈ່າຍຄ່າສະມາຊິກ","ແອັດມິນສົ່ງຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດເຂົ້າໃຊ້ໃຫ້","ປ້ອນທັງສອງຊ່ອງໃນໜ້າ “ຂ້ອຍ” ແລ້ວກົດ “ເປີດໃຊ້ງານ”"],contact:"ຕິດຕໍ່ແອັດມິນ",price:"ຄ່າສະມາຊິກ",lockedTitle:"ບົດນີ້ສຳລັບສະມາຊິກ",lockedLead:"ທົດລອງໃຊ້ຟຣີ 7 ມື້ໝົດແລ້ວ ບົດທີ 0–2 ຍັງຮຽນຟຣີ ບົດທີ 3 ຂຶ້ນໄປຕ້ອງສະໝັກສະມາຊິກ",goJoin:"ສະໝັກສະມາຊິກ",keepNote:"ປ່ຽນເຄື່ອງ ຫຼື ລຶບຂໍ້ມູນເວັບ ໃຫ້ປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດເດີມອີກເທື່ອ"}
};

/* ---------- ไอคอน ---------- */
const svg=p=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const IC={
 mic:svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>'),
 book:svg('<path d="M5 4h9a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4z"/><path d="M9 8h5"/>'),
 grid:svg('<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>'),
 gram:svg('<rect x="3" y="6" width="6" height="5" rx="1.5"/><rect x="11" y="6" width="10" height="5" rx="1.5"/><rect x="3" y="14" width="10" height="5" rx="1.5"/><rect x="15" y="14" width="6" height="5" rx="1.5"/>'),
 target:svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>'),
 me:svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
 spk:svg('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/>'),
 check:svg('<path d="M5 12l5 5 9-10"/>'),
 back:svg('<path d="M15 5l-7 7 7 7"/>'),
 close:svg('<path d="M6 6l12 12M18 6L6 18"/>'),
 chev:svg('<path d="M9 5l7 7-7 7"/>'),
 flame:svg('<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 3 2 0-2-1-4 0-6z"/>'),
 lock:svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
 chat:svg('<path d="M4 20l1.5-4A8 8 0 1 1 9 19.3z"/>'),
 clock:svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
 star:svg('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>')
};

/* ---------- ความคืบหน้า (เก็บในเครื่อง) ---------- */
const KEY="hsk-app-v1";
let S={pts:0,streak:0,last:"",done:{},lang:"th",user:"",code:"",maxDay:0,trial:0};
try{const raw=localStorage.getItem(KEY); if(raw) S=Object.assign(S,JSON.parse(raw));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
if(todayDays()>(S.maxDay||0)){S.maxDay=todayDays(); save();}
if(!S.trial){S.trial=todayDays(); save();}
const dstr=d=>d.toLocaleDateString("en-CA");
function touch(){const today=dstr(new Date()); if(S.last===today) return; const y=new Date(); y.setDate(y.getDate()-1); S.streak=(S.last===dstr(y))?S.streak+1:1; S.last=today; save();}
function curStreak(){const today=dstr(new Date()); const y=new Date(); y.setDate(y.getDate()-1); return (S.last===today||S.last===dstr(y))?S.streak:0;}

Object.assign(T.th,{micBtn:"กดแล้วพูด",micStop:"กำลังฟัง... พูดได้เลย",heard:"เครื่องได้ยินว่า",micGood:"เยี่ยม! ออกเสียงถูกต้อง",micMid:"เกือบถูกแล้ว ฟังตัวอย่างแล้วลองอีกครั้ง",micLow:"ยังไม่ถูก ลองฟังตัวอย่างแล้วพูดช้าๆ",micDeny:"ยังไม่ได้อนุญาตไมโครโฟน · กดอนุญาตในเบราว์เซอร์ แล้วลองใหม่",micNone:"ไม่ได้ยินเสียง ลองพูดดังขึ้นอีกนิด",micNet:"ต้องต่ออินเทอร์เน็ตก่อนฝึกพูด",micErr:"ใช้ไมโครโฟนในเครื่องนี้ไม่ได้ · ฟังแล้วกด “พูดแล้ว” แทนได้",micTip:"สีเขียว = ถูก · สีแดง = ยังไม่ถูก"});
Object.assign(T.lo,{micBtn:"ກົດແລ້ວເວົ້າ",micStop:"ກຳລັງຟັງ... ເວົ້າໄດ້ເລີຍ",heard:"ເຄື່ອງໄດ້ຍິນວ່າ",micGood:"ຍອດຢ້ຽມ! ອອກສຽງຖືກຕ້ອງ",micMid:"ເກືອບຖືກແລ້ວ ຟັງຕົວຢ່າງແລ້ວລອງອີກເທື່ອ",micLow:"ຍັງບໍ່ຖືກ ລອງຟັງຕົວຢ່າງແລ້ວເວົ້າຊ້າໆ",micDeny:"ຍັງບໍ່ໄດ້ອະນຸຍາດໄມໂຄຣໂຟນ · ກົດອະນຸຍາດໃນບຣາວເຊີ ແລ້ວລອງໃໝ່",micNone:"ບໍ່ໄດ້ຍິນສຽງ ລອງເວົ້າດັງຂຶ້ນອີກໜ້ອຍໜຶ່ງ",micNet:"ຕ້ອງຕໍ່ອິນເຕີເນັດກ່ອນຝຶກເວົ້າ",micErr:"ໃຊ້ໄມໂຄຣໂຟນໃນເຄື່ອງນີ້ບໍ່ໄດ້ · ຟັງແລ້ວກົດ “ເວົ້າແລ້ວ” ແທນໄດ້",micTip:"ສີຂຽວ = ຖືກ · ສີແດງ = ຍັງບໍ່ຖືກ"});
const SR=(window.top===window)&&(window.SpeechRecognition||window.webkitSpeechRecognition)||null; // hidden inside embedded previews, where the mic is blocked
let recog=null;
const hanOnly=s=>(s.match(/\p{Script=Han}/gu)||[]);
function micScore(target,heard){const a=hanOnly(target),b=hanOnly(heard),n=a.length,m=b.length;
 const D=Array.from({length:n+1},()=>new Array(m+1).fill(0));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)D[i][j]=a[i]===b[j]?D[i+1][j+1]+1:Math.max(D[i+1][j],D[i][j+1]);
 const ok=new Array(n).fill(false);let i=0,j=0;while(i<n&&j<m){if(a[i]===b[j]){ok[i]=true;i++;j++}else if(D[i+1][j]>=D[i][j+1])i++;else j++}
 const hit=ok.filter(Boolean).length;let p=n?Math.round(hit/n*100):0;if(m>n)p=Math.max(0,p-Math.round((m-n)/n*30));
 return {p,chars:a.map((c,k)=>[c,ok[k]])};}
function stopMic(){if(recog){try{recog.abort()}catch(e){}recog=null}}
function micHTML(i){const r=view.mic&&view.mic[i];if(!r||r.st==="listen")return"";
 if(r.st==="err"){const k={"not-allowed":"micDeny","service-not-allowed":"micDeny","no-speech":"micNone","network":"micNet"}[r.err]||"micErr";return `<div class="micres err" role="status">${t(k)}</div>`;}
 const cls=r.p>=80?"":r.p>=50?"mid":"low";const msg=r.p>=80?"micGood":r.p>=50?"micMid":"micLow";
 return `<div class="micres ${cls}" role="status"><div class="row" style="justify-content:space-between;align-items:center"><span class="pct">${r.p}%</span><b>${t(msg)}</b></div><div class="cmp" lang="zh">${r.chars.map(([c,ok])=>`<span class="${ok?"ok":"miss"}">${c}</span>`).join("")}</div><small>${t("heard")}: <span lang="zh">${esc(r.heard||"—")}</span> · ${t("micTip")}</small></div>`;}
/* LO (คำแปลภาษาลาว) อยู่ในไฟล์ src/data/lao-translations.js */
const tx=s=>S.lang==="lo"&&LO[s]?LO[s]:s;
const t=k=>T[S.lang][k];
const mean=v=>S.lang==="lo"?v[3]:v[2];
const lname=x=>S.lang==="lo"?x.lo:x.th;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- เสียง ---------- */
let zhVoice=null;
function pickVoice(){try{const vs=speechSynthesis.getVoices(); zhVoice=vs.find(v=>/zh[-_]CN/i.test(v.lang))||vs.find(v=>/^zh/i.test(v.lang))||null;}catch(e){}}
try{pickVoice(); speechSynthesis.onvoiceschanged=pickVoice;}catch(e){}
function speak(text,queue){
  try{
    if(!("speechSynthesis" in window)){toast(t("noVoice"));return}
    if(!queue) speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); u.lang="zh-CN"; u.rate=.85; if(zhVoice) u.voice=zhVoice;
    speechSynthesis.speak(u);
    if(!zhVoice){pickVoice(); if(!zhVoice && speechSynthesis.getVoices().length) toast(t("noVoice"));}
  }catch(e){toast(t("noVoice"))}
}
let toastTimer; function toast(m){const el=document.getElementById("toast"); el.textContent=m; el.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.hidden=true,3200);}

/* ---------- สร้างแบบฝึกหัด ---------- */
function mkQuiz(pool,says,n){
  const words=shuffle(pool.slice()); const kinds=["mean","rev","listen"]; const qs=[];
  const orders=shuffle(says.filter(s=>s[0].split("|").length>=2).slice()).slice(0,2);
  const nChoice=Math.max(1,n-orders.length);
  for(let i=0;i<nChoice;i++){
    const w=words[i%words.length]; const k=kinds[i%3];
    let ds=shuffle(pool.filter(x=>x[0]!==w[0]&&mean(x)!==mean(w)));
    if(ds.length<3) ds=ds.concat(shuffle(ALLV.filter(x=>x[0]!==w[0]&&mean(x)!==mean(w)&&!ds.includes(x))));
    qs.push({k,w,opts:shuffle([w].concat(ds.slice(0,3))),pick:null,res:null});
  }
  shuffle(qs);
  orders.forEach(s=>{const toks=s[0].split("|"); let bank=shuffle(toks.slice()); let g=0; while(bank.join("")===toks.join("")&&g++<8) bank=shuffle(bank); qs.push({k:"order",s:toks,py:s[1],th:s[2],bank,built:[],res:null});});
  return {qs,i:0,correct:0};
}

/* ---------- สถานะหน้าจอ ---------- */
let tab="lessons"; let view=null; let resetArmed=false;
const nextIdx=()=>{for(let i=0;i<L.length;i++) if(!S.done[i]) return i; return -1};
const stepsOf=li=>["vocab","gram"].concat(L[li].d.length?["dlg"]:[]).concat(["say","quiz"]);

function openLesson(li){stopMic(); view=unlocked(li)?{type:"lesson",li,step:0,vi:0,said:{},quiz:null,fin:false}:{type:"locked",li}; render(true);}

/* ---------- วาดหน้าจอ ---------- */
function render(scrollTop){
  document.documentElement.lang=S.lang==="lo"?"lo":"th";
  document.getElementById("top").innerHTML=topHTML();
  document.getElementById("view").innerHTML=view?viewHTML():tabHTML();
  const showTabs=!view; document.getElementById("tabs").hidden=!showTabs;
  document.getElementById("tabbar").innerHTML=showTabs?tabsHTML():"";
  if(scrollTop) document.getElementById("main").scrollTop=0;
}
function topHTML(){
  if(view){
    let title="";
    if(view.type==="lesson"||view.type==="locked") title=`${t("lesson")} ${view.li} · ${lname(L[view.li])}`;
    if(view.type==="topic") title=lname(TOPICS[view.ti]);
    if(view.type==="quiz") title=view.title;
    return `<button class="iconbtn" data-a="exit" aria-label="${t("back")}">${IC.back}</button><div class="toptitle">${esc(title)}</div>${langSeg()}`;
  }
  return `<div class="brandname"><span class="seal" aria-hidden="true">中</span>${t("app")} <span class="lvl">HSK ${curLevel()}</span></div>${langSeg()}`;
}
const langSeg=()=>`<div class="seg" role="group" aria-label="${t("lang")}"><button data-a="lang" data-v="th" aria-pressed="${S.lang==="th"}">ไทย</button><button data-a="lang" data-v="lo" aria-pressed="${S.lang==="lo"}" style="font-family:'Noto Sans Lao',sans-serif">ລາວ</button></div>`;
function tabsHTML(){
  const items=[["lessons",IC.book],["topics",IC.grid],["grammar",IC.gram],["practice",IC.target],["me",IC.me]];
  return items.map(([k,ic])=>`<button class="tab" data-a="tab" data-v="${k}" ${tab===k?'aria-current="page"':""}>${ic}<span>${t(k)}</span></button>`).join("");
}
function tabHTML(){
  if(tab==="lessons") return homeHTML();
  if(tab==="topics") return topicsHTML();
  if(tab==="grammar") return grammarHTML();
  if(tab==="practice") return practiceHTML();
  return meHTML();
}
function statsHTML(){
  return `<div class="stats"><div class="stat">${IC.flame}<div><b>${curStreak()}</b><small>${t("streak")} (${t("days")})</small></div></div><div class="stat">${IC.star}<div><b>${S.pts}</b><small>${t("points")}</small></div></div></div>`;
}
function homeHTML(){
  const nd=Object.keys(S.done).length, nx=nextIdx();
  const moved=window.top!==window?`<a class="banner warn" href="https://hsk-lao.pages.dev" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">${IC.mic}<span>${S.lang==="lo"?"ແອັບຍ້າຍໄປລິ້ງໃໝ່ແລ້ວ: hsk-lao.pages.dev · ຝຶກເວົ້າໃສ່ໄມໄດ້ · ກ່ອນຍ້າຍ ໃຫ້ກັອບປີ້ລະຫັດສຳຮອງໃນໜ້າ ຂ້ອຍ ໄປໃສ່ແອັບໃໝ່":"แอปย้ายไปลิงก์ใหม่แล้ว: hsk-lao.pages.dev · ฝึกพูดใส่ไมค์ได้ · ก่อนย้าย ให้คัดลอกรหัสสำรองในหน้า ฉัน ไปใส่แอปใหม่"}</span></a>`:"";
  let h=moved+`<section class="hero"><h1>${t("hi")}</h1>${statsHTML()}<div style="display:flex;flex-direction:column;gap:6px"><small style="opacity:.92">${T[S.lang].doneOf(nd,L.length)}</small><div class="bar"><i style="width:${Math.round(nd/L.length*100)}%"></i></div></div></section>`;
  h+=memberBanner();
  let lvPrev=0;
  L.forEach((x,i)=>{
    const lv=x.lv||1; if(lv!==lvPrev){lvPrev=lv; h+=`<div class="sec"><h2>HSK ${lv}</h2><span>${L.filter(y=>(y.lv||1)===lv).length} ${t("lessons")}</span></div>`;}
    const done=!!S.done[i], isNext=i===nx&&unlocked(i), lock=!unlocked(i);
    h+=`<button class="lesson ${isNext?"next":""} ${lock?"locked":""}" data-a="open" data-v="${i}"><span class="glyph" aria-hidden="true">${x.zh}</span><span class="txt"><span class="n">${t("lesson")} ${i} · ${x.v.length} ${t("words")}</span><br><span class="ti">${esc(lname(x))}</span></span>${lock?`<span class="pill lockp">${IC.lock}${t("member")}</span>`:done?`<span class="pill ok">${t("done")}</span>`:isNext?`<span class="pill">${t("cont")}</span>`:`<span style="color:var(--muted)">${IC.chev}</span>`}</button>`;
  });
  return h;
}
function topicsHTML(){
  let h=`<div class="sec"><h2>${t("topics")}</h2></div><p class="note" style="margin:0">${t("topicsLead")}</p><div class="topics">`;
  TOPICS.forEach((x,i)=>{const n=topicWords(i).length, lock=!unlocked(x.l); h+=`<button class="topic ${lock?"locked":""}" data-a="topic" data-v="${i}"><span class="zh" aria-hidden="true">${x.zh}</span><span class="nm">${esc(lname(x))}</span><small>${lock?`${t("member")} · `:""}${t("lesson")} ${x.l} · ${n} ${t("words")}</small></button>`;});
  return h+`</div>`;
}
const topicWords=i=>{const x=TOPICS[i]; const v=L[x.l].v; return x.w? v.filter(w=>x.w.includes(w[0])) : v;};
function exHTML(e){return `<div class="ex"><div class="t"><div class="z">${e[0]}</div><div class="p py">${esc(e[1])}</div><div class="m">${esc(tx(e[2]))}</div></div><button class="spk sm" data-a="say" data-v="${esc(e[0])}" aria-label="ฟัง">${IC.spk}</button></div>`;}
function grammarHTML(){
  let h=`<div class="sec"><h2>${t("grammar")}</h2></div><p class="note" style="margin:0">${t("gramLead")}</p>`;
  L.forEach((x,i)=>{
    h+=`<div class="glh">${t("lesson")} ${i} · ${esc(lname(x))}</div>`;
    if(!unlocked(i)){ x.g.forEach(g=>{h+=`<button class="gp gplock" data-a="open" data-v="${i}"><span>${esc(tx(g.t))}</span><span class="pill lockp">${IC.lock}${t("member")}</span></button>`;}); return; }
    x.g.forEach(g=>{h+=`<details class="gp"><summary>${esc(tx(g.t))}</summary><div class="in gram"><p>${esc(tx(g.n))}</p>${g.e.map(exHTML).join("")}</div></details>`;});
  });
  return h;
}
function learnedPool(){const ids=Object.keys(S.done).map(Number).filter(i=>i>0); return [].concat(...ids.map(i=>L[i].v));}
function practiceHTML(){
  const pool=learnedPool();
  return `<div class="sec"><h2>${t("practice")}</h2></div><div class="card" style="display:flex;flex-direction:column;gap:8px"><p style="margin:0;font-weight:600">${t("pracWhat")}</p><ol class="steplist">${T[S.lang].pracHow.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></div><div class="card" style="display:flex;flex-direction:column;gap:12px"><div style="display:flex;gap:12px;align-items:center"><span class="glyph" aria-hidden="true">练</span><div><div style="font-weight:700;font-size:18px">${t("pracTitle")}</div><div class="note">${pool.length>=4?T[S.lang].pracLead(pool.length):t("pracAll")}</div></div></div><button class="btn" data-a="practice">${t("start")}</button></div>${statsHTML().replace('class="stats"','class="stats" style="color:var(--ink)"')}`;
}
function meHTML(){
  const li=a=>`<ol class="steplist">${a.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>`;
  return `<section class="hero"><h1>${t("me")}</h1>${statsHTML()}</section>
  ${memberCardHTML()}
  ${backupHTML()}
  <div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:12px"><b>${t("lang")}</b>${langSeg()}</div>
  <div class="card" style="display:flex;flex-direction:column;gap:12px"><b style="font-size:17px">${t("install")}</b><div><div class="tag" style="display:inline-block;margin-bottom:6px">${t("android")}</div>${li(T[S.lang].and)}</div><div><div class="tag lo" style="display:inline-block;margin-bottom:6px">${t("iphone")}</div>${li(T[S.lang].ios)}</div></div>
  <div class="card" style="display:flex;flex-direction:column;gap:10px"><b style="font-size:17px">${t("sound")}</b><button class="btn soft" data-a="say" data-v="你好">${IC.spk}${t("soundBtn")}</button><p class="note" style="margin:0">${t("soundNote")}</p></div>
  <button class="btn ghost" data-a="reset" style="border-color:var(--bad);color:var(--bad)">${resetArmed?t("resetSure"):t("reset")}</button>
  <p class="note" style="margin:0;text-align:center">${t("ver")}</p>`;
}

/* ---------- สมาชิก: หน้าจอ ---------- */
function memberStatus(){
  if(isMember()) return {cls:"ok",txt:T[S.lang].activeUntil(fmtDay(memberExp))};
  if(inTrial()) return {cls:"ok",txt:T[S.lang].trialLeft(trialLeftDays())};
  if(memberExp!==null) return {cls:"bad",txt:T[S.lang].expired(fmtDay(memberExp))};
  return {cls:"",txt:t("trial")};
}
function memberBanner(){
  if(isMember()){const left=memberExp-effToday(); return left<=3?`<div class="banner warn" role="status">${IC.clock}<span>${T[S.lang].daysLeft(left+1)}</span></div>`:"";}
  if(inTrial()) return `<button class="banner warn" data-a="join">${IC.clock}<span>${T[S.lang].trialLeft(trialLeftDays())}</span></button>`;
  if(memberExp!==null) return `<button class="banner bad" data-a="join">${IC.lock}<span>${T[S.lang].expired(fmtDay(memberExp))}</span></button>`;
  return `<button class="banner bad" data-a="join">${IC.lock}<span>${t("trialEnded")}</span></button>`;
}
function joinStepsHTML(){
  const msg=encodeURIComponent(t("waMsg"));
  return `<div style="display:flex;flex-direction:column;gap:10px"><b>${t("howJoin")}</b><ol class="steplist">${T[S.lang].joinSteps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
  <div><div class="note" style="font-weight:700">${t("price")}</div>${ADMIN.prices.map(([m,p])=>`<div class="kv"><span>${T[S.lang].months(m)}</span><b>${p} ${t("kip")}</b></div>`).join("")}</div>
  <div class="kv"><span>${t("contact")}</span><b style="user-select:all">${ADMIN.phone}</b></div>
  <a class="btn" href="https://wa.me/${ADMIN.wa}?text=${msg}" target="_blank" rel="noopener">${IC.chat}${t("waBtn")}</a></div>`;
}
function backupHTML(){
  return `<div class="card" style="display:flex;flex-direction:column;gap:12px"><b style="font-size:17px">${t("backupT")}</b><p class="note" style="margin:0">${t("backupLead")}</p>
  <div class="devbox"><div class="devid" id="bk" style="font-size:20px;text-transform:none;word-break:break-all">${makeBackup()}</div></div>
  <button class="btn soft" data-a="copybk">${t("copyBackup")}</button>
  <label for="restoreInput" style="font-weight:600">${t("restoreLabel")}</label>
  <input id="restoreInput" class="codein" style="font-size:17px" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="P-…">
  <button class="btn ghost" data-a="restore" id="restoreBtn">${t("restoreBtn")}</button><div id="restoreMsg" class="note" role="status"></div></div>`;
}
function memberCardHTML(){
  const st=memberStatus();
  return `<div class="card" id="member" style="display:flex;flex-direction:column;gap:14px">
    ${S.user&&memberExp!==null?`<div class="devbox"><div><div class="note">${t("member")}</div><div class="devid" style="text-transform:none">${esc(S.user)}</div></div></div>`:""}
    <div class="mstatus ${st.cls}">${isMember()||inTrial()?IC.check:IC.lock}<b>${esc(st.txt)}</b></div>
    <div style="display:flex;flex-direction:column;gap:8px"><label for="userInput" style="font-weight:600">${t("userLabel")}</label>
      <input id="userInput" class="codein" style="text-transform:none" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="hsk001" maxlength="30" value="${esc(S.user)}">
      <label for="codeInput" style="font-weight:600">${t("codeLabel")}</label>
      <input id="codeInput" class="codein" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXX-XXXX-XXXX" maxlength="16">
      <button class="btn" data-a="activate">${t("activate")}</button>
      <div id="codeMsg" class="note" role="status"></div></div>
    ${joinStepsHTML()}
    <p class="note" style="margin:0">${t("keepNote")}</p>
  </div>`;
}
function lockedHTML(){
  const x=L[view.li];
  return `<div class="card result"><span class="glyph" aria-hidden="true" style="width:72px;height:72px;font-size:28px">${x.zh}</span><div style="display:flex;align-items:center;gap:8px;color:var(--amber-ink)">${IC.lock}<b style="font-size:19px">${t("lockedTitle")}</b></div><p class="note" style="margin:0">${t("lockedLead")}</p></div>
  <div class="card" style="display:flex;flex-direction:column;gap:14px">${joinStepsHTML()}</div>
  <button class="btn" data-a="join">${t("goJoin")}</button>`;
}

/* ---------- หน้าบทเรียน ---------- */
function viewHTML(){
  if(view.type==="locked") return lockedHTML();
  if(view.type==="lesson") return lessonHTML();
  if(view.type==="topic") return topicHTML();
  if(view.type==="quiz") return view.quiz.fin? resultHTML(view.quiz,false) : quizHTML(view.quiz);
  return "";
}
function lessonHTML(){
  const x=L[view.li], steps=stepsOf(view.li), st=steps[view.step];
  if(view.fin) return resultHTML(view.quiz,true);
  let h=`<div class="steps" role="list">${steps.map((s,i)=>`<button role="listitem" data-a="step" data-v="${i}" ${i===view.step?'aria-current="step"':""} class="${i<view.step?"past":""}">${t(s)}</button>`).join("")}</div>`;
  const nextBtn=()=>{const ns=steps[view.step+1]; return `<button class="btn" data-a="step" data-v="${view.step+1}">${T[S.lang].nextTo(t(ns))}</button>`;};
  if(st==="vocab"){
    const w=x.v[view.vi], last=view.vi===x.v.length-1, other=S.lang==="lo"?[w[2],"ไทย",""]:[w[3],"ລາວ","lo"];
    h+=`<div class="flash"><div class="zh" lang="zh">${w[0]}</div><div class="py">${esc(w[1])}</div><button class="spk" data-a="say" data-v="${esc(w[0])}" aria-label="ฟังเสียง">${IC.spk}</button>
      <div class="means"><div class="mrow"><span class="tag ${S.lang==="lo"?"lo":""}">${S.lang==="lo"?"ລາວ":"ไทย"}</span><span class="big">${esc(mean(w))}</span></div><div class="mrow"><span class="tag ${other[2]}">${other[1]}</span><span>${esc(other[0])}</span></div></div></div>
      <div class="count">${view.vi+1} / ${x.v.length}</div>
      <div class="row"><button class="btn ghost" data-a="vprev" ${view.vi===0?"disabled":""}>${t("prev")}</button>${last?nextBtn():`<button class="btn" data-a="vnext">${t("next")}</button>`}</div>
      <div class="chips">${x.v.map((v,i)=>`<button class="chip" data-a="vjump" data-v="${i}" ${i===view.vi?'aria-current="true"':""}>${v[0]}</button>`).join("")}</div>`;
  }
  if(st==="gram"){
    x.g.forEach(g=>{h+=`<div class="card gram"><h3>${esc(tx(g.t))}</h3><p>${esc(tx(g.n))}</p>${g.e.map(exHTML).join("")}</div>`;});
    h+=nextBtn();
  }
  if(st==="dlg"){
    h+=`<button class="btn soft" data-a="sayall">${IC.spk}${t("playAll")}</button><div class="dlg">`;
    const first=x.d[0][0];
    x.d.forEach(d=>{h+=`<button class="bub ${d[0]===first?"":"b"}" data-a="say" data-v="${esc(d[1])}"><span class="who">${esc(d[0])}</span><span class="z">${d[1]}</span><span class="p">${esc(d[2])}</span><span class="m">${esc(tx(d[3]))}</span></button>`;});
    h+=`</div>`+nextBtn();
  }
  if(st==="say"){
    h+=`<p class="note" style="margin:0">${t("sayHint")}</p>`;
    x.s.forEach((s,i)=>{const z=s[0].split("|").join(""); h+=`<div class="card sayc"><div class="z">${z}</div><div class="py">${esc(s[1])}</div><div class="note">${esc(tx(s[2]))}</div><div class="row" style="align-items:center"><button class="btn soft" data-a="say" data-v="${esc(z)}" style="min-height:44px">${IC.spk}${t("listen")}</button><button class="saidbtn" data-a="said" data-v="${i}" aria-pressed="${!!view.said[i]}" style="justify-content:center">${IC.check}${t("said")}</button></div>${SR?`<button class="micbtn ${view.mic&&view.mic[i]&&view.mic[i].st==="listen"?"on":""}" data-a="mic" data-v="${i}">${IC.mic}${view.mic&&view.mic[i]&&view.mic[i].st==="listen"?t("micStop"):t("micBtn")}</button>${micHTML(i)}`:""}</div>`;});
    h+=nextBtn();
  }
  if(st==="quiz"){
    if(!view.quiz) view.quiz=mkQuiz(x.v,view.li>0?x.s:[],8);
    h+=quizHTML(view.quiz);
  }
  return h;
}
function topicHTML(){
  const x=TOPICS[view.ti], ws=topicWords(view.ti);
  let h=`<div class="card" style="display:flex;gap:14px;align-items:center"><span class="glyph" aria-hidden="true" style="width:64px;height:64px;font-size:24px">${x.zh}</span><div><div style="font-weight:700;font-size:20px">${esc(lname(x))}</div><div class="note">${t("lesson")} ${x.l} · ${ws.length} ${t("words")}</div></div></div><div class="card">`;
  ws.forEach(w=>{h+=`<div class="wl"><span class="z">${w[0]}</span><span class="t"><span class="py">${esc(w[1])}</span><br>${esc(mean(w))}</span><button class="spk sm" data-a="say" data-v="${esc(w[0])}" aria-label="ฟัง">${IC.spk}</button></div>`;});
  h+=`</div><button class="btn" data-a="topicquiz">${t("topicQuiz")}</button><button class="btn ghost" data-a="open" data-v="${x.l}">${T[S.lang].goLesson(x.l)}</button>`;
  return h;
}
function quizHTML(q){
  const Q=q.qs[q.i], n=q.qs.length;
  let h=`<div class="qprog"><div class="bar"><i style="width:${Math.round(q.i/n*100)}%"></i></div><span>${q.i+1}/${n}</span></div>`;
  const answered=Q.res!==null;
  if(Q.k!=="order"){
    const label={mean:t("qMean"),rev:t("qRev"),listen:t("qListen")}[Q.k];
    h+=`<div class="qlabel">${label}</div><div class="qcard">`;
    if(Q.k==="mean") h+=`<div class="zh" lang="zh">${Q.w[0]}</div><div class="py">${esc(Q.w[1])}</div><button class="spk sm" data-a="say" data-v="${esc(Q.w[0])}" aria-label="ฟัง">${IC.spk}</button>`;
    if(Q.k==="rev") h+=`<div class="mean">${esc(mean(Q.w))}</div>`;
    if(Q.k==="listen") h+=`<button class="spk" data-a="say" data-v="${esc(Q.w[0])}" aria-label="${t("listenAgain")}">${IC.spk}</button><div class="note">${t("listenAgain")}</div>`;
    h+=`</div><div class="opts">`;
    Q.opts.forEach((o,i)=>{
      const isAns=o[0]===Q.w[0]; let cls=""; if(answered){ if(isAns) cls="ok"; else if(i===Q.pick) cls="no"; }
      const txt=Q.k==="mean"? esc(mean(o)) : o[0];
      h+=`<button class="opt ${Q.k!=="mean"?"zhf":""} ${cls}" data-a="opt" data-v="${i}" ${answered?"disabled":""}>${txt}${answered&&isAns?IC.check:""}</button>`;
    });
    h+=`</div>`;
  } else {
    h+=`<div class="qlabel">${t("qOrder")}</div><div class="qcard"><div class="mean" style="font-size:20px">${esc(tx(Q.th))}</div></div>`;
    h+=`<div class="ansline" aria-label="คำตอบ">${Q.built.map((j,pos)=>`<button class="tok" data-a="untok" data-v="${pos}" ${answered?"disabled":""}>${Q.bank[j]}</button>`).join("")}</div>`;
    h+=`<div class="chips" style="gap:8px">${Q.bank.map((tk,j)=>Q.built.includes(j)?"":`<button class="tok" data-a="tok" data-v="${j}" ${answered?"disabled":""}>${tk}</button>`).join("")}</div>`;
    if(!answered) h+=`<button class="btn" data-a="check" ${Q.built.length<Q.bank.length?"disabled":""}>${t("check")}</button>`;
  }
  if(answered){
    const last=q.i===n-1;
    const ansTxt=Q.k==="order"? `${Q.s.join("")} · <span class="py">${esc(Q.py)}</span>` : `${Q.w[0]} · <span class="py">${esc(Q.w[1])}</span> · ${esc(mean(Q.w))}`;
    h+=`<div class="fb ${Q.res?"good":"bad"}" role="status"><b>${Q.res?t("good"):t("bad")}</b><div style="font-family:var(--f-ui);font-size:17px">${ansTxt}</div><button class="btn" data-a="qnext">${last?t("seeResult"):t("next")}</button></div>`;
  }
  return h;
}
function resultHTML(q,isLesson){
  const n=q.qs.length;
  let h=`<div class="card result"><div class="note">${t("result")}</div><div class="score">${q.correct}/${n}</div><div style="font-weight:700;color:var(--amber-ink)">${T[S.lang].gotPts(q.correct*10)}</div></div>`;
  if(isLesson){
    if(view.li<L.length-1) h+=`<button class="btn" data-a="open" data-v="${view.li+1}">${t("nextLesson")}</button>`;
    h+=`<button class="btn ghost" data-a="exit">${t("finish")}</button>`;
  } else {
    h+=`<button class="btn" data-a="retryq">${t("retry")}</button><button class="btn ghost" data-a="exit">${t("back")}</button>`;
  }
  return h;
}

/* ---------- การกดปุ่ม ---------- */
function curQuiz(){return view&&view.quiz}
const A={
  tab:v=>{tab=v; resetArmed=false; render(true)},
  lang:v=>{S.lang=v; save(); render()},
  open:v=>openLesson(+v),
  exit:()=>{try{speechSynthesis.cancel()}catch(e){} view=null; render(true)},
  step:v=>{view.step=+v; view.vi=0; render(true)},
  vprev:()=>{view.vi=Math.max(0,view.vi-1); render(); speak(L[view.li].v[view.vi][0])},
  vnext:()=>{view.vi=Math.min(L[view.li].v.length-1,view.vi+1); render(); speak(L[view.li].v[view.vi][0])},
  vjump:v=>{view.vi=+v; render(); speak(L[view.li].v[view.vi][0])},
  say:v=>speak(v),
  sayall:()=>{try{speechSynthesis.cancel()}catch(e){} L[view.li].d.forEach(d=>speak(d[1],true))},
  said:v=>{view.said[v]=!view.said[v]; render()},
  mic:v=>{if(!SR)return; const i=+v; view.mic=view.mic||{};
    if(view.mic[i]&&view.mic[i].st==="listen"){stopMic(); delete view.mic[i]; render(); return}
    stopMic(); try{speechSynthesis.cancel()}catch(e){}
    const target=L[view.li].s[i][0].split("|").join("");
    Object.keys(view.mic).forEach(k=>{if(view.mic[k].st==="listen")delete view.mic[k]});
    view.mic[i]={st:"listen"}; render();
    const r=new SR(); recog=r; r.lang="zh-CN"; r.interimResults=false; r.maxAlternatives=5; r.continuous=false;
    r.onresult=e=>{const alts=[...e.results[0]].map(a=>(a&&a.transcript)||""); let best=null; alts.forEach(tr=>{const sc=micScore(target,tr); if(!best||sc.p>best.p) best={...sc,heard:tr}}); view.mic[i]={st:"done",...best}; if(best.p>=80) view.said[i]=true; if(view.type==="lesson") render()};
    r.onerror=e=>{if(e.error==="aborted")return; view.mic[i]={st:"err",err:e.error}; if(view.type==="lesson") render()};
    r.onend=()=>{if(recog===r) recog=null; if(view.mic[i]&&view.mic[i].st==="listen"){view.mic[i]={st:"err",err:"no-speech"}; if(view.type==="lesson") render()}};
    try{r.start()}catch(e){view.mic[i]={st:"err",err:"start"}; render()}},
  topic:v=>{const l=TOPICS[+v].l; view=unlocked(l)?{type:"topic",ti:+v}:{type:"locked",li:l}; render(true)},
  join:()=>{view=null; tab="me"; render(true); setTimeout(()=>{const el=document.getElementById("member"); if(el) el.scrollIntoView({block:"start"})},30)},
  copybk:()=>{const txt=makeBackup(); try{navigator.clipboard.writeText(txt).then(()=>toast(t("copied")+": "+txt),()=>selectEl("bk"))}catch(e){selectEl("bk")}},
  restore:()=>{const inp=document.getElementById("restoreInput"), msg=document.getElementById("restoreMsg"), btn=document.getElementById("restoreBtn"); const r=readBackup(inp.value);
    if(!r){msg.textContent=t("restoreBad"); msg.style.color="var(--bad)"; restoreArmed=null; btn.textContent=t("restoreBtn"); return}
    if(restoreArmed!==inp.value){restoreArmed=inp.value; btn.textContent=t("restoreSure"); msg.textContent=""; return}
    restoreArmed=null; S.done=r.done; S.pts=r.pts; S.streak=r.streak; S.last=r.last; save(); render(); toast(T[S.lang].restoreOk(Object.keys(r.done).length,r.pts))},
  activate:async()=>{const inp=document.getElementById("codeInput"), uin=document.getElementById("userInput"), msg=document.getElementById("codeMsg"); const ex=await readCode(inp.value,uin.value);
    if(ex===null){msg.textContent=t("codeBad"); msg.style.color="var(--bad)"; return}
    if(ex<effToday()){msg.textContent=T[S.lang].codeOld(fmtDay(ex)); msg.style.color="var(--bad)"; return}
    S.code=norm(inp.value); S.user=normU(uin.value); memberExp=ex; save(); render(); const m=document.getElementById("codeMsg"); if(m){m.textContent=T[S.lang].codeOk(fmtDay(ex)); m.style.color="var(--brand)"}},
  topicquiz:()=>{const ti=view.ti; const ws=topicWords(ti); const pool=ws.length>=4?ws:L[TOPICS[ti].l].v; view={type:"quiz",title:lname(TOPICS[ti]),quiz:mkQuiz(pool,[],Math.min(8,Math.max(5,pool.length))),src:{k:"topic",ti}}; render(true)},
  practice:()=>{const p=learnedPool(); const pool=p.length>=4?p:ALLV; const says=[].concat(...(p.length>=4?Object.keys(S.done).map(Number).filter(i=>i>0):[1,2]).map(i=>L[i].s)); view={type:"quiz",title:t("pracTitle"),quiz:mkQuiz(pool,says,10),src:{k:"practice"}}; render(true)},
  retryq:()=>{const s=view.src; if(s.k==="topic"){view={type:"topic",ti:s.ti}; A.topicquiz()} else A.practice()},
  opt:v=>{const q=curQuiz(), Q=q.qs[q.i]; if(Q.res!==null) return; Q.pick=+v; Q.res=Q.opts[+v][0]===Q.w[0]; grade(q,Q); render(); if(Q.res) speak(Q.w[0])},
  tok:v=>{const Q=curQuiz().qs[curQuiz().i]; if(Q.res===null&&!Q.built.includes(+v)){Q.built.push(+v); speak(Q.bank[+v]); render()}},
  untok:v=>{const Q=curQuiz().qs[curQuiz().i]; if(Q.res===null){Q.built.splice(+v,1); render()}},
  check:()=>{const q=curQuiz(), Q=q.qs[q.i]; Q.res=Q.built.map(j=>Q.bank[j]).join("")===Q.s.join(""); grade(q,Q); render(); speak(Q.s.join(""))},
  qnext:()=>{const q=curQuiz(); if(q.i<q.qs.length-1){q.i++; render(true); const Q=q.qs[q.i]; if(Q.k==="listen") setTimeout(()=>speak(Q.w[0]),150)} else { q.fin=true; if(view.type==="lesson"){view.fin=true; S.done[view.li]=true; touch(); save();} render(true)}},
  reset:()=>{if(!resetArmed){resetArmed=true; render(); return} const {lang,user,code,maxDay,trial}=S; S={pts:0,streak:0,last:"",done:{},lang,user,code,maxDay,trial}; save(); resetArmed=false; render(); toast(t("resetDone"))}
};
function grade(q,Q){if(Q.res){q.correct++; S.pts+=10; touch(); save();}}
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]"); if(!b||b.disabled) return; const f=A[b.dataset.a]; if(f) f(b.dataset.v,b);});
/* เปิดคำถามฟังเสียงครั้งแรกเมื่อเข้าแบบฝึกหัด */
const _step=A.step; A.step=v=>{_step(v); const q=curQuiz(); if(view&&stepsOf(view.li)[view.step]==="quiz"&&q&&q.qs[q.i].k==="listen"&&q.qs[q.i].res===null) setTimeout(()=>speak(q.qs[q.i].w[0]),150)};
let restoreArmed=null;
function selectEl(id){const el=document.getElementById(id); if(!el) return; const r=document.createRange(); r.selectNodeContents(el); const s=getSelection(); s.removeAllRanges(); s.addRange(r);}
render();
if(S.code&&S.user) readCode(S.code,S.user).then(ex=>{memberExp=ex; if(!view||view.type==="locked") render();});
