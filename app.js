/**
 * Multiplication Trainer - Main application
 * Uses C++/WASM when available, falls back to JS implementation
 */

// Pure JavaScript fallback (same logic as C++)
function createJsEngine() {
  let state = 1;
  const seed = (s) => { state = s; };
  const rand = (max) => {
    state = (state * 1103515245 + 12345) >>> 0;
    return (state / 65536) % max;
  };

  return {
    generateQuestion(seedVal) {
      seed(seedVal);
      const n = Math.round(15 + rand(71));
      const maxD = Math.min(n - 10, 99 - n);
      const d = Math.round(1 + rand(Math.max(1, maxD)));
      const factor1 = n - d;
      const factor2 = n + d;
      const answer = n * n - d * d;

      return {
        factor1: Math.min(factor1, factor2),
        factor2: Math.max(factor1, factor2),
        answer,
        hint: `${n}² - ${d}²`,
      };
    },
    checkAnswer(user, correct) {
      return Number(user) === correct;
    },
  };
}

// Load WASM module (Emscripten output) - multiply.js must be in same dir
async function loadWasmEngine() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'multiply.js';
    script.onload = () => {
      if (typeof createMultiplyModule === 'function') {
        createMultiplyModule()
          .then((Module) => resolve({
            generateQuestion: (s) => Module.generateQuestion(s),
            checkAnswer: (u, c) => Module.checkAnswer(u, c),
          }))
          .catch(() => resolve(null));
      } else {
        resolve(null);
      }
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

// Initialize app
async function init() {
  let engine = await loadWasmEngine().catch(() => null);
  if (!engine) {
    engine = createJsEngine();
  }

  const questionEl = document.getElementById('question');
  const inputEl = document.getElementById('answer-input');
  const formEl = document.getElementById('answer-form');
  const feedbackEl = document.getElementById('feedback');
  const nextBtn = document.getElementById('next-btn');

  let currentQuestion = null;
  let questionStartTime = 0;

  function showQuestion() {
    const seed = Math.floor(Date.now() * Math.random());
    currentQuestion = engine.generateQuestion(seed);
    questionEl.textContent = `${currentQuestion.factor1} × ${currentQuestion.factor2} = ?`;
    inputEl.value = '';
    inputEl.focus();
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    nextBtn.classList.add('hidden');
    questionStartTime = performance.now();
    const timerEl = document.getElementById('timer-display');
    timerEl.textContent = '';
  }

  
  function showResult(correct, elapsedTime) {
    const timerEl = document.getElementById('timer-display');
    if (timerEl) {
      timerEl.classList.add('flash');
      timerEl.addEventListener('animationend', () => {
        timerEl.classList.remove('flash');
      }, {once : true});
      timerEl.textContent = `Time: ${elapsedTime} ms`;
    }
    feedbackEl.className = 'feedback ' + (correct ? 'correct' : 'wrong');
    feedbackEl.innerHTML = correct
      ? 'Correct!'
      : `Incorrect. The answer is ${currentQuestion.answer}.<br><span class="hint">Hint: ${currentQuestion.hint}</span>`;
    nextBtn.classList.remove('hidden');
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentQuestion) return;
    const userAnswer = inputEl.value.trim();
    if (userAnswer === '') return;
    const correct = engine.checkAnswer(userAnswer, currentQuestion.answer);
    const elapsedTime = Math.round(performance.now() - questionStartTime);
    showResult(correct, elapsedTime);
  });

  nextBtn.addEventListener('click', showQuestion);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      showQuestion();
    }
  });

  showQuestion();
}

init();
