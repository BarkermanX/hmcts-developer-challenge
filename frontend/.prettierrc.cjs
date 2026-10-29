module.exports = {
  semi: true,
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  plugins: ['prettier-plugin-nunjucks'],
  overrides: [
    {
      files: ['*.njk', '**/*.njk', '*.nunjucks', '**/*.nunjucks'],
      options: {
        parser: 'nunjucks',
      },
    },
  ],
};
