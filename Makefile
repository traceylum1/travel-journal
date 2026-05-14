.PHONY: lint lint-fe lint-go lint-golangci
lint: lint-fe lint-go

lint-fe:
	cd frontend && npm run lint

lint-go:
	go vet ./...

# Optional: install from https://golangci-lint.run/usage/install/
lint-golangci:
	golangci-lint run ./...
