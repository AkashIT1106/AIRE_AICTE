# Contributing to AIRE

## Engineering Standards

All contributions must adhere to the engineering standards specified in `PROJECT_PLAN.md` (Section 36):

1. **Strict TypeScript**: No `any` types; all types must be strictly defined.
2. **Explicit Module Boundaries**: Respect package and domain module separation.
3. **No Business Logic in Presentation or HTTP Controllers**: Keep controllers thin; domain logic resides in dedicated services.
4. **Tenant Isolation**: Institution data isolation must be enforced via Row-Level Security (RLS) and scoped transaction wrappers.
5. **No Hardcoded Secrets**: Use environment configurations validated at startup.
6. **Code Hygiene**: Code must pass `npm run lint`, `npm run typecheck`, and `npm run test` before submission.
