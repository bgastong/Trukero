import { randomBytes } from 'node:crypto';
import { createDeck, shuffle, type Card, type PlayerView } from '@trukero/core';

interface Player {
  socketId: string;
  name: string;
  connected: boolean;
  hand: Card[];
}

export interface Room {
  id: string;
  players: Player[];
  status: PlayerView['status'];
}

const rooms = new Map<string, Room>();

export function createRoom(socketId: string, name: string): Room {
  let id: string;
  do {
    id = randomBytes(3).toString('hex').toUpperCase();
  } while (rooms.has(id));

  const room: Room = { id, players: [{ socketId, name, connected: true, hand: [] }], status: 'esperando' };
  rooms.set(id, room);
  return room;
}

export function joinRoom(roomId: string, socketId: string, name: string): Room | string {
  const room = rooms.get(roomId.toUpperCase());
  if (!room) return 'La sala no existe';
  if (room.players.length >= 2) return 'La sala está llena';

  room.players.push({ socketId, name, connected: true, hand: [] });
  dealHand(room);
  return room;
}

function dealHand(room: Room): void {
  const deck = shuffle(createDeck());
  room.players.forEach((player, i) => {
    player.hand = deck.slice(i * 3, i * 3 + 3);
  });
  room.status = 'jugando';
}

/** Marca al jugador como desconectado y devuelve la sala afectada, si había una. */
export function leaveRooms(socketId: string): Room | undefined {
  for (const room of rooms.values()) {
    const player = room.players.find((p) => p.socketId === socketId);
    if (!player) continue;
    player.connected = false;
    if (room.players.every((p) => !p.connected)) rooms.delete(room.id);
    return room;
  }
  return undefined;
}

/** Arma la vista de un asiento: solo incluye la mano de ese jugador. */
export function viewFor(room: Room, seat: 0 | 1): PlayerView {
  return {
    roomId: room.id,
    seat,
    hand: room.players[seat]?.hand ?? [],
    players: room.players.map(({ name, connected }) => ({ name, connected })),
    status: room.status,
  };
}
