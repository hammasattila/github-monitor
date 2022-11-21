import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiHealth, EuiText } from '@elastic/eui';
import { Panel } from "./Panel";

interface Props {
	isLoggedIn: boolean
	onLogout: () => void
}

export const ConnectionIndicator = ({isLoggedIn, onLogout}: Props) => {
	return (
		<>
			<Panel>
				<EuiFlexGroup justifyContent="spaceBetween">
					<EuiFlexItem grow={false}>
						<EuiHealth color={isLoggedIn ? 'success' : 'subdued'}>
							<EuiText size="m">{isLoggedIn ? "Connected" : "Disconnected"}</EuiText>
						</EuiHealth>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButtonIcon iconType="exit" aria-label="Logout" iconSize="m" onClick={onLogout}/>
					</EuiFlexItem>
				</EuiFlexGroup>
			</Panel>
		</>
	);
};
