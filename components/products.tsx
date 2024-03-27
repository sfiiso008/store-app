import React from 'react';
import { useRouter } from 'next/router';
// @mui
import {
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
// @icons
import { AddShoppingCart } from '@mui/icons-material';
// @types
import { ICategory, IProduct } from '@/store/types';

const Products = ({
	categoryName,
	products,
}: {
	products: IProduct[];
	categoryName: string;
}) => {
	const router = useRouter();

	return (
		<Stack
			width={{ xl: '80vw', lg: '80vw', md: '70vw' }}
			maxHeight='100vh'
			sx={{
				overflow: 'scroll',
				'::-webkit-scrollbar': {
					display: 'none',
				},
			}}
		>
			<Typography variant='h4'>{categoryName}</Typography>
			<Grid container spacing={2}>
				{products.length === 0 && (
					<Stack
						justifyContent='center'
						alignItems='center'
						sx={{
							display: 'flex',
							width: '100%',
							m: 5,
						}}
					>
						<Typography variant='h6' textAlign='center'>
							No products available...
						</Typography>
					</Stack>
				)}
				{products &&
					products.map((product) => (
						<Grid
							key={product.title}
							item
							xl={3}
							lg={4}
							md={6}
							sm={6}
						>
							<Card
								sx={{
									width: { lg: 320, sm: 280 },
									height: { lg: 320, sm: 250 },
									borderRadius: 2,
									'&:hover': {
										boxShadow: '0 0 10px 0 #000',
									},
								}}
								onClick={() => {
									router.push(
										`/products/item/${product._id}`
									);
								}}
							>
								<CardActionArea>
									<CardMedia
										component='img'
										src={
											product?.images &&
											product?.images[0]
										}
										alt={product.title}
										sx={{
											height: { lg: 200, sm: 160 },
											objectFit: 'fill',
										}}
									/>
									<CardContent>
										<Stack
											direction='row'
											justifyContent='space-between'
										>
											<Stack>
												<Typography gutterBottom>
													{product.title}
												</Typography>
												<Typography gutterBottom>
													R {product.price}
												</Typography>
											</Stack>
											<Stack>
												<Button
													size='small'
													color='primary'
													onClick={() => {
														router.push(
															`/products/item/${product._id}`
														);
													}}
												>
													<AddShoppingCart
														sx={{
															fontSize: '3rem',
															float: 'right',
														}}
													/>
												</Button>
											</Stack>
										</Stack>
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					))}
			</Grid>
		</Stack>
	);
};

export default Products;
