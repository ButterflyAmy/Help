const input = document.getElementById("nameInput");
const button = document.getElementById("enterBtn");
const response = document.getElementById("response");
const intro = document.getElementById("intro");
const world = document.getElementById("world");
const welcomeText = document.getElementById("welcomeText");
const message = document.getElementById("message");
const content = document.getElementById("content");

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

const pages = {
  memory: `
    <p class="bar">memory_folder_04</p>
    <p>do you ever miss a place you have never been?</p>
    <p>somewhere blue. somewhere quiet. somewhere where nobody asks you to be normal.</p>
    <p>we saved these fragments because you could not carry them alone.</p>
  `,

  recovery: `
    <p class="bar">TK BRAND // emotional support products</p>
    <p><b>Memory Softener™</b><br>for nights when your brain keeps replaying everything.</p>
    <p><b>Reality Stabilizer™</b><br>for when the room feels fake and your hands do not feel like yours.</p>
    <p><b>Overthinking Suppressant™</b><br>does not erase the pain. just turns the volume down.</p>
  `,

  pool: `
    <p class="bar">poolroom_22</p>
    <p>the water is still. the lights are buzzing.</p>
    <p>nobody will interrupt you here.</p>
    <p>you may float until your thoughts become quiet.</p>
  `,

  observer: `
    <p class="bar">observer_active</p>
    <p>you have been here for a little while.</p>
    <p>that means some part of you still wants to be found.</p>
    <p>thank you for staying.</p>
  `
};

button.addEventListener("click", enterSite);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") enterSite();
});

function enterSite() {
  const name = input.value.trim() || "unknown";

  document.body.classList.add("glitch");

  const reply = random(firstResponses);
  response.textContent = reply;

  setTimeout(() => {
    intro.classList.add("hidden");
    world.classList.remove("hidden");
    document.body.classList.remove("glitch");

    welcomeText.textContent = `hello, ${name}.`;
    message.textContent = random(softMessages);
  }, 2200);
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", e => {
    e.preventDefault();
    const page = card.dataset.page;
    content.innerHTML = pages[page];

    if (Math.random() > 0.5) {
      message.textContent = random(softMessages);
    }
  });
});

setInterval(() => {
  if (!world.classList.contains("hidden")) {
    message.textContent = random(softMessages);
  }
}, 12000);

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
