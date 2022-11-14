import React, { FC, useState } from 'react';
import {
	EuiButton,
	EuiEmptyPrompt,
	EuiPage,
	EuiPageBody,
	EuiPageHeader,
	EuiPageSection,
	EuiPageSidebar
} from '@elastic/eui';
import { LoginData } from "../components/GithubLogin";
import { ApolloProvider, useQuery } from "@apollo/client";
import { GraphQL } from "../services/GraphQLService";
import { Panel } from "../components/Panel";
import { Sidebar } from "../components/Sidebar";
import { AppDispatch } from "./store";
import { NotificationContainer } from "../components/NotificationContainer";
import {
	addNotification,
	clearNotifications,
	errorNotification,
	successNotification
} from "../features/notificationSlice";
import { useDispatch } from "react-redux";
import { graphql } from "../api";

//import '@elastic/eui/dist/eui_theme_light.css'; //Light theme
import '@elastic/eui/dist/eui_theme_dark.css'; //Dark theme
import './App.css';

export const App: FC = () => {
	const [token, setToken] = useState(process.env.GITHUB_ACCESS_TOKEN);
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

    const test = graphql(/* GraphQL */`
        query test {
            repository(owner:"octocat", name:"Hello-World") {
                issues(last:20, states:CLOSED) {
                    edges {
                        node {
                            title
                            url
                            labels(first:5) {
                                edges {
                                    node {
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
		`);
    const test2 = graphql(/* GraphQL */`
        query test2 {
            viewer {
		            organizations(first:5) {
				            nodes {
						            name
						            url
                    }
		            }
		            repositories(first: 4){
				            nodes {
						            name
						            url
                    }
		            }
            }
        }
		`);
	
	function DisplayLocations() {
		const {loading, error, data} = useQuery(test);
		
		if (loading) return <p>Loading...</p>;
		if (error) return <p>Error :(</p>;
		
		console.log(data);
		return <p>asd</p>;
	}
	
	function DisplayLocations2() {
		const {loading, error, data} = useQuery(test2);
		
		if (loading) return <p>Loading...</p>;
		if (error) return <p>Error :(</p>;
		console.log(data);
		return <p>asd</p>;
	}
	
	const content = token ? (
		<Panel>
			You are logged in!
			<DisplayLocations></DisplayLocations>
			<DisplayLocations2></DisplayLocations2>
		</Panel>
	) : (
		<>
			<EuiEmptyPrompt
				title={<span>Not logged in</span>}
				body={<h3>Please log in to use the app!</h3>}
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
						<EuiPageHeader pageTitle="GitHub Monitor"/>
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
