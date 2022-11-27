import {
	EuiAvatar,
	EuiFlexGroup,
	EuiFlexItem,
	EuiHealth,
	EuiLoadingContent,
	EuiSpacer,
	EuiTabbedContent,
	EuiText
} from '@elastic/eui';
import { PullRequests } from "./PullRequests";
import { ContributorList } from "./ContributorList";
import { useQuery } from "@apollo/client";
import { AppSelector } from "../app/types";
import { RepoInfoDocument, StatusState } from "../api/graphql";
import { addNotification, errorNotification } from "../features/notificationSlice";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";

export const RepoDetails = () => {
	const navi = AppSelector((state) => state.navigation);
	const dispatch: AppDispatch = useDispatch();
	
	const insightsTab = {
		id: 'insights',
		name: 'Insights',
		content: <><EuiSpacer/><ContributorList/></>
	}
	
	const PRsTab = {
		id: 'prs',
		name: 'Pull Requests',
		content: <><EuiSpacer/><PullRequests/></>
	}
	
	const {loading, error, data} = useQuery(RepoInfoDocument, {variables: {id: navi.selectedRepo ?? ""}});
	if (loading) return <EuiLoadingContent lines={5}/>;
	if (error) dispatch(addNotification(errorNotification(error.message)));
	if (!data || data.node?.__typename !== "Repository") return null;
	const repo = data.node;
	const buildStatus = repo.defaultBranchRef?.target?.__typename === "Commit" && repo.defaultBranchRef?.target?.history.nodes?.[0]?.statusCheckRollup?.state;
	return (
		<>
			<EuiFlexGroup alignItems="center">
				<EuiAvatar imageUrl={repo.openGraphImageUrl} name={repo.nameWithOwner}
				           type="space" size="xl"/>
				<EuiFlexItem>
					<EuiText><h3>{repo.nameWithOwner}</h3></EuiText>
					{buildStatus ? <><EuiSpacer size="s"/><EuiHealth
						color={buildStatus === StatusState.SUCCESS ? "success" : "danger"}><EuiText>{buildStatus === StatusState.SUCCESS ? "Build Success" : "Build Failing"}</EuiText></EuiHealth></> : null}
				</EuiFlexItem>
			</EuiFlexGroup>
			<EuiSpacer/>
			<EuiTabbedContent initialSelectedTab={PRsTab} size="l" tabs={[PRsTab, insightsTab]}/>
		</>
	);
};
