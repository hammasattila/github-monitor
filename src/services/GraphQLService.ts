import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

class GraphQLService {
	getClient = (token: string, logout: () => void) => {
		const httpLink = new HttpLink({
			uri: 'https://api.github.com/graphql'
		});
		
		const authLink = new ApolloLink((operation, forward) => {
			operation.setContext(({headers = {}}) => ({
				headers: {
					...headers,
					authorization: `Bearer ${token}`
				}
			}));
			return forward(operation);
		})
		
		const errorLink = onError(({networkError}) => {
			// @ts-ignore
			if (networkError && networkError.name === 'ServerError' && networkError.statusCode === 401) {
				logout();
			}
		})
		
		return new ApolloClient({
			link: from([authLink, errorLink, httpLink]),
			cache: new InMemoryCache()
		});
	}
}

export const GraphQL = new GraphQLService();
