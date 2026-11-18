/** Hash navigation only selects a screen; it never dispatches a recording action. */
export function createHashRouter(window, onRoute) {
  const current = () => {
    const hash = window.location.hash.slice(1);
    return !hash || hash === "main" ? "home" : hash;
  };
  const changed = () => onRoute(true);
  window.addEventListener("hashchange", changed);
  return {
    current,
    go(route) {
      if (window.location.hash === "#" + route) onRoute();
      else window.location.hash = route;
    },
    dispose() {
      window.removeEventListener("hashchange", changed);
    },
  };
}
