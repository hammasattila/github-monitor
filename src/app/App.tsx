import React, { FC, useState } from 'react';
import {
	EuiEmptyPrompt, EuiFlexGroup,
	EuiIcon,
	EuiPage,
	EuiPageBody,
	EuiPageHeader,
	EuiPageSection,
	EuiPageSidebar, EuiText
} from '@elastic/eui';
import { LoginData } from "../components/GithubLogin";
import { ApolloProvider } from "@apollo/client";
import { GraphQL } from "../services/GraphQLService";
import { Sidebar } from "../components/Sidebar";
import { AppDispatch } from "./store";
import { NotificationContainer } from "../components/NotificationContainer";
import {
	addNotification,
	errorNotification,
	successNotification
} from "../features/notificationSlice";
import { useDispatch } from "react-redux";
import './App.css';

export const App: FC = () => {
	const [token, setToken] = useState(process.env.REACT_APP_GITHUB_ACCESS_TOKEN);
	const dispatch: AppDispatch = useDispatch();
	
	const handleLogin = (data: LoginData): void => {
		setToken(data.token);
		dispatch(
			addNotification(successNotification("Logged in!"))
		);
	}
	
	const handleLogout = (): void => {
		setToken('');
		dispatch(
			addNotification(successNotification("Logged out!"))
		);
	}
	
	const handleLogoutWError = (): void => {
		setToken('');
		dispatch(
			addNotification(errorNotification("Invalid Token!"))
		);
	}
	
	const content = token ? (
		<EuiEmptyPrompt
			title={<span>You are logged in!</span>}
			body={<h3>Please select a repo!</h3>}
			color={'plain'}
		/>
	) : (
		<EuiEmptyPrompt
			title={<span>Not logged in</span>}
			body={<h3>Please log in to use the app!</h3>}
			color={'plain'}
		/>
	);
	
	const app = (
		<div className="App">
			<EuiPage restrictWidth={1200} paddingSize="none">
				<EuiPageSidebar paddingSize="s" minWidth={300}>
					<Sidebar isLoggedIn={!!token} onLogin={handleLogin} onLogout={handleLogout}/>
				</EuiPageSidebar>
				<EuiPageBody component="div" paddingSize="s" panelled={true}>
					<EuiPageSection bottomBorder="extended" paddingSize="s" alignment="horizontalCenter" color="plain">
						<EuiPageHeader paddingSize="s">
							<EuiFlexGroup justifyContent="spaceAround" alignItems="center">
								<EuiIcon type="logoGithub" size="xl"/>
								<EuiText><h1>GitHub Monitor</h1></EuiText>
								<EuiIcon type="desktop" size="xl"/>
							</EuiFlexGroup>
						</EuiPageHeader>
					</EuiPageSection>
					<EuiPageSection grow={false} paddingSize="s" color="plain">
						{content}
					</EuiPageSection>
				</EuiPageBody>
				<NotificationContainer/>
			</EuiPage>
		</div>
	)
	
	if (token)
		return (
			<ApolloProvider client={GraphQL.getClient(token, handleLogoutWError)}>
				{app}
			</ApolloProvider>
		)
	else return app;
}
