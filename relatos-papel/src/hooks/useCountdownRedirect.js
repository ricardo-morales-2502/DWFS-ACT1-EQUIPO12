import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useCountdownRedirect({ seconds = 5, to, enabled = false, canCancel = true }) {
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState(seconds);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    setRemaining(seconds);
    setCancelled(false);

    if (!canCancel) return;

    const cancelEvents = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    const onUserIntent = () => setCancelled(true);

    cancelEvents.forEach((evt) =>
        window.addEventListener(evt, onUserIntent, { passive: true, once: true })
    );

    return () => {
      cancelEvents.forEach((evt) => window.removeEventListener(evt, onUserIntent));
    };
  }, [enabled, seconds, canCancel]);

  useEffect(() => {
    if (!enabled || cancelled) return;
    if (remaining <= 0) {
      navigate(to);
      return;
    }
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [enabled, cancelled, remaining, navigate, to]);

  return { remaining, cancelled, cancel: () => setCancelled(true) };
}