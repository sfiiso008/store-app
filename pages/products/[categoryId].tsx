import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next/types';
// @mui
import { Stack, Typography, Collapse, Button, Chip } from '@mui/material';
// @mui-icons
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
// @api
import { apiFunctions } from '@/pages/api';
// @types
import { ICategory, IProduct } from '@/store/types';
// @components
import Products from '@/components/products';
import ExpandMore from '@/components/expand-more';

const Categories = ({ category }: { category: ICategory }) => {
	const [allSubCategories, setAllSubCategories] = React.useState<
		{ _id: string; name: string }[]
	>([]);

	const [selectedSubCategory, setSelectedSubCategory] = React.useState<
		string | null
	>(null);

	const [allProducts, setAllProducts] = React.useState<IProduct[]>([]);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [expanded, setExpanded] = React.useState<boolean>(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleFilterClick = (subCategoryId: string) => {
		setSelectedSubCategory(subCategoryId);
	};

	const resetFilter = () => {
		setSelectedSubCategory(null);
	};

	React.useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				if (selectedSubCategory) {
					const res = await apiFunctions.getSubCategoryWithProducts(
						selectedSubCategory
					);
					setAllProducts(res?.products || []);
				} else {
					const res = await apiFunctions.getCategoryWithProducts(
						category._id
					);
					setAllProducts(res?.products);
					setAllSubCategories(res?.subCategories);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [category._id, selectedSubCategory]);

	return (
		<Stack direction='row' spacing={2} width='100vw' px={2}>
			<Stack width={{ xl: '20vw', lg: '20vw', md: '30vw' }}>
				<Typography variant='body1'>Home/Products</Typography>
				<Stack mt={5} justifyContent='center' alignContent='center'>
					<Typography variant='body1'>Filter</Typography>
					<ExpandMore
						expand={expanded}
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label='show more'
					>
						<ExpandMoreIcon />
					</ExpandMore>
				</Stack>

				<Collapse in={expanded}>
					<Stack spacing={2} direction='column'>
						{allSubCategories &&
							allSubCategories.map((subCategory) => (
								<Button
									key={subCategory._id}
									onClick={() =>
										handleFilterClick(subCategory._id)
									}
									sx={{
										textTransform: 'capitalize',
										justifyContent: 'flex-start',
									}}
								>
									<Typography
										variant='body1'
										textAlign='left'
									>
										{subCategory.name}
									</Typography>
								</Button>
							))}
					</Stack>
				</Collapse>
				{selectedSubCategory && (
					<Stack spacing={2} mt={2}>
						<Chip
							label={
								<Typography>
									{allSubCategories &&
										allSubCategories.find(
											(sub) =>
												sub._id === selectedSubCategory
										)?.name}
								</Typography>
							}
							variant='outlined'
							onDelete={resetFilter}
						/>
						<Button onClick={resetFilter}>Reset filter</Button>
					</Stack>
				)}
			</Stack>
			{loading ? (
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
						Loading...
					</Typography>
				</Stack>
			) : (
				<Products products={allProducts} categoryName={category.name} />
			)}
		</Stack>
	);
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const categoryId = params?.categoryId as string;

	const category = await apiFunctions.getCategory(categoryId);

	return {
		props: {
			category: category?.data,
		},
		revalidate: 600,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const result = await apiFunctions.getCategories();
	const categories = result?.data;

	const paths = categories?.map((category: ICategory) => ({
		params: { categoryId: category._id },
	}));

	return {
		paths: paths || [],
		fallback: false,
	};
};

export default Categories;
