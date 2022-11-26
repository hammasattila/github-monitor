import { useEffect, useState } from "react"
import { AggregatedCommits, Commit } from "../models/Commits"
import { Axis, BarSeries, Chart, Settings } from "@elastic/charts";
import moment from "moment";
import { useEuiTheme } from "@elastic/eui";
import { EUI_CHARTS_THEME_DARK, EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';

interface CommitAnalysisProps {
	commits: Commit[]
	aggregatedCommits: AggregatedCommits
}

export const CommitAnalysis = ({commits, aggregatedCommits}: CommitAnalysisProps) => {
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
		if (aggregatedCommits === undefined) {
			return;
		}
		
		const weeks = aggregatedCommits.weeks ?? {};
		const data = Object.keys(weeks).map((key: string) => {
			const week = weeks[key];
			const m = moment(new Date(key));
			return {
				week: `${m.year()}.${m.month()}.${m.date()} - ${m.year()}.${m.month()}.${m.date() + 7}`,
				group: "C",
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
