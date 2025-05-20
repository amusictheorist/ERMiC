module.exports = {
  "testEnvironment": "jsdom",
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
};