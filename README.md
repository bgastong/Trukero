# Trukero

Truco argentino online con anotador. Monorepo en TypeScript.

```
apps/
  web/          React + Vite (cliente)
  server/       Node + Socket.IO (servidor de juego autoritativo)
packages/
  truco-core/   Reglas del juego, anotador y tipos del protocolo (compartido)
```

## Requisitos

- Node 24
- pnpm 11

## Desarrollo

```bash
pnpm install
pnpm dev        # levanta web (http://localhost:5173) y server (http://localhost:3001)
pnpm test       # tests de truco-core
pnpm typecheck
```

Para probar una partida, abrí dos pestañas: en una creá la sala y en la otra unite con el código.

## Jugar con otra persona

El cliente se conecta al socket por el mismo puerto que la web (proxy de Vite), así que alcanza con exponer el `5173`.

**Misma red (WiFi):**

```bash
pnpm dev:lan
```

Vite muestra una URL `Network: http://192.168.x.x:5173`. El rival entra a esa URL desde su compu o celular. Si no carga, permití Node en el firewall de Windows para redes privadas.

**Por internet (túnel):** con `pnpm dev` corriendo, en otra terminal:

```bash
cloudflared tunnel --url http://localhost:5173
```

Pasale al rival la URL `https://….trycloudflare.com` que imprime. Si usás otro túnel (ngrok, etc.), agregá su dominio en `server.allowedHosts` de `apps/web/vite.config.ts`.

## Principios

- **El servidor es la fuente de verdad.** Tiene el mazo y valida cada jugada; cada cliente recibe solo sus propias cartas (`PlayerView`).
- **Las reglas viven en `@trukero/core`** como funciones puras y testeadas, y las usan tanto el server como el cliente.
