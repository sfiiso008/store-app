import React from 'react';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
// @store
import { useStore } from '@/store/session';
// @form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @mui
import { Stack, Button, Typography, Collapse, Alert } from '@mui/material';
// @icons
import {
	PersonOutline,
	LockOutlined,
	MailOutlineOutlined,
	Google,
} from '@mui/icons-material';
// @components
import CustomTextField from '@/components/textfield';
import { apiFunctions } from '../api';

interface IFormValues {
	lastName: string;
	firstName: string;
	email: string;
	password: string;
}

const validationSchema = Yup.object().shape({
	firstName: Yup.string().label('First Name').required(),
	lastName: Yup.string().label('Last Name').required(),
	email: Yup.string().email().lowercase().required().label('Email address'),
	password: Yup.string().label('Password').required().min(8),
});

const Signup = () => {
	const { login, signup } = useStore(
		useShallow((state) => ({
			login: state.login,
			signup: state.signup,
		}))
	);

	const router = useRouter();

	const [loading, setLoading] = React.useState(false);

	const [error, setError] = React.useState<string | null>(null);

	const { handleSubmit, control } = useForm<IFormValues>({
		resolver: yupResolver(validationSchema),
	});

	const submit = async (data: IFormValues) => {
		setLoading(true);

		const result = await signup(data);

		if (result?.success) {
			await login({
				email: data.email,
				password: data.password,
			});

			router.push('/');
		}

		if (!result?.success) {
			setError(result?.message as string);
		}

		setLoading(false);
	};

	const SignupWithGoogle = async () => {
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
			<Typography variant='h4'>Signup</Typography>
			<Controller
				name='firstName'
				control={control}
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<CustomTextField
						value={value}
						onChange={onChange}
						placeholder='Enter your first name'
						icon={PersonOutline}
						name='firstName'
						type='firstName'
					/>
				)}
			/>
			<Controller
				name='lastName'
				control={control}
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<CustomTextField
						value={value}
						onChange={onChange}
						placeholder='Enter your last name'
						icon={PersonOutline}
						name='lastName'
						type='lastName'
					/>
				)}
			/>
			<Controller
				name='email'
				control={control}
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<CustomTextField
						value={value}
						onChange={onChange}
						placeholder='Enter your email address'
						icon={MailOutlineOutlined}
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
			<Collapse in={error != null} sx={{ width: 400 }}>
				<Alert sx={{ width: '100%' }} severity='error'>
					{error}
				</Alert>
			</Collapse>
			<Stack direction='row' spacing={2}>
				<Button
					size='large'
					variant='contained'
					sx={{
						width: { lg: 180, xs: 140 },
					}}
					onClick={handleSubmit(submit)}
					disabled={loading}
				>
					{loading === true ? 'Signing up...' : 'Sign up'}
				</Button>
				<Button
					size='large'
					variant='outlined'
					sx={{
						width: { lg: 180, xs: 140 },
					}}
					href='/login'
				>
					Login
				</Button>
			</Stack>
			<Typography>OR</Typography>
			<Button
				variant='contained'
				color='primary'
				fullWidth
				sx={{
					mt: 2,
					width: { xs: 300 },
				}}
				onClick={SignupWithGoogle}
				startIcon={<Google />}
			>
				Sign up with Google
			</Button>
			<Typography variant='body2'>
				By continuing, you agree to our Privacy & Cookie Policy and
				Terms and Conditions
			</Typography>
		</Stack>
	);
};

export default Signup;
