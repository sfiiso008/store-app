import React from 'react';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
// @store
import { useStore } from '@/store/session';
// @form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @api
import { apiFunctions } from '../api';
// @mui
import {
	Stack,
	Button,
	Typography,
	Collapse,
	Alert,
	Link,
	Hidden,
} from '@mui/material';
// @icons
import { PersonOutline, LockOutlined, Google } from '@mui/icons-material';
// @components
import CustomTextField from '@/components/textfield';

interface IFormValues {
	email: string;
	password: string;
}

const validationSchema = Yup.object().shape({
	email: Yup.string().email().lowercase().required().label('Email address'),
	password: Yup.string().label('Password').required(),
});

const Login = () => {
	const { login } = useStore(
		useShallow((state) => ({
			login: state.login,
		}))
	);

	const router = useRouter();
	const [error, setError] = React.useState<string | null>(null);

	const { handleSubmit, control } = useForm<IFormValues>({
		resolver: yupResolver(validationSchema),
	});

	const performLogin = async ({ email, password }: IFormValues) => {
		setError(null);

		const result = await login({
			email,
			password,
		});

		if (!result?.success) {
			setError(result?.message as string);
			return;
		}

		router.push('/');
	};

	const LoginWithGoogle = async () => {
		await router.push(`${apiFunctions.BaseUrl}/oauth/google`);
	};

	return (
		<Stack
			justifyContent='center'
			alignContent='center'
			alignItems='center'
			sx={{
				transform: 'translate(-50%, -50%)',
				left: '50%',
				top: '50%',
				position: 'absolute',
			}}
			spacing={2}
		>
			<Typography variant='h4'>Login</Typography>
			<form onSubmit={handleSubmit(performLogin)}>
				<Stack alignItems='center' justifyContent='center' spacing={2}>
					<Controller
						name='email'
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, value } }) => (
							<CustomTextField
								value={value}
								onChange={onChange}
								placeholder='Enter your email address'
								icon={PersonOutline}
								name='email'
								type='email'
							/>
						)}
					/>
					<Controller
						name='password'
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, value } }) => (
							<CustomTextField
								value={value}
								onChange={onChange}
								placeholder='Enter your password'
								icon={LockOutlined}
								name='password'
								type='password'
							/>
						)}
					/>

					<Collapse in={error != null} sx={{ width: '100%' }}>
						<Alert sx={{ width: '100%' }} severity='error'>
							{error}
						</Alert>
					</Collapse>
					<Stack direction='row' spacing={2}>
						<Button
							size='large'
							variant='contained'
							sx={{
								width: {
									lg: 180,
									xs: 140,
									sm: 180,
									md: 180,
									xl: 180,
								},
							}}
							type='submit'
						>
							Login
						</Button>
						<Button
							size='large'
							variant='outlined'
							sx={{
								width: { lg: 180, xs: 140, sm: 180 },
							}}
							href='/signup'
						>
							Sign up
						</Button>
					</Stack>
				</Stack>
			</form>
			<Typography>OR</Typography>
			<Button
				variant='contained'
				color='primary'
				fullWidth
				sx={{
					mt: 2,
					width: { xs: 300 },
				}}
				startIcon={<Google />}
				onClick={LoginWithGoogle}
			>
				Login with Google
			</Button>
			<Typography variant='body2'>
				By continuing, you agree to our Privacy & Cookie Policy and
				Terms and Conditions
			</Typography>
		</Stack>
	);
};

export default Login;
