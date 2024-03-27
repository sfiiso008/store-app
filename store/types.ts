import { Application } from '@feathersjs/feathers';

export interface IProduct {
	_id: string;
	category: {
		creationAt: string;
		id: number;
		image: string;
		name: string;
		updatedAt: string;
	};
	creationAt: string;
	description: string;
	images: string[];
	price: number;
	title: string;
}

export interface ISubCategory {
	_id: string;
	name: string;
	categoryId: string;
}

export interface ICategory {
	_id: string;
	name: string;
	image: string;
	creationAt: string;
	updatedAt: string;
}

export type TUserData = {
	_id: string | null;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
	profilePicture?: string | null;
};

export interface IItems {
	productId: number | null;
	price: number | null;
	itemPicture: string | null;
	itemName: string | null;
}

export interface CartItems extends IItems {
	quantity: number;
}

export interface ICartDetails {
	_id?: string | null;
	userId: string | null;
	items: CartItems[];
}

export type TData = {
	user: TUserData;
	cart: ICartDetails;
};

export interface IUserSessionActions extends TData {
	setUser: (setUser: TUserData) => void;
	setCartItem: (setCartItem: ICartDetails) => void;
}

export interface IAuthActions {
	login: (payload: { email: string; password: string }) => Promise<{
		success: boolean;
		message: string | null;
	}>;
	logout: () => Promise<{
		success: boolean;
	}>;
	feathersClient: Application;
	isAuthenticated: boolean;
	checkAuthentication: () => Promise<{ success: boolean; message: string }>;
	signup: (payload: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
	}) => Promise<{
		success: boolean;
		message: string | null;
	}>;
	getCart: (payload: { userId: string }) => Promise<{
		success: boolean;
		message: string;
	}>;
	addToCart: (payload: {
		userId: string;
		items: {
			productId: number;
			quantity: number;
			price: number;
			itemPicture: string;
			itemName: string;
		};
	}) => Promise<{
		success: boolean;
		message: string;
	}>;
	removeFromCart: (payload: {
		userId: string;
		productId: number;
	}) => Promise<{
		success: boolean;
		message: string;
	}>;
	getTotal: (payload: { userId: string }) => Promise<{
		success: boolean;
		totals: {
			totalPrice: number;
			totalNumberOfItems: number;
		};
	}>;
	getWishlist: (payload: { userId: string }) => Promise<{
		success: boolean;
		wishlist: any;
	}>;
	addToWishlist: (payload: {
		userId: string;
		items: {
			productId: number;
			price: number;
			itemPicture: string;
			itemName: string;
		};
	}) => Promise<{
		success: boolean;
		message: string;
	}>;
	AddedToWishlist: (payload: {
		userId: string;
		productId: number;
	}) => Promise<{
		success: boolean;
		alreadyExists: boolean;
	}>;
	removeFromWishlist: (payload: {
		userId: string;
		productId: number;
	}) => Promise<{
		success: boolean;
		message: string;
	}>;
	updateQuantity: (payload: {
		userId: string;
		productId: number;
		newQuantity: number;
	}) => Promise<{
		success: boolean;
		message: string;
	}>;
}

export type TAuthStore = IUserSessionActions & IAuthActions;
