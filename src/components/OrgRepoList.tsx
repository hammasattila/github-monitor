import { AppSelector, definedNN } from "../app/types";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { OrgReposDocument, OrgReposQuery } from "../api/graphql";
import { EuiAvatar, EuiButton, EuiListGroup, EuiLoadingContent } from "@elastic/eui";
import { selectRepo } from "../features/navigationSlice";
import { Org } from "../api/types";

type OrgWRepos = Org<OrgReposQuery['node']>
export const OrgRepoList = ({id}: { id: string }) => {
	const navi = AppSelector((state) => state.navigation);
	const dispatch: AppDispatch = useDispatch();
	
	const {loading, error, data, fetchMore} = useQuery(OrgReposDocument, {variables: {id: id, first: 5}});
	if (loading) return <EuiLoadingContent lines={5}/>;
	if (error) return <p>Unable to load repositories</p>;
	const org = data?.node as OrgWRepos;
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
			const org = fetchMoreResult.node as OrgWRepos;
			const oldorg = previousResult.node as OrgWRepos;
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
