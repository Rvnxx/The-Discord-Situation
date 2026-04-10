const DISCORD_ID = "1017840122328252538";

// 1. START VIBE & AUDIO
function startVibe() {
    document.getElementById('vibe-overlay').style.display = 'none';
    document.getElementById('lofi-player').src = "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1";
}

// 2. DISCORD SYSTEM
async function getStatus() {
    try {
        const r = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const d = await r.json();
        const data = d['data'];
        const user = data['discord_user'];
        const activities = data['activities'];

        document.getElementById('discord-avatar').style.backgroundImage = `url(https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user['avatar']}.png)`;
        document.getElementById('discord-name').innerText = user['username'].toUpperCase();

        const dot = document.getElementById('discord-status');
        const s = data['discord_status'];
        dot.style.background = s === 'online' ? '#23a55a' : s === 'dnd' ? '#f23f43' : s === 'idle' ? '#f0b232' : '#80848e';

        const activityEl = document.getElementById('current-activity');
        if (activities && activities.length > 0) {
            activityEl.innerText = `DOING: ${activities[activities.length - 1].name.toUpperCase()}`;
        } else {
            activityEl.innerText = "STATUS: IDLE";
        }
    } catch (e) { console.log("Lanyard Error"); }
}

setInterval(getStatus, 10000);
getStatus().catch(console.error);

// 3. BACKGROUND CANVAS
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

let stars = [];
for(let i=0; i<80; i++) {
    stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, s: Math.random() * 2, v: Math.random() * 0.5 + 0.2 });
}

function draw() {
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4b0082';
    stars.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill();
        p.y -= p.v; if(p.y < 0) p.y = canvas.height;
    });
    requestAnimationFrame(draw);
}
draw();

// 4. CURSOR & VIBELY EFFECTS
document.addEventListener('mousemove', (e) => {
    const c = document.getElementById('custom-cursor');
    c.style.left = e.clientX + 'px';
    c.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);

    const c = document.getElementById('custom-cursor');
    c.style.width = '20px'; c.style.height = '20px'; c.style.background = '#ffffff';
});

document.addEventListener('mouseup', () => {
    const c = document.getElementById('custom-cursor');
    c.style.width = '12px'; c.style.height = '12px'; c.style.background = '#ff0055';
});

// 5. THE LOCKOUT (Anti-Inspect)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});
