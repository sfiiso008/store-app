import React, { useState, useEffect } from 'react';
import {
	Box,
	Pagination,
	Slide,
	styled,
	Stack,
	useMediaQuery,
	useTheme,
	Fade,
	Grow,
} from '@mui/material';
import { ICategory } from '@/store/types';
import Card from './card';

const CarouselContainer = styled('div')({
	width: '100%',
	height: '100%',
	overflow: 'hidden',
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
});

const Carousel = ({ categories }: { categories: ICategory[] }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const [animate, setAnimate] = useState(true);

	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
	const totalItems = categories.length;

	useEffect(() => {
		if (!animate) return;

		const interval = setInterval(goToNext, 5000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	const goToNext = () => {
		setCurrentPage((prevPage) => (prevPage + 1) % totalItems);
	};

	const startIndex =
		(currentPage + totalItems - (itemsPerPage - 1)) % totalItems;
	const visibleItems = Array.from(
		{ length: itemsPerPage },
		(_, index) => categories[(startIndex + index) % totalItems]
	);

	return (
		<Box
			display='flex'
			alignItems='center'
			justifyContent='center'
			flexDirection='column'
		>
			<CarouselContainer>
				{visibleItems.map((item, index) => (
					<Grow key={index} in={true}>
						<Stack
							direction={isMobile ? 'column' : 'row'}
							spacing={2}
							justifyContent='center'
							alignItems='center'
							p={2}
						>
							<Card category={item} setAnimate={setAnimate} />
						</Stack>
					</Grow>
				))}
			</CarouselContainer>
		</Box>
	);
};

export default Carousel;
