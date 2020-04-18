.PHONY: docs

build:
	tsc

clean-docs:
	rm -rf docs/js

docs: clean-docs build
	cp -r build docs/js
