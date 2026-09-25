/**
 * Takes the delegate to a field that needs fixing: scrolls it to the middle of
 * the screen, puts the cursor in it (or on the first control of a Yes/No
 * group), and briefly flashes its wrapper (`.field-flash`, globals.css).
 *
 * Waits for the error messages (and, if the step changed, the new step) to
 * render before looking the field up.
 */
export function focusField(id: string, { afterStepChange = false } = {}) {
  const run = () => {
    const el = document.getElementById(id);
    if (!el) return;
    const container = (el.closest("[data-field]") as HTMLElement | null) ?? el;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    const target = el.matches("input, select, textarea, button")
      ? el
      : (el.querySelector("input, select, textarea, button") as HTMLElement | null);
    target?.focus({ preventScroll: true });
    container.classList.remove("field-flash");
    void container.offsetWidth; // restart the animation if it's already running
    container.classList.add("field-flash");
    window.setTimeout(() => container.classList.remove("field-flash"), 1600);
  };
  // A step change first scrolls to the top (RegistrationWizard); run after it.
  if (afterStepChange) window.setTimeout(run, 120);
  else requestAnimationFrame(() => requestAnimationFrame(run));
}

/** The first key, in on-screen order, that has an error. */
export function firstError<K extends string>(order: readonly K[], errors: Partial<Record<K, string | undefined>>) {
  return order.find((key) => errors[key]);
}
