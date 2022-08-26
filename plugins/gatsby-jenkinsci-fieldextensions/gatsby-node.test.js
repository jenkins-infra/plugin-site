/**
 * @jest-environment node
 */

const {createSchemaCustomization} = require('./gatsby-node');

describe('gatsby-node', () => {
    describe('createSchemaCustomization', () => {
        const fieldExtensions = {};
        beforeAll(() => {
            createSchemaCustomization({
                actions: {
                    createTypes: jest.fn(),
                    createFieldExtension: ({name, extend}) => {
                        fieldExtensions[name] = extend;
                    }
                }
            });
        });
        describe('machineVersion', () => {
            const versions = ['0.1', '1.0-b9', '1.0-b10', '1.0-rc2', '1.0', '1.0.9', '1.0.10',
                '1.0.10-2', '1.1', '2.0', '4.7.1.1'];
            for (let idx = 1; idx < versions.length; idx++) {
                it (`sorted ${versions[idx - 1]} ${versions[idx]}`, () => {
                    const oldVal = fieldExtensions.machineVersion({field: 'version'}).resolve({version: versions[idx - 1]});
                    const newVal = fieldExtensions.machineVersion({field: 'version'}).resolve({version: versions[idx]});
                    // localeCompare instead of < to keep ESLint happy
                    expect(oldVal.localeCompare(newVal)).toBe(-1);
                });
            }
        });

        describe('strippedHtml', () => {
            it('basic', () => {
                const value = fieldExtensions.strippedHtml().resolve({html: '<div><h1>Header</h1>body</div>'});
                expect(value).toBe('Headerbody');
            });
        });
    });
});

