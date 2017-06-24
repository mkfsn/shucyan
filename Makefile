help:
	@echo "make all"
	@echo "make channel"
	@echo "make console"

.PHONY: help all channel console

all: console channel

channel:
	@make -C channel

console:
	@make -C console
