import PropTypes from 'prop-types';
import React from 'react';
import {RadioGroup, Radio} from 'react-radio-group';

const SORT_TYPES = [
    ['relevance', 'Relevance'],
    ['installed', 'Most installed'],
    ['trend', 'Trending'],
    ['title', 'Title'],
    ['updated', 'Release date']
];

function Sort({setSort, sort}) {
    return (
        <fieldset className="sortOptions">
            <legend>
                {`Sort ${SORT_TYPES.find(s => s[0] === sort)[1]}`}
            </legend>
            <RadioGroup name="sort" selectedValue={sort} onChange={setSort}>
                {SORT_TYPES.map(([key, label]) => (
                    <label key={key}>
                        <Radio value={key} />
                        {` ${label}`}
                    </label>
                ))}
            </RadioGroup>
        </fieldset>
    );
}

Sort.propTypes = {
    setSort: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired
};

export default Sort;
