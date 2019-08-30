
build:
	npm run build

publish:
	npm run build
	npm publish

# https://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules
drone-publish:
	echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc	
	git config --global user.email "tools@dotscience.com"
	git config --global user.name "drone"
	npm version ${DRONE_TAG}
	npm publish