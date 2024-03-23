// @mui
import { InputAdornment, styled, TextField } from '@mui/material';
// @mui-icons
import { SvgIconComponent } from '@mui/icons-material';
import { HTMLInputTypeAttribute } from 'react';

const StyledTextField = styled(TextField)(({ theme }) => ({
	width: 400,
	'& legend': { display: 'none' },
	'& .MuiInputLabel-shrink': {
		opacity: 0,
		transition: 'all 0.2s ease-in',
	},
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: 'primary.main',
		},
		'&:hover fieldset': {
			borderColor: 'primary.main',
		},
		'&.Mui-focused fieldset': {
			borderColor: 'primary.main',
		},
	},
	[theme.breakpoints.down('sm')]: {
		width: 300,
	},
}));

const CustomTextField = ({
	value,
	onChange,
	placeholder,
	disabled = false,
	icon,
	type = 'text',
	name,
}: {
	value: string;
	onChange: (...event: any[]) => void;
	placeholder: string;
	disabled?: boolean;
	icon: SvgIconComponent;
	type?: HTMLInputTypeAttribute;
	name: string;
}) => {
	const Icon = icon;
	return (
		<StyledTextField
			name={name}
			type={type}
			inputProps={{
				style: {
					color: 'primary.main',
				},
			}}
			disabled={disabled}
			fullWidth
			onChange={onChange}
			value={value}
			placeholder={placeholder}
			InputProps={{
				startAdornment: (
					<InputAdornment
						position='start'
						sx={{
							color: 'primary.main',
						}}
					>
						<Icon />
					</InputAdornment>
				),
			}}
		/>
	);
};

export default CustomTextField;
