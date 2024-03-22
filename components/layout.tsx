import React from 'react';
// @mui
import { Stack } from '@mui/material';
import NavBar from './nav-bar';
import Footer from './footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Stack>
			<NavBar />
			<Stack>{children}</Stack>
		</Stack>
	);
};

export default Layout;
