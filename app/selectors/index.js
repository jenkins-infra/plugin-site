import { createSelector } from 'reselect';

const ui = (state) => state.ui;
const data = (state) => state.data;

export const activeCategories = createSelector([ui], ui => ui.activeCategories);
export const activeLabels = createSelector([ui], ui => ui.activeLabels);
export const activeQuery = createSelector([ui], ui => ui.activeQuery);
export const firstVisit = createSelector([ui], ui => ui.firstVisit);
export const isFetchingPlugin = createSelector([ui], ui => ui.isFetchingPlugin);
export const isFiltered = createSelector([ui], ui => ui.isFiltered);
export const isSearching = createSelector([ui], ui => ui.isSearching);
export const limit = createSelector([ui], ui => ui.limit);
export const page = createSelector([ui], ui => ui.page);
export const pages = createSelector([ui], ui => ui.pages);
export const plugin = createSelector([ui], ui => ui.plugin);
export const plugins = createSelector([ui], ui => ui.plugins);
export const query = createSelector([ui], ui => ui.query);
export const showFilter = createSelector([ui], ui => ui.showFilter);
export const showResults = createSelector([ui], ui => ui.showResults);
export const sort = createSelector([ui], ui => ui.sort);
export const total = createSelector([ui], ui => ui.total);
export const view = createSelector([ui], ui => ui.view);

export const categories = createSelector([data], data => data.categories);
export const info = createSelector([data], data => data.info);
export const labels = createSelector([data], data => data.labels);
export const installed = createSelector([data], data => data.stats.installed);
export const trend = createSelector([data], data => data.stats.trend);
export const updated = createSelector([data], data => data.stats.updated);
