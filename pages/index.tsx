import React from 'react';
// @mui
import { Stack } from '@mui/material';
import Categories from '@/components/categories';
// @api
import { apiFunctions } from '@/pages/api';
// @components
import Features from '@/components/features';
import Footer from '@/components/footer';

export interface IData {
	id: number;
	name: string;
	image: string;
	creationAt: string;
	updatedAt: string;
}

const HomePage = ({ categories }: { categories: IData[] }) => {
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
	const categories = await apiFunctions.getCategories();

	return {
		props: {
			categories: categories?.data || [],
		},
	};
};

export default HomePage;
