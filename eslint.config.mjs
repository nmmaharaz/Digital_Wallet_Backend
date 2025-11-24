import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules:{
         "no-console": "warn"
    }
  }
);