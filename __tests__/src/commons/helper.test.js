import {cleanTitle} from '../../../src/commons/helper';

describe('helpers', () => {
    describe('cleanTitle', () => {
        it('works', () => {
            expect(cleanTitle('Jenkins foo')).toEqual('foo');
        });
    });
});
