.PHONY: docs

build:
	tsc

docs:
	cd website && hugo
