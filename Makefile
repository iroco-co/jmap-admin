VERSION := `npm pkg get version | sed 's/"//g'`

run:
	npm run serve

clean:
	rm -Rf ./dist

dist:
	npm run build

install:
	npm i

unit:
	npm run test	

docker-image: 
	docker build -f docker/Dockerfile -t iroco/jmapadmin:${VERSION} .
