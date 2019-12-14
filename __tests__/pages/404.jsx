import React from 'react';
import renderer from 'react-test-renderer';
import {useStaticQuery} from 'gatsby';
import Page404 from '../../src/pages/404';


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
            }
        };
    });
});

describe('Page404', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<Page404 />).toJSON();
        expect(tree).toBeTruthy();
    });
});
