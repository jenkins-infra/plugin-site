import React from 'react';
import querystring from 'querystring';
import {navigate} from 'gatsby';

const ucFirst = s => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();

function useFilterHooks() {
    const [query, setQuery] = React.useState('');
    const [data, setData] = React.useState({
        sort: 'relevance',
        categories: [],
        labels: [],
        view: 'Tiles',
        page: 1,
    });

    const ret = {
        ...data,
        setData,
        query, setQuery
    };

    ['sort', 'categories', 'labels', 'view', 'page'].forEach(key => {
        ret[`set${ucFirst(key)}`] = (val) => {
            const newData = {...data,[key]: val};
            navigate(`/ui/search?${querystring.stringify({...newData, query})}`);
            setData(newData);
        };
    });

    ret.clearCriteria = () => {
        ret.setCategories([]);
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
