import { RootState } from "./rootReducer";
import { useSelector } from "react-redux";
import { AnyAction, AsyncThunk, AsyncThunkPayloadCreator, createAsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";

export const defined = <T>(x: T | undefined): x is T => x !== undefined;

export const AppSelector: <T = unknown>(
	selector: (state: RootState) => T
) => T = <T>(selector: (state: RootState) => T) =>
	useSelector<RootState, T>(selector);

export interface ThunkError {
	error: string;
}

export interface AppStore {
	dispatch: ThunkDispatch<GetState<ThunkConfig<ThunkError>>,
		GetExtra<ThunkConfig<ThunkError>>,
		AnyAction>;
	getState: () => RootState;
}

export interface ThunkConfig<E> {
	dispatch: AppDispatch;
	state: RootState;
	rejectValue: E;
}

export const createThunk: <Returned = void, ThunkArg = void, E = ThunkError>(
	typePrefix: string,
	payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkConfig<E>>
) => AsyncThunk<Returned, ThunkArg, ThunkConfig<E>> = createAsyncThunk;

//RTK types not exported
declare type GetExtra<ThunkApiConfig> = ThunkApiConfig extends {
		extra: infer Extra;
	}
	? Extra
	: unknown;

declare type GetState<ThunkApiConfig> = ThunkApiConfig extends {
		state: infer State;
	}
	? State
	: unknown;
