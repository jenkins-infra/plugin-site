import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import TimeAgo from 'react-timeago';
import MavenDependency from './MavenDependency';
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
import {formatter} from '../commons/helper';

const SORT_ASC = 'asc';
const SORT_DESC = 'desc';

function SortableTable({columns, rows, rowKey}) {
    const [sortCol, setSortCol] = React.useState(columns[0].key);
    const [sortDir, setSortDir] = React.useState(SORT_ASC);

    const handleSort = (col) => {
        if (col === sortCol) {
            setSortDir(d => d === SORT_ASC ? SORT_DESC : SORT_ASC);
        } else {
            setSortCol(col);
            setSortDir(SORT_ASC);
        }
    };

    const sorted = [...rows].sort((a, b) => {
        const av = (a[sortCol] ?? '').toLowerCase();
        const bv = (b[sortCol] ?? '').toLowerCase();
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === SORT_ASC ? cmp : -cmp;
    });

    const indicator = (col) => sortCol === col ? (sortDir === SORT_ASC ? ' ▲' : ' ▼') : '';

    return (
        <div className="table-responsive">
            <table className="table table-sm">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                scope="col"
                                style={col.sortable !== false ? {cursor: 'pointer'} : undefined}
                                onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                            >
                                {col.label}
                                {col.sortable !== false && indicator(col.key)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sorted.map(row => (
                        <tr key={rowKey(row)}>
                            {columns.map(col => (
                                <td key={col.key}>{col.render(row)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

SortableTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        sortable: PropTypes.bool,
        render: PropTypes.func.isRequired,
    })).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowKey: PropTypes.func.isRequired,
};

const DEP_COLUMNS = [
    {
        key: 'title',
        label: 'Plugin',
        render: (dep) => (<>
            {dep.deprecated && '⚠️ '}
            <Link to={`/${dep.name}/dependencies/`}>{dep.title}</Link>
        </>),
    },
    {
        key: 'version',
        label: 'Required Version',
        sortable: false,
        render: (dep) => dep.version ? `≥ ${dep.version}` : '—',
    },
    {
        key: 'latestVersion',
        label: 'Last Version',
        sortable: false,
        render: (dep) => (dep.latestVersion && dep.latestVersion !== dep.version) ? dep.latestVersion : '—',
    },
];

const REV_DEP_COLUMNS = [
    {
        key: 'dependentTitle',
        label: 'Plugin',
        render: (dep) => (<>
            {dep.dependentDeprecated && '⚠️ '}
            <Link to={`/${dep.dependentName}/dependencies/`}>{dep.dependentTitle}</Link>
        </>),
    },
    {
        key: 'dependentVersion',
        label: 'Version',
        sortable: false,
        render: (dep) => dep.dependentVersion ?? '—',
    },
    {
        key: 'dependentReleaseTimestamp',
        label: 'Released',
        render: (dep) => dep.dependentReleaseTimestamp
            ? <TimeAgo date={new Date(dep.dependentReleaseTimestamp)} formatter={formatter} />
            : '—',
    },
    {
        key: 'version',
        label: 'Required Version',
        render: (dep) => dep.version ?? '—',
    },
];

function renderByType(rows, columns, rowKey, onImpliedClick) {
    const optional = rows.filter(dep => dep.optional);
    const implied = rows.filter(dep => dep.implied && !dep.optional);
    const required = rows.filter(dep => !dep.implied && !dep.optional);
    const hasGroups = optional.length + implied.length > 0;
    return (
        <div>
            {hasGroups && <h3>Required</h3>}
            {required.length > 0 && <SortableTable columns={columns} rows={required} rowKey={rowKey} />}
            {optional.length > 0 && <h3>Optional</h3>}
            {optional.length > 0 && <SortableTable columns={columns} rows={optional} rowKey={rowKey} />}
            {implied.length > 0 && (
                <h3>
                    Implied
                    {' '}
                    <a href="#" onClick={onImpliedClick}><span className="req">(what&apos;s this?)</span></a>
                </h3>
            )}
            {implied.length > 0 && <SortableTable columns={columns} rows={implied} rowKey={rowKey} />}
        </div>
    );
}

function PluginDependencies({dependencies, reverseDependencies, gav, hasBomEntry}) {
    const [isShowImplied, setShowImplied] = React.useState(false);
    const toggleShowImplied = (e) => {
        e && e.preventDefault();
        setShowImplied(!isShowImplied);
    };

    return (
        <div className="content pb-3" id="pluginDependencies">
            <h2>Dependencies</h2>
            <Modal placement="bottom" isOpen={isShowImplied} target="pluginDependencies" toggle={toggleShowImplied}>
                <ModalHeader toggle={toggleShowImplied}>About Implied Plugin Dependencies</ModalHeader >
                <ModalBody>
                    <div>
                        <p>
                            Features are sometimes detached (or split off) from Jenkins core and moved into a plugin.
                            Many plugins, like Subversion or JUnit, started as features of Jenkins core.
                        </p>
                        <p>
                            Plugins that depend on a Jenkins core version before such a plugin was detached from core may or may not actually use any of its features.
                            To ensure that plugins don&apos;t break whenever functionality they depend on is detached from Jenkins core, it is considered to have a dependency on the detached plugin if it declares a dependency on a version of Jenkins core before the split.
                            Since that dependency to the detached plugin is not explicitly specified, it is
                            {' '}
                            <em>implied</em>
                            .
                        </p>
                        <p>
                            Plugins that don&apos;t regularly update which Jenkins core version they depend on will accumulate implied dependencies over time.
                        </p>
                    </div>
                </ModalBody>
            </Modal>
            {
                dependencies.length
                    ? renderByType(dependencies, DEP_COLUMNS, (dep) => dep.name, toggleShowImplied)
                    : (<div className="empty">No dependencies found</div>)
            }
            <h2>Dependent plugins</h2>
            <MavenDependency gav={gav} hasBomEntry={hasBomEntry}/>
            {
                reverseDependencies.length
                    ? renderByType(reverseDependencies, REV_DEP_COLUMNS, (dep) => dep.dependentName, toggleShowImplied)
                    : (<div className="empty">No dependent plugins found</div>)
            }
        </div>
    );
}

PluginDependencies.propTypes = {
    dependencies: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            version: PropTypes.string.isRequired,
            latestVersion: PropTypes.string,
            deprecated: PropTypes.bool,
            optional: PropTypes.bool,
            implied: PropTypes.bool
        })
    ),
    reverseDependencies: PropTypes.arrayOf(
        PropTypes.shape({
            dependentName: PropTypes.string.isRequired,
            dependentTitle: PropTypes.string.isRequired,
            dependentVersion: PropTypes.string,
            dependentReleaseTimestamp: PropTypes.string,
            dependentDeprecated: PropTypes.bool,
            version: PropTypes.string,
            optional: PropTypes.bool,
            implied: PropTypes.bool,
        })
    ),
    gav: PropTypes.string,
    hasBomEntry: PropTypes.bool
};

export default PluginDependencies;
