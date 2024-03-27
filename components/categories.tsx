import React from 'react';
import { useRouter } from 'next/router';
// @mui
import { Button, Stack, Typography } from '@mui/material';
// @local
import { ICategory } from '@/store/types';
import Carousel from './carousel';

const Categories = ({ categories }: { categories: ICategory[] }) => {
	const router = useRouter();

	return (
		categories && (
			<Stack>
				<Stack
					justifyContent='center'
					alignContent='center'
					alignItems='center'
					sx={{
						height: 'auto',
						minHeight: '40vh',
					}}
				>
					<Carousel categories={categories} />
				</Stack>
			</Stack>
		)
	);
};

export default Categories;
