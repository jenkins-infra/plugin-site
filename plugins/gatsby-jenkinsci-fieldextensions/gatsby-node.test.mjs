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
        describe('machineVersion', () => {
            const versions = ['0.1', '1.0-b9', '1.0-b10', '1.0-rc2', '1.0', '1.0.9', '1.0.10',
                '1.0.10-2', '1.1', '1.9+build.201606131328', '1.13+build.202205140447',
                '1.14-651.v429b_16b_db_60e', '2.0', '4.7.1.1'];
            const pairs = versions.map((v, i) => [versions[i - 1], v]).slice(1);
            it.each(pairs) ('version %s should be less than %s', (older, newer) => {
                const oldVal = fieldExtensions.machineVersion({field: 'version'}).resolve({version: older});
                const newVal = fieldExtensions.machineVersion({field: 'version'}).resolve({version: newer});
                // localeCompare instead of < to keep ESLint happy
                expect(oldVal.localeCompare(newVal)).toBe(-1);
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

