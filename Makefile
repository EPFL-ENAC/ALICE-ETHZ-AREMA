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


run-database:
	docker-compose up --build -d couchdb

setup-database:
	docker-compose up --build --force-recreate couchdb-setup

# setup and run when deploying on server
setup:
	echo "nothing to see here"

run:
	docker compose pull
	docker compose build --parallel --no-cache
	docker compose up -d --remove-orphans
