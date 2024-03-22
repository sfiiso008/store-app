/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
// @store
import { useStore } from '@/store/session';
// @mui
import { Typography, Stack, Card, Button } from '@mui/material';
// @components
import CartItem from '@/components/cart-item';

const Cart = () => {
	const { cart, getTotal, user, getCart } = useStore(
		useShallow((state) => ({
			cart: state.cart,
			getTotal: state.getTotal,
			user: state.user,
			getCart: state.getCart,
		}))
	);

	const [cartTotalItems, setCartTotalItems] = React.useState<number>(0);
	const [cartTotalPrice, setCartTotalPrice] = React.useState<number>(0);
	const [refetch, setRefetch] = React.useState(false);

	React.useEffect(() => {
		const handleGetTotalItems = async () => {
			const res = await getTotal({ userId: user._id as string });

			if (res?.success) {
				setCartTotalItems(res?.totals.totalNumberOfItems || 0);
				setCartTotalPrice(res?.totals.totalPrice || 0);
			}
		};

		handleGetTotalItems();
	}, [cart, user._id]);

	React.useEffect(() => {
		const handleGetCart = async () => {
			await getCart({ userId: user._id as string });
		};

		handleGetCart();
	}, [refetch]);

	return (
		<Stack>
			<Stack
				direction={{ lg: 'row', md: 'column', sm: 'column' }}
				width='100%'
				justifyContent='center'
				spacing={4}
				mt={2}
			>
				<Stack
					width={{ lg: '60%', md: '100%', sm: '100%' }}
					spacing={4}
				>
					<Card
						sx={{
							width: '100%',
							height: 60,
							p: 2,
						}}
					>
						<Typography variant='h6'>
							All items({cartTotalItems})
						</Typography>
					</Card>
					<Card
						sx={{
							width: '100%',
							height: 'auto',
							px: 2,
							py: 1,
						}}
					>
						<Typography variant='h6'>Category</Typography>
						{cart.items.length === 0 && (
							<Typography variant='h6' textAlign='center' py={2}>
								No items in cart
							</Typography>
						)}
						{cart && cart.items && (
							<CartItem
								view='cart'
								cartItems={cart.items}
								setRefetch={setRefetch}
							/>
						)}
					</Card>
				</Stack>
				<Stack spacing={4}>
					<Card
						sx={{
							width: { lg: 400, md: '100%' },
							height: 400,
							p: 2,
						}}
					>
						<Typography variant='h6'>Order Summary</Typography>
						<Typography variant='body1' textAlign='right'>
							Total: R{cartTotalPrice.toFixed(2)}
						</Typography>
						<Button
							variant='contained'
							sx={{
								justifyContent: 'center',
								width: '100%',
								mt: 5,
								alignItems: 'center',
							}}
						>
							Checkout now
						</Button>
					</Card>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Cart;
