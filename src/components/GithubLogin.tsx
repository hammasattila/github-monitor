import { EuiButton, EuiFieldText, EuiForm, EuiFormRow } from "@elastic/eui";
import { FormEvent, useState } from "react";
import { Panel } from "./Panel";

export interface LoginData {
	token: string;
}

interface Props {
	onLogin: (data: LoginData) => void;
}

export const GithubLogin = ({onLogin}: Props) => {
	const [token, setToken] = useState('');
	
	const handleSubmit = (event: FormEvent): void => {
		onLogin({token: token});
		setToken(''); //Clear token after login
		event.preventDefault();
	};
	
	return (
		<Panel title={"GitHub Login"}>
			<EuiForm component="form" onSubmit={handleSubmit}>
				<EuiFormRow>
					<EuiFieldText
						placeholder="GitHub Personal Access Token"
						value={token}
						onChange={(event) =>
							setToken(event.target.value)
						}
						name="ghtoken"
						fullWidth
					/>
				</EuiFormRow>
				<EuiFormRow>
					<EuiButton type={'submit'} fill>
						<b>Login</b>
					</EuiButton>
				</EuiFormRow>
			</EuiForm>
		</Panel>
	);
};
