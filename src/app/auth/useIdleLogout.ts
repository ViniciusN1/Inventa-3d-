import { useEffect, useRef } from "react";

export function useIdleLogout(logout: () => void, timeout = 10 * 60 * 1000) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      logout();
    }, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((e) => window.addEventListener(e, reset));

    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
}