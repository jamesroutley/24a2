.PHONY: build docs typedoc examples all

build:
	yarn run tsc

docs: build typedoc
	rm -rf docs
	cd website && hugo

typedoc:
	rm -rf website/content/reference
	yarn run typedoc
	/bin/bash website/fix_reference_links.sh

examples: build
	cd examples/snake && yarn run tsc
	cd examples/skiing && yarn run tsc

all: examples docs
