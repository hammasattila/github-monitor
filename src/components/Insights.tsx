import { useQuery } from "@apollo/client";
import { AppSelector, ArrayElement, definedNN } from "../app/types";
import { EuiAvatar, EuiLink } from '@elastic/eui';
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { addNotification, errorNotification } from "../features/notificationSlice";
import { CollabsDocument, CollabsQuery } from "../api/graphql";
import { Page, PaginatedTable } from "./PaginatedTable";
import { useCommits } from "../hooks/Commits";
import { CommitAnalysis } from "./CommitAnalysys";
import moment from "moment";

type Repo = Extract<CollabsQuery['node'], { __typename?: 'Repository' | undefined }>
type Collab =
	NonNullable<ArrayElement<NonNullable<Repo["collaborators"]>['nodes']>>
	& { userinfo?: { name?: string | null, login: string, avatarUrl: string } }

export const Insights = () => {
	const navi = AppSelector((state) => state.navigation);
	const dispatch: AppDispatch = useDispatch();
	const SevenDaysEarlier = new Date();
	SevenDaysEarlier.setTime(SevenDaysEarlier.getTime() - (7 * 24 * 3600000));
	const initialPageSize = 2; //0 = all !! NEVER set it 0
	const { loading, error, data, refetch, fetchMore } = useQuery(CollabsDocument, {
		variables: {
			id: navi.selectedRepo ?? "",
			//since: SevenDaysEarlier,
			first: initialPageSize
		},
		errorPolicy: "all"
	});
	if (error) dispatch(addNotification(errorNotification(error.message)));
	const repo = data?.node as Repo;
	const collabEdges = repo?.collaborators;
	const collabs: Collab[] = collabEdges?.nodes?.filter(definedNN) ?? [] as Collab[];
	const totalItemCount = collabEdges?.totalCount ?? 0;
	const pageOfItems: Collab[] = collabs.map((collab) => {
		return {
			...collab,
			userinfo: collab
		}
	});

	const { commitsByUser, agregatedCommitsByUser, loaded: loadedCommitData } = useCommits(navi.selectedRepo ?? "");

	const columns = [
		{
			field: 'userinfo',
			name: 'User',
			render: ({ name, login, avatarUrl }: { name?: string | null, login: string, avatarUrl: string }) => (
				<><EuiAvatar name={name ?? login} imageUrl={avatarUrl} style={{ marginRight: '10px' }} />
					<EuiLink href={`https://github.com/${login}`} target="_blank">
						{name ?? login}
					</EuiLink></>
			)
		},
		{
			field: 'userinfo',
			name: 'Contribution ( Commits | Additions | Deletions )',
			render: ({ login }: { login: string }) => {
				if (!loadedCommitData) {
					return "Loading...";
				}

				const agregatedData = agregatedCommitsByUser[login];
				if (agregatedData === undefined) {
					return "Unknown";
				}

				return `C: ${agregatedData.totalCount} | A: ${agregatedData.totalAdditions} | D: ${agregatedData.totalDeletions}`;
			}
		},
		{
			field: 'userinfo',
			name: 'Commit density',
			render: ({ login }: { login: string }) => {
				if (!loadedCommitData) {
					return "Loading...";
				}

				const agregatedData = agregatedCommitsByUser[login];
				if (agregatedData === undefined) {
					return "Unknown";
				}

				const days = moment(agregatedData.firstCommitDate).diff(moment(agregatedData.lastCommitDate), 'days') + 1;
				const commitsPerDay = agregatedData.totalCount / days;
				
				if (commitsPerDay < 0.5) {
					return `${(commitsPerDay * 7).toFixed(2)} commits/week`;
				} else {
					return `${commitsPerDay.toFixed(1)} commits/day`;
				}
			}
		}
	];

	const handleChange = async (page: Page, oldpage: Page) => {
		if (oldpage.size !== page.size || page.index === 0) { //change size, first
			const res = await refetch({ first: page.size, last: null, start: null, end: null });
			return !!res.data;
		} else if (page.index + 1 === Math.ceil(totalItemCount / page.size)) { //last
			const res = await fetchMore({ variables: { first: null, last: page.size, start: null, end: null } })
			return !!res?.data;
		} else if (oldpage.index < page.index && collabEdges?.pageInfo.hasNextPage) { //forward
			const res = await fetchMore({
				variables: {
					first: page.size,
					last: null,
					start: null,
					end: collabEdges?.pageInfo.endCursor
				}
			})
			return !!res?.data;
		} else if (oldpage.index > page.index && collabEdges?.pageInfo.hasPreviousPage) { //backward
			const res = await fetchMore({
				variables: {
					first: null,
					last: page.size,
					start: collabEdges?.pageInfo.startCursor,
					end: null
				}
			})
			return !!res?.data;
		}
		return false;
	}

	const handleExpand = ({ userinfo }: Collab) =>
		<CommitAnalysis
			commits={commitsByUser[userinfo?.login ?? ""]}
			agregatedCommits={agregatedCommitsByUser[userinfo?.login ?? ""]} />

	return (
		<PaginatedTable<Collab>
			pageOfItems={pageOfItems}
			columns={columns}
			itemName="Contributors"
			totalItemCount={totalItemCount ?? 0}
			itemsPerPageOptions={[50, 20, 10, initialPageSize]}
			loading={loading}
			onChange={handleChange}
			onExpand={handleExpand}
		/>
	);
};
