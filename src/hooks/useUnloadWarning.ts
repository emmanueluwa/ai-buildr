import { useEffect } from "react";

export default function useUnloadWarning(condition = true) {
  useEffect(() => {
    if (!condition) {
      return;
    }

    const listener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    //when trying to refresh or close page
    window.addEventListener("beforeunload", listener);

    return () => window.removeEventListener("beforeunload", listener);
  }, [condition]);
}
