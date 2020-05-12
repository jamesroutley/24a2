.PHONY: build docs typedoc

build:
	tsc

docs: build typedoc
	rm -r docs
	cd website && hugo

typedoc:
	rm -r website/content/reference
	yarn run typedoc
	/bin/bash website/fix_reference_links.sh
