/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "query Viewer {\n  viewer {\n    id\n    name\n    login\n    avatarUrl\n  }\n}\n\nquery ViewerOrgs($first: Int!, $end: String) {\n  viewer {\n    id\n    organizations(first: $first, after: $end) {\n      nodes {\n        id\n        name\n        url\n        avatarUrl\n        login\n        repositories(affiliations: OWNER) {\n          totalCount\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n    }\n  }\n}\n\nquery ViewerRepos($first: Int!, $end: String) {\n  viewer {\n    id\n    repositories(first: $first, after: $end) {\n      nodes {\n        id\n        name\n        openGraphImageUrl\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n    }\n  }\n}\n\nquery SearchRepo($owner: String!, $repo: String!) {\n  repository(owner: $owner, name: $repo) {\n    id\n    name\n    openGraphImageUrl\n  }\n}\n\nquery RepoInfo($id: ID!) {\n  node(id: $id) {\n    ... on Repository {\n      id\n      nameWithOwner\n      openGraphImageUrl\n      defaultBranchRef {\n        target {\n          ... on Commit {\n            history(first: 1) {\n              nodes {\n                ... on Commit {\n                  statusCheckRollup {\n                    state\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nquery OrgRepos($id: ID!, $first: Int!, $end: String) {\n  node(id: $id) {\n    ... on Organization {\n      id\n      repositories(first: $first, after: $end) {\n        nodes {\n          id\n          name\n          openGraphImageUrl\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n        totalCount\n      }\n    }\n  }\n}\n\nquery PRs($id: ID!, $first: Int, $end: String, $start: String, $last: Int) {\n  node(id: $id) {\n    ... on Repository {\n      id\n      pullRequests(\n        first: $first\n        after: $end\n        before: $start\n        last: $last\n        orderBy: {field: CREATED_AT, direction: DESC}\n      ) {\n        nodes {\n          id\n          number\n          title\n          closed\n          url\n          author {\n            login\n            avatarUrl\n            url\n          }\n          comments(last: 1) {\n            nodes {\n              id\n              bodyText\n            }\n          }\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        totalCount\n      }\n    }\n  }\n}\n\nquery PRComments($id: ID!, $last: Int!) {\n  node(id: $id) {\n    ... on PullRequest {\n      id\n      comments(last: $last) {\n        nodes {\n          id\n          author {\n            login\n            avatarUrl\n          }\n          createdAt\n          bodyText\n        }\n      }\n    }\n  }\n}\n\nquery Collabs($id: ID!, $first: Int, $end: String, $start: String, $last: Int) {\n  node(id: $id) {\n    ... on Repository {\n      id\n      collaborators(first: $first, after: $end, before: $start, last: $last) {\n        nodes {\n          id\n          login\n          name\n          avatarUrl\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        totalCount\n      }\n    }\n  }\n}\n\nquery CommitsForRepo($repoNodeId: ID!) {\n  node(id: $repoNodeId) {\n    ... on Repository {\n      id\n      name\n      defaultBranchRef {\n        name\n        target {\n          ... on Commit {\n            id\n            history {\n              totalCount\n              nodes {\n                author {\n                  name\n                  user {\n                    email\n                    login\n                    name\n                  }\n                }\n                additions\n                deletions\n                committedDate\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nquery CommitsForRepoSince($repoNodeId: ID!, $since: GitTimestamp!) {\n  node(id: $repoNodeId) {\n    ... on Repository {\n      id\n      name\n      defaultBranchRef {\n        name\n        target {\n          ... on Commit {\n            id\n            history(since: $since) {\n              totalCount\n              nodes {\n                author {\n                  name\n                  user {\n                    email\n                    login\n                    name\n                  }\n                }\n                additions\n                deletions\n                committedDate\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}": types.ViewerDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Viewer {\n  viewer {\n    id\n    name\n    login\n    avatarUrl\n  }\n}\n\nquery ViewerOrgs($first: Int!, $end: String) {\n  viewer {\n    id\n    organizations(first: $first, after: $end) {\n      nodes {\n        id\n        name\n        url\n        avatarUrl\n        login\n        repositories(affiliations: OWNER) {\n          totalCount\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n    }\n  }\n}\n\nquery ViewerRepos($first: Int!, $end: String) {\n  viewer {\n    id\n    repositories(first: $first, after: $end) {\n      nodes {\n        id\n        name\n        openGraphImageUrl\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n    }\n  }\n}\n\nquery SearchRepo($owner: String!, $repo: String!) {\n  repository(owner: $owner, name: $repo) {\n    id\n    name\n    openGraphImageUrl\n  }\n}\n\nquery RepoInfo($id: ID!) {\n  node(id: $id) {\n    ... on Repository {\n      id\n      nameWithOwner\n      openGraphImageUrl\n      defaultBranchRef {\n        target {\n          ... on Commit {\n            history(first: 1) {\n              nodes {\n                ... on Commit {\n                  statusCheckRollup {\n                    state\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nquery OrgRepos($id: ID!, $first: Int!, $end: String) {\n  node(id: $id) {\n    ... on Organization {\n      id\n      repositories(first: $first, after: $end) {\n        nodes {\n          id\n          name\n          openGraphImageUrl\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n        totalCount\n      }\n    }\n  }\n}\n\nquery PRs($id: ID!, $first: Int, $end: String, $start: String, $last: Int) {\n  node(id: $id) {\n    ... on Repository {\n      id\n      pullRequests(\n        first: $first\n        after: $end\n        before: $start\n        last: $last\n        orderBy: {field: CREATED_AT, direction: DESC}\n      ) {\n        nodes {\n          id\n          number\n          title\n          closed\n          url\n          author {\n            login\n            avatarUrl\n            url\n          }\n          comments(last: 1) {\n            nodes {\n              id\n              bodyText\n            }\n          }\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        totalCount\n      }\n    }\n  }\n}\n\nquery PRComments($id: ID!, $last: Int!) {\n  node(id: $id) {\n    ... on PullRequest {\n      id\n      comments(last: $last) {\n        nodes {\n          id\n          author {\n            login\n            avatarUrl\n          }\n          createdAt\n          bodyText\n        }\n      }\n    }\n  }\n}\n\nquery Collabs($id: ID!, $first: Int, $end: String, $start: String, $last: Int) {\n  node(id: $id) {\n    ... on Repository {\n      id\n      collaborators(first: $first, after: $end, before: $start, last: $last) {\n        nodes {\n          id\n          login\n          name\n          avatarUrl\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        totalCount\n      }\n    }\n  }\n}\n\nquery CommitsForRepo($repoNodeId: ID!) {\n  node(id: $repoNodeId) {\n    ... on Repository {\n      id\n      name\n      defaultBranchRef {\n        name\n        target {\n          ... on Commit {\n            id\n            history {\n              totalCount\n              nodes {\n                author {\n                  name\n                  user {\n                    email\n                    login\n                    name\n                  }\n                }\n                additions\n                deletions\n                committedDate\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nquery CommitsForRepoSince($repoNodeId: ID!, $since: GitTimestamp!) {\n  node(id: $repoNodeId) {\n    ... on Repository {\n      id\n      name\n      defaultBranchRef {\n        name\n        target {\n          ... on Commit {\n            id\n            history(since: $since) {\n              totalCount\n              nodes {\n                author {\n                  name\n                  user {\n                    email\n                    login\n                    name\n                  }\n                }\n                additions\n                deletions\n                committedDate\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query Viewer {\n  viewer {\n    id\n    name\n    login\n    avatarUrl\n  }\n}\n\nquery ViewerOrgs($first: Int!, $end: String) {\n  viewer {\n    id\n    organizations(first: $first, after: $end) {\n      nodes {\n        id\n        name\n        url\n        avatarUrl\n        login\n        repositories(affiliations: OWNER) {\n          totalCount\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n    }\n  }\n}\n\nquery ViewerRepos($first: Int!, $end: String) {\n  viewer {\n    id\n    repositories(first: $first, after: $end) {\n      nodes {\n        id\n        name\n        openGraphImageUrl\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n    }\n  }\n}\n\nquery SearchRepo($owner: String!, $repo: String!) {\n  repository(owner: $owner, name: $repo) {\n    id\n    name\n    openGraphImageUrl\n  }\n}\n\nquery RepoInfo($id: ID!) {\n  node(id: $id) {\n    ... on Repository {\n      id\n      nameWithOwner\n      openGraphImageUrl\n      defaultBranchRef {\n        target {\n          ... on Commit {\n            history(first: 1) {\n              nodes {\n                ... on Commit {\n                  statusCheckRollup {\n                    state\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nquery OrgRepos($id: ID!, $first: Int!, $end: String) {\n  node(id: $id) {\n    ... on Organization {\n      id\n      repositories(first: $first, after: $end) {\n        nodes {\n          id\n          name\n          openGraphImageUrl\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n        totalCount\n      }\n    }\n  }\n}\n\nquery PRs($id: ID!, $first: Int, $end: String, $start: String, $last: Int) {\n  node(id: $id) {\n    ... on Repository {\n      id\n      pullRequests(\n        first: $first\n        after: $end\n        before: $start\n        last: $last\n        orderBy: {field: CREATED_AT, direction: DESC}\n      ) {\n        nodes {\n          id\n          number\n          title\n          closed\n          url\n          author {\n            login\n            avatarUrl\n            url\n          }\n          comments(last: 1) {\n            nodes {\n              id\n              bodyText\n            }\n          }\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        totalCount\n      }\n    }\n  }\n}\n\nquery PRComments($id: ID!, $last: Int!) {\n  node(id: $id) {\n    ... on PullRequest {\n      id\n      comments(last: $last) {\n        nodes {\n          id\n          author {\n            login\n            avatarUrl\n          }\n          createdAt\n          bodyText\n        }\n      }\n    }\n  }\n}\n\nquery Collabs($id: ID!, $first: Int, $end: String, $start: String, $last: Int) {\n  node(id: $id) {\n    ... on Repository {\n      id\n      collaborators(first: $first, after: $end, before: $start, last: $last) {\n        nodes {\n          id\n          login\n          name\n          avatarUrl\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        totalCount\n      }\n    }\n  }\n}\n\nquery CommitsForRepo($repoNodeId: ID!) {\n  node(id: $repoNodeId) {\n    ... on Repository {\n      id\n      name\n      defaultBranchRef {\n        name\n        target {\n          ... on Commit {\n            id\n            history {\n              totalCount\n              nodes {\n                author {\n                  name\n                  user {\n                    email\n                    login\n                    name\n                  }\n                }\n                additions\n                deletions\n                committedDate\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nquery CommitsForRepoSince($repoNodeId: ID!, $since: GitTimestamp!) {\n  node(id: $repoNodeId) {\n    ... on Repository {\n      id\n      name\n      defaultBranchRef {\n        name\n        target {\n          ... on Commit {\n            id\n            history(since: $since) {\n              totalCount\n              nodes {\n                author {\n                  name\n                  user {\n                    email\n                    login\n                    name\n                  }\n                }\n                additions\n                deletions\n                committedDate\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}"];

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function graphql(source: string): unknown;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;