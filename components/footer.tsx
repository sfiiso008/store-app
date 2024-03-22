import React from 'react';
// @mui
import { Stack, Typography, styled } from '@mui/material';
// @api
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

const StyledInput = styled('input')({
	width: '35rem',
	height: '5rem',
	padding: '1rem',
	border: '.2rem solid #fff',
	fontSize: '1.6rem',
	fontWeight: 700,
	letterSpacing: '.1rem',
	color: '#fff',
	'&:placeholder': {
		color: '#fff',
	},
});

const Footer = () => {
	return (
		<Stack
			height={200}
			width='100vw'
			sx={{
				backgroundColor: '#222',
				position: 'relative',
				b: 0,
			}}
			spacing={3}
			mx={4}
			p={2}
		>
			<Stack
				direction='row'
				spacing={5}
				justifyContent='center'
				alignContent='center'
				alignItems='center'
			>
				<Typography variant='body1' color='secondary.main'>
					Get Connected with us on our social networks!{' '}
				</Typography>
				<Stack direction='row' spacing={2}>
					<Facebook
						sx={{ fontSize: '5rem', color: 'secondary.main' }}
					/>
					<Twitter
						sx={{ fontSize: '5rem', color: 'secondary.main' }}
					/>
					<Instagram
						sx={{ fontSize: '5rem', color: 'secondary.main' }}
					/>
				</Stack>
			</Stack>
			<Stack
				direction='row'
				justifyContent='center'
				alignContent='center'
				alignItems='center'
				spacing={2}
			>
				<Typography variant='body1' color='secondary.main'>
					Subscribe to our newsletter
				</Typography>
				<StyledInput type='email' placeholder='Enter your e-mail' />
			</Stack>
			<Typography textAlign='center' color='secondary.main'>
				Sfiso Mbonane &copy; 2024 All rights reserved
			</Typography>
		</Stack>
	);
};

export default Footer;
