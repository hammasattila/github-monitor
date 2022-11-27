import { ArrayElement, definedNN } from "../app/types";
import { CommitsByUserDocument, CommitsByUserQuery } from "../api/graphql";
import { AggregatedUserContribution, Commit } from "../api/types";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";
import { Contrib } from "../components/ContributorList";

type HistoryCommit = NonNullable<ArrayElement<NonNullable<Commit<CommitsByUserQuery['node']>['history']['nodes']>>>

export const useCommits = (items: { id: string, user: Contrib }[], latestCommitID: string) => {
	const [contributions, setContributions] = useState<{ [userId: string]: AggregatedUserContribution }>({})
	const [queryCommits, {
		loading,
		error
	}] = useLazyQuery(CommitsByUserDocument, {defaultOptions: {errorPolicy: "all"}});
	
	function aggregateData(data: CommitsByUserQuery) {
		const commit = data.node as Commit<CommitsByUserQuery['node']>;
		const aggregatedContributions: AggregatedUserContribution = {
			weeks: {},
			total: {
				count: 0,
				additions: 0,
				deletions: 0
			}
		}
		if (commit) {
			const listOfCommits = commit.history.nodes as HistoryCommit[]
			const commits = listOfCommits.filter(definedNN).filter((c => c.parents.totalCount <= 1)) ?? [];
			
			const ag = aggregatedContributions;
			const acc = ag.weeks;
			for (const c of commits) {
				const week = moment(c.committedDate).startOf('week').toISOString();
				if (!acc[week])
					acc[week] = {
						count: 0,
						additions: 0,
						deletions: 0
					}
				acc[week].additions += c.additions;
				acc[week].deletions += c.deletions;
				acc[week].count += 1;
				
				ag.total.additions += c.additions;
				ag.total.deletions += c.deletions;
				ag.total.count += 1;
				ag.lastCommitDate = new Date(c.committedDate);
				if (!ag.firstCommitDate) {
					ag.firstCommitDate = new Date(c.committedDate)
				}
			}
		}
		return aggregatedContributions;
	}
	
	function getStats(c: { id: string, user: Contrib }) {
		return queryCommits({
			variables: {
				historyRootId: latestCommitID,
				author: {id: c.id}
			}, onCompleted: ((data) => {
				setContributions((prevState) => {
					prevState[c.id] = aggregateData(data)
					return prevState
				})
			})
		})
	}
	
	useEffect(() => {
		if (loading || error) return;
		items.forEach((item) => {
			if (!contributions[item.id]) {
				getStats(item)
			}
		})
	});
	return contributions;
}
