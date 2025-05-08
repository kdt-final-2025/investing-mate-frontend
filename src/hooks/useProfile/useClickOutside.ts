// hooks/useClickOutside.ts
import { RefObject, useEffect } from 'react';

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  when = true
) {
  useEffect(() => {
    if (!when) return;

    function handleClick(e: MouseEvent) {
      if (
        ref &&
        'current' in ref &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, onOutsideClick, when]);
}
