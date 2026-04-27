import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch (error) {
      console.warn(`Could not load ${key} from local storage`, error);
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      const serialized = JSON.stringify(value);
      if (typeof serialized === "undefined") {
        window.localStorage.removeItem(key);
        return;
      }
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      console.warn(`Could not save ${key} to local storage`, error);
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated];
}
