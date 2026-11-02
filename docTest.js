     //<!-- ======================== JAVASCRIPT LOGIC ======================== -->
 // Question Database for the 3 subjects shown in Card 1
        const quizDatabase = {
            Mathematics: [
                {
                    q: "1. ถ้า 3x + 9 = 24 แล้วค่าของ x มีค่าเท่ากับข้อใด?",
                    choices: ["x = 3", "x = 5", "x = 7", "x = 8"],
                    answer: 1
                },
                {
                    q: "2. พื้นที่ของรูปสี่เหลี่ยมผืนผ้าที่มีความกว้าง 8 ซม. และความยาว 12 ซม. คือข้อใด?",
                    choices: ["40 ตารางเซนติเมตร", "84 ตารางเซนติเมตร", "96 ตารางเซนติเมตร", "108 ตารางเซนติเมตร"],
                    answer: 2
                },
                {
                    q: "3. ค่าเฉลี่ยเลขคณิตของข้อมูล 10, 15, 20, 25, 30 มีค่าเท่าใด?",
                    choices: ["18", "20", "22", "25"],
                    answer: 1
                }
            ],
            English: [
                {
                    q: "1. Choose the correct word: 'She _____ to Udon Thani Vocational College every day.'",
                    choices: ["go", "goes", "going", "gone"],
                    answer: 1
                },
                {
                    q: "2. Which expression is best used when greeting a teacher in the morning?",
                    choices: ["Good night, teacher.", "Good morning, how are you?", "See you tomorrow.", "Thank you very much."],
                    answer: 1
                },
                {
                    q: "3. What does 'Standard Assessment' mean in Thai?",
                    choices: ["การประเมินผลที่ได้มาตรฐาน", "การลงทะเบียนเรียนออนไลน์", "ตารางสอนประจำสัปดาห์", "ใบรับรองการจบการศึกษา"],
                    answer: 0
                }
            ],
            Programming: [
                {
                    q: "1. คำสั่งใดในภาษา Python ใช้สำหรับแสดงผลข้อความออกทางหน้าจอ?",
                    choices: ["echo()", "console.log()", "print()", "system.out()"],
                    answer: 2
                },
                {
                    q: "2. แท็ก HTML ใดใช้สำหรับสร้างปุ่มกดบนหน้าเว็บไซต์?",
                    choices: ["<input-btn>", "<button>", "<click>", "<action>"],
                    answer: 1
                },
                {
                    q: "3. ข้อใดคือสัญลักษณ์ของคำสั่งเปรียบเทียบ 'เท่ากับ' ในการเขียนโปรแกรมส่วนใหญ่?",
                    choices: ["==", "=>", "!=", "<<"],
                    answer: 0
                }
            ]
        };

        let currentSubject = 'Mathematics';
        let currentIndex = 0;
        let selectedChoice = null;
        let userScore = 0;
        let timerInterval = null;
        let secondsRemaining = 300;

        // Navigation interactions
        function setActiveNav(el, name) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active', 'text-udvc-navy', 'font-semibold');
            });
            el.classList.add('active', 'text-udvc-navy', 'font-semibold');
            showToast(`เปิดเมนู: ${name}`);
        }

        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        function setActiveNavMobile(name) {
            document.getElementById('mobileMenu').classList.add('hidden');
            showToast(`เปิดเมนู: ${name}`);
        }

        // Login Modal Functions
        function openLoginModal() {
            document.getElementById('loginModal').classList.remove('hidden');
        }

        function closeLoginModal() {
            document.getElementById('loginModal').classList.add('hidden');
        }

        function handleLoginSubmit(e) {
            e.preventDefault();
            const stdId = document.getElementById('studentIdInput').value || 'นักศึกษา UDVC';
            const loginBtn = document.getElementById('loginHeaderBtn');
            loginBtn.innerHTML = `<i class="fa-solid fa-circle-check text-[#e4c887]"></i> <span>${stdId}</span>`;
            closeLoginModal();
            showToast(`ยินดีต้อนรับ รหัสนักศึกษา ${stdId} เข้าสู่ระบบ UDVC`);
        }

        // Quiz Modal Functions
        function openQuizModal(subject) {
            document.getElementById('quizModal').classList.remove('hidden');
            selectQuizSubject(subject || 'Mathematics');
            startTimer();
        }

        function closeQuizModal() {
            document.getElementById('quizModal').classList.add('hidden');
            if (timerInterval) clearInterval(timerInterval);
        }

        function selectQuizSubject(subject) {
            currentSubject = subject;
            currentIndex = 0;
            userScore = 0;
            selectedChoice = null;

            // Update Subject Tab Styling
            ['Mathematics', 'English', 'Programming'].forEach(sub => {
                const btn = document.getElementById('tab-' + sub);
                if (sub === subject) {
                    btn.className = "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-udvc-navy text-white shadow-sm";
                } else {
                    btn.className = "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white text-slate-600 border border-slate-200 hover:bg-slate-100";
                }
            });

            document.getElementById('quizBody').classList.remove('hidden');
            document.getElementById('quizResultView').classList.add('hidden');
            renderCurrentQuestion();
        }

        function renderCurrentQuestion() {
            const list = quizDatabase[currentSubject];
            const item = list[currentIndex];
            selectedChoice = null;

            const total = list.length;
            const pct = Math.round(((currentIndex + 1) / total) * 100);

            document.getElementById('questionCounter').textContent = `ข้อที่ ${currentIndex + 1} จาก ${total} (วิชา ${currentSubject})`;
            document.getElementById('progressPercent').textContent = `${pct}%`;
            document.getElementById('quizProgressBar').style.width = `${pct}%`;
            document.getElementById('questionText').textContent = item.q;

            const container = document.getElementById('choicesContainer');
            container.innerHTML = '';

            item.choices.forEach((choiceText, idx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = "w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-udvc-navy/50 text-sm font-medium text-slate-700 flex items-center justify-between transition-all";
                btn.innerHTML = `
                    <span>${choiceText}</span>
                    <span class="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs choice-radio"></span>
                `;
                btn.onclick = () => {
                    selectedChoice = idx;
                    Array.from(container.children).forEach((c, cIdx) => {
                        if (cIdx === idx) {
                            c.className = "w-full text-left px-4 py-3 rounded-xl border-2 border-udvc-navy bg-slate-50 text-sm font-semibold text-udvc-navy flex items-center justify-between transition-all";
                            c.querySelector('.choice-radio').innerHTML = '<i class="fa-solid fa-check text-udvc-navy"></i>';
                        } else {
                            c.className = "w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-udvc-navy/50 text-sm font-medium text-slate-700 flex items-center justify-between transition-all";
                            c.querySelector('.choice-radio').innerHTML = '';
                        }
                    });
                };
                container.appendChild(btn);
            });

            const nextBtn = document.getElementById('nextQuestionBtn');
            nextBtn.innerHTML = currentIndex === total - 1 
                ? 'ส่งคำตอบและดูผลประเมิน <i class="fa-solid fa-check-double ml-1"></i>' 
                : 'ข้อถัดไป <i class="fa-solid fa-arrow-right ml-1"></i>';
        }

        function nextQuestion() {
            if (selectedChoice === null) {
                showToast('กรุณาเลือกคำตอบก่อนไปข้อถัดไป');
                return;
            }

            const list = quizDatabase[currentSubject];
            if (selectedChoice === list[currentIndex].answer) {
                userScore++;
            }

            if (currentIndex < list.length - 1) {
                currentIndex++;
                renderCurrentQuestion();
            } else {
                showQuizResult();
            }
        }

        function showQuizResult() {
            document.getElementById('quizBody').classList.add('hidden');
            document.getElementById('quizResultView').classList.remove('hidden');

            const total = quizDatabase[currentSubject].length;
            document.getElementById('resultSubjectTitle').textContent = `ผลประเมินรายวิชา ${currentSubject}`;
            document.getElementById('resultScoreText').textContent = `${userScore} / ${total}`;
            document.getElementById('resultGradeText').textContent = userScore === total ? 'ดีเยี่ยม (Excellent)' : (userScore >= 2 ? 'ดีมาก (Very Good)' : 'ผ่านเกณฑ์ (Pass)');
        }

        function openSampleCertificate() {
            document.getElementById('quizModal').classList.remove('hidden');
            currentSubject = 'Mathematics';
            userScore = 3;
            showQuizResult();
        }

        function resetQuiz() {
            selectQuizSubject(currentSubject);
        }

        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            secondsRemaining = 300;
            const timerEl = document.getElementById('quizTimer');
            timerInterval = setInterval(() => {
                secondsRemaining--;
                if (secondsRemaining <= 0) {
                    clearInterval(timerInterval);
                    showQuizResult();
                    return;
                }
                const mins = String(Math.floor(secondsRemaining / 60)).padStart(2, '0');
                const secs = String(secondsRemaining % 60).padStart(2, '0');
                timerEl.textContent = `${mins}:${secs}`;
            }, 1000);
        }

        // Toast Helper
        let toastTimeout = null;
        function showToast(message) {
            const box = document.getElementById('toastBox');
            document.getElementById('toastMessage').textContent = message;
            box.classList.remove('hidden');
            if (toastTimeout) clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                box.classList.add('hidden');
            }, 3000);
        }