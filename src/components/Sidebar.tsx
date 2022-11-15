import React, { FC } from 'react';
import { ConnectionIndicator } from './ConnectionIndicator';

import { GithubLogin, LoginData } from "./GithubLogin";
import { Panel } from "./Panel";
import { useQuery } from "@apollo/client";
import { EuiFlexGroup, EuiFlexItem, EuiImage, EuiLoadingContent, EuiText } from "@elastic/eui";
import { graphql } from "../api";
import { RepoList } from "./RepoList";

interface Props {
	isLoggedIn: boolean
	onLogin: (data: LoginData) => void
	onLogout: () => void
}

export const Sidebar: FC<Props> = ({isLoggedIn, onLogin, onLogout}: Props) => {
    const user = graphql(/* GraphQL */`
        query user {
            viewer {
                id
                name
                login
                avatarUrl
            }
        }
		`);
	
	function UserInfo() {
		const {loading, error, data} = useQuery(user);
		
		if (loading) return <EuiLoadingContent lines={2}/>;
		if (error) return <p>Unknown user</p>;
		return (
			<EuiFlexGroup gutterSize="s" justifyContent={"flexStart"}>
				<EuiFlexItem grow={false}>
					<EuiImage src={data?.viewer?.avatarUrl ?? ""} alt="userAvatar" hasShadow={true} size={50}/>
				</EuiFlexItem>
				<EuiFlexItem>
					<EuiText size="m">
						<b><strong>{data?.viewer?.login ?? ""}</strong></b>
					</EuiText>
					<EuiText size="s">
						{data?.viewer?.name ?? ""}
					</EuiText>
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	}
	
	return (
		<>
			<ConnectionIndicator isLoggedIn={isLoggedIn} onLogout={onLogout}/>
			{isLoggedIn ? (
				<Panel customTitle={<UserInfo/>}>
					<RepoList/>
				</Panel>
			) : (
				<GithubLogin onLogin={onLogin}/>
			)}
		</>
	);
};
