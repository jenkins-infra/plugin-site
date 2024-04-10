
import React from 'react';

import {render} from '@testing-library/react';

import TemplatePluginDocumentation from './plugin_documentation';

import {describe, expect, it} from '@jest/globals';
describe('component - TemplatePluginDocumentation', () => {
    it('renders', async () => {
        const plugin = {
            name: 'fake',
            title: 'fake plugin',
            buildDate: '0',
            labels: [],
            developers: [],
            stats: {
                installations: [],
                currentInstalls: 15,
                currentInstallPercentage: 15,
            },
            gav: 'something',
            dependencies: [],
            wiki: {
                url: 'https://somewhere.com',
                content: 'something'
            }
        };
        const {container} = render(<TemplatePluginDocumentation data={{jenkinsPlugin: plugin}} />);

        expect(container).toBeTruthy();
    });
});
