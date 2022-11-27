export type Org<T> = Extract<T, { __typename?: 'Organization' | undefined }>
export type Repo<T> = Extract<T, { __typename?: 'Repository' | undefined }>
export type Commit<T> = Extract<T, { __typename?: 'Commit' | undefined }>
export type PR<T> = Extract<T, { __typename?: 'PullRequest' | undefined }>

export type UserContribution = {
	additions: number,
	deletions: number,
	count: number
}
export type AggregatedUserContribution = {
	weeks: { [date: string]: UserContribution },
	total: UserContribution,
	firstCommitDate?: Date,
	lastCommitDate?: Date
}
