import { ACTION_TYPES } from '../actions';
import initial from '../state';

const initialState = initial.ui;

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.PARSE_QUERY_PARAMS: {
      const queryParams = action.queryParams;
      if (Object.keys(queryParams).length == 0) {
        return state;
      }
      // Since at least one was given it's being treated as initial state.
      return Object.assign({}, initialState, queryParams);
    }
    case ACTION_TYPES.CLEAR_QUERY:
      return Object.assign({}, state, {
        query: ''
      });
    case ACTION_TYPES.SET_QUERY:
      return Object.assign({}, state, {
        query: action.query
    });
    case ACTION_TYPES.SET_IS_SEARCHING:
      return Object.assign({}, state, {
        isSearching: true
      });
    case ACTION_TYPES.CLEAR_CRITERIA:
      return Object.assign({}, state, {
        activeCategories: initialState.activeCategories,
        activeLabels: initialState.activeLabels,
        activeQuery: initialState.activeQuery
      });
    case ACTION_TYPES.SET_SEARCH_RESULTS:
      return Object.assign({}, state, {
        activeQuery: state.query,
        isSearching: false,
        page: action.results.page,
        pages: action.results.pages,
        plugins: action.results.plugins,
        showFilter: true,
        showResults: true,
        total: action.results.total
      });
    case ACTION_TYPES.SET_SORT:
      return Object.assign({}, state, {
        sort: action.sort
      });
    case ACTION_TYPES.SET_CATEGORY:
      return Object.assign({}, state, {
        activeCategories: [ action.categoryId ]
      });
    case ACTION_TYPES.TOGGLE_CATGORY: {
      const category = action.category;
      const { activeCategories, activeLabels } = state;
      const checked = activeCategories.find((active) => active === category.id) !== undefined;
      const newActiveCategories = checked ?
        // Remove category and its labels
        activeCategories.filter((active) => active !== category.id) :
        // Add category but remove its labels.
        activeCategories.concat(category.id);
      const newActiveLabels = activeLabels.filter((active) => !category.labels.includes(active));
      return Object.assign({}, state, {
        activeCategories: newActiveCategories,
        activeLabels: newActiveLabels
      });
    }
    case ACTION_TYPES.TOGGLE_LABEL: {
      const label = action.label;
      const categoryId = action.categoryId;
      const { activeCategories, activeLabels } = state;
      const checked = activeLabels.find((active) => active === label.id) !== undefined;
      if (checked) {
        const newActiveLabels = activeLabels.filter((active) => active !== label.id);
        return Object.assign({}, state, {
          activeLabels: newActiveLabels
        });
      } else {
        const newActiveCategories = activeCategories.filter((active) => active !== categoryId);
        const newActiveLabels = activeLabels.concat(label.id);
        return Object.assign({}, state, {
          activeCategories: newActiveCategories,
          activeLabels: newActiveLabels
        });
      }
    }
    case ACTION_TYPES.TOGGLE_SHOW_FILTER: {
      const opts = action.opts;
      const showFilter = opts.forceOpen || !state.showFilter;
      return Object.assign({}, state, {
        showFilter: showFilter
      });
    }
    case ACTION_TYPES.SET_PAGE:
      return Object.assign({}, state, {
        page: action.page
      });
    case ACTION_TYPES.SET_IS_FETCHING_PLUGIN:
      return Object.assign({}, state, {
        isFetchingPlugin: true
      });
    case ACTION_TYPES.SET_PLUGIN:
      return Object.assign({}, state, {
        isFetchingPlugin: false,
        plugin: action.plugin
      });
    case ACTION_TYPES.CLEAR_PLUGIN:
      return Object.assign({}, state, {
        plugin: null
      });
    case ACTION_TYPES.SET_VIEW:
      return Object.assign({}, state, {
        view: action.view
      });
    case ACTION_TYPES.CLEAR_FIRST_VISIT:
      return Object.assign({}, state, {
          firstVisit: false
      });
    default:
      return state;
  }
};
