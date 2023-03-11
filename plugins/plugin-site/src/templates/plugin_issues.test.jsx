
import React from 'react';

import {render} from '@testing-library/react';

import TemplatePluginIssues from './plugin_issues';

describe('component - TemplatePluginIssues', () => {
    it('renders', async () => {
        const plugin = {
            name: 'fake',
            title: 'fake plugin',
            buildDate: '0',
            labels: [],
            developers: [],
            stats: {
                installations: [],
                currentInstalls: 15
            },
            gav: 'something',
            dependencies: [],
            wiki: {
                url: 'https://somewhere.com',
                content: 'something'
            }
        };
        const {container} = render(<TemplatePluginIssues data={{jenkinsPlugin: plugin,}} />);

        expect(container).toBeTruthy();
    });
});
