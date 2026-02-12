# Load .env
include .env
export

# ─── Network Config ───────────────────────────────────────────────────
ANVIL_RPC   := http://127.0.0.1:8545
SEPOLIA_RPC := https://eth-sepolia.g.alchemy.com/v2/$(ALCHEMY_API_KEY)

# ─── Shared deploy helper ─────────────────────────────────────────────
define deploy
	forge script script/Deploy.s.sol:Deploy \
		--rpc-url $(1) --private-key $(2) --broadcast
	./scripts/sync-frontend.sh $(3)
endef

# ─── Chain ────────────────────────────────────────────────────────────
.PHONY: anvil
anvil: ## Start local Anvil chain
	anvil

# ─── Build & Test ─────────────────────────────────────────────────────
.PHONY: build test clean
build: ## Compile contracts
	forge build

test: ## Run tests
	forge test -vvv

clean: ## Remove build artifacts
	forge clean

# ─── Deploy ───────────────────────────────────────────────────────────
.PHONY: deploy-anvil deploy-sepolia sync

deploy-anvil: ## Deploy all contracts to local Anvil + sync frontend
	$(call deploy,$(ANVIL_RPC),$(ANVIL_KEY),31337)

deploy-sepolia: ## Deploy all contracts to Sepolia + sync frontend
	$(call deploy,$(SEPOLIA_RPC),$(SEPOLIA_KEY),11155111)

sync: ## Sync ABIs & addresses to frontend (chain id as arg, default 31337)
	./scripts/sync-frontend.sh $(or $(CHAIN),31337)

# ─── Help ─────────────────────────────────────────────────────────────
.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
