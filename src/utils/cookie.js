function getCookie(cookieName) {
  if (Array.isArray(cookieName)) {
    const result = {};
    const cookieRows = document.cookie.split("; ");
    cookieName.forEach((name) => {
      const value = cookieRows
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
      if (value) result[name] = value;
    });
    return result;
  }
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];
}

const defaultOptions = { path: "/", sameSite: "lax", secure: true };
function setCookie(name, value, options) {
  const { expires, path, sameSite, secure } = {
    ...defaultOptions,
    ...options,
  };
  document.cookie = `${name}=${value};path=${path};${
    expires
      ? `expires=${expires instanceof Date ? expires.toUTCString() : expires};`
      : ""
  }${secure ? "Secure;" : ""}SameSite=${sameSite};`;
}

const defaultRemoveQueryOptions = { path: "/" };
function removeCookie(name, options) {
  const { path } = { ...defaultRemoveQueryOptions, ...options };
  document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export { getCookie, setCookie, removeCookie };
