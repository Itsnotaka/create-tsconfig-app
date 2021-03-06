/* cSpell:disable */
/* spell-checker: disable */
/* spellchecker: disable */

module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['xo'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: { jsx: true },
		ecmaVersion: 12,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['**/*.js'],
	rules: {
		// Next.js
		'@typescript-eslint/triple-slash-reference': 'off',
		'react/react-in-jsx-scope': 'off',

		// Prettier handles these
		'@typescript-eslint/comma-dangle': 'off',
		'react/function-component-definition': 'off',
		'react/jsx-tag-spacing': 'off',
		'react/no-unescaped-entities': 'off',
		'no-mixed-operators': 'off',
		'operator-linebreak': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'quote-props': 'off',
		'@typescript-eslint/quotes': 'off',
		'react/jsx-curly-newline': 'off',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/object-curly-spacing': 'off',

		// Bruh
		'@typescript-eslint/ban-types': 'off',
		'object-curly-spacing': 'off',
		'indent': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'no-unused-vars': 'warn',
		'capitalized-comments': 'off',
		'arrow-body-style': 'warn',
		'curly': 'off',
		'no-warning-comments': 'off',
	},
};
