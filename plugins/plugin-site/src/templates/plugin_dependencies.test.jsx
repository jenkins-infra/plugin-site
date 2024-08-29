
import React from 'react';

import {render} from '@testing-library/react';

import TemplatePluginDependencies from './plugin_dependencies';

import {describe, expect, it} from '@jest/globals';

describe('component - TemplatePluginDependencies', () => {
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
                currentInstallPercentage: 0.15
            },
            gav: 'something',
            dependencies: [],
            wiki: {
                url: 'https://somewhere.com',
                content: 'something'
            }
        };
        const {container} = render(<TemplatePluginDependencies data={{
            jenkinsPlugin: plugin,
            reverseDependencies: {edges: []}
        }} />);

        expect(container).toBeTruthy();
    });
});
