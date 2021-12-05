import React from 'react';

import {render} from '@testing-library/react';

import PluginLastReleased from './PluginLastReleased';

describe('pluginLastReleased', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2021-12-04').getTime());
    });
    it('both release timestamp and builDate', async () => {
        const {container} = render(<PluginLastReleased releaseTimestamp="2017-02-09T15:19:10.00Z" buildDate="Feb 09, 2017" />);

        expect(container).toHaveTextContent('Released: 5 years ago');
        expect(container.querySelector('time')).toHaveAttribute('datetime', '2017-02-09T15:19:10.000Z');
        expect(container.querySelector('time')).toHaveAttribute('title', '2017-02-09 15:19');
    });
    it('only timestamp and no buildDate', async () => {
        const {container} = render(<PluginLastReleased releaseTimestamp="2017-02-09T15:19:10.00Z" />);

        expect(container).toHaveTextContent('Released: 5 years ago');
        expect(container.querySelector('time')).toHaveAttribute('datetime', '2017-02-09T15:19:10.000Z');
        expect(container.querySelector('time')).toHaveAttribute('title', '2017-02-09 15:19');
    });
    it('no timestamp and only buildDate', async () => {
        const {container} = render(<PluginLastReleased buildDate="Feb 09, 2017" />);

        expect(container).toHaveTextContent('Released: 5 years ago');
        expect(container.querySelector('time')).toHaveAttribute('datetime', '2017-02-09T00:00:00.000Z');
        expect(container.querySelector('time')).toHaveAttribute('title', '2017-02-09 00:00');
    });
});
