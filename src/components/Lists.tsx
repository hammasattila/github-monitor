import {
	EuiAvatar,
	EuiButton,
	EuiCollapsibleNavGroup,
	EuiFieldSearch,
	EuiListGroup,
	EuiLoadingContent,
	EuiSpacer
} from '@elastic/eui';
import { useApolloClient, useQuery } from "@apollo/client";
import {
	OrgReposDocument,
	OrgReposQuery,
	SearchRepoDocument,
	SearchRepoQuery,
	ViewerOrgsDocument,
	ViewerReposDocument
} from "../api/graphql";
import { AppSelector, definedNN } from "../app/types";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { selectRepo } from "../features/navigationSlice";
import { addNotification, errorNotification } from "../features/notificationSlice";
import { useState } from "react";

export const OwnRepoList = () => {
	const navi = AppSelector((state) => state.navigation);
	const dispatch: AppDispatch = useDispatch();
	
	const {loading, error, data, fetchMore} = useQuery(ViewerReposDocument, {variables: {first: 5}});
	if (loading) return <EuiLoadingContent lines={5}/>;
	if (error) return <p>Unable to load repositories</p>;
	if (!data || !data.viewer.repositories.nodes) return null;
	const repos = data.viewer.repositories.nodes.filter(definedNN);
	const repoitems = repos.map((repo) => {
		return {
			label: repo.name,
			icon: <EuiAvatar imageUrl={repo.openGraphImageUrl ?? null} name={repo.name} size="s"
			                 initialsLength={2} type="space" color="subdued"/>,
			isActive: navi.selectedRepo === repo.id,
			onClick: () => dispatch(selectRepo(repo.id))
		}
	});
	const loadMore = () => fetchMore({variables: {first: 5, end: data.viewer.repositories.pageInfo.endCursor}})
	return (
		<>
			<EuiListGroup listItems={repoitems}/>
			{data.viewer.repositories.pageInfo.hasNextPage ? (
				<>
					<EuiButton fullWidth size="s" fill={false} color="text" onClick={loadMore}>Load more</EuiButton>
				</>
			) : null
			}
		</>
	);
}
type Org = Extract<OrgReposQuery['node'], { __typename?: 'Organization' | undefined }>

export const OrgRepoList = ({id}: { id: string }) => {
	const navi = AppSelector((state) => state.navigation);
	const dispatch: AppDispatch = useDispatch();
	
	const {loading, error, data, fetchMore} = useQuery(OrgReposDocument, {variables: {id: id, first: 5}});
	if (loading) return <EuiLoadingContent lines={5}/>;
	if (error) return <p>Unable to load repositories</p>;
	const org = data?.node as Org;
	if (!org || !org.repositories.nodes) return null;
	const repos = org.repositories.nodes.filter(definedNN);
	const repoitems = repos.map((repo) => {
		return {
			label: repo.name,
			icon: <EuiAvatar imageUrl={repo.openGraphImageUrl ?? null} name={repo.name} size="s"
			                 initialsLength={2} type="space" color="subdued"/>,
			isActive: navi.selectedRepo === repo.id,
			onClick: () => dispatch(selectRepo(repo.id))
		}
	});
	
	const loadMore = () => fetchMore({
		variables: {end: org.repositories.pageInfo.endCursor},
		updateQuery: (previousResult, {fetchMoreResult}) => {
			const org = fetchMoreResult.node as Org;
			const oldorg = previousResult.node as Org;
			return org.repositories.nodes
				? {
					node: {
						__typename: org.__typename,
						id: org.id,
						repositories: {
							__typename: org.repositories.__typename,
							nodes: [...oldorg.repositories?.nodes?.filter(definedNN) ?? [], ...org.repositories.nodes.filter(definedNN)],
							pageInfo: org.repositories.pageInfo,
							totalCount: org.repositories.totalCount
						}
					}
				}
				: previousResult;
		}
	});
	return (
		<>
			<EuiListGroup listItems={repoitems}/>
			{org.repositories.pageInfo.hasNextPage ? (
				<>
					<EuiButton fullWidth size="s" fill={false} color="text" onClick={loadMore}>Load more</EuiButton>
				</>
			) : null
			}
		</>
	);
}

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
				<OwnRepoList/>
			</EuiCollapsibleNavGroup>
			{orgitems}
		</>
	);
}
