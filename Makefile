.phony: publish-demo

build:
	npm run build

publish: # build
	VERSION=$$(cat package.json | jq -r ".version") ;\
	cp demo/mapbook.json ./dist ;\
	cd dist ;\
	zip gm4-$$VERSION.zip -r * ;\
	gcloud storage cp -r * gs://gm4-demo
