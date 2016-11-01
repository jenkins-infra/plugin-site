import { ACTION_TYPES } from '../actions';
import initial from '../state';

const initialState = initial.data;

export const data = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_DATA:
      return Object.assign({}, state, {
        categories: action.data.categories,
        labels: action.data.labels,
        stats: {
          installed: action.data.installed,
          trend: action.data.trend,
          updated: action.data.updated
        }
      });
    default:
      return state;
  }
};
