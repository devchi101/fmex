const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  toggle.textContent = document.body.classList.contains('light') ? '😈' : '🌙';
});

// Phantom Wallet integration
let walletAddress = null;
const walletButton = document.getElementById('wallet-button');
const statusEl = document.getElementById('status');

// Connect wallet function
async function connectWallet() {
  if (!window.solana || !window.solana.isPhantom) {
    alert("Phantom Wallet not found. Please install it.");
    return;
  }

  try {
    const response = await window.solana.connect();
    walletAddress = response.publicKey.toString();
    updateUI(true);
  } catch (err) {
    console.error("Connection error:", err);
    statusEl.textContent = "❌ Connection failed. Please try again.";
  }
}

// Update UI
function updateUI(connected) {
  if (connected && walletAddress) {
    const short = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    walletButton.textContent = `Connected: ${short}`;
    statusEl.textContent = `✅ Connected to wallet`;
  }
}

// Set up button (only once)
walletButton.onclick = connectWallet;

// Auto-connect if trusted
window.addEventListener('load', async () => {
  if (window.solana?.isPhantom) {
    try {
      const response = await window.solana.connect({ onlyIfTrusted: true });
      walletAddress = response.publicKey.toString();
      updateUI(true);
    } catch (e) {
      // Silent if not connected
    }
  }
});

// Set initial progress (e.g. 22,980.01 out of 50,000)
const raised = 10980.01;
const target = 50000;
const progressPercent = (raised / target) * 100;

// Animate progress bar fill
document.addEventListener("DOMContentLoaded", () => {
  const fill = document.getElementById("progress-fill");
  if (fill) {
    fill.style.width = `${progressPercent.toFixed(2)}%`;
  }
});

// Estimate
const solInput = document.getElementById("solAmount");
const estimateEl = document.getElementById("fmexEstimate");

function updateEstimate() {
  const sol = parseFloat(solInput.value);
  if (!isNaN(sol) && sol >= 0.1) {
    const fmexAmount = sol * 800_000; // 1 SOL = 800,000 FMEX
    estimateEl.textContent = `You’ll receive: ${fmexAmount.toLocaleString()} $FMEX`;
    estimateEl.style.color = "lime";
  } else {
    estimateEl.textContent = "";
  }
}

if (solInput && estimateEl) {
  solInput.addEventListener("input", updateEstimate);
}

document.addEventListener("DOMContentLoaded", () => {
  // CONFESSION WALL
  const confessionInput = document.getElementById('confession-input');
  const confessionList = document.getElementById('confession-list');
  const submitConfession = document.getElementById('submit-confession');
  const toast = document.getElementById('toast');
  const toastSound = document.getElementById('toast-sound');

  const badWords = ['fuck', 'shit', 'bitch', 'asshole'];
  const maxLength = 280;

  function showToast(message = "Saved!") {
    toast.textContent = message;
    toast.classList.add('show');
    toastSound.play();
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function loadConfessions() {
  confessionList.innerHTML = '';
  const confessions = JSON.parse(localStorage.getItem('confessions') || '[]');
  confessions.reverse().forEach(text => {
    const li = document.createElement('li');
    li.className = 'confession';
    li.textContent = text;
    confessionList.appendChild(li);
  });
}

  function saveConfession(text) {
    const confessions = JSON.parse(localStorage.getItem('confessions') || '[]');
    confessions.push(text);
    localStorage.setItem('confessions', JSON.stringify(confessions));
  }

  function containsBadWords(text) {
    return badWords.some(word => text.toLowerCase().includes(word));
  }

  function handleConfessionSubmit() {
    const text = confessionInput.value.trim();
    if (!text) return showToast("Confession can't be empty.");
    if (text.length > maxLength) return showToast(`Max ${maxLength} characters allowed.`);
    if (containsBadWords(text)) return showToast("Please avoid profanity.");

    saveConfession(text);
    confessionInput.value = '';
    loadConfessions();
    showToast("Confession posted.");
  }

  if (submitConfession) {
    submitConfession.addEventListener('click', handleConfessionSubmit);
    loadConfessions();
  }

  // AIRDROP COUNTDOWN
  const countdown = document.getElementById("airdrop-timer");
  const deadline = new Date("2025-07-24T00:00:00Z").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = deadline - now;

    if (distance <= 0) {
      countdown.textContent = "🎉 Airdrop Closed!";
      clearInterval(timerInterval);
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }

  const timerInterval = setInterval(updateCountdown, 1000);
  updateCountdown();
});

// Scroll animation for fade-in
// Scroll animation using Intersection Observer
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // animate once
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-left, .fade-in-right').forEach(el => {
  observer.observe(el);
});

// Coin Utility Chart
const ctx = document.getElementById('coinChart').getContext('2d');

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Staking', 'Challenges', 'Governance', 'Burns', 'Liquidity'],
    datasets: [{
      data: [14, 19, 10, 6, 20],
      backgroundColor: [
        '#ff5cbf',
        '#00f0ff',
        '#ffcb05',
        '#a855f7',
        '#4ade80'
      ],
      borderColor: '#0b0b13',
      borderWidth: 3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: '$FMEX',
        color: "white",
        font: {
          size: 18
        }
      }
    }
  }
});


window.onload = function () {
  const ctx = document.getElementById("tokenomicsChart")?.getContext("2d");
  if (!ctx) return; // Safety: stop if element is missing

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Marketing", "Development", "Liquidity", "Presale", "Airdrop"],
      datasets: [
        {
          label: "Fund Allocation",
          data: [30, 20, 50, null, null],
          backgroundColor: "#00e599"
        },
        {
          label: "Token Allocation (Launch)",
          data: [null, null, 30, 60, 10],
          backgroundColor: "#9945FF"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "x",
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: "#ffffff",
            font: { weight: "bold" }
          },
          grid: { color: "#444" }
        },
        x: {
          ticks: {
            color: "#ffffff",
            font: { weight: "bold" }
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
            font: { weight: "bold" }
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw || 0}%`;
            }
          }
        }
      }
    }
  });
};

const phrases = [
  "💔 F*ck My Ex Coin ($FMEX)",
  "Turning Heartbreak Into Gains 💰",
  "Stake. Meme. Earn. Repeat"
];

const typingText = document.getElementById("typingText");

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let speed = 50;

function type() {
  const currentPhrase = phrases[phraseIndex];
  const currentText = currentPhrase.substring(0, charIndex);

  typingText.textContent = currentText;

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex++;
    speed = 80;
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    speed = 50;
  } else {
    if (!isDeleting) {
      isDeleting = true;
      speed = 2000; // pause before deleting
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 500;
    }
  }

  setTimeout(type, speed);
}

document.addEventListener("DOMContentLoaded", () => {
  type();
});
