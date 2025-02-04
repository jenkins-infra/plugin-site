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
};
