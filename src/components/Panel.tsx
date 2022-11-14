import React, { FC, PropsWithChildren } from 'react';
import { EuiHorizontalRule, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';

interface Props {
	title?: string;
	customTitle?: JSX.Element;
}

export const Panel: FC<PropsWithChildren<Props>> = ({children, title, customTitle}) => {
	return (
		<>
			<EuiPanel>
				{title !== undefined ? (
					<EuiTitle size="s">
						<h2>{title}</h2>
					</EuiTitle>
				) : customTitle !== undefined ? (
					customTitle
				) : null}
				
				{title !== undefined || customTitle !== undefined ? (
					<EuiHorizontalRule margin="s"/>
				) : null}
				{children}
			</EuiPanel>
			<EuiSpacer size="s"/>
		</>
	);
};
