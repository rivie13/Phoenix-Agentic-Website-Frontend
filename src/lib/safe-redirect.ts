export function safeRedirect(input: string | undefined, fallback: string): string {
  if (!input) {
    return fallback;
  }

  if (!input.startsWith("/") || input.startsWith("//")) {
    return fallback;
  }

  return input;
}
