import React from 'react';
import PropTypes from 'prop-types';
import ClipboardButton from './ClipboardButton';

function MavenDependency({gav, hasBomEntry} ) {
    const [group, artifactId, version] = gav.split(':');
    const snippet = `<dependency>
    <groupId>${group}</groupId>
    <artifactId>${artifactId}</artifactId>${hasBomEntry ? '':`\n    <version>${version}</version>`}
</dependency>`;
    return (
        <>
            <h3>Declaring a dependency</h3>
            <p>As a plugin developer you can use this plugin as dependency of your plugin by adding a dependency tag to your POM.</p>
            {!hasBomEntry && <p>To add the latest version of this plugin as a maven dependency, use the following:</p>}
            {hasBomEntry && <p>
                <>
                    To avoid version conflicts it is suggested not to depend on a specific version, but use the
                    {' '}
                    <a href="https://github.com/jenkinsci/bom#readme">Jenkins plugin BOM</a>
                    {' '}
                    and the following dependency snippet:
                </>
            </p>}
            <div className="code-wrapper position-relative">
                <pre>
                    {snippet}
                </pre>
                <ClipboardButton content={snippet}/>
            </div>
        </>
    );
}

MavenDependency.propTypes = {
    gav: PropTypes.string.isRequired,
    hasBomEntry: PropTypes.bool
};

export default MavenDependency;
