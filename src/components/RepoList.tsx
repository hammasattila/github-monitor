import {
	EuiAvatar,
	EuiCollapsibleNavGroup,
	EuiFieldSearch,
	EuiListGroup,
	EuiLoadingContent,
	EuiSpacer
} from '@elastic/eui';
import { useApolloClient, useQuery } from "@apollo/client";
import { SearchRepoDocument, SearchRepoQuery, ViewerOrgsDocument } from "../api/graphql";
import { AppSelector, definedNN } from "../app/types";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { selectRepo } from "../features/navigationSlice";
import { addNotification, errorNotification } from "../features/notificationSlice";
import { useState } from "react";
import { UserRepoList } from "./UserRepoList";
import { OrgRepoList } from "./OrgRepoList";

export const RepoList = () => {
	const navi = AppSelector((state) => state.navigation);
	const dispatch: AppDispatch = useDispatch();
	const apollo = useApolloClient();
	const [foundRepos, setFoundRepos] = useState<SearchRepoQuery['repository'][]>();
	const {loading, error, data} = useQuery(ViewerOrgsDocument, {variables: {first: 5}});
	if (loading) return <EuiLoadingContent lines={5}/>;
	if (error) return <p>Unable to load organizations</p>;
	if (!data || !data.viewer.organizations.nodes) return null;
	const orgs = data.viewer.organizations.nodes.filter(definedNN);
	
	const orgitems = orgs.map((org) => {
		return <EuiCollapsibleNavGroup
			title={org.name ?? org.login}
			key={org.id}
			iconType={() => (<EuiAvatar imageUrl={org.avatarUrl ?? ""}
			                            name={org.login} size="m"
			                            initialsLength={2} type="space" color="subdued"/>)}
			isCollapsible={true}
			initialIsOpen={false}
		>
			<OrgRepoList id={org.id}/>
		</EuiCollapsibleNavGroup>
	});
	
	const handleSearch = (value: string) => {
		const items = value.split("/");
		const owner = items.at(0)?.trim();
		const repo = items.at(1)?.trim();
		if (!owner || !repo) return;
		apollo.query({query: SearchRepoDocument, variables: {owner: owner, repo: repo}})
			.then(({data}) => {
				if (data.repository)
					setFoundRepos([...foundRepos ?? [], data.repository]);
			})
			.catch((error) => dispatch(addNotification(errorNotification(error))));
	}
	const searchResults = foundRepos && foundRepos.length > 0 ? (
		<EuiCollapsibleNavGroup><EuiListGroup listItems={foundRepos.filter(definedNN).map((repo) => {
			return {
				label: repo.name,
				icon: (<EuiAvatar imageUrl={repo.openGraphImageUrl ?? null} name={repo.name} size="s"
				                  initialsLength={2} type="space" color="subdued"/>),
				isActive: navi.selectedRepo === repo.id,
				onClick: () => dispatch(selectRepo(repo.id))
			}
		})}
		/></EuiCollapsibleNavGroup>) : null;
	return (
		<>
			<EuiFieldSearch placeholder="Owner / Repository" onSearch={handleSearch}/>
			<EuiSpacer size="s"/>
			{searchResults}
			<EuiCollapsibleNavGroup>
				<UserRepoList/>
			</EuiCollapsibleNavGroup>
			{orgitems}
		</>
	);
}
