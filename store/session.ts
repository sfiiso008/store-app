import { create } from 'zustand';
import { persistNSync } from 'persist-and-sync';
// @stores
import { createAuthStore } from './store';
import { createDataStore } from './data-store';
import { TAuthStore, TDataStore } from './types';

export const useStore = create<TAuthStore>()(
	persistNSync(
		(...a) => ({
			...createAuthStore()(...a),
		}),
		{ name: 'store' }
	)
);
export const useDataStore = create<TDataStore>()(createDataStore());
