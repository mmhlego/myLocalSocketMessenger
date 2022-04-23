import { io } from "socket.io-client";

//========

const socket = io("http://localhost:8000");

socket.on("connect", () => {
	showMessage(`Connected`);
});

socket.on("disconnect", () => {
	showMessage(`Disconnected`);
});

socket.on("receive-message", (message) => {
	showMessage(`${message.sender} : ${message.text}`);
});

socket.on("client-list", (clients) => {
	console.log("Clients:", clients);
});

socket.on("receive-username", (username) => {
	document.getElementById("myUsername").innerHTML = username;

	console.log(username);
});

//========

const input = document.getElementsByTagName("input")[0];
const button = document.getElementById("sendButton");
const messages = document.getElementById("messageBox");

button.addEventListener("click", (e) => {
	if (input.value === "") return;

	socket.emit("send-message", input.value, target.value);

	showMessage(input.value);
	input.value = "";
});

const username = document.getElementById("Username");
const setUsername = document.getElementById("setUsername");

setUsername.addEventListener("click", () => {
	socket.emit("set-username", username.value);
});

const target = document.getElementById("target");

function showMessage(text) {
	console.log(text);
	let element = document.createElement("p");
	element.innerHTML = text;
	messages.appendChild(element);
}
