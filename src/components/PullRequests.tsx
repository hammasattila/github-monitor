import { EuiFieldSearch, EuiIcon, EuiSpacer } from '@elastic/eui';
import { AppSelector, ArrayElement, definedNN } from "../app/types";
import { useQuery } from "@apollo/client";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { addNotification, errorNotification } from "../features/notificationSlice";
import { PRsDocument, PRsQuery } from "../api/graphql";
import { PRCommentList } from "./CommentList";
import { Page, PaginatedTable } from "./PaginatedTable";
import { useState } from "react";
import { Repo } from "../api/types";

type PRRepo = Repo<PRsQuery['node']>
type PR = NonNullable<ArrayElement<PRRepo["pullRequests"]['nodes']>> & { regexpResult?: string }

export const PullRequests = () => {
	const navi = AppSelector((state) => state.navigation);
	const dispatch: AppDispatch = useDispatch();
	const [commentRegex, setCommentRegex] = useState("");
	const initialPageSize = 5; //0 = all !! NEVER set it 0
	const {loading, error, data, fetchMore, refetch} = useQuery(PRsDocument, {
		variables: {
			id: navi.selectedRepo,
			first: initialPageSize
		},
		errorPolicy: "all"
	});
	const getRegexResult = (comment?: string) => {
		if (comment)
			try {
				const pattern = new RegExp(commentRegex);
				return pattern.exec(comment)?.join(",") ?? "no match";
			} catch (e) {
				return "invalid";
			}
		return "-";
	}
	
	if (error) dispatch(addNotification(errorNotification(error.message)));
	const repo = data?.node as PRRepo;
	const PRedges = repo?.pullRequests;
	const PRs: PR[] = PRedges?.nodes?.filter(definedNN) ?? [] as PR[];
	const totalItemCount = PRedges?.totalCount ?? 0;
	const pageOfItems: PR[] = PRs.map((pr) => ({
		...pr,
		regexpResult: getRegexResult(pr.comments.nodes?.[0]?.bodyText)
	}))
	
	const columns = [
		{
			field: 'closed',
			name: 'Open',
			render: (closed: boolean) => closed ? (<EuiIcon type="lock" color="red"/>) : (
				<EuiIcon type="lockOpen" color="green"/>),
			width: "50px"
		},
		{
			field: 'number',
			name: 'Number',
			width: "70px"
		},
		{
			field: 'title',
			name: 'Title',
			truncateText: true,
			width: "50%"
		},
		{
			field: 'author.login',
			name: 'Author'
		},
		{
			field: 'regexpResult',
			name: "Result"
		}
	];
	
	const handleChange = async (page: Page, oldpage: Page) => {
		if (oldpage.size !== page.size || page.index === 0) { //change size, first
			const res = await refetch({first: page.size, last: null, start: null, end: null});
			return !!res.data;
		} else if (page.index + 1 === Math.ceil(totalItemCount / page.size)) { //last
			const res = await fetchMore({variables: {first: null, last: page.size, start: null, end: null}})
			return !!res?.data;
		} else if (oldpage.index < page.index && PRedges?.pageInfo.hasNextPage) { //forward
			const res = await fetchMore({
				variables: {
					first: page.size,
					last: null,
					start: null,
					end: PRedges?.pageInfo.endCursor
				}
			})
			return !!res?.data;
		} else if (oldpage.index > page.index && PRedges?.pageInfo.hasPreviousPage) { //backward
			const res = await fetchMore({
				variables: {
					first: null,
					last: page.size,
					start: PRedges?.pageInfo.startCursor,
					end: null
				}
			})
			return !!res?.data;
		}
		return false;
	}
	
	const handleExpand = (pr: PR) => <PRCommentList parentId={pr.id}/>
	
	return (
		<>
			<EuiFieldSearch onChange={(e) => setCommentRegex(e.target.value)} placeholder="Search in comments"
			                value={commentRegex}/>
			<EuiSpacer size="s"/>
			<PaginatedTable<PR>
				pageOfItems={pageOfItems}
				columns={columns}
				itemName="Pull requests"
				totalItemCount={totalItemCount}
				itemsPerPageOptions={[50, 20, 10, initialPageSize]}
				loading={loading}
				onChange={handleChange}
				onExpand={handleExpand}
			/>
		</>
	)
};
