import { feathers as feathersInit } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth, { AuthenticationClient } from '@feathersjs/authentication-client';
import io from 'socket.io-client';

const IS_BROWSER = typeof window !== 'undefined';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

const token = IS_BROWSER
	? window.localStorage.getItem('access-token')
	: undefined;

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
			storage: IS_BROWSER ? window.localStorage : undefined,
			storageKey: token ? 'access-token' : undefined,
			path: '/authentication',
			Authentication: AuthenticationClient,
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
