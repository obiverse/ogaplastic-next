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
	@echo "Deployed. Enable GitHub Pages → Settings → Pages → Branch: $(BRANCH)"

clean:
	rm -rf $(OUT) .next
