import { defineConfig } from 'orval'

export default defineConfig({
  forUm: {
    input: {
      target: './openapi.json',
    },
    output: {
      target: './src/api/generated/endpoints.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      clean: true,
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
