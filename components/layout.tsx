import React from 'react';
// @mui
import { Stack } from '@mui/material';
import NavBar from './nav-bar';

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Stack>
			<NavBar />
			<Stack>{children}</Stack>
		</Stack>
	);
};

export default Layout;
