import { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import moment from 'moment';
import { AgregatedUserContribution, Commit, RepositoryWithCommits, UserContribution } from '../models/Commits';
import { CommitsForRepoDocument } from "../api/graphql";

export const useCommits = (repoId: string, since?: Date | undefined) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [commits, setCommits] = useState<Commit[] | undefined>();
    const [commitsByUser, setCommitsByUser] = useState<UserContribution>({});
    const [agregatedCommitsByUser, setAgregatedCommitsByUser] = useState<AgregatedUserContribution>({});

    const { loading, error, data } = useQuery(CommitsForRepoDocument, {
        variables: {
            repoNodeId: repoId
        },
        errorPolicy: "all"
    });

    useEffect(() => {
        if (loading || error) {
            setLoaded(!loading);
            setCommits(undefined);
            setCommitsByUser({});
            setAgregatedCommitsByUser({});

            return;
        }

        const repo = data?.node as RepositoryWithCommits;
        const branch = repo.defaultBranchRef?.target;

        if (branch?.__typename === 'Commit') {
            const listOfCommits = branch.history.nodes ?? []
            const cs = listOfCommits.map(c => ({
                author: c?.author?.user?.login ?? "",
                additions: c?.additions ?? 0,
                deletions: c?.deletions ?? 0,
                date: new Date(c?.committedDate)
            }));
            const csbu = cs.reduce((acc: UserContribution, c: Commit) => {
                if (acc[c.author] === undefined) {
                    acc[c.author] = [];
                }

                acc[c.author].push(c);
                return acc
            }, {})

            const acsbu: AgregatedUserContribution = {};
            for (const commitauthor in csbu) {
                acsbu[commitauthor] = {
                    weeks: {},
                    totalCount: 0,
                    totalAdditions: 0,
                    totalDeletions: 0
                };
                const ag = acsbu[commitauthor];
                const acc = ag.weeks;

                for (const commitdate in csbu[commitauthor]) {
                    const c = csbu[commitauthor][commitdate];
                    const week = moment(c.date).startOf('week').toISOString();

                    if (!acc[week]) {
                        acc[week] = {
                            author: c.author,
                            additions: c.additions,
                            deletions: c.deletions,
                            date: c.date,
                            count: 1
                        };
                    } else {
                        acc[week].additions += c.additions;
                        acc[week].deletions += c.deletions;
                        acc[week].count += 1;
                    }

                    ag.totalCount += 1;
                    ag.totalAdditions += c.additions;
                    ag.totalDeletions += c.deletions;
                    ag.lastCommitDate = c.date;
                    if (ag.firstCommitDate === undefined) { ag.firstCommitDate = c.date }
                }


                //     return acc;
                // });
            }


            setLoaded(!loading);
            setCommits(cs);
            setCommitsByUser(csbu);
            setAgregatedCommitsByUser(acsbu);
        }
    }, [loading, data, error]);

    return {
        error,
        loaded,
        commits,
        commitsByUser,
        agregatedCommitsByUser
    }
}