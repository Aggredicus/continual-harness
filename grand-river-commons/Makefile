.PHONY: dev test docker-build docker-up docker-down docker-test clean

PORT ?= 5173

# Run locally with the dependency-free Node static server.
dev:
	PORT=$(PORT) npm run dev

# Run Node's built-in test runner.
test:
	npm test

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

# Remove local transient artifacts.
clean:
	rm -rf node_modules coverage
