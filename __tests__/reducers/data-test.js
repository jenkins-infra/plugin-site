import { ACTION_TYPES } from '../../app/actions';
import { data as reducer } from '../../app/reducers/data';
import { data as initialState } from '../../app/state/data';

describe('data reducer', () => {

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle SET_DATA', () => {
    const categories = [
      {
        id: 'testId',
        name: 'name'
      }
    ];
    const labels = [
      {
        id: 'testId',
        name: 'name'
      }
    ];
    const newly = [
      {
        id: 'git',
        name: 'Git'
      }
    ];
    const trend = [
      {
        id: 'git',
        name: 'Git'
      }
    ];
    const updated = [
      {
        id: 'git',
        name: 'Git'
      }
    ];
    const info = {
      commit: 'b73765ae2fafec2704847beced9c5d93165b71d2'
    };
    const data = {
      categories, labels, newly, trend, updated, info
    };
    const action = { type: ACTION_TYPES.SET_DATA, data };
    expect(
      reducer(initialState, action)
    ).toEqual({
      categories,
      info: {
        commit: info
      },
      labels,
      stats: {
        newly,
        trend,
        updated
      }
    });
  });

});
