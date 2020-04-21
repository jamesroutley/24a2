.PHONY: docs

build:
	tsc

clean-docs:
	rm -rf docs

docs: clean-docs
	cp -r website docs
