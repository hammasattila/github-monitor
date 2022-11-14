import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { createEntityAdapter, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export const errorNotification = (text: string): Notification => {
	return {
		title: 'Error',
		text: text,
		color: 'danger',
		iconType: 'cross'
	};
};

export const warningNotification = (text: string): Notification => {
	return {
		title: 'Warning',
		text: text,
		color: 'warning',
		iconType: 'alert'
	};
};

export const successNotification = (text: string): Notification => {
	return {
		title: 'Success',
		text: text,
		color: 'success',
		iconType: 'check'
	};
};

export type Notification = Omit<Toast, 'id'>;
const notificationAdapter = createEntityAdapter<Toast>();
const initialState = notificationAdapter.getInitialState();
const notificationSlice = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		addNotification: (state, action: PayloadAction<Notification>) => {
			notificationAdapter.addOne(state, {
				id: nanoid(),
				...action.payload
			});
		},
		removeNotification: notificationAdapter.removeOne,
		clearNotifications: notificationAdapter.removeAll
	}
});

export const {
	addNotification,
	removeNotification,
	clearNotifications
} = notificationSlice.actions;
export const {
	selectById: selectNotifById,
	selectIds: selectNotifIds,
	selectEntities: selectNotifEntities,
	selectAll: selectAllNotifs,
	selectTotal: selectTotalNotifs
} = notificationAdapter.getSelectors();
export const notificationsReducer = notificationSlice.reducer;
