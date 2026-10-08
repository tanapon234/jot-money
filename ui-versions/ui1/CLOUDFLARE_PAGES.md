# Cloudflare Pages — รุ่นเดโม

เอกสารนี้เป็นค่าที่ต้องใช้เมื่อพร้อมเชื่อม GitHub และ Cloudflare Pages โดยยังไม่มี credential ใดเก็บไว้ในโครงการ

## โปรเจกต์เดโม

| รายการ | ค่า |
| --- | --- |
| GitHub repository | `jot-money` (ตั้งเป็น private ได้) |
| Cloudflare Pages project | `jot-money-demo` |
| URL เริ่มต้น | `jot-money-demo.pages.dev` |
| Production branch | `demo` |
| Framework preset | `None` |
| Root directory | เว้นว่าง |
| Build command | เว้นว่าง |
| Build output directory | `dist` |

## ลำดับการสร้างครั้งแรก

1. ติดตั้ง Git for Windows และสร้าง GitHub repository แบบว่างชื่อ `jot-money`.
2. เริ่ม repository ในโฟลเดอร์นี้ แล้ว push branch `main` และ `demo` ไป GitHub.
3. ใน Cloudflare ไปที่ **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
4. เชื่อม GitHub โดยอนุญาต Cloudflare เข้าถึงเฉพาะ repository `jot-money`.
5. เลือก repository แล้วกรอกค่าตามตาราง จากนั้น deploy.
6. เปิด URL ของเดโม ตรวจการทำงานบนมือถือและคอมก่อนบอกผู้ใช้คนอื่นให้ลอง.

## การออก patch เดโม

1. แก้ใน branch `fix/...` หรือ `feature/...`.
2. รันชุดตรวจทั้งหมดและเพิ่มเลข `VERSION` เป็นรุ่นเดโมถัดไป.
3. เพิ่มบันทึกใน `CHANGELOG.md`, push branch และตรวจ preview URL.
4. เมื่อผ่าน ให้ merge เข้า `demo`; Cloudflare จะอัปเดต URL เดโมอัตโนมัติ.

## ก่อนเปิดรุ่นจริง

- เพิ่มการสำรอง/กู้คืน JSON และทดสอบการย้ายข้อมูล.
- ทบทวนข้อความที่บอกผู้ใช้ว่าไม่มีการซิงก์ข้อมูล.
- สร้าง Pages project จริงแยกจากเดโม แล้วตั้ง production branch เป็น `main`.
