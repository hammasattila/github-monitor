import { useQuery } from "@apollo/client";
import { ViewerDocument } from "../api/graphql";
import { EuiAvatar, EuiFlexGroup, EuiFlexItem, EuiLoadingContent, EuiText } from "@elastic/eui";

export const UserInfo = () => {
	const {loading, error, data} = useQuery(ViewerDocument);
	if (loading) return <EuiLoadingContent lines={2}/>;
	if (error) return <p>Unknown user</p>;
	if (!data) return null;
	return (
		<EuiFlexGroup gutterSize="s" justifyContent={"flexStart"}>
			<EuiFlexItem grow={false}>
				<EuiAvatar imageUrl={data.viewer.avatarUrl} name={data.viewer.login} size="xl"
				           initialsLength={2} type="space"/>
			</EuiFlexItem>
			<EuiFlexItem>
				<EuiText size="m">
					<b><strong>{data.viewer.login}</strong></b>
				</EuiText>
				<EuiText size="s">
					{data.viewer.name ?? ""}
				</EuiText>
			</EuiFlexItem>
		</EuiFlexGroup>
	);
}
