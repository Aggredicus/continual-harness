# Grand River Commons

Grand River Commons is a browser-first turn-based hex-grid deck-building strategy game where players reshape a living watershed using permaculture-inspired systems.

## Core factions

- Commons: regenerative/permaculture player.
- MegaCorp: extractive industrial AI adversary.
- Mother Nature: neutral climate/ecology event system.

## MVP goals

- 15x15 axial hex grid.
- Card-driven map modification.
- Resource economy.
- Ecological aging.
- Climate risks.
- AI-readable JSON state.
- Browser-playable prototype.
- Docker-first reproducible initialization.

## Recommended: run with Docker

From this directory:

```bash
cd grand-river-commons
docker compose up --build
```

Then open:

```text
http://localhost:5173
```

Stop the container with:

```bash
docker compose down
```

## Verify with Docker

Run the unit tests inside Docker:

```bash
cd grand-river-commons
docker compose run --rm grand-river-commons npm test
```

Run the static-server smoke test inside Docker:

```bash
docker compose run --rm -e SMOKE_PORT=5174 grand-river-commons npm run smoke
```

Run both checks together:

```bash
docker compose run --rm -e SMOKE_PORT=5174 grand-river-commons npm run verify
```

Or use Make:

```bash
make docker-test
make docker-smoke
make docker-verify
```

## Local development without Docker

This project currently has no external npm runtime dependencies. You only need Node 22 or newer.

```bash
cd grand-river-commons
npm run dev
```

Then open:

```text
http://localhost:5173
```

Run local tests and smoke checks:

```bash
npm test
npm run smoke
npm run verify
```

## Makefile shortcuts

```bash
make dev            # local Node static server
make test           # local tests
make smoke          # local server smoke test
make verify         # local tests plus smoke test
make docker-up      # docker compose up --build
make docker-test    # tests inside Docker
make docker-smoke   # smoke test inside Docker
make docker-verify  # tests plus smoke test inside Docker
make docker-down    # stop containers
```

## Dev container

The `.devcontainer/devcontainer.json` file lets compatible editors open the project inside the Docker Compose service and forward port 5173 automatically.

## Why Docker?

The first smoke test used a raw web/CDN-style loading path. That was useful to quickly verify the UI, but it is not reliable enough for ongoing development. The Docker setup gives humans, Cursor, Codex, browser agents, and future Continual Harness workflows one predictable launch path.
