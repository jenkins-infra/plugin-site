/**
 * @jest-environment node
 */

import {createSchemaCustomization} from './gatsby-node.mjs';
import {jest, describe, beforeAll, expect, it} from '@jest/globals';

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

        describe('strippedHtml', () => {
            it('basic', () => {
                const value = fieldExtensions.strippedHtml().resolve({html: '<div><h1>Header</h1>body</div>'});
                expect(value).toBe('Headerbody');
            });
        });
    });
});

