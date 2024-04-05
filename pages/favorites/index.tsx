import React from 'react';
import { useShallow } from 'zustand/react/shallow';
// @store
import { useStore, useDataStore } from '@/store/session';
// @mui
import { Typography, Stack, Card, Button } from '@mui/material';
// @types
import { CartItems } from '@/store/types';
// @components
import CartItem from '@/components/cart-item';

const Favorites = () => {
	const { user } = useStore(
		useShallow((state) => ({
			user: state.user,
		}))
	);

	const { getWishlist } = useDataStore(
		useShallow((state) => ({
			getWishlist: state.getWishlist,
		}))
	);

	const [refetch, setRefetch] = React.useState(false);

	const [wishlistItems, setWishlistItems] = React.useState<CartItems[]>();
	const [totalNumberOfItems, setTotalNumberOfItems] = React.useState(0);

	React.useEffect(() => {
		const handleGetCart = async () => {
			const res = await getWishlist({ userId: user._id as string });

			if (res?.success) {
				setWishlistItems(res?.wishlist.items);
				setTotalNumberOfItems(res?.wishlist.items.length);
			}
		};

		handleGetCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
							All items({totalNumberOfItems})
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
						{!wishlistItems && (
							<Typography variant='h6' textAlign='center' py={2}>
								No items in wishlist
							</Typography>
						)}
						{wishlistItems && (
							<CartItem
								view='favorites'
								cartItems={wishlistItems}
								setRefetch={setRefetch}
							/>
						)}
					</Card>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Favorites;
