import {cleanTitle, formatPercentage} from '../../../src/commons/helper';

import {describe, expect, it} from '@jest/globals';

describe('helpers', () => {

    describe('cleanTitle', () => {
        it('works', () => {
            expect(cleanTitle('Jenkins foo')).toBe('foo');
        });

        it('undefined doesnt error', () => {
            expect(cleanTitle(undefined)).toBeUndefined();
        });
    });

    describe('formatPercentage', () => {
        it('shows high percentages accurately', () => {
            expect(formatPercentage(95.45)).toBe('95.5%');
            expect(formatPercentage(1.234)).toBe('1.23%');
        });

        it('shows low percentage concisely', () => {
            expect(formatPercentage(0.9577)).toBe('0.96%');
            expect(formatPercentage(0.009577)).toBe('0.0096%');
        });
    });
});
