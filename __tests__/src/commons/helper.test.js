import {cleanTitle} from '../../../src/commons/helper';

describe('helpers', () => {
    describe('cleanTitle', () => {
        it('works', () => {
            expect(cleanTitle('Jenkins foo')).toBe('foo');
        });
        it('undefined doesnt error', () => {
            expect(cleanTitle(undefined)).toBeUndefined();
        });
    });
});
