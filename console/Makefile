.PHONY: docker clean

docker:
	docker build . -t wochentlich/console
	docker rmi -f `docker images -qf "dangling=true"`

clean:
	rm -rf node_modules
	rm -rf dist
