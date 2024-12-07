import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number = 250) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    //clean up - cancel previous timeout when typing
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
