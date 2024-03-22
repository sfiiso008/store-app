import React from 'react';
// @mui
import {
	Stack,
	Typography,
	Collapse,
	IconButton,
	styled,
	IconButtonProps,
	Button,
	Chip,
} from '@mui/material';
// @mui-icons
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
// @api
import { apiFunctions } from '@/pages/api';
// @components
import ProductsView from '@/components/products';
// @types
import { IProduct, ICategory } from '@/store/types';

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));

const Products = () => {
	const [products, setProducts] = React.useState<IProduct[] | []>([]);
	const [categories, setCategories] = React.useState<ICategory[] | []>([]);
	const [expanded, setExpanded] = React.useState(false);
	const [handleFilter, setHandleFilter] = React.useState(false);
	const [selectedCategory, setSelectedCategory] = React.useState<
		number | null
	>(null);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleFilterClick = (categoryId: number) => {
		setSelectedCategory(categoryId);
		setHandleFilter(true);
	};

	const resetFilter = () => {
		setSelectedCategory(null);
		setHandleFilter(false);
	};

	React.useEffect(() => {
		if (handleFilter && selectedCategory) {
			const getCategories = async () => {
				const result = await apiFunctions.getProducts(selectedCategory);

				if (result?.error) {
					console.error(result.error);
				} else {
					setProducts(result?.data || []);
				}
			};
			getCategories();
		} else {
			const getAllProducts = async () => {
				const result = await apiFunctions.getAllProducts();

				if (result?.error) {
					console.error(result.error);
				} else {
					setProducts(result?.data || []);
				}
			};
			getAllProducts();
		}
	}, [handleFilter, selectedCategory]);

	React.useEffect(() => {
		const getCategories = async () => {
			const result = await apiFunctions.getCategories();

			if (result?.error) {
				console.error(result.error);
			} else {
				setCategories(result?.data || []);
			}
		};
		getCategories();
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
							<Button
								key={category.id}
								onClick={() => handleFilterClick(category.id)}
								sx={{
									textTransform: 'capitalize',
									justifyContent: 'flex-start',
								}}
							>
								<Typography variant='body1' textAlign='left'>
									{category.name}
								</Typography>
							</Button>
						))}
					</Stack>
				</Collapse>
				{selectedCategory && (
					<Stack spacing={2} mt={2}>
						<Chip
							label={
								<Typography>
									{
										categories.find(
											(category) =>
												category.id === selectedCategory
										)?.name
									}
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
