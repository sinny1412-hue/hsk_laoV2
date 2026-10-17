# ແອັບຮຽນພາສາຈີນ HSK 1–4 (ໄທ / ລາວ / 中文)

ໂປຣເຈັກ Node.js ຂອງແອັບຮຽນພາສາຈີນ. ມີ 100 ບົດຮຽນ, ຝຶກເວົ້າໃສ່ໄມໂຄຣໂຟນໄດ້, ແລະ ຕິດຕັ້ງໃສ່ໜ້າຈໍມືຖືໄດ້.
ບໍ່ຕ້ອງຕິດຕັ້ງ library ເພີ່ມ, ໃຊ້ພຽງ Node.js ເວີຊັນ 18 ຂຶ້ນໄປ.

## ໂຄງສ້າງໄຟລ໌

```
hsk-lao-project/
├── package.json              ຄຳສັ່ງ build / start
├── vercel.json               ການຕັ້ງຄ່າສຳລັບ Vercel
├── server.js                 ເຊີບເວີສຳລັບເປີດແອັບໃນເຄື່ອງຕົວເອງ
├── scripts/
│   └── build.js              ລວມໄຟລ໌ທັງໝົດເປັນແອັບດຽວ ໃນໂຟນເດີ dist/
└── src/
    ├── index.template.html   ໂຄງໜ້າເວັບ
    ├── styles.css            ສີ ແລະ ຮູບແບບໜ້າຈໍ
    ├── app.js                ໂຄດຂອງແອັບ (ໜ້າຈໍ, ແບບຝຶກຫັດ, ໄມ, ລະຫັດສະມາຊິກ)
    ├── data/
    │   ├── lessons.js        ບົດຮຽນທັງ 100 ບົດ
    │   ├── topics.js         ຫົວຂໍ້
    │   └── lao-translations.js  ຄຳແປພາສາລາວ (ປະໂຫຍກ, ບົດສົນທະນາ, ໄວຍາກອນ)
    └── static/               ໄອຄອນ, manifest, sw.js (ຄັດລອກໄປ dist/ ຕາມເດີມ)
```

## ຄຳສັ່ງ

| ຄຳສັ່ງ | ເຮັດຫຍັງ |
|---|---|
| `npm run build` | ສ້າງແອັບໃນ `dist/` ແລະ ກວດວ່າໂຄດ ຫຼື ຂໍ້ມູນບົດຮຽນມີຈຸດຜິດບໍ |
| `npm start` | ເປີດແອັບທີ່ http://localhost:3000 (ຕ້ອງ build ກ່ອນ) |
| `npm run dev` | build ແລ້ວເປີດແອັບທັນທີ |

## ແກ້ເນື້ອຫາ

- **ແກ້ຄຳແປລາວ:** ເປີດ `src/data/lao-translations.js`. ແກ້ສະເພາະຂໍ້ຄວາມ**ເບື້ອງຂວາ**. ຫ້າມແກ້ຂໍ້ຄວາມພາສາໄທເບື້ອງຊ້າຍ
- **ແກ້ບົດຮຽນ:** ເປີດ `src/data/lessons.js`. ແຕ່ລະບົດມີ:
  - `v` ຄຳສັບ `[ຈີນ, ພິນອິນ, ໄທ, ລາວ]`
  - `g` ໄວຍາກອນ
  - `d` ບົດສົນທະນາ
  - `s` ປະໂຫຍກຝຶກເວົ້າ
- **ແກ້ເບີ WhatsApp ຫຼື ລາຄາ:** ເປີດ `src/app.js`, ຊອກຄຳວ່າ `const ADMIN=`
- ແກ້ແລ້ວ ຕ້ອງລັນ `npm run build` ທຸກເທື່ອ

⚠️ ຫ້າມປ່ຽນ `SECRET` ໃນ `src/app.js`. ຖ້າປ່ຽນ, ລະຫັດສະມາຊິກທີ່ອອກໃຫ້ນັກຮຽນແລ້ວຈະໃຊ້ບໍ່ໄດ້ທັງໝົດ. ຄ່ານີ້ຕ້ອງກົງກັບໜ້າ Admin.

## ເອົາຂຶ້ນ Vercel

### ວິທີ A: ຜ່ານ GitHub (ແນະນຳ, ລິ້ງບໍ່ປ່ຽນເວລາອັບເດດ)
1. ສະໝັກ **github.com**, ແລ້ວກົດ **New repository** ຕັ້ງຊື່ `hsk-lao` ເລືອກ **Private**
2. ກົດ **uploading an existing file** ແລ້ວລາກ**ທຸກໄຟລ໌ ແລະ ໂຟນເດີ**ໃນ hsk-lao-project ໄປວາງ (ຍົກເວັ້ນ `dist/`) → **Commit changes**
3. ເຂົ້າ **vercel.com/new** → ເຂົ້າສູ່ລະບົບດ້ວຍ GitHub → ເລືອກ `hsk-lao` → **Import**
4. Vercel ຈະອ່ານ `vercel.json` ເອງ (Build: `npm run build`, Output: `dist`) → ກົດ **Deploy**
5. ໄດ້ລິ້ງ ເຊັ່ນ `hsk-lao.vercel.app`. ຕໍ່ໄປ ແກ້ໄຟລ໌ໃນ GitHub ແລ້ວ Vercel ຈະອັບເດດໃຫ້ເອງ

### ວິທີ B: ຜ່ານໂປຣແກຣມໃນຄອມ (Vercel CLI)
```
npm i -g vercel
vercel login
vercel --prod
```

## ເອົາຂຶ້ນບ່ອນອື່ນ

ລັນ `npm run build` ແລ້ວເອົາ**ທຸກໄຟລ໌ໃນໂຟນເດີ `dist/`** ໄປອັບໂຫຼດ:
- **Cloudflare Pages:** Workers & Pages → hsk-lao → Create deployment
- **Netlify:** Deploys → ລາກໂຟນເດີ dist ໄປວາງ
- **Render / Railway:** Build command `npm run build`, Start command `npm start`

## ຂໍ້ຄວນຮູ້

- ໄມໂຄຣໂຟນໃຊ້ໄດ້ສະເພາະເວັບທີ່ເປັນ **https://** ຫຼື `localhost`. ໃຊ້ໄດ້ດີທີ່ສຸດໃນ Chrome ຢູ່ Android
- ຄວາມຄືບໜ້າຂອງນັກຮຽນບັນທຶກໃນມືຖືຂອງນັກຮຽນເອງ, ແຍກຕາມລິ້ງ. ຖ້າປ່ຽນລິ້ງ, ນັກຮຽນຕ້ອງໃຊ້ "ລະຫັດສຳຮອງ" ເພື່ອຍ້າຍຄວາມຄືບໜ້າ
- ໜ້າ Admin (ສ້າງລະຫັດສະມາຊິກ) ຢູ່ໃນ Claude, ບໍ່ໄດ້ຢູ່ໃນໂປຣເຈັກນີ້
