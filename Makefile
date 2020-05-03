.PHONY: docs typedoc

build:
	tsc

docs: typedoc
	rm -r docs
	cd website && hugo

typedoc:
	rm -r website/content/reference
	yarn run typedoc
	/bin/bash website/fix_reference_links.sh
