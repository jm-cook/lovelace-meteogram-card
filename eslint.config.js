// ESLint 9+ flat config.
//
// The previous `lint` script — `eslint --ext .ts --ext .js --fix src` — could never have
// run: eslint was not in devDependencies, and `--ext` was removed in ESLint 9, which
// discovers files through this config instead.
//
// This is deliberately a *starting* configuration for a 7.7k-line codebase that has
// never been linted. It is tuned to surface real defects rather than to bury them in
// style opinions, because a lint run that reports hundreds of cosmetic findings gets
// ignored and then reports nothing useful ever again. Rules can be tightened once the
// baseline is clean.

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "tmp/**",
      "doc/**",
      "example/**",
      // Standalone d3 prototypes kept for reference; not part of the build.
      "src/*.html",
      "*.config.js",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser },
    },
    rules: {
      // The card talks to Home Assistant's untyped `hass` object and to d3, whose
      // selection types do not survive the boundary. Banning `any` here would mean
      // hundreds of findings and no useful signal; worth revisiting per-module once
      // the god class is split.
      "@typescript-eslint/no-explicit-any": "off",

      // Unused values are worth knowing about, but an underscore prefix is the
      // conventional way to say "required by the signature, deliberately ignored" —
      // the codebase already uses `_` and `_props` for exactly that.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Diagnostics and debug logging are a feature of this card, not an oversight.
      "no-console": "off",

      // These catch genuine mistakes and should stay errors.
      "no-fallthrough": "error",
      "no-unsafe-optional-chaining": "error",
      "@typescript-eslint/no-unused-expressions": "error",
    },
  },
);
