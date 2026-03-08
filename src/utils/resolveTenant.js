export function resolveTenant() {
  const hostname = window.location.hostname;

  const parts = hostname.split(".");

  if (hostname.includes("localhost")) {
    return "dev";
  }

  return parts[0];
}
