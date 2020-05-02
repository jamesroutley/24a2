.PHONY: docs

build:
	tsc

docs:
	cd website && hugo
	$(MAKE) typedoc

typedoc:
	yarn run typedoc
