const AUTH_EXPIRED_EVENT = "app:auth-expired";

export const normalizeStoredToken = (storedToken) => {
  if (!storedToken || typeof storedToken !== "string") {
    return null;
  }

  return storedToken.includes("|") ? storedToken.split("|").pop() : storedToken;
};

export const getStoredToken = () => {
  const rawToken = localStorage.getItem("auth_token");

  if (!rawToken) {
    return null;
  }

  try {
    const parsedToken = JSON.parse(rawToken);
    return normalizeStoredToken(parsedToken);
  } catch {
    return normalizeStoredToken(rawToken);
  }
};

export const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token) => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );

    return JSON.parse(window.atob(paddedPayload));
  } catch {
    return null;
  }
};

export const getTokenExpiryTime = () => {
  const token = getStoredToken();
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return null;
  }

  return payload.exp * 1000;
};

export const isStoredTokenExpired = () => {
  const expiryTime = getTokenExpiryTime();

  if (!expiryTime) {
    return false;
  }

  return Date.now() >= expiryTime;
};

export const clearStoredAuth = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};

export const logoutUser = () => {
  clearStoredAuth();
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));

  if (window.location.pathname !== "/signin") {
    window.location.href = "/signin";
  }
};

export const authExpiredEventName = AUTH_EXPIRED_EVENT;