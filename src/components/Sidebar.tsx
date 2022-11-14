import React, { FC } from 'react';
import { ConnectionIndicator } from './ConnectionIndicator';

import { GithubLogin, LoginData } from "./GithubLogin";
import { EuiButton } from "@elastic/eui";
import { Panel } from "./Panel";

interface Props {
	isLoggedIn: boolean
	onLogin: (data: LoginData) => void
	onLogout: () => void
}

export const Sidebar: FC<Props> = ({isLoggedIn, onLogin, onLogout}: Props) => {
	
	/*const usersList = users.isLoading ? (
		<EuiLoadingContent lines={2} />
	) : null;*/
	
	return (
		<>
			<ConnectionIndicator isLoggedIn={isLoggedIn}/>
			{isLoggedIn ? (
				<Panel title={"GitHub"}>
					<EuiButton fill onClick={onLogout}>
						<b>Logout</b>
					</EuiButton>
				</Panel>
			
			) : (
				<GithubLogin onLogin={onLogin}/>
			)}
		</>
	);
};
