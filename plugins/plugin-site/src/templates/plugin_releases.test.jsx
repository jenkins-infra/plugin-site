
import React from 'react';

import {render} from '@testing-library/react';

import TemplatePluginReleases from './plugin_releases';

import {describe, expect, it} from '@jest/globals';

describe('component - TemplatePluginReleases', () => {
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
                currentInstallPercentage: 0.15,
            },
            gav: 'something',
            dependencies: [],
            wiki: {
                url: 'https://somewhere.com',
                content: 'something'
            }
        };
        const {container} = render(<TemplatePluginReleases data={{
            jenkinsPlugin: plugin,
            versions: {edges: []}
        }} />);

        expect(container).toBeTruthy();
    });
});
