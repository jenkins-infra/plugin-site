import React from 'react';

import {render} from '@testing-library/react';

import LineChart from './LineChart';

describe('lineChart', () => {
    it('no data should return empty component', () => {
        const {container} = render(<LineChart />);
        expect(container.innerHTML).toBe('');
    });
    it('renders correctly', () => {
        const installations = [
            {'timestamp': 1606780800000, 'total': 5126},
            {'timestamp': 1609459200000, 'total': 5075},
            {'timestamp': 1612137600000, 'total': 4968},
            {'timestamp': 1614556800000, 'total': 5252},
            {'timestamp': 1617235200000, 'total': 5079},
            {'timestamp': 1619827200000, 'total': 4946},
            {'timestamp': 1622505600000, 'total': 4960},
            {'timestamp': 1625097600000, 'total': 4837},
            {'timestamp': 1627776000000, 'total': 4827},
            {'timestamp': 1630454400000, 'total': 4726},
            {'timestamp': 1633046400000, 'total': 4647},
            {'timestamp': 1635724800000, 'total': 4704}
        ];
        const {getByRole} = render(<LineChart installations={installations} />);

        const canvas = getByRole('img');
        expect(canvas).toBeTruthy();
    });
});

