import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { App } from './app/App';
//import reportWebVitals from './reportWebVitals';
import './index.css';
import { EuiProvider } from "@elastic/eui";
import ReactDOM from 'react-dom';

//import '@elastic/eui/dist/eui_theme_light.css'; //Light theme
//import '@elastic/charts/dist/theme_only_dark.css'; // for charts
import '@elastic/eui/dist/eui_theme_dark.css'; //Dark theme
import '@elastic/charts/dist/theme_only_dark.css'; //for charts

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<EuiProvider colorMode="dark">
				<App/>
			</EuiProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
