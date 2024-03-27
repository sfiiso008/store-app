import React from 'react';
// @mui
import { Stack } from '@mui/material';
import Categories from '@/components/categories';
// @api
import { apiFunctions } from '@/pages/api';
// @types
import { ICategory } from '@/store/types';
// @components
import Features from '@/components/features';
import Footer from '@/components/footer';

const HomePage = ({ categories }: { categories: ICategory[] }) => {
	return (
		<Stack
			justifyContent='center'
			alignContent='center'
			alignItems='center'
			maxWidth='100vw'
			spacing={10}
		>
			<Categories categories={categories} />
			<Features />
			<Footer />
		</Stack>
	);
};

export const getStaticProps = async () => {
	const result = await apiFunctions.getCategories();

	const categories = result?.data;

	return {
		props: {
			categories: categories || [],
		},
	};
};

export default HomePage;
