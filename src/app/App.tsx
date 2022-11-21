import { useState } from 'react';
import {
	EuiEmptyPrompt,
	EuiFlexGroup,
	EuiIcon,
	EuiLink,
	EuiPage,
	EuiPageBody,
	EuiPageHeader,
	EuiPageSection,
	EuiPageSidebar,
	EuiSpacer,
	EuiText
} from '@elastic/eui';
import { LoginData } from "../components/GithubLogin";
import { ApolloProvider } from "@apollo/client";
import { GraphQL } from "../services/GraphQLService";
import { Sidebar } from "../components/Sidebar";
import { AppDispatch } from "./store";
import { NotificationContainer } from "../components/NotificationContainer";
import { addNotification, errorNotification, successNotification } from "../features/notificationSlice";
import { useDispatch } from "react-redux";
import './App.css';
import { RepoDetails } from "../components/RepoDetails";
import { AppSelector } from "./types";

export const App = () => {
	const navi = AppSelector((state) => state.navigation);
	const [token, setToken] = useState(process.env.REACT_APP_GITHUB_ACCESS_TOKEN);
	const dispatch: AppDispatch = useDispatch();
	
	const handleLogin = (data: LoginData): void => {
		setToken(data.token);
		dispatch(addNotification(successNotification("Logged in!")));
	}
	
	const handleLogout = (): void => {
		setToken(undefined);
		dispatch(addNotification(successNotification("Logged out!")));
	}
	
	const handleLogoutWError = (): void => {
		setToken(undefined);
		dispatch(addNotification(errorNotification("Invalid Token!")));
	}
	
	const loggedInContent = navi.selectedRepo ? (
		<RepoDetails/>
	) : (
		<>
			<EuiSpacer size="l"/>
			<EuiEmptyPrompt
				title={<span>You are logged in!</span>}
				body={<h3>Please select a repo!</h3>}
				color={'plain'}
			/>
		</>
	);
	
	const content = token ? loggedInContent : (
		<>
			<EuiSpacer size="l"/>
			<EuiEmptyPrompt
				title={<span>Not logged in</span>}
				body={(<><h3>Please log in to use the app!</h3><EuiLink
					href="https://docs.github.com/en/graphql/guides/forming-calls-with-graphql">Instructions</EuiLink></>)}
				color={'plain'}
			/>
		</>
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
