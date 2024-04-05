import React from 'react';
// @types
import { CartItems } from '@/store/types';
// @local
import DisplayCartItem from './display-cart-item';

const CartItem = ({
	view,
	cartItems,
	setRefetch,
}: {
	view: 'cart' | 'favorites';
	cartItems: CartItems[];
	setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return cartItems.map((item, index) => (
		<DisplayCartItem
			key={index}
			view={view}
			item={item}
			setRefetch={setRefetch}
		/>
	));
};

export default CartItem;
