export const isValidUrl = (value) => {
  if (!value || typeof value !== "string") return false;

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    const hostname = url.hostname?.toLowerCase();

    if (!hostname) return false;

    if (process.env.NODE_ENV === "production") {
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("10.") ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("172.") ||
        hostname.startsWith("169.254.")
      ) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
};
