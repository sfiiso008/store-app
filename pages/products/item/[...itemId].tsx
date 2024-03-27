import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useShallow } from 'zustand/react/shallow';
// @store
import { useStore } from '@/store/session';
// @mui
import {
	Button,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from '@mui/material';
// @mui-icons
import { Favorite } from '@mui/icons-material';
// @api
import { apiFunctions } from '@/pages/api';

interface IProduct {
	id: number;
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

const SelectedItem = () => {
	const isDesktop = useMediaQuery('(min-width:600px)');

	const {
		isAuthenticated,
		user,
		addToCart,
		addToWishlist,
		AddedToWishlist,
		removeFromWishlist,
	} = useStore(
		useShallow((state) => ({
			user: state.user,
			addToCart: state.addToCart,
			addToWishlist: state.addToWishlist,
			AddedToWishlist: state.AddedToWishlist,
			removeFromWishlist: state.removeFromWishlist,
			isAuthenticated: state.isAuthenticated,
		}))
	);

	const router = useRouter();
	const { itemId } = router.query;
	const [product, setProduct] = React.useState<IProduct | null>(null);
	const [hoveredImage, setHoveredImage] = React.useState<string | null>(null);
	const [isAddedToWishlist, setIsAddedToWishlist] =
		React.useState<boolean>(false);

	React.useEffect(() => {
		if (itemId) {
			const handleGetProduct = async () => {
				const res = await apiFunctions.getProduct({
					productId: itemId as string,
				});

				if (!res?.error) {
					setProduct(res?.data);
					setHoveredImage(res?.data.images[0]);
				}
			};

			handleGetProduct();
		}
	}, [itemId]);

	const handleImageHover = (image: string) => {
		setHoveredImage(image);
	};

	const handleAddToCart = async () => {
		if (user && product) {
			const data = {
				userId: user._id as string,
				items: {
					productId: product?.id,
					quantity: 1,
					price: product?.price,
					itemPicture: product?.images[0],
					itemName: product?.title as string,
				},
			};

			await addToCart(data);
		}
	};

	const handleAddToWishList = async () => {
		if (user && product) {
			const data = {
				userId: user._id as string,
				items: {
					productId: product?.id,
					price: product?.price,
					itemPicture: product?.images[0],
					itemName: product?.title as string,
				},
			};

			const res = await addToWishlist(data);
			if (res.success) {
				setIsAddedToWishlist(true);
			}
		}
	};

	const handleRemoveFromWishList = async () => {
		if (user && product) {
			const res = await removeFromWishlist({
				userId: user._id as string,
				productId: product?.id as number,
			});

			if (res?.success) {
				setIsAddedToWishlist(false);
			}
		}
	};

	React.useEffect(() => {
		if (user && product) {
			const handleAddedToWishlist = async () => {
				const res = await AddedToWishlist({
					userId: user._id as string,
					productId: product?.id as number,
				});

				if (res?.success) {
					setIsAddedToWishlist(res.alreadyExists);
				}
			};
			handleAddedToWishlist();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, product]);

	return (
		<Stack direction='row' spacing={2} justifyContent='center'>
			<Stack direction='column'>
				{product &&
					product.images &&
					product.images.map((image) => (
						<div
							key={image}
							onMouseEnter={() => handleImageHover(image)}
						>
							<Image
								src={image}
								alt={product.title}
								width={60}
								height={60}
							/>
						</div>
					))}
			</Stack>
			{product && (
				<Stack
					direction={{
						xl: 'row',
						lg: 'row',
						xs: 'column',
						md: 'column',
						sm: 'column',
					}}
					spacing={2}
				>
					<Stack spacing={2}>
						{hoveredImage && (
							<Image
								src={hoveredImage}
								alt={product.title}
								width={isDesktop ? 600 : 300}
								height={isDesktop ? 600 : 300}
								objectFit='fill'
							/>
						)}
					</Stack>
					<Stack
						direction='column'
						spacing={2}
						width={{ xs: 200, sm: 500, md: 600, lg: 500, xl: 500 }}
						pt={{ lg: 4 }}
					>
						<Typography variant='body1'>
							R {product.price}
						</Typography>
						<Typography variant='body1'>{product.title}</Typography>
						<Typography variant='body1'>
							{product.description}
						</Typography>
						<Stack flexDirection='row'>
							<Button
								variant='outlined'
								sx={{
									mx: 0.5,
								}}
							>
								S
							</Button>
							<Button
								variant='outlined'
								sx={{
									mx: 0.5,
								}}
							>
								M
							</Button>
							<Button
								variant='outlined'
								sx={{
									mx: 0.5,
								}}
							>
								L
							</Button>
							<Button
								variant='outlined'
								sx={{
									mx: 0.5,
								}}
							>
								XL
							</Button>
						</Stack>
						{isAuthenticated && (
							<Stack flexDirection='row'>
								<Button
									variant='contained'
									sx={{
										width: 200,
									}}
									onClick={handleAddToCart}
								>
									<Typography variant='body1'>
										Add to cart
									</Typography>
								</Button>
								<IconButton
									onClick={
										isAddedToWishlist
											? handleRemoveFromWishList
											: handleAddToWishList
									}
								>
									<Favorite
										sx={{
											fontSize: '3rem',
											color: isAddedToWishlist
												? '#000'
												: '#fff',
											stroke: '#000',
											strokeWidth: 2,
										}}
									/>
								</IconButton>
							</Stack>
						)}
					</Stack>
				</Stack>
			)}
		</Stack>
	);
};

export default SelectedItem;
