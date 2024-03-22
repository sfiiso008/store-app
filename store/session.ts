import { create } from 'zustand';
import { persistNSync } from 'persist-and-sync';
// @stores
import { createAuthStore } from './store';
import { TAuthStore } from './types';

export const useStore = create<TAuthStore>()(
	persistNSync(
		(...a) => ({
			...createAuthStore()(...a),
		}),
		{ name: 'store' }
	)
);
