/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // JavaScript/ESLint 推荐的规则

    // Vue/ESLint 推荐的规则
    'vue/attribute-hyphenation': 'error', // 属性名使用连字符形式
    'vue/html-self-closing': 'off', // 关闭自闭合标签要求，根据个人或团队喜好配置
    'vue/no-v-html': 'off', // 允许使用 v-html 指令
    'vue/no-unused-components': 'warn', // 不允许存在未使用的组件

    // TypeScript/ESLint 推荐的规则
    '@typescript-eslint/no-unused-vars': 'warn', // 不允许存在未使用的 TypeScript 变量
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 允许不显式指定导出函数的返回类型
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
  },
}
