import React, { useState, useEffect } from 'react';
// @mui
import { Stack, Typography, Collapse, Button, Chip } from '@mui/material';
// @mui-icons
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
// @api
import { apiFunctions } from '@/pages/api';
// @types
import { IProduct, ICategory, ISubCategory } from '@/store/types';
// @components
import ProductsView from '@/components/products';
import ExpandMore from '@/components/expand-more';

const Products: React.FC = () => {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	);

	const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
		string | null
	>(null);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleCategoryFilterClick = (categoryId: string) => {
		setSelectedCategoryId(categoryId);
		setSelectedSubCategoryId(null);
	};

	const handleSubcategoryFilterClick = (subcategoryId: string) => {
		setSelectedSubCategoryId(subcategoryId);
	};

	const resetFilter = () => {
		setSelectedCategoryId(null);
		setSelectedSubCategoryId(null);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				let result;
				if (selectedSubCategoryId) {
					result = await apiFunctions.getSubCategoryWithProducts(
						selectedSubCategoryId
					);
				} else if (selectedCategoryId) {
					result = await apiFunctions.getCategoryWithProducts(
						selectedCategoryId
					);
					setSubCategories(result?.subCategories || []);
					setProducts(result?.products || []);
				} else {
					result = await apiFunctions.getAllProducts();
					setSubCategories([]);
					setProducts(result?.products || []);
				}
				if (result && !result.error) {
					// Only set products for subcategory if subcategory selected
					if (selectedSubCategoryId) {
						setProducts(result.products || []);
					}
				} else {
					console.error(result?.error);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [selectedCategoryId, selectedSubCategoryId]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const result = await apiFunctions.getCategories();
				if (result && !result.error) {
					setCategories(result.data || []);
				} else {
					console.error(result?.error);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};

		fetchCategories();
	}, []);

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
						{categories.map((category) => (
							<Stack key={category._id}>
								<Button
									onClick={() =>
										handleCategoryFilterClick(category._id)
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
										{category.name}
									</Typography>
								</Button>
								{selectedCategoryId === category._id && (
									<Collapse in={expanded}>
										<Stack
											spacing={2}
											direction='column'
											pl={5}
										>
											{subCategories.map(
												(subcategory) => (
													<Button
														key={subcategory._id}
														onClick={() =>
															handleSubcategoryFilterClick(
																subcategory._id
															)
														}
														sx={{
															textTransform:
																'capitalize',
															justifyContent:
																'flex-start',
														}}
													>
														<Typography
															variant='body2'
															textAlign='right'
															fontWeight='bold'
														>
															{subcategory.name}
														</Typography>
													</Button>
												)
											)}
										</Stack>
									</Collapse>
								)}
							</Stack>
						))}
					</Stack>
				</Collapse>
				{(selectedCategoryId || selectedSubCategoryId) && (
					<Stack spacing={2} mt={2}>
						<Chip
							label={
								<Typography>
									{selectedSubCategoryId
										? subCategories.find(
												(subcategory) =>
													subcategory._id ===
													selectedSubCategoryId
										  )?.name
										: categories.find(
												(category) =>
													category._id ===
													selectedCategoryId
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
			<ProductsView products={products} categoryName='All Products' />
		</Stack>
	);
};

export default Products;
