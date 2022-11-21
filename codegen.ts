import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'schema.graphql',
	documents: ['src/**/*.graphql'],
	ignoreNoDocuments: true,
	generates: {
		'./src/api/': {
			preset: 'client',
			config: {
				namingConvention: "keep"
			},
			plugins: []
		}
	}
};

export default config;
