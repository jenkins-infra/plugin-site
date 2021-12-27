import React from 'react';
import renderer from 'react-test-renderer';
import {useStaticQuery} from 'gatsby';
import Page404 from '../../src/pages/404';


describe('page404', () => {
    beforeEach(() => {
        useStaticQuery.mockImplementationOnce(() => {
            return {
                jenkinsPluginSiteInfo: {
                    api: {
                        commit: 'FAKECommit'
                    },
                    website: {
                        commit: 'FAKECommit'
                    }
                },
                site: {
                    buildTime: new Date(1578980455).getUTCDate()
                }
            };
        });
    });

    it('renders correctly', () => {
        const tree = renderer.create(<Page404 />).toJSON();
        expect(tree).toBeTruthy();
    });
});
