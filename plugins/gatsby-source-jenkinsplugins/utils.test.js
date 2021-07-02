/**
 * @jest-environment node
 */
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const nock = require('nock');
nock.disableNetConnect();

process.env.GET_CONTENT = true;

describe('Utils', () => {
    let _reporter;
    afterEach(() => {
        nock.cleanAll();
    });
    beforeEach(async () => {
        _reporter = {
            panic: (...args) => { throw args[0]; },
            activityTimer: () => {
                return {
                    start: jest.fn(),
                    end: jest.fn(),
                };
            }
        };
    });
    it('Get plugin data for a wiki based plugin', async () => {
        nock('https://updates.jenkins.io')
            .get('/update-center.actual.json')
            .reply(200, {deprecations: [], warnings: [], plugins: {
                'ios-device-connector': {'buildDate': 'Oct 10, 2012','defaultBranch': 'master','dependencies': [],
                    'developers': [],'excerpt': 'Talks to iOS devices connected to slaves and do stuff.',
                    'gav': 'org.jenkins-ci.plugins:ios-device-connector:1.2',
                    'issueTrackers': [{'reportUrl': 'https://www.jenkins.io/participate/report-issue/redirect/#17020',
                        'type': 'jira','viewUrl': 'https://issues.jenkins.io/issues/?jql=component=17020'}],
                    'labels': ['builder','ios'],'name': 'ios-device-connector','popularity': 275,
                    'previousTimestamp': '2012-10-08T20:04:36.00Z','previousVersion': '1.1',
                    'releaseTimestamp': '2012-10-10T17:27:42.00Z','requiredCore': '1.466',
                    'scm': 'https://github.com/jenkinsci/ios-device-connector-plugin',
                    'sha1': 'B2z2wTyA8l5uwz9HqD+xhG9Hjns=',
                    'sha256': 'Tray3+tyfE6xoTu1Rge9+INkcj5y7Bgw7nPm//saiYw=','size': 1548862,
                    'title': 'iOS Device connector','url': 'https://updates.jenkins.io/download/plugins/ios-device-connector/1.2/ios-device-connector.hpi',
                    'version': '1.2','wiki': 'https://plugins.jenkins.io/ios-device-connector'}
            }});
        nock('https://www.jenkins.io')
            .get('/doc/pipeline/steps/contents.json')
            .reply(200, []);
        nock('https://raw.githubusercontent.com:443')
            .get('/jenkinsci/bom/master/bom-latest/pom.xml')
            .reply(200, '');
        nock('https://plugins.jenkins.io')
            .get('/api/plugins/?limit=100&page=1')
            .reply(200, {
                'plugins': [
                    JSON.parse(
                        await fs.promises.readFile(path.join(__dirname, '__mocks__', 'plugins.jenkins.io.api.plugin.ios-device-connector.json')).then(d => d.toString())
                    )
                ],
                'page': 1,
                'pages': 1,
                'total': 1,
                'limit': 100
            }, {'Content-Type': 'application/json'});
        nock('https://wiki.jenkins.io')
            .get('/rest/api/content?expand=body.view&title=iOS+Device+Connector+Plugin')
            .replyWithFile(200, path.join(__dirname, '__mocks__', 'wiki.jenkins.io.io-device-connector-plugin.json'), {'Content-Type': 'application/json'});

        const createNode = jest.fn().mockResolvedValue();
        const firstReleases = {'ios-device-connector': new Date(0)};
        await utils.fetchPluginData({createNode, reporter: _reporter, firstReleases});
        expect(createNode.mock.calls[0][0]).toMatchSnapshot();
    });
});
