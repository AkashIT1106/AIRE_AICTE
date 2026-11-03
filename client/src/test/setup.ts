import "@testing-library/jest-dom";

// In Node 22+ with jsdom, jsdom provides window.AbortSignal/AbortController in the DOM realm,
// while Node provides undici Request in the global realm.
// React Router 7's createBrowserRouter uses `new Request(url, { signal })` during client navigations,
// which causes undici to throw "TypeError: RequestInit: Expected signal to be an instance of AbortSignal".
// This wrapper ensures cross-realm signals in jsdom do not throw.
const OriginalRequest = globalThis.Request;

if (OriginalRequest) {
  globalThis.Request = class Request extends OriginalRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      if (init && init.signal) {
        try {
          super(input, init);
          return;
        } catch (err: any) {
          if (
            err instanceof TypeError &&
            err.message.includes("Expected signal")
          ) {
            const { signal: _, ...restInit } = init;
            super(input, restInit);
            return;
          }
          throw err;
        }
      }
      super(input, init);
    }
  } as typeof OriginalRequest;
}
