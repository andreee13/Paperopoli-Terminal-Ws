import { createServer } from "http";
import { parse } from "url";
import ws from "ws";

const { Server, OPEN } = ws;
const server = createServer();
const port = 6000;
const wss = new Server({ noServer: true, clientTracking: true });

server.listen(port, () => {
  console.log("Running WebSocket server on port " + port);
});

server.on("upgrade", function upgrade(request, socket, head) {
  if (parse(request.url, true, true).pathname === "/") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on("connection", (ws) => {
  ws.send(
    JSON.stringify({
      body: "Benvenuto/a in chat!",
      date: new Date(),
      sender: {
        uid: "system",
        displayName: "Sistema",
        email: "support@paperopoliterminal.com",
        creationTime: new Date(2021, 4, 31),
        lastSignInTime: new Date(),
      },
    })
  );
  ws.on("message", (msg) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === OPEN) {
        client.send(msg);
      }
    });
  });
});
