// client/src/utils/auth.js
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false; // no exp claim

    // exp is in seconds → convert to ms
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};
