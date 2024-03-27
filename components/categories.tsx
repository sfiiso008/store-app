import React from 'react';
import { useRouter } from 'next/router';
// @mui
import { Button, Stack, Typography } from '@mui/material';
// @local
import { IData } from '@/pages';

const Categories = ({ categories }: { categories: IData[] }) => {
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
					<Stack
						direction={{
							xs: 'column',
							md: 'row',
							lg: 'row',
							sm: 'column',
						}}
						spacing={2}
						justifyContent='center'
						alignContent='center'
						alignItems='center'
						p={2}
					>
						{categories.slice(0, 3).map((currentItem) => (
							<Stack
								key={currentItem._id}
								sx={{
									width: { md: 300, lg: 400, xs: 350 },
									height: 400,
								}}
							>
								<Stack
									sx={{
										justifyContent: 'center',
										alignItems: 'center',
										background: `url(${currentItem.image}) no-repeat`,
										backgroundPosition: 'center center',
										backgroundSize: 'cover',
										width: '100%',
										height: '100%',
										'&:hover': {
											cursor: 'pointer',
											width: {
												md: 500,
												lg: 450,
												xs: 400,
											},
											height: 500,
											transition: 'all 1s',
										},
									}}
								>
									<Typography
										variant='h5'
										textTransform='initial'
										color='secondary.main'
									>
										{currentItem.name}
									</Typography>
									<Button variant='contained' color='primary'>
										<Typography
											variant='body1'
											textTransform='initial'
											onClick={() =>
												router.push(
													`/products/${currentItem._id}`
												)
											}
										>
											Browse now
										</Typography>
									</Button>
								</Stack>
							</Stack>
						))}
					</Stack>
				</Stack>
			</Stack>
		)
	);
};

export default Categories;
