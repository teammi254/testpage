// อ้างอิง Element จาก DOM
const navItems = document.querySelectorAll('.nav-item');
const startTestBtn = document.getElementById('startTestBtn');
const loginBtn = document.getElementById('loginBtn');
const stepCards = document.querySelectorAll('.step-card');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');

// 1. สลับขีดเส้นใต้สีทองเมื่อคลิกเมนู Navbar
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});

// 2. ฟังก์ชันเปิดและปิด Modal
function openModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;
    modalOverlay.classList.add('show');
}

function closeModal() {
    modalOverlay.classList.remove('show');
}

closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// 3. เมื่อคลิกปุ่ม "เริ่มการทดสอบทันที"
startTestBtn.addEventListener('click', () => {
    openModal('เลือกแบบทดสอบออนไลน์ UDVC', `
        <p style="margin-bottom: 14px; color: #525d72; font-size: 14px;">
            กรุณาเลือกรายวิชาที่ต้องการเข้าทำแบบทดสอบ:
        </p>
        <button class="subject-select-btn" onclick="startQuiz('Mathematics (คณิตศาสตร์)')">
            <span>📐 Mathematics (คณิตศาสตร์)</span>
            <span>เริ่มสอบ →</span>
        </button>
        <button class="subject-select-btn" onclick="startQuiz('English (ภาษาอังกฤษ)')">
            <span>🔤 English (ภาษาอังกฤษ)</span>
            <span>เริ่มสอบ →</span>
        </button>
        <button class="subject-select-btn" onclick="startQuiz('Programming (การเขียนโปรแกรม)')">
            <span>💻 Programming (การเขียนโปรแกรม)</span>
            <span>เริ่มสอบ →</span>
        </button>
    `);
});

// 4. เมื่อคลิกปุ่ม "ลงชื่อเข้าใช้"
loginBtn.addEventListener('click', () => {
    openModal('ลงชื่อเข้าใช้ระบบ UDVC', `
        <form onsubmit="handleLogin(event)">
            <div class="form-group">
                <label>รหัสนักศึกษา / ชื่อผู้ใช้งาน</label>
                <input type="text" id="usernameInput" placeholder="กรอกรหัสนักศึกษา" required>
            </div>
            <div class="form-group">
                <label>รหัสผ่าน</label>
                <input type="password" placeholder="กรอกรหัสผ่าน" required>
            </div>
            <button type="submit" class="btn-login" style="width: 100%; padding: 12px; margin-top: 8px;">
                เข้าสู่ระบบ
            </button>
        </form>
    `);
});

// 5. ฟังก์ชันจำลองการเข้าสู่ระบบและเริ่มทำข้อสอบ
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value;
    loginBtn.textContent = `สวัสดี, ${username}`;
    closeModal();
}

function startQuiz(subjectName) {
    openModal(`กำลังทดสอบ: ${subjectName}`, `
        <p style="margin-bottom: 12px; font-weight: 500;">
            ข้อที่ 1: ข้อใดคือเป้าหมายหลักของระบบทดสอบออนไลน์ UDVC?
        </p>
        <button class="subject-select-btn" onclick="showResult('${subjectName}', true)">
            ก. พัฒนาทักษะและประเมินผลที่ได้มาตรฐาน
        </button>
        <button class="subject-select-btn" onclick="showResult('${subjectName}', false)">
            ข. ใช้สำหรับลงทะเบียนเรียนเท่านั้น
        </button>
    `);
}

function showResult(subjectName, isCorrect) {
    const scoreText = isCorrect ? '100% (ผ่านเกณฑ์มาตรฐาน)' : '0% (ลองใหม่อีกครั้ง)';
    openModal('ผลการประเมิน (Evaluation Result)', `
        <div style="text-align: center; padding: 12px 0;">
            <h4 style="color: #1c2742; margin-bottom: 8px;">วิชา: ${subjectName}</h4>
            <p style="font-size: 18px; font-weight: 700; color: #b89758; margin-bottom: 16px;">
                คะแนนของคุณ: ${scoreText}
            </p>
            <button class="btn-login" onclick="closeModal()">ปิดหน้าต่าง</button>
        </div>
    `);
}

// 6. เมื่อคลิกที่การ์ดแต่ละขั้นตอน
stepCards.forEach(card => {
    card.addEventListener('click', () => {
        const step = card.getAttribute('data-step');
        if (step === '1') {
            startTestBtn.click();
        } else if (step === '2') {
            startQuiz('Programming (การเขียนโปรแกรม)');
        } else if (step === '3') {
            showResult('Programming (การเขียนโปรแกรม)', true);
        }
    });
});
