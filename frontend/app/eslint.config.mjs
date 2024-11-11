// import globals from "globals";
// import pluginJs from "@eslint/js";
// import pluginReact from "eslint-plugin-react";


// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {files: ["**/*.{js,mjs,cjs,jsx}"]},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
//   pluginReact.configs.flat.recommended,
// ];


// eslint.config.mjs

// eslint.config.mjs

/** @type {import('eslint').Linter.Config} */
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"], // Make sure all extensions are included
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parser: "@babel/eslint-parser",
      parserOptions: {
        requireConfigFile: false, // Allows parsing without a Babel config file
        ecmaFeatures: {
          jsx: true, // Enables parsing of JSX syntax
        },
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      // Add any custom rules here
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

