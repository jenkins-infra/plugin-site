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
            it('0.0.0', () => {
                const value = fieldExtensions.machineVersion({field: 'version'}).resolve({version: '0.0.0'});
                expect(value).toBe('00000_00000_00000_00000');
            });
            it('4.7.1.1', () => {
                const value = fieldExtensions.machineVersion({field: 'version'}).resolve({version: '4.7.1.1'});
                expect(value).toBe('00004_00007_00001_00001');
            });
        });
        describe('strippedHtml', () => {
            it('basic', () => {
                const value = fieldExtensions.strippedHtml().resolve({html: '<div><h1>Header</h1>body</div>'});
                expect(value).toBe('Headerbody');
            });
        });
    });
});

