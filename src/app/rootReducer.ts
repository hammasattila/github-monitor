import { combineReducers } from '@reduxjs/toolkit';
import { notificationsReducer } from "../features/notificationSlice";


export const rootReducer = combineReducers({
//    messages: messagesReducer,
	notifications: notificationsReducer
	
});
export type RootState = ReturnType<typeof rootReducer>;
