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
            .reply(200, {deprecations: []});
        nock('https://www.jenkins.io')
            .get('/doc/pipeline/steps/contents.json')
            .reply(200, []);
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
        await utils.fetchPluginData({createNode, reporter: _reporter});
        expect(createNode.mock.calls[0][0]).toMatchSnapshot();
    });
});
