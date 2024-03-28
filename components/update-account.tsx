import React from 'react';
import { useShallow } from 'zustand/react/shallow';
// @store
import { useStore } from '@/store/session';
// @form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @types
import { TUserData } from '@/store/types';
// @mui
import {
	Stack,
	Typography,
	Skeleton,
	styled,
	Avatar,
	Collapse,
	Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// @mui-icons
import {
	PersonOutline,
	MailOutlineOutlined,
	CloudUpload,
} from '@mui/icons-material';
// @ui
import CustomTextField from './textfield';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

interface IFormValues {
	lastName: string;
	firstName: string;
	email: string;
}

const validationSchema = Yup.object().shape({
	firstName: Yup.string().label('First Name').required(),
	lastName: Yup.string().label('Last Name').required(),
	email: Yup.string().email().lowercase().required().label('Email address'),
});

const AccountDetails = ({ user }: { user: TUserData }) => {
	const [error, setError] = React.useState<string | null>(null);

	const { updateUser, updateProfilePic } = useStore(
		useShallow((state) => ({
			updateUser: state.updateUser,
			updateProfilePic: state.updateProfilePic,
		}))
	);

	const [isLoading, setLoading] = React.useState(false);
	const [fileLoading, setFileLoading] = React.useState(false);

	const defaultValues = {
		firstName: user.firstName || '',
		lastName: user.lastName || '',
		email: user.email || '',
	};

	const { handleSubmit, control } = useForm<IFormValues>({
		resolver: yupResolver(validationSchema),
		defaultValues,
	});

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setFileLoading(true);

		if (user._id) {
			if (e.target.files) {
				const result = await updateProfilePic(
					e.target.files as FileList,
					user._id as string
				);

				if (!result?.success) {
					setError(result?.message as string);
				}
			}
		}
		setFileLoading(false);
	};

	const updateDetails = async (payload: IFormValues) => {
		setLoading(true);

		if (user._id) {
			const result = await updateUser(user._id as string, payload);

			if (!result?.success) {
				setError(result?.message as string);
			}
		}

		setLoading(false);
	};

	return (
		<Stack
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				mt: { xl: 10, lg: 0, xs: 10 },
				width: '100%',
			}}
			spacing={2}
		>
			<Stack>
				<Typography
					variant='body1'
					textAlign='center'
					color='primary.main'
				>
					Manage your account details
				</Typography>
			</Stack>
			<Stack>
				{!user?.profilePicture ? (
					<Skeleton
						variant='circular'
						width={220}
						height={220}
						sx={{
							bgcolor: 'primary.main',
						}}
						animation='pulse'
					/>
				) : (
					<Avatar
						src={user.profilePicture}
						sx={{
							width: 220,
							height: 220,
						}}
					/>
				)}
				<LoadingButton
					component='label'
					role={undefined}
					endIcon={<CloudUpload />}
					sx={{
						mt: 1,
					}}
					loading={fileLoading}
				>
					Change Photo
					<VisuallyHiddenInput
						type='file'
						onChange={handleFileChange}
					/>
				</LoadingButton>
			</Stack>
			<Stack spacing={2}>
				<Controller
					name='firstName'
					control={control}
					rules={{ required: true }}
					render={({ field: { onChange, value } }) => {
						return (
							<CustomTextField
								value={value}
								onChange={onChange}
								placeholder='Type your first name'
								icon={PersonOutline}
								type='text'
								name='firstName'
							/>
						);
					}}
				/>
				<Controller
					name='lastName'
					control={control}
					rules={{ required: true }}
					render={({ field: { onChange, value } }) => {
						return (
							<CustomTextField
								value={value}
								onChange={onChange}
								placeholder='Type your last name'
								icon={PersonOutline}
								type='text'
								name='lastName'
							/>
						);
					}}
				/>
				<Controller
					name='email'
					control={control}
					rules={{ required: true }}
					render={({ field: { onChange, value } }) => {
						return (
							<CustomTextField
								value={value}
								onChange={onChange}
								placeholder='Type your email'
								icon={MailOutlineOutlined}
								type='email'
								name='email'
							/>
						);
					}}
				/>
			</Stack>
			<Collapse in={error != null} sx={{ width: '100%' }}>
				<Alert sx={{ width: '100%' }} severity='error'>
					{error}
				</Alert>
			</Collapse>
			<LoadingButton
				variant='contained'
				size='large'
				sx={{
					width: 200,
				}}
				loading={isLoading}
				onClick={handleSubmit(updateDetails)}
			>
				<Typography variant='body1'>Update details</Typography>
			</LoadingButton>
		</Stack>
	);
};

export default AccountDetails;
