const state = {
  view: {
    timeLeft: document.querySelector("#time-left"),
    hitPoints: document.querySelector("#hits"),
    missPoints: document.querySelector("#misses"),
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    modal: document.getElementById("modal"),
    modalHits: document.getElementById("modal-hits"),
    modalMisses: document.getElementById("modal-misses"),
    modalResult: document.getElementById("modal-result"),
    restartBtn: document.getElementById("restart-btn"),
    startBtn: document.getElementById("start-btn"),
    levelBtn: document.getElementById("level-btn"),
    levelOptions: document.querySelector("#level-options"),
    levelOptionButtons: document.querySelectorAll(".level-option"),
    pauseBtn: document.getElementById("pause-btn"),
    resumeBtn: document.getElementById("resume-btn"),
  },
  values: {
    currentTime: 30,
    countDownTimerId: null,
    timerId: null,
    hits: 0,
    misses: 0,
    hitPosition: 0,
    isPaused: false,
    selectedLevel: 'hard',  // Default level
    velocityLevels: {
      easy: 2000,
      moderate: 1000,
      hard: 500,
    },
  },
};

const { view, values } = state;

const removeEnemy = () => {
  view.squares.forEach(square => square.classList.remove("enemy"));
};

const playSoundtrack = (soundtrack) => {
  let audio = new Audio(`./src/audios/${soundtrack}`);
  audio.volume = 0.2;
  audio.play();
};

const showGameResult = () => {
  view.modalHits.textContent = values.hits;
  view.modalMisses.textContent = values.misses;
  view.modalResult.textContent = values.hits - values.misses;
  view.modal.style.display = "flex";
};

const resetGameResult = () => location.reload();

const countDownGameTime = () => {
  clearInterval(values.countDownTimerId);
  values.countDownTimerId = setInterval(() => {
    if (values.isPaused) return;
    values.currentTime -= 1;
    view.timeLeft.textContent = `Tempo Restante: ${values.currentTime}`;
    if (values.currentTime === 0) {
      clearInterval(values.countDownTimerId);
      clearInterval(values.timerId);
      removeEnemy();
      showGameResult();
    }
  }, 1000);
};

const getRandomSquare = () => {
  removeEnemy();
  let randomNumber = Math.floor(Math.random() * 9);
  return view.squares[randomNumber];
};

const addEnemy = () => {
  if (values.isPaused) return;
  let randomSquare = getRandomSquare();
  randomSquare.classList.add("enemy");
  values.hitPosition = randomSquare.id;
};

const moveEnemy = () => {
  clearInterval(values.timerId);
  values.timerId = setInterval(addEnemy, values.velocityLevels[values.selectedLevel]);
};

const hitEnemy = () => {
  values.hits += 1;
  playSoundtrack("hit.wav");
  removeEnemy();
};

const missEnemy = () => {
  values.misses += 1;
  playSoundtrack("miss.ogg");
  removeEnemy();
};

const hit = (square) => {
  if (values.isPaused) return;
  square.id === values.hitPosition ? hitEnemy() : missEnemy();
  view.hitPoints.textContent = `Acertos: ${values.hits}`;
  view.missPoints.textContent = `Erros: ${values.misses}`;
  values.hitPosition = null;
};

const addListenerHitBox = () => {
  view.squares.forEach(square => square.addEventListener("mousedown", () => hit(square)));
};

const init = () => {
  values.isPaused = false;
  moveEnemy();
  addListenerHitBox();
  countDownGameTime();
};

const toggleLevelOptions = () => {
  view.levelOptions.style.display = view.levelOptions.style.display === "block" ? "none" : "block";
};

const handleLevelSelection = (event) => {
  values.selectedLevel = event.target.dataset.level;
  view.levelOptions.style.display = "none";
  // Atualiza o intervalo de movimentação do inimigo com o novo nível selecionado
  moveEnemy();
};

const pauseGame = () => {
  values.isPaused = true;
  view.pauseBtn.style.display = "none";
  view.resumeBtn.style.display = "inline";
};

const resumeGame = () => {
  values.isPaused = false;
  view.pauseBtn.style.display = "inline";
  view.resumeBtn.style.display = "none";
};

view.startBtn.addEventListener("click", init);
view.restartBtn.addEventListener("click", resetGameResult);
view.levelBtn.addEventListener("click", toggleLevelOptions);
view.levelOptionButtons.forEach(button => button.addEventListener("click", handleLevelSelection));
view.pauseBtn.addEventListener("click", pauseGame);
view.resumeBtn.addEventListener("click", resumeGame);

document.addEventListener("click", (event) => {
  if (!view.levelOptions.contains(event.target) && !view.levelBtn.contains(event.target)) {
    view.levelOptions.style.display = "none";
  }
});
