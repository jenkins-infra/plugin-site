import {actions, ACTION_TYPES} from '../../app/actions';
import initialState from '../../app/state';

import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {

    afterEach(() => {
        nock.cleanAll();
    });

    it('should parse query params but not search', () => {
        const queryParams = {
        };
        const expectedActions = [
            {type: ACTION_TYPES.PARSE_QUERY_PARAMS, queryParams}
        ];
        const store = mockStore(initialState);
        return store.dispatch(actions.parseQueryParams(queryParams))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should parse query params then search', () => {
        const queryParams = {
            q: 'Searching for stuff'
        };
        const results = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.PARSE_QUERY_PARAMS, queryParams},
            {type: ACTION_TYPES.SET_IS_SEARCHING},
            {type: ACTION_TYPES.SET_SEARCH_RESULTS, results}
        ];
        nock(__REST_API_URL__)
            .get('/plugins')
            .query(() => true)
            .reply(200, results);
        const store = mockStore(initialState);
        return store.dispatch(actions.parseQueryParams(queryParams))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should clear query params then search', () => {
        const results = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.CLEAR_QUERY},
            {type: ACTION_TYPES.SET_IS_SEARCHING},
            {type: ACTION_TYPES.SET_SEARCH_RESULTS, results}
        ];
        nock(__REST_API_URL__)
            .get('/plugins')
            .query(() => true)
            .reply(200, results);
        const store = mockStore(initialState);
        return store.dispatch(actions.clearQuery())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should set query', () => {
        const query = 'Searching for stuff';
        const expectedAction = {type: ACTION_TYPES.SET_QUERY, query};
        expect(actions.setQuery(query)).toEqual(expectedAction);
    });

    it('should set searching', () => {
        const expectedAction = {type: ACTION_TYPES.SET_IS_SEARCHING};
        expect(actions.setIsSearching()).toEqual(expectedAction);
    });

    it('should clear criteria then search', () => {
        const results = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.CLEAR_CRITERIA},
            {type: ACTION_TYPES.SET_IS_SEARCHING},
            {type: ACTION_TYPES.SET_SEARCH_RESULTS, results}
        ];
        nock(__REST_API_URL__)
            .get('/plugins')
            .query(() => true)
            .reply(200, results);
        const store = mockStore(initialState);
        return store.dispatch(actions.clearCriteria())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should set search results', () => {
        const results = { }; // Don't care here. That's up to the reducer
        const expectedAction = {type: ACTION_TYPES.SET_SEARCH_RESULTS, results};
        expect(actions.setSearchResults(results)).toEqual(expectedAction);
    });

    it('should set sort then search', () => {
        const sort = 'relevance';
        const results = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.SET_SORT, sort},
            {type: ACTION_TYPES.SET_IS_SEARCHING},
            {type: ACTION_TYPES.SET_SEARCH_RESULTS, results}
        ];
        nock(__REST_API_URL__)
            .get('/plugins')
            .query(() => true)
            .reply(200, results);
        const store = mockStore(initialState);
        return store.dispatch(actions.setSort(sort))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should set category after clearing criteria then search', () => {
        const categoryId = 'categoryId';
        const results = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.CLEAR_CRITERIA},
            {type: ACTION_TYPES.SET_CATEGORY, categoryId},
            {type: ACTION_TYPES.SET_IS_SEARCHING},
            {type: ACTION_TYPES.SET_SEARCH_RESULTS, results}
        ];
        nock(__REST_API_URL__)
            .get('/plugins')
            .query(() => true)
            .reply(200, results);
        const store = mockStore(initialState);
        return store.dispatch(actions.setCategory(categoryId))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should toggle category then search', () => {
        const category = { }; // Don't care here. That's up to the reducer
        const results = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.TOGGLE_CATGORY, category},
            {type: ACTION_TYPES.SET_IS_SEARCHING},
            {type: ACTION_TYPES.SET_SEARCH_RESULTS, results}
        ];
        nock(__REST_API_URL__)
            .get('/plugins')
            .query(() => true)
            .reply(200, results);
        const store = mockStore(initialState);
        return store.dispatch(actions.toggleCategory(category))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should toggle label then search', () => {
        const label = { }; // Don't care here. That's up to the reducer
        const categoryId = 'categoryId'; // Don't care here. That's up to the reducer
        const results = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.TOGGLE_LABEL, label, categoryId},
            {type: ACTION_TYPES.SET_IS_SEARCHING},
            {type: ACTION_TYPES.SET_SEARCH_RESULTS, results}
        ];
        nock(__REST_API_URL__)
            .get('/plugins')
            .query(() => true)
            .reply(200, results);
        const store = mockStore(initialState);
        return store.dispatch(actions.toggleLabel(label, categoryId))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should toggle show filter, default not force open', () => {
        const expectedAction = {type: ACTION_TYPES.TOGGLE_SHOW_FILTER, opts: {forceOpen: false}};
        expect(actions.toggleShowFilter()).toEqual(expectedAction);
    });

    it('should toggle show filter, force open', () => {
        const opts = {forceOpen: true};
        const expectedAction = {type: ACTION_TYPES.TOGGLE_SHOW_FILTER, opts};
        expect(actions.toggleShowFilter(opts)).toEqual(expectedAction);
    });

    it('should set page then search', () => {
        const page = 1; // Don't care here. That's up to the reducer
        const results = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.SET_PAGE, page},
            {type: ACTION_TYPES.SET_IS_SEARCHING},
            {type: ACTION_TYPES.SET_SEARCH_RESULTS, results}
        ];
        nock(__REST_API_URL__)
            .get('/plugins')
            .query(() => true)
            .reply(200, results);
        const store = mockStore(initialState);
        return store.dispatch(actions.setPage(page))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should set view', () => {
        const view = 'list'; // Don't care here. That's up to the reducer
        const expectedAction = {type: ACTION_TYPES.SET_VIEW, view};
        expect(actions.setView(view)).toEqual(expectedAction);
    });

    it('should set data', () => {
        const data = { }; // Don't care here. That's up to the reducer
        const expectedAction = {type: ACTION_TYPES.SET_DATA, data};
        expect(actions.setData(data)).toEqual(expectedAction);
    });

    it('should search', () => {
        const results = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.SET_IS_SEARCHING},
            {type: ACTION_TYPES.SET_SEARCH_RESULTS, results}
        ];
        nock(__REST_API_URL__)
            .get('/plugins')
            .query(() => true)
            .reply(200, results);
        const store = mockStore(initialState);
        return store.dispatch(actions.search())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should clearPlugin', () => {
        const expectedAction = {type: ACTION_TYPES.CLEAR_PLUGIN};
        expect(actions.clearPlugin()).toEqual(expectedAction);
    });

    it('should get plugin', () => {
        const name = 'git';
        const plugin = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.SET_IS_FETCHING_PLUGIN},
            {type: ACTION_TYPES.SET_PLUGIN, plugin}
        ];
        nock(__REST_API_URL__)
            .get(`/plugin/${name}`)
            .query(() => true)
            .reply(200, plugin);
        const store = mockStore(initialState);
        return store.dispatch(actions.getPlugin(name))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should set plugin', () => {
        const plugin = { }; // Don't care here. That's up to the reducer
        const expectedAction = {type: ACTION_TYPES.SET_PLUGIN, plugin};
        expect(actions.setPlugin(plugin)).toEqual(expectedAction);
    });


    it('should load initial data', () => {
        const data = { }; // Don't care here. That's up to the reducer
        const expectedActions = [
            {type: ACTION_TYPES.SET_DATA, data}
        ];
        const mockCall = (uri) => {
            nock(__REST_API_URL__)
                .get(uri)
                .query(() => true)
                .reply(200, data);
        };
        mockCall('/categories');
        mockCall('/labels');
        mockCall('/info');
        mockCall('/plugins/new');
        mockCall('/plugins/updated');
        mockCall('/plugins/trend');
        const store = mockStore(initialState);
        return store.dispatch(actions.loadInitialData())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should clear first visit', () => {
        const expectedAction = {type: ACTION_TYPES.CLEAR_FIRST_VISIT};
        expect(actions.clearFirstVisit()).toEqual(expectedAction);
    });

});
