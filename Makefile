.PHONY: backup-dump

install:
	pnpm install
	npx husky install
	$(MAKE) -C frontend install

run-frontend:
	$(MAKE) -C frontend dev

test:
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C frontend lint

lint-staged:
	$(MAKE) -C frontend lint-staged

run: run-db run-es

stop: stop-db stop-es

run-db:
	docker compose up -d --pull=always postgres

stop-db:
	docker compose stop postgres

down-db:
	docker compose down postgres

run-es:
	docker compose up -d --pull=always es8

stop-es:
	docker compose stop es8

down-es:
	docker compose down es8

workflow:
	# .secrets should have GITHUB_TOKEN
	# .env should have GITHUB_ACTOR
	act -W .github/workflows/deploy.yml -s GITHUB_TOKEN=$(cat .secrets | grep GITHUB_TOKEN | cut -d '=' -f2) --env-file .env
