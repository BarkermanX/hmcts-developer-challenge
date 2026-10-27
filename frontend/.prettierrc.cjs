module.exports = {
  semi: true,
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  plugins: [require.resolve('prettier-plugin-jinja-template')],
  overrides: [
    {
      files: '**/*.njk',
      options: {
        parser: 'jinja-template',
      },
    },
  ],
};
