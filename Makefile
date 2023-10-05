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

run-db:
	docker compose up -d --pull=always postgres

stop-db:
	docker compose stop postgres

# setup and run when deploying on server
setup:
	echo "nothing to see here"

run:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml  up  --pull=always -d --remove-orphans

