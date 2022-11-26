import { CommitsForRepoQuery, CommitsForRepoSinceQuery } from "../api/graphql"


export type RepositoryWithCommits =
  Extract<CommitsForRepoQuery['node'], { __typename?: 'Repository' | undefined }>
  | Extract<CommitsForRepoSinceQuery['node'], { __typename?: 'Repository' | undefined }>

export type Commit = {
    author: string,
    additions: number,
    deletions: number,
    date: Date
}

export type AggregatedCommit = Commit & { count: number }

export type AggregatedCommits = {
    weeks: { [key: string]: AggregatedCommit }
    totalCount: number,
    totalAdditions: number,
    totalDeletions: number,
    firstCommitDate?: Date,
    lastCommitDate?: Date
}

export type UserContribution = {
    [author: string]: Commit[]
}

export type AggregatedUserContribution = {
    [author: string]: AggregatedCommits
}
