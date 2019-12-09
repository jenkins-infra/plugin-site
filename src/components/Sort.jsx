import PropTypes from 'prop-types';
import React from 'react';
import {RadioGroup, Radio} from 'react-radio-group';

function Sort({setSort, sort}) {
    return (
        <fieldset className="sortOptions">
            <legend>

                {'Sort '}
                {sort}
            </legend>
            <RadioGroup name="sort" selectedValue={sort} onChange={setSort}>
                <label>
                    <Radio value="relevance" />
                    {' Relevance'}
                </label>
                <label>
                    <Radio value="installed" />
                    {' Most installed'}
                </label>
                <label>
                    <Radio value="trend" />
                    {' Trending'}
                </label>
                <label>
                    <Radio value="title" />
                    {' Title'}
                </label>
                <label>
                    <Radio value="updated" />
                    {' Release date'}
                </label>
            </RadioGroup>
        </fieldset>
    );
}

Sort.propTypes = {
    setSort: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired
};

export default Sort;
