module.exports = {
  plugins: ['@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  rules: {
    'import/no-anonymous-default-export': 'off',
    'no-console': [
      'error',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],
    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': [1, 'always'],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    // allow explicit any --> we swear to use it wisely 🤞
    '@typescript-eslint/no-explicit-any': 'off',
    // allow underscore as unused variable
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // allow empty interfaces
    '@typescript-eslint/no-empty-interface': 'off',
  },
}
