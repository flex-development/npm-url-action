/**
 * @file eslint
 * @module config/eslint
 * @see https://eslint.org/docs/user-guide/configuring
 */

import fldv from '@flex-development/eslint-config'

/**
 * eslint configuration.
 *
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...fldv.configs.node,
  {
    files: ['.github/actions/**/action.yml', 'action.yml'],
    rules: {
      'yml/sort-keys': [
        2,
        {
          order: [
            'name',
            'author',
            'description',
            'inputs',
            'outputs',
            'runs',
            'branding'
          ],
          pathPattern: '^$'
        }
      ]
    }
  }
]
