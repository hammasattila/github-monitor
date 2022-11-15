import React, { FC } from 'react';
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiHealth, EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';

interface Props {
	isLoggedIn: boolean
	onLogout: () => void
}

export const ConnectionIndicator: FC<Props> = ({isLoggedIn, onLogout}: Props) => {
	
	let color = 'subdued';
	let connectionState = "Disconnected";
	if (isLoggedIn) {
		color = 'success';
		connectionState = "Connected"
	}
	
	return (
		<>
			<EuiPanel>
				<EuiFlexGroup justifyContent="spaceBetween">
					<EuiFlexItem grow={false}>
						<EuiHealth color={color}>
							<EuiText size="m">{connectionState}</EuiText>
						</EuiHealth>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButtonIcon iconType="exit" aria-label="Logout" iconSize="m" onClick={onLogout}/>
					</EuiFlexItem>
				</EuiFlexGroup>
			</EuiPanel>
			<EuiSpacer size="s"/>
		</>
	);
};
