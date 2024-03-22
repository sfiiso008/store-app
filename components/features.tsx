import React from 'react';
// @mui
import { Typography, Card, Stack } from '@mui/material';
// @mui-icons
import { SvgIconComponent } from '@mui/icons-material';
import { AssignmentReturn, DeliveryDining, Payment } from '@mui/icons-material';

const featuresData = [
	{
		id: 1,
		icon: AssignmentReturn,
		title: '7 DAYS RETURN',
		description:
			'Simply return it within 7 days of purchase. (T&Cs apply, please check Return Policy for more details)',
	},
	{
		id: 2,
		icon: DeliveryDining,
		title: 'Free Delivery',
		description:
			'Free delivery on all orders over R600. (T&Cs apply, please check Shipping Policy for more details)',
	},
	{
		id: 3,
		icon: Payment,
		title: 'Easy Payment',
		description:
			'Flexible payment options that will have you smiling. (T&Cs apply, please check Return Policy for more details)',
	},
];

const FeatureComponent = ({
	icon,
	title,
	description,
}: {
	icon: SvgIconComponent;
	title: string;
	description: string;
}) => {
	const Icon = icon;

	return (
		<Card
			sx={{
				width: { md: 300, lg: 400 },
				height: 200,
				px: 2,
				py: 5,
			}}
		>
			<Stack
				sx={{
					justifyContent: 'center',
					alignContent: 'center',
				}}
				spacing={2}
			>
				<Stack direction='row' spacing={2} alignItems='center'>
					<Icon
						style={{
							color: '#333',
							fontSize: '5rem',
						}}
					/>
					<Typography
						variant='body1'
						sx={{
							color: '#333',
						}}
					>
						{title}
					</Typography>
				</Stack>

				<Typography color='primary.main'>{description}</Typography>
			</Stack>
		</Card>
	);
};

const Features = () => {
	return (
		<Stack>
			<Typography
				textAlign='center'
				variant='h3'
				sx={{
					color: '#333',
				}}
			>
				Our features
			</Typography>
			<Stack
				direction={{ xs: 'column', lg: 'row', md: 'row' }}
				spacing={2}
			>
				{featuresData.map((feature) => (
					<FeatureComponent
						icon={feature.icon}
						key={feature.id}
						title={feature.title}
						description={feature.description}
					/>
				))}
			</Stack>
		</Stack>
	);
};

export default Features;
