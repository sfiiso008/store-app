import React from 'react';
import { useRouter } from 'next/router';
// @mui
import { Stack, Typography, Button } from '@mui/material';
// @types
import { ICategory } from '@/store/types';

const Card = ({
	category,
	setAnimate,
}: {
	category: ICategory;
	setAnimate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const router = useRouter();

	return (
		<Stack
			key={category._id}
			sx={{
				width: { md: 300, lg: 400, xs: 350 },
				height: 400,
			}}
		>
			<Stack
				onMouseEnter={() => setAnimate(false)}
				onMouseLeave={() => setAnimate(true)}
				sx={{
					justifyContent: 'center',
					alignItems: 'center',
					background: `url(${category.image}) no-repeat`,
					backgroundPosition: 'center center',
					backgroundSize: 'cover',
					width: '100%',
					height: '100%',
					'&:hover': {
						cursor: 'pointer',
						transition: 'all 1s',
					},
				}}
			>
				<Typography
					variant='h5'
					textTransform='initial'
					color='secondary.main'
				>
					{category.name}
				</Typography>
				<Button variant='contained' color='primary'>
					<Typography
						variant='body1'
						textTransform='initial'
						onClick={() => router.push(`/products/${category._id}`)}
					>
						Browse now
					</Typography>
				</Button>
			</Stack>
		</Stack>
	);
};

export default Card;
