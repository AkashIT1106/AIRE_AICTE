#!/usr/bin/env bash
set -euo pipefail

# Colors for readable console output
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

START_TIME=$(date +%s)

echo -e "${BOLD}${BLUE}==========================================================${NC}"
echo -e "${BOLD}${BLUE}   AIRE Local CI Pipeline (Fast Parallel Runner)${NC}"
echo -e "${BOLD}${BLUE}==========================================================${NC}"

# Step 1: Generate Prisma client
echo -e "\n${BOLD}[1/4] Generating Prisma client...${NC}"
pnpm run prisma:generate

# Step 2: Quality checks in parallel (format, lint, typecheck)
echo -e "\n${BOLD}[2/4] Running format check, lint, and typecheck in parallel...${NC}"
FAILED=0

pnpm run format:check &
PID_FORMAT=$!

pnpm run lint &
PID_LINT=$!

pnpm run typecheck &
PID_TYPECHECK=$!

wait $PID_FORMAT || FAILED=1
wait $PID_LINT || FAILED=1
wait $PID_TYPECHECK || FAILED=1

if [ $FAILED -ne 0 ]; then
  echo -e "\n${RED}Quality checks failed.${NC}" >&2
  exit 1
fi
echo -e "${GREEN}✓ Quality checks passed.${NC}"

# Step 3: Database migrations (if Postgres is reachable)
echo -e "\n${BOLD}[3/4] Checking database readiness...${NC}"
if nc -z localhost 5433 2>/dev/null || nc -z localhost 5432 2>/dev/null; then
  echo "Database connection detected. Applying Prisma migrations..."
  pnpm run prisma:migrate
else
  echo "Database service not detected on localhost:5433/5432. Skipping live migration check."
fi

# Step 4: Build and test in parallel
echo -e "\n${BOLD}[4/4] Building packages/apps and running test suites in parallel...${NC}"
pnpm run build &
PID_BUILD=$!

pnpm run test &
PID_TEST=$!

wait $PID_BUILD || FAILED=1
wait $PID_TEST || FAILED=1

if [ $FAILED -ne 0 ]; then
  echo -e "\n${RED}Build or test execution failed.${NC}" >&2
  exit 1
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo -e "\n${BOLD}${GREEN}==========================================================${NC}"
echo -e "${BOLD}${GREEN}   Local CI Pipeline Completed Successfully in ${DURATION}s!${NC}"
echo -e "${BOLD}${GREEN}==========================================================${NC}"
