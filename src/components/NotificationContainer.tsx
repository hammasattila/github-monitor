import React, { FC } from 'react';
import { AppSelector } from '../app/types';
import { AppDispatch } from '../app/store';
import { useDispatch } from 'react-redux';
import { EuiGlobalToastList } from '@elastic/eui';
import { removeNotification, selectAllNotifs } from '../features/notificationSlice';

export const NotificationContainer: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const notif = AppSelector((state) => state.notifications);
	
	const toasts = selectAllNotifs(notif);
	return (
		<EuiGlobalToastList
			toasts={toasts}
			dismissToast={(t) => dispatch(removeNotification(t.id))}
			toastLifeTimeMs={4000}
		/>
	);
};
