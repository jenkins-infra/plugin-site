/**
 * @jest-environment node
 */
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const nock = require('nock');


const readText = async (fileName) => {const buffer = await fs.promises.readFile(path.join(__dirname, '__mocks__', fileName)); return buffer.toString();};

describe('utils', () => {
    let _reporter;
    beforeEach(async () => {
        process.env.GET_CONTENT = true;
        nock.disableNetConnect();

        _reporter = {
            panic: (...args) => {throw args[0];},
            error: jest.fn(),
            activityTimer: () => {
                return {
                    start: jest.fn(),
                    end: jest.fn(),
                };
            }
        };
    });
    afterEach(() => {
        nock.cleanAll();
    });
    it('fix GitHub URL: submodule gets expanded', () => {
        expect(utils.fixGitHubUrl('https://github.com/jenkinsci/blueocean-plugin/blueocean-bitbucket-pipeline', 'master'))
            .toBe('https://github.com/jenkinsci/blueocean-plugin/tree/master/blueocean-bitbucket-pipeline');
    });
    it('fix GitHub URL: expanded stays expanded', () => {
        expect(utils.fixGitHubUrl('https://github.com/jenkinsci/blueocean-plugin/tree/master/blueocean-bitbucket-pipeline', 'master'))
            .toBe('https://github.com/jenkinsci/blueocean-plugin/tree/master/blueocean-bitbucket-pipeline');
    });
    it('fix GitHub URL: no submodule, keep short', () => {
        expect(utils.fixGitHubUrl('https://github.com/jenkinsci/junit-plugin', ''))
            .toBe('https://github.com/jenkinsci/junit-plugin');
    });
    it('get plugin data for a wiki based plugin', async () => {
        nock('https://updates.jenkins.io')
            .get('/update-center.actual.json')
            .reply(200, JSON.parse(await readText('update-center.actual.json')));
        nock('https://updates.jenkins.io')
            .get('/current/plugin-documentation-urls.json')
            .reply(200, '{"ios-device-connector":{"url":"https://wiki.jenkins-ci.org/display/JENKINS/iOS+Device+Connector+Plugin"}}');
        nock('https://www.jenkins.io')
            .get('/doc/pipeline/steps/contents.json')
            .reply(200, []);
        nock('https://www.jenkins.io')
            .get('/doc/developer/extensions/contents.json')
            .reply(200, []);
        nock('https://raw.githubusercontent.com:443')
            .get('/jenkinsci/bom/master/bom-weekly/pom.xml')
            .reply(200, '');
        nock('https://raw.githubusercontent.com:443')
            .get('/jenkinsci/jenkins/master/core/src/main/resources/jenkins/split-plugins.txt')
            .reply(200, await readText('split-plugins.txt'));
        nock('https://raw.githubusercontent.com:443')
            .get('/jenkinsci/jenkins/master/core/src/main/resources/jenkins/canonical-labels.txt')
            .reply(200, '');
        nock('https://plugins.jenkins.io').persist()
            .get(/\/api\/plugin\/.*/)
            .reply(200, '{"wiki":{"content": "<p>This plugin lists up all the iOS devices connected to the master and all the Jenkins slaves, and provide operations to them.</p>"}}');

        const createNode = jest.fn().mockResolvedValue();
        const createContentDigest = require('gatsby-core-utils').createContentDigest;
        const createNodeId = jest.fn(key => key);
        const firstReleases = {'ios-device-connector': new Date(0)};
        const labelToCategory = {'ios': 'languagesPlatforms', 'builder': 'buildManagement'};
        const stats = {
            'core': {'installations': [{total: 300000}, {total: 300000}]},
            'ios-device-connector': {
                'currentInstalls': 269, 'installations': [
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
                    {'timestamp': 1622520000000, 'total': 269}]
            }
        };
        await utils.fetchPluginData({createNode, createNodeId, createContentDigest, reporter: _reporter, firstReleases, labelToCategory, stats});
        expect(createNode.mock.calls.filter(call => call[0].name === 'ios-device-connector').map(args => args[0])).toMatchSnapshot();
    });
    describe('findReadmeFromGenericGithub', () => {
        let _createWikiNode;
        let _requestGET;

        beforeEach(() => {
            _requestGET = jest.fn();
            _createWikiNode = jest.fn().mockReturnValue(Promise.resolve('createWikiNode Was Success'));
        });

        it('should do nothing if not a github url', async () => {
            const fetched = await utils.findReadmeFromGenericGithub({
                wikiUrl: 'https://support.testsigma.com/support/solutions/articles/32000022660-how-to-integrate-jenkins-ci-cd-tool-in-testsigma',
                defaultBranch: 'master',
                requestGET: _requestGET,
                reporter: _reporter,
                createWikiNode: _createWikiNode,
            });
            expect(fetched).toBeNull();
            expect(_createWikiNode.mock.calls).toEqual([]); // eslint-disable-line jest/prefer-strict-equal
            expect(_requestGET.mock.calls).toEqual([]);// eslint-disable-line jest/prefer-strict-equal
        });

        it('should attempt 4 urls', async () => {
            _requestGET.mockResolvedValue();

            const fetched = await utils.findReadmeFromGenericGithub({
                wikiUrl: 'https://github.com/jenkinsci/configuration-as-code-plugin',
                defaultBranch: 'master',
                requestGET: _requestGET,
                reporter: _reporter,
                createWikiNode: _createWikiNode,
            });

            expect(fetched).toBeNull();
            expect(_reporter.error.mock.calls).toEqual([]); // eslint-disable-line jest/prefer-strict-equal
            expect(_createWikiNode.mock.calls).toEqual([]); // eslint-disable-line jest/prefer-strict-equal
            expect(_requestGET.mock.calls).toEqual([ // eslint-disable-line jest/prefer-strict-equal
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/configuration-as-code-plugin/master/README.md', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/configuration-as-code-plugin/master/readme.md', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/configuration-as-code-plugin/master/README.adoc', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/configuration-as-code-plugin/master/readme.adoc', skipError: true}],
            ]);
        });

        it('should handle tree/ urls', async () => {
            _requestGET.mockResolvedValue();

            const fetched = await utils.findReadmeFromGenericGithub({
                wikiUrl: 'https://github.com/jenkinsci/cloudify-plugin/tree/cloudify-1.0.8',
                defaultBranch: 'master',
                requestGET: _requestGET,
                reporter: _reporter,
                createWikiNode: _createWikiNode,
            });

            expect(fetched).toBeNull();
            expect(_reporter.error.mock.calls).toEqual([]); // eslint-disable-line jest/prefer-strict-equal
            expect(_createWikiNode.mock.calls).toEqual([]); // eslint-disable-line jest/prefer-strict-equal
            expect(_requestGET.mock.calls).toEqual([ // eslint-disable-line jest/prefer-strict-equal
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/README.md', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/readme.md', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/README.adoc', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/readme.adoc', skipError: true}],
            ]);
        });

        it('only actual errors should get reported', async () => {
            _requestGET.mockReturnValueOnce(Promise.reject(new Error('fail'))).mockReturnValue(Promise.resolve(''));

            await expect(async () => utils.findReadmeFromGenericGithub({
                wikiUrl: 'https://github.com/jenkinsci/cloudify-plugin/tree/cloudify-1.0.8',
                defaultBranch: 'master',
                requestGET: _requestGET,
                reporter: _reporter,
                createWikiNode: _createWikiNode,
            })).rejects.toThrow('fail');

            expect(_reporter.error.mock.calls).toEqual([]); // eslint-disable-line jest/prefer-strict-equal
            expect(_createWikiNode.mock.calls).toEqual([]); // eslint-disable-line jest/prefer-strict-equal
            expect(_requestGET.mock.calls).toEqual([ // eslint-disable-line jest/prefer-strict-equal
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/README.md', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/readme.md', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/README.adoc', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/readme.adoc', skipError: true}],
            ]);
        });

        it('success should call createWikiNode', async () => {
            _requestGET.mockReturnValueOnce(Promise.resolve('something goes here')).mockReturnValue(Promise.resolve(''));

            const fetched = await utils.findReadmeFromGenericGithub({
                wikiUrl: 'https://github.com/jenkinsci/cloudify-plugin/tree/cloudify-1.0.8',
                defaultBranch: 'master',
                requestGET: _requestGET,
                reporter: _reporter,
                createWikiNode: _createWikiNode,
            });

            expect(fetched).not.toBeNull();

            expect(_reporter.error.mock.calls).toEqual([]); // eslint-disable-line jest/prefer-strict-equal
            expect(_createWikiNode.mock.calls).toEqual([ // eslint-disable-line jest/prefer-strict-equal
                ['text/markdown', 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/README.md', 'something goes here'],
            ]);
            expect(_requestGET.mock.calls).toEqual([ // eslint-disable-line jest/prefer-strict-equal
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/README.md', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/readme.md', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/README.adoc', skipError: true}],
                [{reporter: _reporter, url: 'https://raw.githubusercontent.com/jenkinsci/cloudify-plugin/cloudify-1.0.8/readme.adoc', skipError: true}],
            ]);
        });
    });
});
