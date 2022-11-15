import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'schema.graphql',
	documents: ['src/**/*.tsx', '!src/api/**/*'],
	ignoreNoDocuments: true,
	require: ['ts-node/register'],
	generates: {
		'./src/api/': {
			preset: 'client',
			plugins: []
		}
	}
};

export default config;
