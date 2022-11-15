import React, { FC } from 'react';
import {
	EuiLoadingContent
} from '@elastic/eui';
import { graphql } from "../api";
import { useQuery } from "@apollo/client";


export const RepoList: FC = () => {
    const repos = graphql(/* GraphQL */`
        query Repos {
            viewer {
                id
                repositories(first:5) {
                    nodes {
                        id
                        name
                        url
                    }
                }
            }
        }
		`);
    const orgs = graphql(/* GraphQL */`
        query Orgs {
            viewer {
                id
                organizations(first:5) {
                    nodes {
                        id
                        name
                        url
                    }
                }
            }
        }
		`);
	
	function Repos() {
		const {loading, error, data} = useQuery(repos);
		
		if (loading) return <EuiLoadingContent lines={5}/>;
		if (error) return <p>Unable to load repositories</p>;
		return <p>{data?.viewer?.repositories?.nodes?.[0]?.name ?? "asd"}</p>;
	}
	
	function Orgs() {
		const {loading, error, data} = useQuery(orgs);
		
		if (loading) return <EuiLoadingContent lines={5}/>;
		if (error) return <p>Unable to load repositories</p>;
		return <p>{data?.viewer?.organizations?.nodes?.[0]?.name ?? "asd"}</p>;
		
	}
	
	return (
		<>
			<Orgs/>
			<Repos/>
		</>
	);
};
