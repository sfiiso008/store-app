import * as React from 'react';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
import Link from 'next/link';
// @store
import { useStore } from '@/store/session';
// @mui
import {
	MenuItem,
	Tooltip,
	Button,
	Avatar,
	Container,
	Box,
	AppBar,
	Menu,
	Typography,
	IconButton,
	Stack,
	Hidden,
	InputBase,
	Badge,
} from '@mui/material';
// @mui-icons
import {
	ShoppingBasket,
	Adb as AdbIcon,
	Menu as MenuIcon,
	Search as SearchIcon,
	Favorite,
} from '@mui/icons-material';

const pages = [
	{
		name: 'Home',
		path: '/',
	},
	{ name: 'Products', path: '/products' },
	{ name: 'About', path: '/about' },
	{ name: 'Contact', path: '/contact' },
];

const ResponsiveAppBar = () => {
	const { user, logout, isAuthenticated, cart, getTotal } = useStore(
		useShallow((state) => ({
			user: state.user,
			logout: state.logout,
			isAuthenticated: state.isAuthenticated,
			cart: state.cart,
			getTotal: state.getTotal,
		}))
	);

	const router = useRouter();

	const [cartTotalItems, setCartTotalItems] = React.useState<number>(0);

	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);

	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const signOut = async () => {
		await logout();
		handleCloseUserMenu();
		router.push('/');
	};

	React.useEffect(() => {
		const handleGetTotalItems = async () => {
			const res = await getTotal({ userId: user._id as string });

			if (res?.success) {
				setCartTotalItems(res?.totals.totalNumberOfItems);
			}
		};

		handleGetTotalItems();
	}, [cart, getTotal, user._id]);

	return (
		<AppBar position='static'>
			<Container maxWidth='xl'>
				<Stack direction='row' alignItems='center'>
					<Typography
						variant='h6'
						noWrap
						component='a'
						href='/'
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						Store-y
					</Typography>
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: 'flex', md: 'flex' },
						}}
					>
						<Hidden mdUp>
							<IconButton
								size='large'
								aria-label='account of current user'
								aria-controls='menu-appbar'
								aria-haspopup='true'
								onClick={handleOpenNavMenu}
								color='inherit'
							>
								<MenuIcon />
							</IconButton>
						</Hidden>

						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem
									key={page.name}
									onClick={handleCloseNavMenu}
								>
									<Typography
										onClick={() =>
											router.push(`/${page.path}`)
										}
									>
										{' '}
										{page.name}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<Typography
						variant='h5'
						noWrap
						component='a'
						href='/'
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						Store-y
					</Typography>
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: 'none', md: 'flex' },
						}}
					>
						{pages.map((page) => (
							<Button
								key={page.name}
								onClick={handleCloseNavMenu}
								sx={{
									my: 2,
									color: 'white',
									display: 'block',
									fontSize: '1.5rem',
									fontWeight: 700,
								}}
							>
								<Typography
									onClick={() => router.push(`/${page.path}`)}
								>
									{page.name}
								</Typography>
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Stack direction='row'>
							<IconButton
								sx={{ p: 1 }}
								onClick={() => router.push('/favorites')}
							>
								<Favorite
									sx={{
										fontSize: '3rem',
										color: 'secondary.main',
									}}
								/>
							</IconButton>
							<IconButton
								sx={{ p: 1 }}
								onClick={() => router.push('/cart')}
							>
								<Badge
									color='secondary'
									badgeContent={cartTotalItems}
									sx={{
										color: 'red',
										'& .MuiBadge-badge': {
											color: 'lightgreen',
											backgroundColor: 'green',
											fontSize: '1rem',
										},
									}}
								>
									<ShoppingBasket
										sx={{
											fontSize: '3rem',
											color: 'secondary.main',
										}}
									/>
								</Badge>
							</IconButton>

							{isAuthenticated ? (
								<Tooltip title='Open settings'>
									<IconButton
										onClick={handleOpenUserMenu}
										sx={{ pl: 2 }}
									>
										<Avatar
											alt={`${user?.firstName} ${user.lastName}`}
											src={user.profilePicture || ''}
										/>
									</IconButton>
								</Tooltip>
							) : (
								<Button>
									<Typography
										variant='body1'
										color='secondary.main'
										onClick={() => router.push('/login')}
									>
										Login
									</Typography>
								</Button>
							)}
							<Menu
								sx={{ mt: '45px' }}
								id='menu-appbar'
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem>
									<Link
										href='/profile'
										style={{
											textDecoration: 'none',
											color: '#333',
										}}
									>
										<Typography textAlign='center'>
											Profile
										</Typography>
									</Link>
								</MenuItem>
								<MenuItem>
									<Link
										href='/account'
										style={{
											textDecoration: 'none',
											color: '#333',
										}}
									>
										<Typography textAlign='center'>
											Account
										</Typography>
									</Link>
								</MenuItem>
								<MenuItem>
									<Link
										href='/favorites'
										style={{
											textDecoration: 'none',
											color: '#333',
										}}
									>
										<Typography textAlign='center'>
											Wishlist
										</Typography>
									</Link>
								</MenuItem>
								<MenuItem onClick={signOut}>
									<Typography textAlign='center'>
										Logout
									</Typography>
								</MenuItem>
							</Menu>
						</Stack>
					</Box>
				</Stack>
			</Container>
		</AppBar>
	);
};

export default ResponsiveAppBar;
