import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";  // Import Prettier plugin
import configPrettier from "eslint-config-prettier";  // Import Prettier config


/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,jsx}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        plugins: ["prettier"],  // Add Prettier to the list of plugins
        rules: {
            "prettier/prettier": "error",  // Run Prettier as an ESLint rule
        },
    },
    configPrettier,  // Use Prettier's config to turn off conflicting rules
];