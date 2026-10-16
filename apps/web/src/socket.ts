import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@trukero/core';

/** Sin VITE_SERVER_URL se conecta al mismo origen y en desarrollo pasa por el proxy de Vite. */
const SERVER_URL: string | undefined = import.meta.env.VITE_SERVER_URL;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = SERVER_URL ? io(SERVER_URL) : io();
