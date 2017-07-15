help:
	@echo "Usages:"
	@echo "    make build - build all image"
	@echo "    make clean - "

.PHONY: help build

build:
	docker-compose build

clean:
	docker-compose down
