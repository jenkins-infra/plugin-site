import {load} from 'cheerio';

export const createSchemaCustomization = ({actions}) => {
    const {createFieldExtension} = actions;

    createFieldExtension({
        name: 'strippedHtml',
        args: {
            field: 'String',
        },
        extend(options = {}) {
            return {
                resolve(source) {
                    const field = options.field || 'html';
                    return load(source[field]).text();
                },
            };
        },
    });
    createFieldExtension({
        name: 'machineVersion',
        description: 'returns machine sortable version',
        args: {
            field: 'String',
        },
        extend(options = {}) {
            const padArrayEnd = (arr, len, padding) => {
                return arr.concat(Array(Math.max(len - arr.length, 0)).fill(padding));
            };
            // qualifiers alphabetically sorted: a(lpha) < b(eta) < r(c) < s(table)
            const getQualifier = val => val.toString().match(/^(rc|a\d|b\d)/) ? val.charAt(0) : 's';
            return {
                resolve(source) {
                    const value = source[options.field || 'version'].toString() || '';
                    // make sure the version has 3 parts and 5 length (just in case)
                    // so 1.2.3 and 1.2 sort right
                    // 2.29 => s00002_s00029_s00000
                    // 2.290 => s00002_s00290_s00000
                    // 2.290-rc4 => s00002_s00290_r00004
                    return padArrayEnd(value.split(/\+build\.|[.-]/), 4, 0).map(val => getQualifier(val)
                                + val.toString().replace(/^rc/, '').replace(/^[ab](\d)/, '$1').padStart(5, '0')).join('_');
                },
            };
        },
    });
};
