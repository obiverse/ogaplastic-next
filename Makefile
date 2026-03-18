# OGA PLASTIC — Build & Deploy to GitHub Pages

BRANCH := gh-pages
OUT := out
REMOTE := $(shell git remote get-url origin)

.PHONY: build deploy clean dev

dev:
	npm run dev

build:
	NEXT_PUBLIC_BASE_PATH=/ogaplastic-next npm run build
	@touch $(OUT)/.nojekyll
	@echo "Build complete → $(OUT)/"

deploy: build
	@echo "Deploying to GitHub Pages ($(BRANCH) branch)..."
	@cd $(OUT) && \
		git init && \
		git checkout -b $(BRANCH) && \
		git add -A && \
		git commit -m "Deploy $$(date -u '+%Y-%m-%d %H:%M:%S UTC')" && \
		git remote add origin $(REMOTE) && \
		git push -f origin $(BRANCH)
	@rm -rf $(OUT)/.git
	@echo "Deployed → https://obiverse.github.io/ogaplastic-next/"

clean:
	rm -rf $(OUT) .next
