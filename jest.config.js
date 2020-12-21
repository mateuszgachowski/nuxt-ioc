module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue'],
  testRegex: '((test|spec))\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
