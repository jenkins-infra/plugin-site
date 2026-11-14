import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {useStaticQuery} from 'gatsby';
import Category from './Category';
import {jest, describe, expect, it} from '@jest/globals';

jest.mock('gatsby');

describe('Category', () => {
    it('renders and selects labels by their source IDs', () => {
        useStaticQuery.mockReturnValue({
            labels: {
                edges: [
                    {node: {labelId: 'scm', title: 'Source Code Management'}},
                    {node: {labelId: 'scm-related', title: 'Source Code Management related'}}
                ]
            }
        });
        const category = {
            id: 'scm',
            labels: ['scm', 'scm-related'],
            title: 'Source code management'
        };
        const toggleLabel = jest.fn();
        const {getByRole} = render(
            <Category
                activeCategories={[]}
                activeLabels={[]}
                category={category}
                toggleCategory={jest.fn()}
                toggleLabel={toggleLabel}
            />
        );

        const scm = getByRole('checkbox', {name: 'Source Code Management'});
        const related = getByRole('checkbox', {name: 'Source Code Management related'});
        expect(scm.value).toBe('scm');
        expect(related.value).toBe('scm-related');

        fireEvent.click(related);
        expect(toggleLabel).toHaveBeenCalledWith(
            {labelId: 'scm-related', title: 'Source Code Management related'},
            category
        );
    });
});
