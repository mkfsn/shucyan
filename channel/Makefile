.PHONY: docker clean

docker:
	docker build . -t wochentlich/channel
	docker rmi -f `docker images -qf "dangling=true"`

clean:
	rm channel
