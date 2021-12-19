const cheerio = require('cheerio');

exports.createSchemaCustomization = ({actions}) => {
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
                    return cheerio.load(source[field]).text();
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
            return {
                resolve(source) {
                    const value = source[options.field || 'version'].toString() || '';
                    // make sure the version has 3 parts and 5 length (just in case)
                    // so 1.2.3 and 1.2 sort right
                    // 2.29 => 00002_00029_00000
                    // 2.290 => 00002_00290_00000
                    return padArrayEnd(value.split('.'), 4, 0).map(val => val.toString().padStart(5, '0')).join('_');
                },
            };
        },
    });
};
