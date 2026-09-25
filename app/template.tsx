import { ViewTransition } from "react";

/**
 * Page-to-page transition for every route. A template (unlike a layout)
 * re-mounts on each navigation, so the outgoing page's <ViewTransition>
 * exits and the incoming one enters; the browser animates between them with
 * the `page` classes in globals.css. Browsers without the View Transitions
 * API simply swap pages as before, and reduced-motion users get no motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
