module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    snapshotSerializers: ['jest-serializer-html-string'],
    testRegex: '/(.)+/test/(.)+\\.unit\\.test\\.[jt]sx?$'
};
