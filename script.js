const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.main-nav');
const revealItems = document.querySelectorAll('.reveal');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('is-open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const breathingStates = {
  inhale: { label: 'Inspire', duration: 4, message: 'Deixe a barriga abrir com calma.' },
  hold: { label: 'Segure', duration: 2, message: 'Mantenha a quietude sem forçar.' },
  exhale: { label: 'Expire', duration: 6, message: 'Solte o que puder, devagar.' },
};

const breathCircle = document.getElementById('breathCircle');
const breathPhase = document.getElementById('breathPhase');
const breathCountdown = document.getElementById('breathCountdown');
const breathMessage = document.getElementById('breathMessage');
const startBreath = document.getElementById('startBreath');
const pauseBreath = document.getElementById('pauseBreath');
const resetBreath = document.getElementById('resetBreath');

const breathSequence = ['inhale', 'hold', 'exhale'];

let breathInterval = null;
let breathStateIndex = 0;
let timeLeft = 0;
let running = false;
let completed = false;

function updateBreathVisual(stateName) {
  breathCircle.classList.remove('inhale', 'hold', 'exhale');

  if (stateName === 'inhale') {
    breathCircle.classList.add('inhale');
  }

  if (stateName === 'hold') {
    breathCircle.classList.add('hold');
  }

  if (stateName === 'exhale') {
    breathCircle.classList.add('exhale');
  }
}

function updateBreathDisplay(stateName, countdownValue) {
  const state = breathingStates[stateName];
  breathPhase.textContent = state.label;
  breathMessage.textContent = state.message;
  breathCountdown.textContent = String(countdownValue);
  updateBreathVisual(stateName);
}

function endBreathCycle() {
  running = false;
  completed = true;
  clearInterval(breathInterval);
  breathPhase.textContent = 'Concluído';
  breathMessage.textContent = 'Você terminou um ciclo. Pode permanecer um momento mais tranquilo antes de seguir em frente.';
  breathCountdown.textContent = '0';
  breathCircle.classList.remove('inhale', 'hold', 'exhale');
}

function moveToNextBreathState() {
  if (breathStateIndex >= breathSequence.length - 1) {
    endBreathCycle();
    return;
  }

  breathStateIndex += 1;
  const nextStateName = breathSequence[breathStateIndex];
  timeLeft = breathingStates[nextStateName].duration;
  updateBreathDisplay(nextStateName, timeLeft);
}

function stepBreathCycle() {
  if (!running || completed) return;

  timeLeft -= 1;
  breathCountdown.textContent = String(timeLeft);

  if (timeLeft <= 0) {
    const currentStateName = breathSequence[breathStateIndex];

    if (currentStateName === 'exhale') {
      moveToNextBreathState();
      return;
    }

    moveToNextBreathState();
  }
}

function startBreathCycle() {
  if (running) return;

  if (completed || breathStateIndex >= breathSequence.length) {
    breathStateIndex = 0;
    completed = false;
  }

  if (timeLeft <= 0) {
    breathStateIndex = 0;
    timeLeft = breathingStates[breathSequence[breathStateIndex]].duration;
    updateBreathDisplay(breathSequence[breathStateIndex], timeLeft);
  }

  running = true;
  breathInterval = setInterval(() => {
    stepBreathCycle();
  }, 1000);
}

function pauseBreathCycle() {
  running = false;
  clearInterval(breathInterval);
}

function resetBreathCycle() {
  pauseBreathCycle();
  completed = false;
  breathStateIndex = 0;
  timeLeft = breathingStates.inhale.duration;
  updateBreathDisplay('inhale', timeLeft);
  breathMessage.textContent = 'Abrace o ritmo do momento.';
}

startBreath.addEventListener('click', startBreathCycle);
pauseBreath.addEventListener('click', pauseBreathCycle);
resetBreath.addEventListener('click', resetBreathCycle);

resetBreathCycle();

const quoteBank = [
  'Você não precisa encontrar todas as respostas hoje.',
  'Alguns dias pedem movimento. Outros pedem apenas presença.',
  'Falar sobre o que pesa também é uma forma de cuidado.',
  'Nem tudo precisa ser resolvido em uma única tentativa.',
  'O silêncio também pode ser um lugar de acolhimento.',
  'Você pode começar por um passo bem pequeno.',
  'Às vezes, a melhor resposta é parar e escutar o próprio coração.',
  'Apressar o sentimento não o torna menor, apenas mais pesado.',
  'Há um valor em reconhecer que o momento exige gentileza.',
  'Ninguém precisa girar em círculos sozinho por muito tempo.',
  'Você não está atrasado por precisar de pausa.',
  'Cuidar de si também é uma forma de estar presente com o mundo.',
  'Uma conversa honesta pode ser mais leve do que você imagina.',
  'A vida raramente exige perfeição. Ela pede atenção.',
  'Seu cansaço também merece ser ouvido com respeito.'
];

const quoteText = document.getElementById('randomQuote');
const nextQuoteButton = document.getElementById('nextQuote');

let currentQuoteIndex = 0;

function renderQuote(index) {
  quoteText.style.animation = 'none';
  quoteText.offsetHeight;
  quoteText.textContent = quoteBank[index];
  quoteText.style.animation = 'fadeInUp 0.55s ease forwards';
}

function showRandomQuote() {
  let nextIndex = Math.floor(Math.random() * quoteBank.length);
  if (quoteBank.length > 1 && nextIndex === currentQuoteIndex) {
    nextIndex = (nextIndex + 1) % quoteBank.length;
  }
  currentQuoteIndex = nextIndex;
  renderQuote(currentQuoteIndex);
}

nextQuoteButton.addEventListener('click', showRandomQuote);
showRandomQuote();

const moodOptions = document.querySelectorAll('.mood-option');
const moodMessage = document.getElementById('moodMessage');

const moodMessages = {
  Leve: 'A leveza também merece ser notada. Que tal guardar esse momento como um sinal de que você está conseguindo respirar melhor.',
  Cansado: 'Cansaço não é falta de força. Pode ser um sinal de que você precisa de gentileza consigo mesmo.',
  Ansioso: 'A ansiedade pode ficar mais leve quando a gente a nomeia sem julgamento. Respire e dê espaço para o que sentiu.',
  Triste: 'O luto e a tristeza não precisam ser escondidos. Também merecem presença e cuidado.',
  Confuso: 'Confusão pode ser um lugar de início, não de erro. Você não precisa decidir tudo agora.',
  'Em paz': 'Que bom perceber essa calma. Guardar esse momento pode ajudar a reconhecer o que te sustenta.'
};

moodOptions.forEach((button) => {
  button.addEventListener('click', () => {
    moodOptions.forEach((option) => option.classList.remove('is-selected'));
    button.classList.add('is-selected');
    const mood = button.dataset.mood;
    moodMessage.textContent = moodMessages[mood] || 'Obrigado por perceber como você está. Dar nome ao que sentimos pode ser um primeiro passo.';
  });
});

window.addEventListener('beforeunload', pauseBreathCycle);