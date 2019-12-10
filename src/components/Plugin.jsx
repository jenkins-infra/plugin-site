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
    position: relative;
    height: 100%;
`;

const IconContainer = styled.div`
    position: absolute;
    z-index: 9;
    bottom: .25rem;
    right: .25rem;
    display: block;
    opacity: .75;

    i {
        text-align: center;
        display: inline-block;
        font-size: 1.33rem;
        color: #fff;
        height: 3rem;
        width: 3rem;
        border-radius: 3px;
        line-height: 3rem;
        font-style: normal;
        margin: -1px 0 0 -1px;
        margin-bottom: 0px;
        text-shadow: rgba(0, 0, 0, .5) 1px 2px 1px;
    }
`;

const TitleContainer = styled.div`
    h4 {
        font-size: 1rem;
        margin: 0 0 .25rem;
        line-height: 1.1rem;
        max-height: 2.2rem;
        overflow: hidden;
        font-weight: normal;
        color: #000;
        font-weight: normal;
        position: relative;
    }
`;

const InstallsContainer = styled.div`
    padding: 0;
    margin: 0;
    font-size: .75rem;
    color: #999;
`;

const VersionContainer = styled.div`
    font-size: .75rem;
    color: #59a;
    margin-right: .5rem;
    line-height: 1rem;
    span {
        margin-right: .25rem;
    }
`;

const LabelsContainer = styled.div`
    margin: .25rem 0;
    max-height: 2rem;
    min-height: 1rem;
    overflow: hidden;
    line-height: .75rem;

    div {
        display: inline;
        font-size: .75rem;
        color: #59a;
        margin-right: .25rem;
        line-height: 1rem;
    }
    div:after {
        content: ", ";
    }
    div:last-child:after {
        content: "";
    }
`;


const ExcerptContainer = styled.div`
    white-space: normal;
    line-height: 1.1rem;
    height: 4.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    margin: 0;
    padding: 0;
    max-height: 4.4rem;
    min-height: .5rem;
    word-wrap: break-word;
`;

const AuthorsContainer = styled.div`
    position: absolute;
    bottom: 1rem;
    max-width: 8rem;
    overflow: hidden;
    white-space: nowrap;

    div {
        font-size: .75rem;
        color: #59a;
        margin-right: .5rem;
        line-height: 1rem;
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
                <span className="v">{version}</span>
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
                <PluginMaintainers maintainers={maintainers} />
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
