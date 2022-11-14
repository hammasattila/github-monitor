import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'https://docs.github.com/public/schema.docs.graphql',
	documents: ['src/**/*.tsx', '!src/api/**/*'],
	generates: {
		'./src/api/': {
			preset: 'client',
			plugins: [],
		},
		"./graphql.schema.json": {
			plugins: ["introspection"]
		}
	},
};

export default config;
