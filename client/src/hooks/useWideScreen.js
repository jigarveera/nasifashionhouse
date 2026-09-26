import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 768px)';

function subscribe(callback) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

export default function useWideScreen() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
