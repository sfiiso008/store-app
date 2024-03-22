import React from 'react';
import { useShallow } from 'zustand/react/shallow';
// @store
import { useStore } from '@/store/session';
// @mui
import { Stack } from '@mui/material';
// @components
import UpdateAccount from '@/components/update-account';

const AccountDetails = () => {
	const { user } = useStore(
		useShallow((state) => ({
			user: state.user,
		}))
	);

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
			<UpdateAccount user={user} />
		</Stack>
	);
};

export default AccountDetails;
