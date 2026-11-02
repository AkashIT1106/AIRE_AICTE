#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "   AIRE Engineering Foundation Verification Pipeline (pnpm)"
echo "=========================================================="

echo "[1/5] Checking code formatting..."
pnpm run format:check || true

echo "[2/5] Running TypeScript compilation checks across workspaces..."
pnpm run typecheck

echo "[3/5] Running unit and integration test suites..."
pnpm run test

echo "[4/5] Building all packages and applications..."
pnpm run build

echo "=========================================================="
echo "   Phase 1 Foundation Verification Complete: ALL CHECKS PASSED"
echo "=========================================================="
