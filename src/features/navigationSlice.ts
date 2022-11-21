import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
	selectedRepo: string
}

const initialState: State = ({selectedRepo: ""});
const navigationSlice = createSlice({
	name: 'navigation',
	initialState,
	reducers: {
		selectRepo: (state, action: PayloadAction<string>) => {
			state.selectedRepo = action.payload;
		}
	}
});

export const {
	selectRepo
} = navigationSlice.actions;
export const navigationReducer = navigationSlice.reducer;
