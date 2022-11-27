import { useEffect, useState } from "react"
import { Axis, BarSeries, Chart, Settings } from "@elastic/charts";
import moment from "moment";
import { useEuiTheme } from "@elastic/eui";
import { EUI_CHARTS_THEME_DARK, EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';
import { AggregatedUserContribution } from "../api/types";

interface CommitAnalysisProps {
	aggregatedCommits: AggregatedUserContribution
}

export const ContributionGraphs = ({aggregatedCommits}: CommitAnalysisProps) => {
	const theme = useEuiTheme();
	const euiTheme = theme.colorMode === "DARK" ? EUI_CHARTS_THEME_DARK.theme : EUI_CHARTS_THEME_LIGHT.theme;
	let [aggregatedData, setAggregatedData] = useState<{
		week: string
		group: string
		additions: number,
		commits: number,
		deletions: number
	}[]>([]);
	
	useEffect(() => {
		if (!aggregatedCommits)
			return;
		
		const weeks = aggregatedCommits.weeks ?? {};
		const data = Object.keys(weeks).map((key: string) => {
			const week = weeks[key];
			const m = moment(new Date(key));
			const nm = m.clone().add(7, 'days');
			return {
				week: `${m.year()}.${m.month()}.${m.date()} - ${nm.year()}.${nm.month()}.${nm.date()}`,
				group: "Commit",
				additions: week.additions,
				deletions: -week.deletions,
				commits: week.count
			}
		}).reverse();
		
		setAggregatedData(data);
	}, [aggregatedCommits]);
	
	return (
		<>
			<Chart size={{height: 200}}>
				<Settings theme={euiTheme} showLegend={false}/>
				<BarSeries
					id="changes"
					name="Changes"
					data={aggregatedData}
					xAccessor={'week'}
					yAccessors={['additions', 'deletions']}
					splitSeriesAccessors={['group']}
					stackAccessors={['group']}
				/>
				<Axis id="bottom-axis" position="bottom" showGridLines/>
				<Axis id="left-axis" position="left" showGridLines/>
			</Chart>
			<Chart size={{height: 200}}>
				<Settings theme={euiTheme} showLegend={false}/>
				<BarSeries
					id="commits"
					name="Commits"
					data={aggregatedData}
					xAccessor={'week'}
					yAccessors={['commits']}
					splitSeriesAccessors={['group']}
					stackAccessors={['group']}
				/>
				<Axis id="bottom-axis" position="bottom" showGridLines/>
				<Axis id="left-axis" position="left" showGridLines/>
			</Chart>
		</>
	);
}
