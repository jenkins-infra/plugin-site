import React from 'react';
import querystring from 'querystring';
import {navigate} from 'gatsby';

const ucFirst = s => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();
const DEFAULT_DATA = {
    sort: 'relevance',
    categories: [],
    labels: [],
    view: 'Tiles',
    page: 1,
};

function useFilterHooks({doSearch, setResults, categoriesMap}) {
    const [data, setData] = React.useState(DEFAULT_DATA);

    const ret = {
        ...data,
        setData
    };

    ret.clearQuery = () => ret.setQuery('');

    ret.setData = (newData) => {
        delete newData[''];
        if (!Array.isArray(newData.categories)) {
            newData.categories = [newData.categories];
        }
        if (!Array.isArray(newData.labels)) {
            newData.labels = [newData.labels];
        }
        newData = {...DEFAULT_DATA, ...newData};
        setData(newData);
    };

    ['sort', 'categories', 'labels', 'view', 'page', 'query'].forEach(key => {
        ret[`set${ucFirst(key)}`] = (val) => {
            const newData = {...data, [key]: val};
            if (key != 'page') {
                newData.page = 1;
            }
            navigate(`/ui/search?${querystring.stringify({...newData})}`);
            ret.setData(newData);
            doSearch(newData, setResults, categoriesMap);
        };
    });

    ret['setQuerySilent'] = (val) => {
        const newData = {...data, query: val, page: 1};
        ret.setData(newData);
    };

    ret.clearCriteria = () => {
        ret.setCategories([]);
        ret.setLabels([]);
    };

    ret.toggleCategory = (category) => {
        const vals = new Set(data.categories);
        if (vals.has(category.id)) {
            vals.delete(category.id);
        } else {
            vals.add(category.id);
        }
        ret.setCategories(Array.from(vals).filter(Boolean));
    };

    ret.toggleLabel = (label) => {
        const vals = new Set(data.labels);
        if (vals.has(label.id)) {
            vals.delete(label.id);
        } else {
            vals.add(label.id);
        }
        ret.setLabels(Array.from(vals).filter(Boolean));
    };

    if (!Array.isArray(ret.categories)) {
        ret.categories = [ret.categories];
    }
    if (!Array.isArray(ret.labels)) {
        ret.labels = [ret.labels];
    }
    return ret;
}

export default useFilterHooks;
