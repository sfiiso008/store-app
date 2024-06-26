import React from 'react';
import Image from 'next/image';
import { useShallow } from 'zustand/react/shallow';
// @store
import { useStore, useDataStore } from '@/store/session';
// @mui
import { Stack, Typography, Box, Button } from '@mui/material';
// @types
import { CartItems } from '@/store/types';

const DisplayCartItem = ({
	item,
	view,
	setRefetch,
}: {
	item: CartItems;
	view: 'cart' | 'favorites';
	setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { user } = useStore(
		useShallow((state) => ({
			user: state.user,
		}))
	);

	const {
		removeFromCart,
		removeFromWishlist,
		addToWishlist,
		addToCart,
		updateQuantity,
		AddedToWishlist,
	} = useDataStore(
		useShallow((state) => ({
			removeFromCart: state.removeFromCart,
			removeFromWishlist: state.removeFromWishlist,
			addToCart: state.addToCart,
			addToWishlist: state.addToWishlist,
			updateQuantity: state.updateQuantity,
			AddedToWishlist: state.AddedToWishlist,
		}))
	);

	const [isInWishlist, setIsInWishlist] = React.useState(false);

	const handleRemove = async (productId: string) => {
		if (view === 'cart') {
			await removeFromCart({
				userId: user._id as string,
				productId,
			});
		}
		if (view === 'favorites') {
			await removeFromWishlist({
				userId: user._id as string,
				productId,
			});

			setRefetch((prev) => !prev);
		}
	};

	const handleAdd = async (product: {
		productId: string;
		price: number;
		itemName: string;
		itemPicture: string;
	}) => {
		if (user && product) {
			if (view === 'cart') {
				const data = {
					userId: user._id as string,
					items: product,
				};

				const res = await addToWishlist(data);

				if (res.success) {
					setRefetch((prev) => !prev);
				}
			} else if (view === 'favorites') {
				const data = {
					userId: user._id as string,
					items: {
						productId: product.productId,
						quantity: 1,
						price: product?.price,
						itemPicture: product?.itemPicture,
						itemName: product?.itemName as string,
					},
				};

				const res = await addToCart(data);

				if (res.success) {
					const res = await removeFromWishlist({
						userId: user._id as string,
						productId: product.productId,
					});
					if (res.success) {
						setRefetch((prev) => !prev);
					}
				}
			}
		}
	};

	const handleUpdateQuantity = async (
		productId: string,
		newQuantity: number
	) => {
		if (user) {
			const res = await updateQuantity({
				userId: user._id as string,
				productId,
				newQuantity,
			});

			if (res.success) {
				setRefetch((prev) => !prev);
			}
		}
	};

	React.useEffect(() => {
		if (user && item) {
			const handleAddedToWishlist = async () => {
				const res = await AddedToWishlist({
					userId: user._id as string,
					productId: item.productId as string,
				});

				if (res?.success) {
					setIsInWishlist(res.alreadyExists);
				}
			};
			handleAddedToWishlist();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, item]);

	return (
		<Stack justifyContent='space-between' direction='row' mt={2}>
			<Stack direction='row' spacing={2}>
				<Image
					src={item.itemPicture as string}
					alt='product'
					width={120}
					height={120}
				/>
				<Stack justifyContent='center' spacing={1}>
					<Typography variant='body1'>{item.itemName}</Typography>
					<Typography variant='body1'>M</Typography>
					<Typography variant='body1'>R {item.price}</Typography>
				</Stack>
			</Stack>
			<Stack justifyContent='center' alignContent='center' spacing={2}>
				{view === 'cart' && item.quantity && (
					<Box display='flex' alignItems='center'>
						{item.quantity > 1 ? (
							<Button
								variant='outlined'
								onClick={() =>
									handleUpdateQuantity(
										item.productId as string,
										item.quantity - 1
									)
								}
							>
								-
							</Button>
						) : (
							<Button
								variant='outlined'
								onClick={() =>
									handleRemove(item.productId as string)
								}
							>
								-
							</Button>
						)}
						<Typography
							variant='h6'
							component='span'
							sx={{ mx: 2 }}
						>
							{item?.quantity}
						</Typography>
						<Button
							variant='outlined'
							onClick={() =>
								handleUpdateQuantity(
									item.productId as string,
									item.quantity + 1
								)
							}
						>
							+
						</Button>
					</Box>
				)}
				<Button
					variant='outlined'
					onClick={() => handleRemove(item.productId as string)}
				>
					Remove
				</Button>
				{view === 'cart' && (
					<Button
						variant='outlined'
						onClick={() =>
							handleAdd({
								productId: item.productId as string,
								price: item.price as number,
								itemName: item.itemName as string,
								itemPicture: item.itemPicture as string,
							})
						}
						disabled={isInWishlist}
					>
						{isInWishlist
							? 'Already in wishlist'
							: 'Save to wishlist'}
					</Button>
				)}
				{view === 'favorites' && (
					<Button
						variant='outlined'
						onClick={() =>
							handleAdd({
								productId: item.productId as string,
								price: item.price as number,
								itemName: item.itemName as string,
								itemPicture: item.itemPicture as string,
							})
						}
					>
						Move to cart
					</Button>
				)}
			</Stack>
		</Stack>
	);
};

export default DisplayCartItem;
