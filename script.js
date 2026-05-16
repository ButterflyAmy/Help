const input = document.getElementById("nameInput");
const button = document.getElementById("enterBtn");
const response = document.getElementById("response");

const intro = document.getElementById("intro");
const world = document.getElementById("world");
const roomPage = document.getElementById("roomPage");

const welcomeText = document.getElementById("welcomeText");
const message = document.getElementById("message");
const cursorGlow = document.getElementById("cursorGlow");

let audioCtx, masterGain, humOsc, rainNoise, rainGain, roomOsc;
let audioStarted = false;
let currentRoom = null;

let parentsTimer = null;
let parentsSeconds = 0;
let safeClicks = 0;

let currentSong = 0;
let currentPic = 0;
let musicAudio = null;

const songs = [
  { title: "song 01", src: "music/song1.mp3" },
  { title: "song 02", src: "music/song2.mp3" },
  { title: "song 03", src: "music/song3.mp3" },
  { title: "song 04", src: "music/song4.mp3" },
  { title: "song 05", src: "music/song5.mp3" },
  { title: "song 06", src: "music/song6.mp3" }
];

const pictures = [
  "images/pic1.jpg",
  "images/pic2.jpg",
  "images/pic3.jpg",
  "images/pic4.jpg",
  "images/pic5.jpg",
  "images/pic6.jpg"
];

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

const gentleMessages = [
  "you are not responsible for the weather inside other people.",
  "you did not cause the storm.",
  "your body learned fear, but it can also learn safety.",
  "you deserved a softer childhood.",
  "you are allowed to protect your peace.",
  "their anger is not your identity.",
  "one day, quiet will feel normal."
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
  study: { title: "the classroom after midnight", text: "this room is still under construction. but even here: you are not lazy. you are tired." },
  worthless: { title: "the blue room under the water", text: "this room is still under construction. but even here: you do not need to earn the right to exist." },
  unreal: { title: "the mall where nothing feels real", text: "this room is still under construction. but even here: you are still real." },
  missing: { title: "the train station of people who left", text: "this room is still under construction. but even here: missing someone means the connection mattered." },
  tired: { title: "the room where nothing is expected", text: "this room is still under construction. but even here: surviving today is enough." }
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
  card.addEventListener("click", () => openRoom(card.dataset.room));
});

function openRoom(roomName) {
  currentRoom = roomName;
  world.classList.add("hidden");
  roomPage.classList.remove("hidden");
  document.body.className = "";
  stopParentsTimer();

  if (roomName === "parents") openParentsRoom();
  else openPlaceholderRoom(roomName);
}

function openParentsRoom() {
  document.body.classList.add("parents-room");
  changeRoomSound(92);
  parentsSeconds = 0;
  safeClicks = 0;

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
      <div id="stayTimer">00:00</div>

      <div class="survival-shelf">
        <p>things that helped me survive the noise:</p>
        <button id="musicPanelBtn">music</button>
        <button id="picturesPanelBtn">pictures</button>
        <button id="diaryPanelBtn">write</button>
        <button id="gentleBtn">gentle message</button>
        <button id="quietBtn">make it quieter</button>
      </div>

      <div id="toolPanel" class="tool-panel hidden"></div>

      <div class="parents-textbox">
        <p class="tiny">room_01 // muffled hallway</p>
        <h1>the house is loud again</h1>
        <p>
          click objects in the room. some things make it louder.
          some things make it safer. use the shelf when you need distraction.
        </p>
      </div>

      <p id="roomMessage">you are in the room now. nothing here can hurt you.</p>

      <div class="breathe-box">
        <p>hold this button when it gets too loud.</p>
        <button id="breatheBtn">hold to breathe</button>
      </div>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", returnToArchive);
  document.getElementById("musicPanelBtn").addEventListener("click", openMusicPanel);
  document.getElementById("picturesPanelBtn").addEventListener("click", openPicturesPanel);
  document.getElementById("diaryPanelBtn").addEventListener("click", openDiaryPanel);
  document.getElementById("gentleBtn").addEventListener("click", showGentleMessage);
  document.getElementById("quietBtn").addEventListener("click", emergencyQuiet);

  document.querySelectorAll(".clickable").forEach(item => {
    item.addEventListener("click", () => handleParentsObject(item.dataset.object));
  });

  const breatheBtn = document.getElementById("breatheBtn");
  breatheBtn.addEventListener("mousedown", startBreathing);
  breatheBtn.addEventListener("mouseup", stopBreathing);
  breatheBtn.addEventListener("mouseleave", stopBreathing);
  breatheBtn.addEventListener("touchstart", startBreathing);
  breatheBtn.addEventListener("touchend", stopBreathing);

  startParentsTimer();
}

function openMusicPanel() {
  const panel = document.getElementById("toolPanel");
  panel.classList.remove("hidden");
  panel.innerHTML = `
    <p class="tiny">music_player.exe</p>
    <h2>why not listen to music so the house gets quieter?</h2>
    <p id="songTitle">${songs[currentSong].title}</p>
    <div class="tool-buttons">
      <button id="prevSong">previous</button>
      <button id="playSong">play / pause</button>
      <button id="nextSong">next</button>
      <button id="closePanel">close</button>
    </div>
  `;

  document.getElementById("prevSong").addEventListener("click", prevSong);
  document.getElementById("playSong").addEventListener("click", toggleSong);
  document.getElementById("nextSong").addEventListener("click", nextSong);
  document.getElementById("closePanel").addEventListener("click", closePanel);
}

function toggleSong() {
  if (!musicAudio) {
    musicAudio = new Audio(songs[currentSong].src);
    musicAudio.volume = 0.75;
  }

  if (musicAudio.paused) {
    musicAudio.play();
    lowerAudio();
  } else {
    musicAudio.pause();
  }
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong();
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong();
}

function loadSong() {
  if (musicAudio) {
    musicAudio.pause();
  }

  musicAudio = new Audio(songs[currentSong].src);
  musicAudio.volume = 0.75;
  musicAudio.play();

  const title = document.getElementById("songTitle");
  if (title) title.textContent = songs[currentSong].title;

  lowerAudio();
}

function openPicturesPanel() {
  const panel = document.getElementById("toolPanel");
  panel.classList.remove("hidden");
  panel.innerHTML = `
    <p class="tiny">escape_gallery.exe</p>
    <h2>look somewhere else for a while.</h2>
    <div class="picture-frame">
      <img id="comfortPic" src="${pictures[currentPic]}" alt="comfort image">
    </div>
    <div class="tool-buttons">
      <button id="prevPic">previous</button>
      <button id="nextPic">next</button>
      <button id="closePanel">close</button>
    </div>
  `;

  document.getElementById("prevPic").addEventListener("click", prevPic);
  document.getElementById("nextPic").addEventListener("click", nextPic);
  document.getElementById("closePanel").addEventListener("click", closePanel);
}

function nextPic() {
  currentPic = (currentPic + 1) % pictures.length;
  document.getElementById("comfortPic").src = pictures[currentPic];
}

function prevPic() {
  currentPic = (currentPic - 1 + pictures.length) % pictures.length;
  document.getElementById("comfortPic").src = pictures[currentPic];
}

function openDiaryPanel() {
  const panel = document.getElementById("toolPanel");
  panel.classList.remove("hidden");
  panel.innerHTML = `
    <p class="tiny">unsent_words.txt</p>
    <h2>write what you cannot say out loud.</h2>
    <textarea id="diaryBox" placeholder="type here. it will disappear when you close this."></textarea>
    <div class="tool-buttons">
      <button id="clearDiary">make it disappear</button>
      <button id="closePanel">close</button>
    </div>
  `;

  document.getElementById("clearDiary").addEventListener("click", () => {
    document.getElementById("diaryBox").value = "";
    document.getElementById("roomMessage").textContent = "gone. you do not have to carry every sentence.";
  });

  document.getElementById("closePanel").addEventListener("click", closePanel);
}

function closePanel() {
  document.getElementById("toolPanel").classList.add("hidden");
  document.getElementById("toolPanel").innerHTML = "";
}

function showGentleMessage() {
  document.getElementById("roomMessage").textContent = random(gentleMessages);
  softBell();
}

function emergencyQuiet() {
  const scene = document.getElementById("parentsScene");
  scene.classList.add("safe-mode", "calm-one");
  lowerAudio();
  document.getElementById("roomMessage").textContent = "okay. we are making it quieter. unclench your jaw. breathe slowly. you are here, not there.";
}

function handleParentsObject(object) {
  const roomMessage = document.getElementById("roomMessage");
  const scene = document.getElementById("parentsScene");

  roomMessage.textContent = parentsMessages[object];

  if (object === "door") {
    playYellingSound();
    shakeRoom();
  }

  if (object === "child") {
    playCryingSound();
    safeClicks++;
    scene.classList.add("safe-mode");
    lowerAudio();
  }

  if (object === "window") {
    playLoudRain();
    scene.classList.add("rain-loud");
    setTimeout(() => scene.classList.remove("rain-loud"), 4500);
  }

  if (object === "tv") playStaticSound();

  if (object === "blanket" || object === "lamp" || object === "teddy") {
    safeClicks++;
    scene.classList.add("safe-mode");
    lowerAudio();
  }

  if (safeClicks >= 3) {
    scene.classList.add("calm-one");
    roomMessage.textContent = "the room notices what you keep choosing. softer things. safer things.";
  }

  if (safeClicks >= 5) {
    scene.classList.add("calm-two");
    roomMessage.textContent = "you are changing the room. the loud parts are still there, but they are not in control anymore.";
    masterGain.gain.setTargetAtTime(0.035, audioCtx.currentTime, 1);
  }
}

function startParentsTimer() {
  parentsTimer = setInterval(() => {
    if (currentRoom !== "parents") return;

    parentsSeconds++;
    updateStayTimer();

    const scene = document.getElementById("parentsScene");
    const roomMessage = document.getElementById("roomMessage");
    if (!scene || !roomMessage) return;

    if (parentsSeconds === 45) {
      scene.classList.add("calm-one");
      roomMessage.textContent = "you stayed. the room expected you to run, but you stayed.";
      softBell();
    }

    if (parentsSeconds === 90) {
      scene.classList.add("calm-two");
      roomMessage.textContent = "it is getting quieter now. not because it never happened, but because this room belongs to you.";
      masterGain.gain.setTargetAtTime(0.035, audioCtx.currentTime, 1);
      softBell();
    }

    if (parentsSeconds === 150) {
      roomMessage.textContent = "the child version of you can rest here. you do not have to keep standing at the door.";
      playSoftMelody();
    }

    if (parentsSeconds === 240) {
      scene.classList.add("sunrise");
      roomMessage.textContent = "you survived the night.";
      masterGain.gain.setTargetAtTime(0.025, audioCtx.currentTime, 2);
      playSunriseSound();
    }
  }, 1000);
}

function updateStayTimer() {
  const timer = document.getElementById("stayTimer");
  if (!timer) return;
  const mins = String(Math.floor(parentsSeconds / 60)).padStart(2, "0");
  const secs = String(parentsSeconds % 60).padStart(2, "0");
  timer.textContent = `${mins}:${secs}`;
}

function stopParentsTimer() {
  if (parentsTimer) clearInterval(parentsTimer);
  parentsTimer = null;
}

function startBreathing() {
  const scene = document.getElementById("parentsScene");
  const roomMessage = document.getElementById("roomMessage");

  scene.classList.add("safe-mode");
  document.body.classList.add("breathing");
  roomMessage.textContent = "breathe in. hold. breathe out. the room is not bigger than you.";
  safeClicks++;
  lowerAudio();
  playBreathTone();
}

function stopBreathing() {
  document.body.classList.remove("breathing");
}

function shakeRoom() {
  roomPage.classList.add("glitch");
  setTimeout(() => roomPage.classList.remove("glitch"), 450);
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
  stopParentsTimer();

  if (musicAudio) {
    musicAudio.pause();
    musicAudio = null;
  }

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

  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  rainNoise = audioCtx.createBufferSource();
  rainNoise.buffer = buffer;
  rainNoise.loop = true;

  rainGain = audioCtx.createGain();
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

function playYellingSound() {
  if (!audioStarted) startBaseAudio();
  const now = audioCtx.currentTime;

  for (let i = 0; i < 3; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180 + Math.random() * 120, now + i * 0.16);
    osc.frequency.exponentialRampToValueAtTime(90 + Math.random() * 80, now + i * 0.16 + 0.35);

    gain.gain.setValueAtTime(0.0001, now + i * 0.16);
    gain.gain.exponentialRampToValueAtTime(0.09, now + i * 0.16 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.16 + 0.38);

    filter.type = "lowpass";
    filter.frequency.value = 520;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(now + i * 0.16);
    osc.stop(now + i * 0.16 + 0.42);
  }
}

function playCryingSound() {
  if (!audioStarted) startBaseAudio();
  const now = audioCtx.currentTime;

  for (let i = 0; i < 4; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(420 + Math.random() * 80, now + i * 0.28);
    osc.frequency.exponentialRampToValueAtTime(250 + Math.random() * 40, now + i * 0.28 + 0.22);

    gain.gain.setValueAtTime(0.0001, now + i * 0.28);
    gain.gain.exponentialRampToValueAtTime(0.045, now + i * 0.28 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.28 + 0.32);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now + i * 0.28);
    osc.stop(now + i * 0.28 + 0.36);
  }
}

function playLoudRain() {
  if (!rainGain || !audioCtx) return;
  rainGain.gain.setTargetAtTime(0.085, audioCtx.currentTime, 0.15);

  setTimeout(() => {
    if (rainGain && audioCtx) rainGain.gain.setTargetAtTime(0.018, audioCtx.currentTime, 1.2);
  }, 4200);
}

function playStaticSound() {
  if (!audioStarted) startBaseAudio();

  const bufferSize = audioCtx.sampleRate * 0.6;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  source.buffer = buffer;
  gain.gain.value = 0.04;
  filter.type = "highpass";
  filter.frequency.value = 600;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start();
}

function playBreathTone() {
  if (!audioStarted) startBaseAudio();

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = 220;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.035, now + 0.6);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 3.8);
}

function softBell() {
  if (!audioStarted) startBaseAudio();

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = 660;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.04, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 1.5);
}

function playSoftMelody() {
  [392, 440, 523, 440, 392].forEach((freq, i) => {
    setTimeout(() => {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.9);
    }, i * 550);
  });
}

function playSunriseSound() {
  [261, 329, 392, 523, 659].forEach((freq, i) => {
    setTimeout(() => {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 1.3);
    }, i * 420);
  });
}

setInterval(() => {
  if (!world.classList.contains("hidden")) {
    message.textContent = random(softMessages);
  }
}, 14000);

setInterval(() => {
  if (currentRoom === "parents") {
    const roomMessage = document.getElementById("roomMessage");

    if (roomMessage && Math.random() > 0.65 && parentsSeconds < 230) {
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
