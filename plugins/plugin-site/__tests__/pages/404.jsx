import React from 'react';
import {render} from '@testing-library/react';
import Page404 from '../../src/pages/404';

import {describe, expect, it} from '@jest/globals';

describe('page404', () => {
    it('renders correctly', () => {
        const location = {
            href: ''
        };
        const {container} = render(<Page404 location={location}/>);

        expect(container).toBeTruthy();
    });

    it('links to search page', () => {
        const location = {
            'href': 'http://localhost:3000/discord/',
        };
        const {container} = render(<Page404 location={location}/>);

        expect(container).toBeTruthy();
        expect(container.querySelector('a[href^="/ui/search"]').href).toBe('http://localhost/ui/search?query=discord');
    });
});
