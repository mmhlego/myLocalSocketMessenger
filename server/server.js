const { instrument } = require("@socket.io/admin-ui");

const io = require("socket.io")(8000, {
	cors: {
		origin: ["http://localhost:8080", "https://admin.socket.io"],
	},
});

let userCount = 0;
io.on("connection", (socket) => {
	//=================

	console.log(socket.id);
	socket.username = `user-${userCount++}`;
	socket.join(socket.username);

	const sockets = Array.from(io.sockets.sockets).map(
		(socket) => socket[1].username
	);
	socket.emit("client-list", sockets);
	socket.broadcast.emit("client-list", sockets);
	socket.join(socket.username);

	socket.emit("receive-username", socket.username);

	//=================

	socket.on("set-username", (username) => {
		socket.username = username;
		const sockets = Array.from(io.sockets.sockets).map(
			(socket) => socket[1].username
		);
		socket.emit("client-list", sockets);
		socket.broadcast.emit("client-list", sockets);
		socket.join(socket.username);

		socket.to(socket.username).emit("receive-username", socket.username);
	});

	socket.on("send-message", (message, target) => {
		if (target === "") {
			socket.broadcast.emit("receive-message", {
				text: message,
				sender: socket.username,
			});
		} else {
			socket.to(target).emit("receive-message", {
				text: message,
				sender: socket.username,
			});
		}

		// socket.to(room).emit("receive-message", message);
		console.log(message);
	});

	// socket.on("join-room", (room) => {
	// 	console.log("joined room " + room);
	// 	socket.join(room);
	// });
});

instrument(io, { auth: false });
