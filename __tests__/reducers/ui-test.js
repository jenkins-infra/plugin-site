import { ACTION_TYPES } from '../../app/actions';
import { ui as reducer } from '../../app/reducers/ui';
import { ui as initialState } from '../../app/state/ui';

describe('ui reducer', () => {

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle PARSE_QUERY_PARAMS without queryParams, not modify state', () => {
    const queryParams = { };
    const action = { type: ACTION_TYPES.PARSE_QUERY_PARAMS, queryParams };
    expect(
      reducer(initialState, action)
    ).toEqual(initialState);
  });

  it('should handle PARSE_QUERY_PARAMS with queryParams, modify state', () => {
    const queryParams = {
      activeCategories: [ 'category1' ],
      activeLabels: [ 'label1' ],
      page: 5,
      query: 'Searching for something',
      sort: 'updated',
      view: 'list'
    };
    const action = { type: ACTION_TYPES.PARSE_QUERY_PARAMS, queryParams };
    const expectedState = Object.assign({}, initialState, queryParams);
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle CLEAR_QUERY', () => {
    const state = Object.assign({}, initialState, { query: 'Searching' });
    const action = { type: ACTION_TYPES.CLEAR_QUERY };
    expect(
      reducer(state, action)
    ).toEqual(initialState);
  });

  it('should handle SET_QUERY', () => {
    const query = 'Searching';
    const action = { type: ACTION_TYPES.SET_QUERY, query };
    const expectedState = Object.assign({}, initialState, { query });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle SET_IS_SEARCHING', () => {
    const action = { type: ACTION_TYPES.SET_IS_SEARCHING };
    const expectedState = Object.assign({}, initialState, { isSearching: true });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle CLEAR_CRITERIA', () => {
    const state = Object.assign({}, initialState, {
      activeCategories: [ 'category1', 'category2' ],
      activeLabels: [ 'label1', 'label2' ],
      activeQuery: 'Searching'
    });
    const action = { type: ACTION_TYPES.CLEAR_CRITERIA };
    expect(
      reducer(state, action)
    ).toEqual(initialState);
  });

  it('should handle SET_SEARCH_RESULTS', () => {
    const results = {
      page: 3,
      pages: 5,
      plugins: [ { id: 'git', name: 'git' } ],
      total: 100
    };
    const query = 'Searching';
    const action = { type: ACTION_TYPES.SET_SEARCH_RESULTS, results };
    const state = Object.assign({}, initialState, { query });
    const expectedState = Object.assign({}, state, Object.assign(results, {
      activeQuery: query, showFilter: true, showResults: true
    }));
    expect(
      reducer(state, action)
    ).toEqual(expectedState);
  });

  it('should handle SET_SORT', () => {
    const sort = 'updated';
    const action = { type: ACTION_TYPES.SET_SORT, sort };
    const expectedState = Object.assign({}, initialState, { sort });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle SET_CATEGORY', () => {
    const categoryId = 'category1';
    const action = { type: ACTION_TYPES.SET_CATEGORY, categoryId };
    const expectedState = Object.assign({}, initialState, { activeCategories: [ categoryId ] });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_CATGORY, nothing checked', () => {
    const labels = [ 'label1', 'label2', 'label3' ];
    const category = { id: 'category1', labels };
    const action = { type: ACTION_TYPES.TOGGLE_CATGORY, category };
    const expectedState = Object.assign({}, initialState, { activeCategories: [ category.id ] });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_CATGORY, category checked', () => {
    const labels = [ 'label1', 'label2', 'label3' ];
    const category = { id: 'category1', labels };
    const action = { type: ACTION_TYPES.TOGGLE_CATGORY, category };
    const state = Object.assign({}, initialState, { activeCategories: [ category.id ] });
    expect(
      reducer(state, action)
    ).toEqual(initialState);
  });

  it('should handle TOGGLE_CATGORY, category not checked but two of its labels are', () => {
    const labels = [ 'label1', 'label2', 'label3' ];
    const category = { id: 'category1', labels };
    const action = { type: ACTION_TYPES.TOGGLE_CATGORY, category };
    const state = Object.assign({}, initialState, { activeLabels: [ labels[0], labels[1] ] });
    const expectedState = Object.assign({}, initialState, { activeCategories: [ category.id ] });
    expect(
      reducer(state, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_CATGORY, category not checked but unassociated labels are', () => {
    const labels = [ 'label1', 'label2', 'label3' ];
    const category = { id: 'category1', labels };
    const activeLabels = [ 'label4', 'label5' ];
    const action = { type: ACTION_TYPES.TOGGLE_CATGORY, category };
    const state = Object.assign({}, initialState, { activeLabels });
    const expectedState = Object.assign({}, initialState, { activeCategories: [ category.id ], activeLabels });
    expect(
      reducer(state, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_CATGORY, category not checked but two of its labels and unassociated labels are', () => {
    const labels = [ 'label1', 'label2', 'label3' ];
    const category = { id: 'category1', labels };
    const activeLabels = [ labels[0], labels[1], 'label4', 'label5' ];
    const action = { type: ACTION_TYPES.TOGGLE_CATGORY, category };
    const state = Object.assign({}, initialState, { activeLabels });
    const expectedState = Object.assign({}, initialState, {
      activeCategories: [ category.id ], activeLabels: activeLabels.slice(2)
    });
    expect(
      reducer(state, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_LABEL, nothing checked', () => {
    const label = { id: 'label1' };
    const categoryId = 'category1';
    const action = { type: ACTION_TYPES.TOGGLE_LABEL, label, categoryId };
    const expectedState = Object.assign({}, initialState, { activeLabels: [ label.id ] });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_LABEL, other labels checked', () => {
    const label = { id: 'label1' };
    const categoryId = 'category1';
    const action = { type: ACTION_TYPES.TOGGLE_LABEL, label, categoryId };
    const activeLabels = [ 'label2', 'label3' ];
    const state = Object.assign({}, initialState, { activeLabels });
    const expectedState = Object.assign({}, initialState, { activeLabels: activeLabels.concat(label.id) });
    expect(
      reducer(state, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_LABEL, category checked', () => {
    const label = { id: 'label1' };
    const categoryId = 'category1';
    const action = { type: ACTION_TYPES.TOGGLE_LABEL, label, categoryId };
    const activeCategories = [ categoryId ];
    const state = Object.assign({}, initialState, { activeCategories });
    const expectedState = Object.assign({}, initialState, { activeLabels: [ label.id ] });
    expect(
      reducer(state, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_LABEL, category checked, other labels checked', () => {
    const label = { id: 'label1' };
    const categoryId = 'category1';
    const action = { type: ACTION_TYPES.TOGGLE_LABEL, label, categoryId };
    const activeCategories = [ categoryId ];
    const activeLabels = [ 'label2', 'label3' ];
    const state = Object.assign({}, initialState, { activeCategories, activeLabels });
    const expectedState = Object.assign({}, initialState, { activeLabels: activeLabels.concat(label.id) });
    expect(
      reducer(state, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_LABEL, label and other labels checked', () => {
    const label = { id: 'label1' };
    const categoryId = 'category1';
    const action = { type: ACTION_TYPES.TOGGLE_LABEL, label, categoryId };
    const activeLabels = [ label.id, 'label2', 'label3' ];
    const state = Object.assign({}, initialState, { activeLabels });
    const expectedState = Object.assign({}, initialState, { activeLabels: activeLabels.slice(1) });
    expect(
      reducer(state, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_SHOW_FILTER, not shown', () => {
    const opts = {};
    const action = { type: ACTION_TYPES.TOGGLE_SHOW_FILTER, opts };
    const expectedState = Object.assign({}, initialState, { showFilter: true });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_SHOW_FILTER, is shown', () => {
    const opts = {};
    const action = { type: ACTION_TYPES.TOGGLE_SHOW_FILTER, opts };
    const expectedState = initialState;
    expect(
      reducer(Object.assign({}, initialState, { showFilter: true }), action)
    ).toEqual(expectedState);
  });

  it('should handle TOGGLE_SHOW_FILTER, is shown but force', () => {
    const opts = { forceOpen: true };
    const action = { type: ACTION_TYPES.TOGGLE_SHOW_FILTER, opts };
    const state = Object.assign({}, initialState, { showFilter: true });
    expect(
      reducer(state, action)
    ).toEqual(state);
  });

  it('should handle SET_PAGE', () => {
    const page = 10;
    const action = { type: ACTION_TYPES.SET_PAGE, page };
    const expectedState = Object.assign({}, initialState, { page });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle SET_IS_FETCHING_PLUGIN', () => {
    const action = { type: ACTION_TYPES.SET_IS_FETCHING_PLUGIN };
    const expectedState = Object.assign({}, initialState, { isFetchingPlugin: true });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle SET_PLUGIN', () => {
    const plugin = { id: 'git', name: 'git' };
    const action = { type: ACTION_TYPES.SET_PLUGIN, plugin };
    const expectedState = Object.assign({}, initialState, { plugin });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle CLEAR_PLUGIN', () => {
    const plugin = { id: 'git', name: 'git' };
    const action = { type: ACTION_TYPES.CLEAR_PLUGIN };
    const state = Object.assign({}, initialState, { plugin });
    expect(
      reducer(state, action)
    ).toEqual(initialState);
  });

  it('should handle SET_VIEW', () => {
    const view = 'list';
    const action = { type: ACTION_TYPES.SET_VIEW, view };
    const expectedState = Object.assign({}, initialState, { view });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

  it('should handle CLEAR_FIRST_VISIT', () => {
    const action = { type: ACTION_TYPES.CLEAR_FIRST_VISIT };
    const expectedState = Object.assign({}, initialState, { firstVisit: false });
    expect(
      reducer(initialState, action)
    ).toEqual(expectedState);
  });

});
