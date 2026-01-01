export const isValidUrl = (value) => {
  try {
    const url = new URL(value);

    // Only allow http & https
    if (!["http:", "https:"].includes(url.protocol)) return false;

    return true;
  } catch {
    return false;
  }
};
