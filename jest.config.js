/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const isIntgr = !!process.env.JEST_INTGR;
const testPathIgnorePatterns = ["/node_modules/"];
if (!isIntgr) {
  testPathIgnorePatterns.push(".*.intgr.test.ts");
}
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
  },
  testRegex: isIntgr ? ".*.intgr.test.ts" : ".*.test.ts",
  testPathIgnorePatterns,
};
