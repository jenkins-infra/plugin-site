/**
 * @jest-environment node
 */
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const nock = require('nock');
nock.disableNetConnect();

process.env.GET_CONTENT = true;

const readText = async (fileName) => {const buffer = await fs.promises.readFile(path.join(__dirname, '__mocks__', fileName)); return buffer.toString();};

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
    it('Fix GitHub URL: submodule gets expanded', () => {
        expect(utils.fixGitHubUrl('https://github.com/jenkinsci/blueocean-plugin/blueocean-bitbucket-pipeline', 'master'))
            .toBe('https://github.com/jenkinsci/blueocean-plugin/tree/master/blueocean-bitbucket-pipeline');
    });
    it('Fix GitHub URL: expanded stays expanded', () => {
        expect(utils.fixGitHubUrl('https://github.com/jenkinsci/blueocean-plugin/tree/master/blueocean-bitbucket-pipeline', 'master'))
            .toBe('https://github.com/jenkinsci/blueocean-plugin/tree/master/blueocean-bitbucket-pipeline');
    });
    it('Fix GitHub URL: no submodule, keep short', () => {
        expect(utils.fixGitHubUrl('https://github.com/jenkinsci/junit-plugin', ''))
            .toBe('https://github.com/jenkinsci/junit-plugin');
    });
    it('Get plugin data for a wiki based plugin', async () => {
        nock('https://updates.jenkins.io')
            .get('/update-center.actual.json')
            .reply(200, JSON.parse(await readText('update-center.actual.json')));
        nock('https://updates.jenkins.io')
            .get('/current/plugin-documentation-urls.json')
            .reply(200, '{"ios-device-connector":{"url":"https://wiki.jenkins-ci.org/display/JENKINS/iOS+Device+Connector+Plugin"}}');
        nock('https://www.jenkins.io')
            .get('/doc/pipeline/steps/contents.json')
            .reply(200, []);
        nock('https://raw.githubusercontent.com:443')
            .get('/jenkinsci/bom/master/bom-latest/pom.xml')
            .reply(200, '');
        nock('https://raw.githubusercontent.com:443')
            .get('/jenkinsci/jenkins/master/core/src/main/resources/jenkins/split-plugins.txt')
            .reply(200, await readText('split-plugins.txt'));
        nock('https://plugins.jenkins.io').persist()
            .get(/\/api\/plugin\/.*/)
            .reply(200, '{"wiki":{"content": ""}}');
        nock('https://wiki.jenkins.io')
            .get('/rest/api/content?expand=body.view&title=iOS+Device+Connector+Plugin')
            .replyWithFile(200, path.join(__dirname, '__mocks__', 'wiki.jenkins.io.io-device-connector-plugin.json'), {'Content-Type': 'application/json'});

        const createNode = jest.fn().mockResolvedValue();
        const firstReleases = {'ios-device-connector': new Date(0)};
        const labelToCategory = {'ios': 'languagesPlatforms', 'builder': 'buildManagement'};
        const stats = {
            'core': {'installations': [{total: 300000}, {total: 300000}]},
            'ios-device-connector': {'currentInstalls': 269, 'installations': [
                {'timestamp': 1590984000000, 'total': 349},
                {'timestamp': 1593576000000, 'total': 348},
                {'timestamp': 1596254400000, 'total': 341},
                {'timestamp': 1598932800000, 'total': 347},
                {'timestamp': 1601524800000, 'total': 318},
                {'timestamp': 1604203200000, 'total': 325},
                {'timestamp': 1606798800000, 'total': 312},
                {'timestamp': 1609477200000, 'total': 301},
                {'timestamp': 1612155600000, 'total': 297},
                {'timestamp': 1614574800000, 'total': 303},
                {'timestamp': 1617249600000, 'total': 290},
                {'timestamp': 1619841600000, 'total': 275},
                {'timestamp': 1622520000000, 'total': 269}]}
        };
        await utils.fetchPluginData({createNode, reporter: _reporter, firstReleases, labelToCategory, stats});
        expect(createNode.mock.calls[0][0]).toMatchSnapshot();
    });
});
