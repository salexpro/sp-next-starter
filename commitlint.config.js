module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'enhanced-scope-enum': [
      2,
      'always',
      [
        'ci',
        'deps',
        'api',
        'core',
        'home',
        'foundation',
        'developers',
        'wallet',
        'bridge',
        'solutions',
        'solutions/gas',
        'solutions/chain',
        'solutions/account',
        'token',
        'beacon',
        'beacon/poh',
        'beacon/airdrop',
        'beacon/pol',
        'blog',
      ],
    ],
  },
  plugins: [
    {
      rules: {
        'enhanced-scope-enum': (parsed, when = 'always', value = []) => {
          if (!parsed.scope) {
            return [true, '']
          }

          // only use comma sign as seperator
          const scopeSegments = parsed.scope.split(',')

          const check = (value, enums) => {
            if (value === undefined) {
              return false
            }
            if (!Array.isArray(enums)) {
              return false
            }
            return enums.indexOf(value) > -1
          }

          const negated = when === 'never'
          const result =
            value.length === 0 ||
            scopeSegments.every((scope) => check(scope, value))

          return [
            negated ? !result : result,
            `scope must ${negated ? `not` : null} be one of [${value.join(
              ', '
            )}]`,
          ]
        },
      },
    },
  ],
}
