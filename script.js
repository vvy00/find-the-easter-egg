const timeDisplay = document.getElementById("time");
const levelDisplay = document.getElementById("level");
const flashlight = document.getElementById("flashlight");
const winScreen = document.getElementById("winScreen");
const title = document.getElementById("title");

let startTime = Date.now();
let level = 1;
let realEgg = null;
let gameOver = false;

setInterval(() => {
  let t = ((Date.now() - startTime) / 1000).toFixed(1);
  timeDisplay.textContent = t;
}, 100);

const levelObjects = {
  1: ["🪑", "🪵"],
  2: ["🪑", "🪵", "🌳", "🐇"],
  3: ["🪑", "🪵", "🌳", "🐇", "🦗", "🛝", "🌳", "🪑"]
};

const topMargin = 120;
const bottomMargin = 50;
const leftMargin = 20;
const rightMargin = 20;
const objectSize = 100;

function loadLevel() {
  document.querySelectorAll(".object").forEach(o => o.remove());

  let objects = levelObjects[level];
  if(level === 3){
    document.body.style.backgroundColor = "#000";
    document.body.style.backgroundImage = "none";
    flashlight.style.display = "block";
    title.style.color = "#fff";
    title.style.textShadow = `
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px #ffb3c6
    `;
  } else {
    document.body.style.backgroundColor = "#fdf6e3";
    document.body.style.backgroundImage = `radial-gradient(#ffd6e0 10%, transparent 11%),
                                          radial-gradient(#bae1ff 10%, transparent 11%),
                                          radial-gradient(#caffbf 10%, transparent 11%)`;
    document.body.style.backgroundSize = "60px 60px";
    flashlight.style.display = "none";

    title.style.color = "#333";
    title.style.textShadow = `
        0 0 5px #fff,
        0 0 10px #ffb3c6,
        0 0 20px #bde0fe
    `;
  }

  objects.forEach(item => {
    let obj = document.createElement("div");
    obj.className = "object";
    obj.textContent = item;

    obj.style.top = Math.random() * (window.innerHeight - topMargin - bottomMargin - objectSize) + topMargin + "px";
    obj.style.left = Math.random() * (window.innerWidth - leftMargin - rightMargin - objectSize) + leftMargin + "px";
    document.body.appendChild(obj);

    if (item === "🐇") {
      setInterval(() => {
        obj.style.top = Math.random() * (window.innerHeight - topMargin - bottomMargin - objectSize) + topMargin + "px";
        obj.style.left = Math.random() * (window.innerWidth - leftMargin - rightMargin - objectSize) + leftMargin + "px";
      }, 1500);
    }
  });

  placeEgg();
}

function placeEgg() {
  const objects = document.querySelectorAll(".object");
  let randomObj = objects[Math.floor(Math.random() * objects.length)];

  let egg = document.createElement("img");
  egg.className = "hiddenEgg";
  egg.src = "images/easter-egg.png";
  egg.style.width = "40px";
  egg.style.height = "40px";
  egg.style.position = "absolute";
  egg.style.top = "50%";
  egg.style.left = "50%";
  egg.style.transform = "translate(-50%, -50%)";
  egg.style.opacity = "0";        
  egg.style.pointerEvents = "none";
  egg.style.transition = "opacity 0.2s";
  egg.style.zIndex = "600";

  randomObj.appendChild(egg);
  realEgg = egg;
  realEgg.onclick = nextLevel;

  randomObj.addEventListener("mouseenter", () => {
    egg.style.opacity = "1";
    egg.style.pointerEvents = "auto";
  });

  randomObj.addEventListener("mouseleave", () => {
    egg.style.opacity = "0";
    egg.style.pointerEvents = "none";
  });
}

function nextLevel() {
  if(gameOver) return;

  let time = ((Date.now() - startTime) / 1000).toFixed(2);
  alert("🎉 Level " + level + " complete in " + time + " seconds!");

  level++;

  if(level > 3){
    winScreen.style.display = "flex";
    gameOver = true;
    flashlight.style.display = "none";
    return;
  }

  levelDisplay.textContent = level;
  startTime = Date.now();
  loadLevel();
}

document.addEventListener("mousemove", (e) => {
  if(level === 3 && !gameOver){
    flashlight.style.background = `radial-gradient(circle 120px at ${e.clientX}px ${e.clientY}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)`;
  }
});

function restartGame() {
  gameOver = false;
  level = 1;
  levelDisplay.textContent = level;
  winScreen.style.display = "none";
  startTime = Date.now();
  loadLevel();
}

loadLevel();