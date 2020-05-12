.PHONY: build docs typedoc examples all

build:
	tsc

docs: build typedoc
	rm -r docs
	cd website && hugo

typedoc:
	rm -r website/content/reference
	yarn run typedoc
	/bin/bash website/fix_reference_links.sh

examples: build
	cd examples/snake && tsc
	cd examples/skiing && tsc

all: examples docs
