const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nick")
const messageForm = document.querySelector("#message")

const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener("open", () => {
  console.log("connected to Server")
})

socket.addEventListener("message", (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
})
 
socket.addEventListener("close", () => {
  console.log("Disconnected from server")
})

const makeMessage = (type, payload) => {
  return JSON.stringify({type, payload})
}

const handleSubmit = (type) => (e) => {
  e.preventDefault();
  const form = type === 'nickname' ? nicknameForm : messageForm;
  const input = form.querySelector("input")
  socket.send(makeMessage(type, input.value));
  input.value = ''
}

nicknameForm.addEventListener("submit", handleSubmit('nickname'));
messageForm.addEventListener("submit", handleSubmit('message'))