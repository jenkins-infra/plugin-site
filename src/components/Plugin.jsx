import PropTypes from 'prop-types';
import React from 'react';

import {navigate} from 'gatsby';
import styled from '@emotion/styled';

import {cleanTitle} from '../commons/helper';
import Icon from '../components/Icon';
import PluginLabels from '../components/PluginLabels';
import PluginMaintainers from '../components/PluginMaintainers';

function Maintainers({maintainers}) {
    return (
        <>
            <PluginMaintainers maintainers={maintainers.slice(0, 2)} />
            {maintainers.length > 2 && (
                <div key="more_maintainers">
                    {`(${maintainers.length - 2} other contributers)`}
                </div>
            )}
        </>
    );
}

Maintainers.propTypes = PluginMaintainers.propTypes;

const PluginContainer = styled.div`
    height: 100%;
    position: relative;
`;

const IconContainer = styled.div`
    bottom: 0.25rem;
    display: block;
    opacity: 0.75;
    position: absolute;
    right: 0.25rem;
    z-index: 9;

    i {
        border-radius: 3px;
        color: #fff;
        display: inline-block;
        font-size: 1.33rem;
        font-style: normal;
        height: 3rem;
        line-height: 3rem;
        margin: -1px 0 0 -1px;
        margin-bottom: 0;
        text-align: center;
        text-shadow: rgba(0, 0, 0, 0.5) 1px 2px 1px;
        width: 3rem;
    }
`;

const TitleContainer = styled.div`
    h4 {
        color: #000;
        font-size: 1rem;
        font-weight: normal;
        line-height: 1.1rem;
        margin: 0 0 0.25rem;
        max-height: 2.2rem;
        overflow: hidden;
        position: relative;
    }
`;

const InstallsContainer = styled.div`
    color: #999;
    font-size: 0.75rem;
    margin: 0;
    padding: 0;
`;

const VersionContainer = styled.div`
    color: #59a;
    font-size: 0.75rem;
    line-height: 1rem;
    margin-right: 0.5rem;

    span {
        margin-right: 0.25rem;
    }
`;

const LabelsContainer = styled.div`
    line-height: 0.75rem;
    margin: 0.25rem 0;
    max-height: 2rem;
    min-height: 1rem;
    overflow: hidden;

    div {
        color: #59a;
        display: inline;
        font-size: 0.75rem;
        line-height: 1rem;
        margin-right: 0.25rem;
    }

    div::after {
        content: ", ";
    }

    div:last-child::after {
        content: "";
    }
`;


const ExcerptContainer = styled.div`

    height: 4.4rem;
    line-height: 1.1rem;
    margin: 0;
    max-height: 4.4rem;
    min-height: 0.5rem;
    overflow: hidden;
    padding: 0;
    position: relative;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
`;

const AuthorsContainer = styled.div`

    bottom: 1rem;
    max-width: 8rem;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;

    div {
        color: #59a;
        font-size: 0.75rem;
        line-height: 1rem;
        margin-right: 0.5rem;
    }
`;

function Plugin({plugin: {name, title, stats, version, requiredCore, labels, excerpt, maintainers}}) {
    return (
        <PluginContainer onClick={() => { navigate(`/${name}`); }}>
            <IconContainer>
                <Icon title={title} />
            </IconContainer>
            <TitleContainer>
                <h4>{cleanTitle(title)}</h4>
            </TitleContainer>
            <InstallsContainer>
                {'Installs:  '}
                {stats.currentInstalls}
            </InstallsContainer>
            <VersionContainer>
                <span className="jc">
                    <span className="j">Jenkins</span>
                    <span className="c">{`${requiredCore} +`}</span>
                </span>
            </VersionContainer>
            <LabelsContainer>
                <PluginLabels labels={labels} />
            </LabelsContainer>
            <ExcerptContainer dangerouslySetInnerHTML={{__html: excerpt}} />
            <AuthorsContainer>
                <Maintainers maintainers={maintainers} />
            </AuthorsContainer>
        </PluginContainer>
    );
}

Plugin.propTypes = {
    plugin: PropTypes.shape({
        excerpt: PropTypes.string,
        labels: PropTypes.arrayOf(PropTypes.string),
        maintainers: PropTypes.arrayOf(PropTypes.shape({
            email: PropTypes.string,
            id: PropTypes.string,
            name: PropTypes.string
        })),
        name: PropTypes.string.isRequired,
        requiredCore: PropTypes.string,
        sha1: PropTypes.string,
        stats: PropTypes.shape({
            currentInstalls: PropTypes.number
        }).isRequired,
        title: PropTypes.string.isRequired,
        version: PropTypes.string,
        wiki: PropTypes.shape({
            url: PropTypes.string
        }).isRequire,
    }).isRequired
};

export default Plugin;
