import { feathers as feathersInit, HookContext } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth, { AuthenticationClient } from '@feathersjs/authentication-client';
import io from 'socket.io-client';

const IS_BROWSER = typeof window !== 'undefined';
const IS_LOCAL_STORAGE_AVAILABLE = typeof localStorage !== 'undefined';
const BASE_URL = process.env.BASE_URL as string;

class CustomAuthenticationClient extends AuthenticationClient {
	handleError(error: any, type: string) {
		if (error.code === 401 || error.code === 404) {
			const promise = this.removeAccessToken().then(() => this.reset());

			return type === 'logout'
				? promise
				: promise.then(() => Promise.reject(error));
		}

		return Promise.reject(error);
	}
}

export function createFeathersClient() {
	const socket = io(BASE_URL);
	const feathers = feathersInit();

	feathers.configure(
		socketio(socket, {
			timeout: 16000,
		})
	);

	feathers.configure(
		auth({
			storage:
				IS_BROWSER && IS_LOCAL_STORAGE_AVAILABLE
					? localStorage
					: undefined,
			storageKey: 'access-token',
			Authentication: CustomAuthenticationClient,
		})
	);

	socket.on('connect_error', () => {
		console.info('Not connected to the server');
	});

	socket.on('connect', () => {
		console.info(`CONNECTED: ${socket.connected}`);
	});

	feathers.hooks({
		before: {
			all: [],
		},
	});

	return feathers;
}

export const feathersClient = createFeathersClient();
