import { AppSelector, definedNN } from "../app/types";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { ViewerReposDocument } from "../api/graphql";
import { EuiAvatar, EuiButton, EuiListGroup, EuiLoadingContent } from "@elastic/eui";
import { selectRepo } from "../features/navigationSlice";

export const UserRepoList = () => {
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
