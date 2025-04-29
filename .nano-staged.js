const path = require('path')

module.exports = {
  // '*.{js,ts,jsx,tsx,json}': ({ filenames }) => buildEslintCommand(filenames),
  '*.{js,ts,jsx,tsx,json}': (api) =>
    `pnpm dlx eslint --fix ${api.filenames.join(' ')}`,
  // '*.ts': 'tsc-files --noEmit --pretty',
  '*.{css,scss}': ['stylelint --allow-empty-input'],
  '*.{md,mdx}': ['prettier --write'],
}
