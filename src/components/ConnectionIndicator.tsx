import React, { FC } from 'react';
import { EuiHealth, EuiText } from '@elastic/eui';
import { Panel } from './Panel';

interface Props {
	isLoggedIn: boolean
}

export const ConnectionIndicator: FC<Props> = ({isLoggedIn}: Props) => {
	/*const [alreadyConnected, setConnected] = useState(false);
	const [connectionState, setConnectionState] = useState(false);
	/*
	usffect(() => {
			const onDc = (): void => setConnected(false);
			const onC = (): void => setConnected(true);
			const onRC = (store: AppStore): void => {
					store.dispatch(
							addNotification(
									warningNotification(
											'Server connection lost! Reconnecting..'
									)
							)
					);
			};
			const onDcD = (store: AppStore): void => {
					if (alreadyConnected)
							store.dispatch(
									addNotification(
											errorNotification(
													'Failed to restore connection to server! Please login again!'
											)
									)
							);
			};
			const onST = (
					store: AppStore,
					state: HubConnectionState
					//err?: Error
			): void => {
					setConnectionState(state);
					// if (err)
					//     store.dispatch(addNotification(errorNotification(err.message)));
			};
			SignalR.on('StateChange', onST)
					.on(HubConnectionState.Connected, onC)
					.on(HubConnectionState.Reconnecting, onRC)
					.on(HubConnectionState.Disconnecting, onDc)
					.on(HubConnectionState.Disconnected, onDcD);
			return () => {
					SignalR.off('StateChange', onST)
							.off(HubConnectionState.Connected, onC)
							.off(HubConnectionState.Reconnecting, onRC)
							.off(HubConnectionState.Disconnecting, onDc)
							.off(HubConnectionState.Disconnected, onDcD);
			};
	});
	
	switch (connectionState) {
			case HubConnectionState.Disconnected:
					if (alreadyConnected) color = 'danger';
					else color = 'subdued';
					break;
			case HubConnectionState.Connected:
					color = 'success';
					break;
			case HubConnectionState.Disconnecting:
					break;
			case HubConnectionState.Connecting:
			case HubConnectionState.Reconnecting:
					color = 'warning';
					break;
	}*/
	let color = 'subdued';
	let connectionState = "Disconnected";
	if (isLoggedIn) {
		color = 'success';
		connectionState = "Connected"
	}
	
	return (
		<Panel>
			<EuiHealth color={color}>
				<EuiText size="m">{connectionState}</EuiText>
			</EuiHealth>
		</Panel>
	);
};
