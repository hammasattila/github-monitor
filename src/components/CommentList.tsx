import { EuiAvatar, EuiCommentList, EuiCommentProps, EuiFlexGroup, EuiLoadingSpinner, EuiText } from '@elastic/eui';
import { useQuery } from "@apollo/client";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { addNotification, errorNotification } from "../features/notificationSlice";
import { PRCommentsDocument, PRCommentsQuery } from "../api/graphql";
import { ArrayElement, definedNN } from "../app/types";

interface Props {
	parentId: string
}

type PR = Extract<PRCommentsQuery['node'], { __typename?: 'PullRequest' | undefined }>
type Comment = NonNullable<ArrayElement<PR["comments"]['nodes']>>

export const PRCommentList = ({parentId}: Props) => {
	const dispatch: AppDispatch = useDispatch();
	
	const {error, data} = useQuery(PRCommentsDocument, {variables: {id: parentId, last: 3}});
	if (error) dispatch(addNotification(errorNotification(error.message)));
	if (!data) return <EuiFlexGroup justifyContent="center"><EuiLoadingSpinner size="xxl"/></EuiFlexGroup>
	const pr = data.node as PR;
	const comments: EuiCommentProps[] = pr.comments.nodes?.filter(definedNN).map((comment: Comment) => {
		return {
			username: comment.author?.login ?? "",
			event: 'added a comment',
			timestamp: "on " + new Date(comment.createdAt).toLocaleString(),
			timelineAvatar: comment.author ?
				<EuiAvatar name={comment.author.login} imageUrl={comment.author.avatarUrl}/> : null,
			children: <EuiText>{comment.bodyText}</EuiText>
		}
	}) ?? [];
	if (comments.length > 0) {
		comments.unshift({
			username: "Devs",
			event: "//TODO load more comments",
			timelineAvatar: "dot"
		} as EuiCommentProps)
	}
	
	return <EuiCommentList comments={comments}/>;
}
