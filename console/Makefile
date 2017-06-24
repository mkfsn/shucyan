all: node_modules webconsole

webconsole:
	go build

node_modules:
	npm install

clean:
	go clean
	rm -rf node_modules
	rm -rf dist

docker:
	docker build . -t webconsole
