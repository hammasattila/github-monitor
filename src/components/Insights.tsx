import { useQuery } from "@apollo/client";
import { AppSelector, ArrayElement, definedNN } from "../app/types";
import { EuiAvatar, EuiLink } from '@elastic/eui';
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { addNotification, errorNotification } from "../features/notificationSlice";
import { CollabsDocument, CollabsQuery } from "../api/graphql";
import { Page, PaginatedTable } from "./PaginatedTable";

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
	const {loading, error, data, refetch, fetchMore} = useQuery(CollabsDocument, {
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
	
	const columns = [
		{
			field: 'userinfo',
			name: 'User',
			render: ({name, login, avatarUrl}: { name?: string | null, login: string, avatarUrl: string }) => (
				<><EuiAvatar name={name ?? login} imageUrl={avatarUrl} style={{marginRight: '10px'}}/>
					<EuiLink href={`https://github.com/${login}`} target="_blank">
						{name ?? login}
					</EuiLink></>
			)
		}
	];
	
	const handleChange = async (page: Page, oldpage: Page) => {
		if (oldpage.size !== page.size || page.index === 0) { //change size, first
			const res = await refetch({first: page.size, last: null, start: null, end: null});
			return !!res.data;
		} else if (page.index + 1 === Math.ceil(totalItemCount / page.size)) { //last
			const res = await fetchMore({variables: {first: null, last: page.size, start: null, end: null}})
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
	
	return (
		<PaginatedTable<Collab>
			pageOfItems={pageOfItems}
			columns={columns}
			itemName="Contributors"
			totalItemCount={totalItemCount ?? 0}
			itemsPerPageOptions={[50, 20, 10, initialPageSize]}
			loading={loading}
			onChange={handleChange}
		/>
	);
};
