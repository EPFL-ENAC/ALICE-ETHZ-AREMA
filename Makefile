help: ## Show this help
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-12s %s\n", $$1, $$2}'

run: run-db run-es ## Start PostgreSQL and Elasticsearch

stop: stop-db stop-es ## Stop PostgreSQL and Elasticsearch

# PostgreSQL

run-db: ## Start PostgreSQL
	docker compose up -d --pull=always postgres

stop-db: ## Stop PostgreSQL
	docker compose stop postgres

down-db: ## Remove PostgreSQL container
	docker compose down postgres

connect-db: ## Open a psql shell
	docker compose exec postgres psql -U postgres -d arema

# Elasticsearch

run-es: ## Start Elasticsearch
	docker compose up -d --pull=always es8

stop-es: ## Stop Elasticsearch
	docker compose stop es8

down-es: ## Remove Elasticsearch container
	docker compose down es8
