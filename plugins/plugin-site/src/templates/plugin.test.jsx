
import React from 'react';

import {render} from '@testing-library/react';

import {useSelectedPluginTab} from '../hooks/useSelectedTab';

import PluginPage from './plugin';

describe('component - PluginPage', () => {
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
            wiki: {
                url: 'https://somewhere.com',
                content: 'something'
            }
        };
        const {container} = render(<PluginPage data={{jenkinsPlugin: plugin}} />);

        expect(container).toBeTruthy();
    });
    describe('useSelectedPluginTab', () => {
        const tabs = [
            {id: 'documentation', label: 'Documentation'},
            {id: 'releases', label: 'Releases'},
            {id: 'issues', label: 'Issues'},
            {id: 'dependencies', label: 'Dependencies'},
        ];
        it('invalid preselected tab should default to first tab', async () => {
            window.location.hash = '#foo';
            const selectedTab = useSelectedPluginTab(tabs);
            expect(selectedTab).toBe(tabs[0]);
        });
        it('valid preselected tab should return that one', async () => {
            window.location.hash = `#${ tabs[1].id}`;
            const selectedTab = useSelectedPluginTab(tabs);
            expect(selectedTab).toBe(tabs[1]);
        });
    });
});
