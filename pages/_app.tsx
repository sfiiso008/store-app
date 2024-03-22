import React from 'react';
import Head from 'next/head';
import { useShallow } from 'zustand/react/shallow';
import { useMount } from 'react-use';
// @store
import { useStore } from '@/store/session';
// @mui
import { CssBaseline, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
// @components
import Layout from '@/components/layout';
// @styles
import GlobalTheme from '@/styles/globalTheme';
import '../styles/globals.css';

function MyApp({
	Component,
	pageProps,
}: {
	Component: React.ElementType;
	pageProps: any;
}) {
	const [loader, setLoader] = React.useState('');

	const { checkAuthentication } = useStore(
		useShallow((state) => ({
			checkAuthentication: state.checkAuthentication,
		}))
	);

	useMount(() => {
		setLoader('loading');
		try {
			const authenticateUser = async () => {
				await checkAuthentication();
				setLoader('done');
			};

			authenticateUser();
		} catch (err) {
			console.log('Error in Authenticate', err);
		}
	});

	return (
		<ThemeProvider theme={GlobalTheme}>
			<CssBaseline />
			<Head>
				<title>Shop with us</title>
				<meta
					name='description'
					content='Shop with us for all your needs. We have a wide range of products for you to choose from.'
				/>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0'
				/>
			</Head>
			{loader === 'loading' && (
				<CircularProgress
					size='200px'
					sx={{
						position: 'absolute',
						top: { lg: '30%' },
						left: { lg: '45%' },
						transform: { lg: 'translate(-50%, -50%)' },
					}}
				/>
			)}
			{loader === 'done' && (
				<Layout>
					<Component {...pageProps} />
				</Layout>
			)}
		</ThemeProvider>
	);
}

export default MyApp;
