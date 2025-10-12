export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // This is a server-side instrumentation
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // This is an edge runtime instrumentation
  }
}

export async function onRequestError() {
  // This is a request error handler
}
