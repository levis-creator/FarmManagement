import { atom } from 'jotai';
import { Stats } from '../types/types';
export const statsAtom=atom<Stats[]>([])