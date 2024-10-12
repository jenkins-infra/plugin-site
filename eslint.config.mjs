import jest from 'eslint-plugin-jest';
import react from 'eslint-plugin-react';
import pluginPromise from 'eslint-plugin-promise';
import globals from 'globals';
import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
const reactRecommended = react.configs.recommended;
export default
[
    {
        ignores: ['**/.cache/', '**/public/', '.yarn', '**/layout.jsx']
    },
    {
        ...js.configs.recommended,
        ...pluginPromise.configs['flat/recommended'],
        ...jest.configs['flat/recommended'],
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        plugins: {
            react,
            jest,
            'import': pluginImport,
        },
        languageOptions: {
            ...reactRecommended.languageOptions,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
                ...globals.node,
                ...jest.configs['flat/recommended'].languageOptions.globals,
                'Intl': 'readonly'
            },
        },

        settings: {
            'import/resolver': {
                'node': {
                    'extensions': [
                        '.js',
                        '.jsx',
                        '.mjs'
                    ]
                }
            },
            'react': {
                'version': '18.0'
            }
        },
        rules: {
            ...reactRecommended.rules,
            ...js.configs.recommended.rules,
            ...pluginImport.configs.recommended.rules,
            'indent': ['error', 4],
            'jsx-quotes': 2,
            'key-spacing': [2],
            'max-len': 0,
            'no-console': 2,
            'no-extra-semi': 2,
            'no-multi-spaces': 'error',
            'no-trailing-spaces': [2, {'skipBlankLines': true}],
            'no-undef': 2,
            'no-underscore-dangle': [0],
            'no-unused-vars': [2],
            'no-var': 2,
            'object-curly-spacing': ['error', 'never'],
            'object-shorthand': [0, 'always'],
            'prefer-arrow-callback': 2,
            'prefer-const': 2,
            'prefer-template': 2,
            'quote-props': [0, 'as-needed'],
            'quotes': [2, 'single'],
            'react/display-name': 0,
            'react/jsx-boolean-value': 2,
            'react/jsx-curly-spacing': [2, {'allowMultiline': true, 'when': 'never'}],
            'react/jsx-equals-spacing': [2, 'never'],
            'react/jsx-filename-extension': [1, {'extensions': ['.js', '.jsx']}],
            'react/jsx-indent': ['error', 4, {'checkAttributes': true, 'indentLogicalExpressions': true}],
            'react/jsx-no-undef': 2,
            'react/jsx-one-expression-per-line': ['error', {'allow': 'single-child'}],
            'react/jsx-sort-props': 0,
            'react/jsx-uses-react': 2,
            'react/jsx-uses-vars': 2,
            'react/jsx-wrap-multilines': 2,
            'react/no-did-mount-set-state': 2,
            'react/no-did-update-set-state': 2,
            'react/no-multi-comp': 0,
            'react/no-unknown-property': 2,
            'react/prop-types': 2,
            'react/react-in-jsx-scope': 2,
            'react/self-closing-comp': 2,
            'semi': [2],
            'space-before-function-paren': [2, {'anonymous': 'always', 'named': 'never'}],
            'strict': [2, 'global'],
            'jest/prefer-importing-jest-globals': 2
        }
    }]
;