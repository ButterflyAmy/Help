const input = document.getElementById("nameInput");
const button = document.getElementById("enterBtn");
const response = document.getElementById("response");

const intro = document.getElementById("intro");
const world = document.getElementById("world");
const roomPage = document.getElementById("roomPage");

const welcomeText = document.getElementById("welcomeText");
const message = document.getElementById("message");
const cursorGlow = document.getElementById("cursorGlow");

let audioCtx;
let masterGain;
let humOsc;
let rainNoise;
let roomOsc;
let audioStarted = false;
let currentRoom = null;

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

const parentsMessages = {
  bed: "you learned to stay very quiet. not because you were weak, but because quiet felt safer.",
  tv: "sometimes noise is used to cover other noise. the screen glowed blue while your stomach stayed tight.",
  photo: "you kept trying to find the version of them that smiled.",
  door: "you always listened for the tone. the footsteps. the silence after. your body was trying to protect you.",
  blanket: "the blanket cannot fix everything, but for a moment, the world becomes smaller. softer. survivable.",
  lamp: "a little light is still light. you deserved warmth in that room. the yelling feels farther away.",
  window: "outside, the rain keeps falling like it understands without asking questions.",
  child: "the child version of you did not need to be stronger. they needed to be held.",
  teddy: "even small things can become witnesses. even a toy can feel like company when the house is too loud.",
  clock: "time moved differently on nights like this. every minute felt like waiting for the next sound."
};

const otherRooms = {
  study: {
    title: "the classroom after midnight",
    text: "this room is still under construction. but even here: you are not lazy. you are tired."
  },
  worthless: {
    title: "the blue room under the water",
    text: "this room is still under construction. but even here: you do not need to earn the right to exist."
  },
  unreal: {
    title: "the mall where nothing feels real",
    text: "this room is still under construction. but even here: you are still real."
  },
  missing: {
    title: "the train station of people who left",
    text: "this room is still under construction. but even here: missing someone means the connection mattered."
  },
  tired: {
    title: "the room where nothing is expected",
    text: "this room is still under construction. but even here: surviving today is enough."
  }
};

input.addEventListener("focus", startBaseAudio);
input.addEventListener("click", startBaseAudio);
button.addEventListener("click", enterSite);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") enterSite();
});

function enterSite() {
  startBaseAudio();

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

  world.classList.add("hidden");
  roomPage.classList.remove("hidden");
  document.body.className = "";

  if (roomName === "parents") {
    openParentsRoom();
  } else {
    openPlaceholderRoom(roomName);
  }
}

function openParentsRoom() {
  document.body.classList.add("parents-room");
  changeRoomSound(92);

  roomPage.innerHTML = `
    <div class="parents-scene" id="parentsScene">
      <div class="rain"></div>
      <div class="wall-shadow"></div>
      <div class="moon"></div>
      <div class="drawn-window clickable" data-object="window"></div>

      <div class="door-light"></div>
      <div class="door clickable" data-object="door"></div>
      <div class="parent-shadow parent-one"></div>
      <div class="parent-shadow parent-two"></div>

      <div class="photo clickable" data-object="photo"></div>
      <div class="clock clickable" data-object="clock">2:43</div>

      <div class="bed clickable" data-object="bed"></div>
      <div class="blanket clickable" data-object="blanket"></div>
      <div class="teddy clickable" data-object="teddy"></div>
      <div class="lamp clickable" data-object="lamp"></div>
      <div class="tv clickable" data-object="tv"></div>
      <div class="child clickable" data-object="child"></div>

      <div class="room-floor"></div>
    </div>

    <div class="room-ui">
      <button class="back" id="backBtn">← return to archive</button>

      <div class="parents-textbox">
        <p class="tiny">room_01 // muffled hallway</p>
        <h1>the house is loud again</h1>
        <p>
          click objects in the room. the bed, the tv, the door, the blanket,
          the lamp, the window, the child, the teddy, the clock.
        </p>
      </div>

      <p id="roomMessage">
        you are in the room now. nothing here can hurt you.
      </p>

      <div class="breathe-box">
        <p>hold this button when it gets too loud.</p>
        <button id="breatheBtn">hold to breathe</button>
      </div>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", returnToArchive);

  document.querySelectorAll(".clickable").forEach(item => {
    item.addEventListener("click", () => {
      handleParentsObject(item.dataset.object);
    });
  });

  const breatheBtn = document.getElementById("breatheBtn");
  breatheBtn.addEventListener("mousedown", startBreathing);
  breatheBtn.addEventListener("mouseup", stopBreathing);
  breatheBtn.addEventListener("mouseleave", stopBreathing);
  breatheBtn.addEventListener("touchstart", startBreathing);
  breatheBtn.addEventListener("touchend", stopBreathing);
}

function handleParentsObject(object) {
  const roomMessage = document.getElementById("roomMessage");
  const scene = document.getElementById("parentsScene");

  roomMessage.textContent = parentsMessages[object];

  if (object === "blanket" || object === "lamp" || object === "child" || object === "teddy") {
    scene.classList.add("safe-mode");
    lowerAudio();
  }

  if (object === "door") {
    shakeRoom();
  }
}

function startBreathing() {
  const scene = document.getElementById("parentsScene");
  const roomMessage = document.getElementById("roomMessage");

  scene.classList.add("safe-mode");
  document.body.classList.add("breathing");
  roomMessage.textContent = "breathe in. hold. breathe out. the room is not bigger than you.";
  lowerAudio();
}

function stopBreathing() {
  document.body.classList.remove("breathing");
}

function shakeRoom() {
  roomPage.classList.add("glitch");
  setTimeout(() => roomPage.classList.remove("glitch"), 350);
}

function openPlaceholderRoom(roomName) {
  const room = otherRooms[roomName];

  roomPage.innerHTML = `
    <div class="room-placeholder">
      <button id="backBtn">← return to archive</button>
      <h1>${room.title}</h1>
      <p>${room.text}</p>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", returnToArchive);
}

function returnToArchive() {
  roomPage.classList.add("hidden");
  world.classList.remove("hidden");
  roomPage.innerHTML = "";
  document.body.className = "";
  currentRoom = null;
  message.textContent = "welcome back to the archive.";
  changeRoomSound(70);
}

function startBaseAudio() {
  if (audioStarted) return;

  audioStarted = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.05;
  masterGain.connect(audioCtx.destination);

  humOsc = audioCtx.createOscillator();
  humOsc.type = "sine";
  humOsc.frequency.value = 70;

  const humGain = audioCtx.createGain();
  humGain.gain.value = 0.45;

  humOsc.connect(humGain);
  humGain.connect(masterGain);
  humOsc.start();

  createRainNoise();
}

function createRainNoise() {
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  rainNoise = audioCtx.createBufferSource();
  rainNoise.buffer = buffer;
  rainNoise.loop = true;

  const rainGain = audioCtx.createGain();
  rainGain.gain.value = 0.018;

  rainNoise.connect(rainGain);
  rainGain.connect(masterGain);
  rainNoise.start();
}

function changeRoomSound(freq) {
  if (!audioStarted) startBaseAudio();

  if (roomOsc) {
    roomOsc.stop();
    roomOsc.disconnect();
  }

  roomOsc = audioCtx.createOscillator();
  roomOsc.type = "sine";
  roomOsc.frequency.value = freq;

  const roomGain = audioCtx.createGain();
  roomGain.gain.value = 0.025;

  roomOsc.connect(roomGain);
  roomGain.connect(masterGain);
  roomOsc.start();

  masterGain.gain.setTargetAtTime(0.065, audioCtx.currentTime, 0.5);
}

function lowerAudio() {
  if (!masterGain || !audioCtx) return;

  masterGain.gain.setTargetAtTime(0.025, audioCtx.currentTime, 0.6);

  setTimeout(() => {
    if (masterGain && audioCtx) {
      masterGain.gain.setTargetAtTime(0.055, audioCtx.currentTime, 1);
    }
  }, 5000);
}

setInterval(() => {
  if (!world.classList.contains("hidden")) {
    message.textContent = random(softMessages);
  }
}, 14000);

setInterval(() => {
  if (currentRoom === "parents") {
    const roomMessage = document.getElementById("roomMessage");

    if (roomMessage && Math.random() > 0.65) {
      const whispers = [
        "the rain is still here.",
        "you can stay in the quiet corner.",
        "you are not responsible for their anger.",
        "the door is only a door. it is not your whole life.",
        "somewhere in the future, it is quiet."
      ];

      roomMessage.textContent = random(whispers);
    }
  }
}, 12000);

document.addEventListener("mousemove", e => {
  cursorGlow.style.left = `${e.clientX - 110}px`;
  cursorGlow.style.top = `${e.clientY - 110}px`;
});

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
