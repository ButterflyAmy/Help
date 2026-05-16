const input = document.getElementById("nameInput");
const button = document.getElementById("enterBtn");
const response = document.getElementById("response");
const intro = document.getElementById("intro");
const world = document.getElementById("world");
const welcomeText = document.getElementById("welcomeText");
const message = document.getElementById("message");
const room = document.getElementById("room");
const soundBtn = document.getElementById("soundBtn");
const homeBtn = document.getElementById("homeBtn");
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
    title: "the house is loud again",
    text: `
      <p class="bar">room_01 // muffled hallway</p>
      <h2 class="room-title">the house is loud again</h2>
      <p class="soft">you should not have had to become older just to survive the noise.</p>
      <p>when adults break the peace, children learn to listen for footsteps, doors, voices, silence.</p>
      <p>none of it was your fault. not the yelling. not the tension. not the way your body still reacts.</p>
      <p class="whisper">you are allowed to want a quiet home.</p>
      <button class="memory-button" onclick="revealMemory('parents')">open hidden message</button>
    `
  },

  study: {
    className: "study-room",
    freq: 130,
    title: "the classroom after midnight",
    text: `
      <p class="bar">room_02 // abandoned classroom</p>
      <h2 class="room-title">the classroom after midnight</h2>
      <p class="soft">you are not lazy. you are tired from carrying invisible weight.</p>
      <p>sometimes studying feels impossible because your mind is already fighting a war nobody can see.</p>
      <p>your grades are not your soul. your productivity is not your worth.</p>
      <p class="whisper">one small step is still movement.</p>
      <button class="memory-button" onclick="revealMemory('study')">open hidden message</button>
    `
  },

  worthless: {
    className: "worthless-room",
    freq: 70,
    title: "the blue room under the water",
    text: `
      <p class="bar">room_03 // underwater signal</p>
      <h2 class="room-title">the blue room under the water</h2>
      <p class="soft">you are not difficult to love.</p>
      <p>you may feel like a burden, but feelings are not always telling the truth.</p>
      <p>someone taught you to question your value. that does not mean they were right.</p>
      <p class="whisper">you deserved gentleness too.</p>
      <button class="memory-button" onclick="revealMemory('worthless')">open hidden message</button>
    `
  },

  unreal: {
    className: "unreal-room",
    freq: 160,
    title: "the mall where nothing feels real",
    text: `
      <p class="bar">room_04 // reality unstable</p>
      <h2 class="room-title">the mall where nothing feels real</h2>
      <p class="soft">you are still here.</p>
      <p>when the world feels fake, it can be your mind trying to protect you from too much at once.</p>
      <p>look around. name five things. touch something cold. breathe slowly.</p>
      <p class="whisper">you did not disappear. you only became distant for a while.</p>
      <button class="memory-button" onclick="revealMemory('unreal')">open hidden message</button>
    `
  },

  missing: {
    className: "missing-room",
    freq: 110,
    title: "the train station of people who left",
    text: `
      <p class="bar">room_05 // last train missed</p>
      <h2 class="room-title">the train station of people who left</h2>
      <p class="soft">missing someone means the connection mattered.</p>
      <p>some people leave, but the version of you that loved them still remains somewhere.</p>
      <p>you are not weak for remembering.</p>
      <p class="whisper">grief is love with nowhere to sit.</p>
      <button class="memory-button" onclick="revealMemory('missing')">open hidden message</button>
    `
  },

  tired: {
    className: "tired-room",
    freq: 55,
    title: "the room where nothing is expected",
    text: `
      <p class="bar">room_06 // low battery</p>
      <h2 class="room-title">the room where nothing is expected</h2>
      <p class="soft">you can stop performing here.</p>
      <p>you do not have to be impressive. you do not have to explain why you are exhausted.</p>
      <p>some days, surviving is the whole task.</p>
      <p class="whisper">rest is not failure.</p>
      <button class="memory-button" onclick="revealMemory('tired')">open hidden message</button>
    `
  }
};

const hiddenMessages = {
  parents: [
    "you were a child. it was never your job to keep the house from breaking.",
    "your nervous system remembers. be patient with it.",
    "one day, peace will not feel suspicious anymore."
  ],
  study: [
    "start with five minutes. not because five minutes fixes everything, but because it proves you can begin.",
    "your brain is not a machine. it needs care before output.",
    "you are allowed to be a person before you are a student."
  ],
  worthless: [
    "you are not a failed version of yourself.",
    "the fact that you are still here means something inside you kept choosing life.",
    "you do not need to earn the right to exist."
  ],
  unreal: [
    "press your feet into the floor. this moment is strange, but it will pass.",
    "you are not crazy. you are overwhelmed.",
    "come back slowly. no rush."
  ],
  missing: [
    "not every goodbye means the love was fake.",
    "you can miss them and still move forward.",
    "some memories hurt because they were beautiful."
  ],
  tired: [
    "you do not have to solve your whole life tonight.",
    "drink water. loosen your jaw. unclench your hands.",
    "you are allowed to exist quietly."
  ]
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

  document.body.className = "";
  document.body.classList.add(rooms[roomName].className);

  room.innerHTML = rooms[roomName].text;
  message.textContent = random(softMessages);

  if (soundOn) {
    startSound(rooms[roomName].freq);
  }
}

function revealMemory(roomName) {
  const memory = random(hiddenMessages[roomName]);

  const p = document.createElement("p");
  p.className = "soft";
  p.textContent = memory;

  room.appendChild(p);
}

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

homeBtn.addEventListener("click", () => {
  currentRoom = null;
  document.body.className = "";

  room.innerHTML = `
    <p class="bar">archive_home</p>
    <p>choose the feeling that found you today.</p>
    <p class="whisper">you can return to any room whenever you need it.</p>
  `;

  message.textContent = "welcome back to the archive.";
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
