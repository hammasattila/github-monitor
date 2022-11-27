import { useLazyQuery, useQuery } from "@apollo/client";
import { AppSelector, ArrayElement, definedNN } from "../app/types";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { addNotification, errorNotification } from "../features/notificationSlice";
import { ContribsDocument, ContribsQuery, LatestCommitForRepoDocument, LatestCommitForRepoQuery } from "../api/graphql";
import { Commit, Repo } from "../api/types";
import { EuiAvatar, EuiLink, EuiLoadingSpinner } from "@elastic/eui";
import { PaginatedTable } from "./PaginatedTable";
import { useState } from "react";
import { useCommits } from "../hooks/Commits";
import moment from "moment";
import { ContributionGraphs } from "./ContributionGraphs";

type RepoWLatestCommit = Repo<LatestCommitForRepoQuery['node']>
type Branch = NonNullable<RepoWLatestCommit['defaultBranchRef']>
type LatestCommit = Commit<Branch['target']>

type LatestCommitByID = Commit<ContribsQuery['node']>
type HistoryCommit = NonNullable<ArrayElement<NonNullable<LatestCommitByID['history']['nodes']>>>
export type Contrib = NonNullable<NonNullable<HistoryCommit['author']>['user']>


export const ContributorList = () => {
	const navi = AppSelector((state) => state.navigation);
	const dispatch: AppDispatch = useDispatch();
	const initialPageSize = 5; //0 = all, < 10
	
	const {loading: loadingCommit, error: errorCommit} = useQuery(LatestCommitForRepoDocument, {
		variables: {repoId: navi.selectedRepo ?? ""},
		errorPolicy: "all",
		onCompleted: getContribs
	});
	
	function getContribs(data: LatestCommitForRepoQuery) {
		const repo = data.node as Repo<LatestCommitForRepoQuery['node']>
		const branch = repo.defaultBranchRef as Branch;
		const latestCommit = branch.target as LatestCommit;
		queryContribs({variables: {commitId: latestCommit.id}})
	}
	
	const [queryContribs, {
		loading: loadingContribs,
		error: errorContribs,
		data: dataContribs
	}] = useLazyQuery(ContribsDocument, {defaultOptions: {errorPolicy: "all"}});
	
	if (errorContribs) dispatch(addNotification(errorNotification(errorContribs.message)));
	if (errorCommit) dispatch(addNotification(errorNotification(errorCommit.message)));
	
	const latestCommitByID = dataContribs?.node as LatestCommitByID;
	const historyCommits = latestCommitByID?.history.nodes as HistoryCommit[];
	const allcontribs = historyCommits?.filter(definedNN).map((c) => c.author?.user).filter(definedNN) as Contrib[]
	const contribs = allcontribs?.reduce((acc: { [id: string]: Contrib }, c: typeof allcontribs[0]) => {
		if (!acc[c.id]) {
			acc[c.id] = c;
		}
		return acc
	}, {})
	const contribdata = contribs ? Object.keys(contribs).map((id) => ({
		id: id,
		user: contribs[id]
	})) : []
	
	const totalItemCount = contribdata.length;
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(initialPageSize);
	
	const items = contribdata.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
	const contributions = useCommits(items, latestCommitByID?.id);
	const columns = [
		{
			field: 'user',
			name: 'User',
			render: ({name, login, avatarUrl}: Contrib) => (
				<><EuiAvatar name={name ?? login} imageUrl={avatarUrl} style={{marginRight: '10px'}}/>
					<EuiLink href={`https://github.com/${login}`} target="_blank">
						{name ?? login}
					</EuiLink></>
			)
		},
		{
			field: 'id',
			name: 'Commits',
			render: (id: string) => {
				const data = contributions[id]
				if (!data)
					return <EuiLoadingSpinner/>;
				return `${data.total.count}`;
			}
		},
		{
			field: 'id',
			name: 'Additions',
			render: (id: string) => {
				const data = contributions[id]
				if (!data)
					return <EuiLoadingSpinner/>;
				return `${data.total.additions}`;
			}
		},
		{
			field: 'id',
			name: 'Deletions',
			render: (id: string) => {
				const data = contributions[id]
				if (!data)
					return <EuiLoadingSpinner/>;
				return `${data.total.deletions}`;
			}
		},
		{
			field: 'id',
			name: 'Commit density',
			render: (id: string) => {
				const data = contributions[id]
				if (!data)
					return <EuiLoadingSpinner/>;
				
				const days = moment(data.firstCommitDate).diff(moment(data.lastCommitDate), 'days') + 1;
				const commitsPerDay = data.total.count / days;
				
				if (commitsPerDay < 0.5) {
					return `${(commitsPerDay * 7).toFixed(2)} commits/week`;
				} else {
					return `${commitsPerDay.toFixed(1)} commits/day`;
				}
			}
		}
	];
	
	const handleExpand = (item: typeof items[0]) => <ContributionGraphs aggregatedCommits={contributions[item.id]}/>
	
	return (
		<PaginatedTable<typeof items[0]>
			pageOfItems={items ?? []}
			columns={columns}
			itemName="Contributors"
			totalItemCount={totalItemCount}
			itemsPerPageOptions={[50, 20, 10, initialPageSize]}
			loading={loadingCommit || loadingContribs}
			onChange={async (p) => {
				setPageIndex(p.index)
				setPageSize(p.size)
				return true
			}}
			onExpand={handleExpand}
		/>
	);
}
