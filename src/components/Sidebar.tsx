import { ConnectionIndicator } from './ConnectionIndicator';
import { GithubLogin, LoginData } from "./GithubLogin";
import { UserInfo } from "./UserInfo";
import { RepoList } from "./RepoList";
import { Panel } from "./Panel";

interface Props {
	isLoggedIn: boolean
	onLogin: (data: LoginData) => void
	onLogout: () => void
}

export const Sidebar = ({isLoggedIn, onLogin, onLogout}: Props) => (
	<>
		<ConnectionIndicator isLoggedIn={isLoggedIn} onLogout={onLogout}/>
		{isLoggedIn ? (
			<Panel customTitle={<UserInfo/>}>
				<RepoList/>
			</Panel>
		) : (
			<GithubLogin onLogin={onLogin}/>
		)}
	</>
);
