import { useEffect, useState, type FormEvent } from 'react';
import { envidoPoints, type Card, type PlayerView } from '@trukero/core';
import { socket } from './socket.js';

export function App() {
  const [view, setView] = useState<PlayerView | null>(null);
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socket.on('game:state', setView);
    return () => {
      socket.off('game:state', setView);
    };
  }, []);

  function create() {
    setError(null);
    socket.emit('room:create', name || 'Jugador', () => {});
  }

  function join(event: FormEvent) {
    event.preventDefault();
    setError(null);
    socket.emit('room:join', roomCode, name || 'Jugador', setError);
  }

  if (!view) {
    return (
      <main className="lobby">
        <h1>Trukero</h1>
        <input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={create}>Crear sala</button>
        <form onSubmit={join}>
          <input
            placeholder="Código de sala"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
          <button type="submit" disabled={!roomCode}>
            Unirse
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </main>
    );
  }

  return (
    <main className="table">
      <header>
        <span>
          Sala <strong>{view.roomId}</strong>
        </span>
        <span>
          {view.players.map((p) => `${p.name}${p.connected ? '' : ' (desconectado)'}`).join(' vs ')}
        </span>
      </header>

      {view.status === 'esperando' ? (
        <p>Esperando rival… Pasale el código {view.roomId}</p>
      ) : (
        <>
          <div className="hand">
            {view.hand.map((card) => (
              <CardView key={`${card.number}-${card.suit}`} card={card} />
            ))}
          </div>
          <p>Tenés {envidoPoints(view.hand)} de envido</p>
        </>
      )}
    </main>
  );
}

function CardView({ card }: { card: Card }) {
  return (
    <div className={`card card-${card.suit}`}>
      <span className="card-number">{card.number}</span>
      <span className="card-suit">{card.suit}</span>
    </div>
  );
}
