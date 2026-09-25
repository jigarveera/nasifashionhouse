import { useContext } from 'react';
import { OverlayContext } from './OverlayContext';
export function useOverlay() { return useContext(OverlayContext); }
