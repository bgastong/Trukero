import type { Card } from './cards.js';

/** Vista de la partida que recibe cada jugador: nunca incluye las cartas del rival. */
export interface PlayerView {
  roomId: string;
  seat: 0 | 1;
  hand: Card[];
  players: { name: string; connected: boolean }[];
  status: 'esperando' | 'jugando';
}

export interface ClientToServerEvents {
  'room:create': (name: string, ack: (roomId: string) => void) => void;
  'room:join': (roomId: string, name: string, ack: (error: string | null) => void) => void;
}

export interface ServerToClientEvents {
  'game:state': (view: PlayerView) => void;
}
