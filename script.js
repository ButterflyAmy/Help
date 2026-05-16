const input = document.getElementById("nameInput");
const button = document.getElementById("enterBtn");
const response = document.getElementById("response");

const intro = document.getElementById("intro");
const world = document.getElementById("world");
const roomPage = document.getElementById("roomPage");

const welcomeText = document.getElementById("welcomeText");
const message = document.getElementById("message");

const soundBtn = document.getElementById("soundBtn");
const backBtn = document.getElementById("backBtn");
const hiddenBtn = document.getElementById("hiddenBtn");

const roomCode = document.getElementById("roomCode");
const roomTitle = document.getElementById("roomTitle");
const roomMainText = document.getElementById("roomMainText");
const hiddenText = document.getElementById("hiddenText");

const cursorGlow = document.getElementById("cursorGlow");

let currentRoom = null;
let audioCtx = null;
let oscillator = null;
let gainNode = null;
let soundOn = false;

const firstResponses = [
  "you look tired.",
  "we knew you would come here eventually.",
  "you do not have to explain.",
  "connection accepted.",
  "you are not broken. just overloaded.",
  "welcome back, even if this is your first time.",
  "someone understands. stay a while."
];

const softMessages = [
  "you survived things nobody saw.",
  "the noise in your head is not your fault.",
  "you are still real.",
  "you can rest here.",
  "some feelings do not fit into normal words.",
  "this place was made for people who feel too much.",
  "you are not too sensitive. the world is too loud."
];

const rooms = {
  parents: {
    className: "parents-room",
    freq: 95,
    code: "room_01 // muffled hallway",
    title: "the house is loud again",
    main: "you should not have had to become older just to survive the noise. none of it was your fault. not the yelling. not the silence after. not the way your body still remembers.",
    hidden: [
      "you were a child. it was never your job to keep the house from breaking.",
      "your nervous system remembers. be patient with it.",
      "one day, peace will not feel suspicious anymore."
    ]
  },

  study: {
    className: "study-room",
    freq: 130,
    code: "room_02 // abandoned classroom",
    title: "the classroom after midnight",
    main: "you are not lazy. you are tired from carrying invisible weight. your grades are not your soul. your productivity is not your worth.",
    hidden: [
      "start with five minutes. not because five minutes fixes everything, but because it proves you can begin.",
      "your brain is not a machine. it needs care before output.",
      "you are allowed to be a person before you are a student."
    ]
  },

  worthless: {
    className: "worthless-room",
    freq: 70,
    code: "room_03 // underwater signal",
    title: "the blue room under the water",
    main: "you are not difficult to love. you may feel like a burden, but feelings are not always telling the truth. you do not need to earn the right to exist.",
    hidden: [
      "you are not a failed version of yourself.",
      "the fact that you are still here means something inside you kept choosing life.",
      "someone taught you to question your value. that does not mean they were right."
    ]
  },

  unreal: {
    className: "unreal-room",
    freq: 160,
    code: "room_04 // reality unstable",
    title: "the mall where nothing feels real",
    main: "you are still here. when the world feels fake, it can be your mind trying to protect you from too much at once. come back slowly. no rush.",
    hidden: [
      "press your feet into the floor. this moment is strange, but it will pass.",
      "you are not crazy. you are overwhelmed.",
      "name five things around you. this place will wait."
    ]
  },

  missing: {
    className: "missing-room",
    freq: 110,
    code: "room_05 // last train missed",
    title: "the train station of people who left",
    main: "missing someone means the connection mattered. you are not weak for remembering. some memories hurt because they were beautiful.",
    hidden: [
      "not every goodbye means the love was fake.",
      "you can miss them and still move forward.",
      "some people leave fingerprints on your soul."
    ]
  },

  tired: {
    className: "tired-room",
    freq: 55,
    code: "room_06 // low battery",
    title: "the room where nothing is expected",
    main: "you can stop performing here. you do not have to be impressive. you do not have to explain why you are exhausted. some days, surviving is the whole task.",
    hidden: [
      "you do not have to solve your whole life tonight.",
      "drink water. loosen your jaw. unclench your hands.",
      "you are allowed to exist quietly."
    ]
  }
};

button.addEventListener("click", enterSite);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") enterSite();
});

function enterSite() {
  const name = input.value.trim() || "unknown";

  document.body.classList.add("glitch");
  response.textContent = random(firstResponses);

  setTimeout(() => {
    intro.classList.add("hidden");
    world.classList.remove("hidden");
    document.body.classList.remove("glitch");

    welcomeText.textContent = `hello, ${name}.`;
    message.textContent = random(softMessages);
  }, 2200);
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    openRoom(card.dataset.room);
  });
});

function openRoom(roomName) {
  currentRoom = roomName;
  const selected = rooms[roomName];

  world.classList.add("hidden");
  roomPage.classList.remove("hidden");

  document.body.className = "";
  document.body.classList.add(selected.className);

  roomCode.textContent = selected.code;
  roomTitle.textContent = selected.title;
  roomMainText.textContent = selected.main;
  hiddenText.textContent = "";

  if (soundOn) {
    startSound(selected.freq);
  }
}

backBtn.addEventListener("click", () => {
  roomPage.classList.add("hidden");
  world.classList.remove("hidden");

  document.body.className = "";
  currentRoom = null;

  message.textContent = "welcome back to the archive.";
});

hiddenBtn.addEventListener("click", () => {
  if (!currentRoom) return;
  hiddenText.textContent = random(rooms[currentRoom].hidden);
});

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;

  if (soundOn) {
    soundBtn.textContent = "turn sound off";
    const freq = currentRoom ? rooms[currentRoom].freq : 90;
    startSound(freq);
  } else {
    soundBtn.textContent = "turn sound on";
    stopSound();
  }
});

function startSound(freq) {
  stopSound();

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = freq;
  gainNode.gain.value = 0.035;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
}

function stopSound() {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
  }

  oscillator = null;
  gainNode = null;
}

setInterval(() => {
  if (!world.classList.contains("hidden")) {
    message.textContent = random(softMessages);
  }
}, 14000);

document.addEventListener("mousemove", e => {
  cursorGlow.style.left = `${e.clientX - 110}px`;
  cursorGlow.style.top = `${e.clientY - 110}px`;
});

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
