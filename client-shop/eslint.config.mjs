import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",

      // False positive: async loading pattern (setLoading before fetch) is valid usage
      // of setState inside effects when syncing with external systems (API calls).
      // This rule is intended to prevent derived-state anti-patterns, not async fetching.
      "react-hooks/set-state-in-effect": "off",

      // Downgrade to warning — reset() from usePagination is a stable function,
      // adding it to deps causes infinite loops. Exhaustive-deps can't infer stability
      // of functions from custom hooks without useCallback wrapping.
      "react-hooks/exhaustive-deps": "warn",

      "@typescript-eslint/no-unused-vars": ["warn", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_" 
}],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
