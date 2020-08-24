module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
};
