.PHONY: dev test smoke verify docker-build docker-up docker-down docker-test docker-smoke docker-verify clean

PORT ?= 5173

# Run locally with the dependency-free Node static server.
dev:
	PORT=$(PORT) npm run dev

# Run Node's built-in test runner.
test:
	npm test

# Run a local server smoke test without Docker.
smoke:
	npm run smoke

# Run local unit tests plus smoke test.
verify:
	npm run verify

# Build the Docker image.
docker-build:
	docker build -t grand-river-commons .

# Start the Docker Compose dev server.
docker-up:
	docker compose up --build

# Stop Docker Compose services.
docker-down:
	docker compose down

# Run tests inside a one-off Docker container.
docker-test:
	docker compose run --rm grand-river-commons npm test

# Run the static-server smoke test inside Docker.
docker-smoke:
	docker compose run --rm -e SMOKE_PORT=5174 grand-river-commons npm run smoke

# Run tests and smoke test inside Docker.
docker-verify:
	docker compose run --rm -e SMOKE_PORT=5174 grand-river-commons npm run verify

# Remove local transient artifacts.
clean:
	rm -rf node_modules coverage
