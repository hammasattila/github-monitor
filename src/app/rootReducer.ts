import { combineReducers } from '@reduxjs/toolkit';
import { notificationsReducer } from "../features/notificationSlice";
import { navigationReducer } from "../features/navigationSlice";

export const rootReducer = combineReducers({
	notifications: notificationsReducer,
	navigation: navigationReducer
});
export type RootState = ReturnType<typeof rootReducer>;
