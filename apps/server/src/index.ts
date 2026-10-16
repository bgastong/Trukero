import { createServer } from 'node:http';
import { parseArgs } from 'node:util';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '@trukero/core';
import { createRoom, joinRoom, leaveRooms, viewFor, type Room } from './rooms.js';

// En desarrollo el script pasa --port explícito: así no lo pisa un PORT ajeno (p. ej. el de Vite).
// En producción el hosting define PORT.
const { values: args } = parseArgs({ options: { port: { type: 'string' } }, strict: false });
const PORT = Number(args.port ?? process.env.PORT ?? 3001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'text/plain' }).end('ok');
    return;
  }
  res.writeHead(404).end();
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: CLIENT_ORIGIN },
});

/** Cada jugador recibe su propia vista, así nunca viajan las cartas del rival. */
function broadcast(room: Room): void {
  room.players.forEach((player, seat) => {
    io.to(player.socketId).emit('game:state', viewFor(room, seat as 0 | 1));
  });
}

io.on('connection', (socket) => {
  socket.on('room:create', (name, ack) => {
    const room = createRoom(socket.id, name);
    ack(room.id);
    broadcast(room);
  });

  socket.on('room:join', (roomId, name, ack) => {
    const result = joinRoom(roomId, socket.id, name);
    if (typeof result === 'string') {
      ack(result);
      return;
    }
    ack(null);
    broadcast(result);
  });

  socket.on('disconnect', () => {
    const room = leaveRooms(socket.id);
    if (room) broadcast(room);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor de Trukero escuchando en http://localhost:${PORT}`);
});
