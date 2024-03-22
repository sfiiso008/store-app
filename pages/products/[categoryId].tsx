import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next/types';
// @mui
import { Stack, Typography } from '@mui/material';
// @api
import { apiFunctions } from '@/pages/api';
// @types
import { ICategory, IProduct } from '@/store/types';
// @components
import Products from '@/components/products';

const Categories = ({ category }: { category: ICategory }) => {
	const [allProducts, setAllProducts] = React.useState<IProduct[] | []>([]);
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		if (category) {
			setLoading(true);

			const handleGetProducts = async () => {
				const res = await apiFunctions.getProducts(category.id);

				if (res) {
					setAllProducts(res.data);
				}
			};

			handleGetProducts();
		}
		setLoading(false);
	}, [category]);

	return loading ? (
		<Typography variant='h3'>Loading...</Typography>
	) : (
		<Stack direction='row' spacing={2} width='100vw' px={2}>
			<Stack width={{ xl: '20vw', lg: '20vw', md: '30vw' }}>
				<Typography variant='body1'>{`Home/Products/${category.name}`}</Typography>
				{/* <Typography variant='h3'>Sidebar</Typography> */}
			</Stack>
			<Products products={allProducts} categoryName={category.name} />
		</Stack>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { params } = context;
	const categoryId = params?.categoryId;

	const category = await apiFunctions.getCategory(Number(categoryId));

	return {
		props: {
			category: category?.data,
		},
		revalidate: 600,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const categories = await apiFunctions.getCategories();

	const paths = categories?.data?.map((categories: ICategory) => ({
		params: { categoryId: categories.id.toString() },
	}));

	return {
		paths,
		fallback: false,
	};
};

export default Categories;
