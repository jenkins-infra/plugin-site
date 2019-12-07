// This is the content of your gatsby-config.js
// and what you need to provide as schema:
module.exports = {
    siteMetadata: {
        title: 'Plugin Site',
        titleTemplate: '%s | The Nameless Site',
    },
    plugins: [
        'gatsby-plugin-emotion',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: 'Jenkins Plugins',
                short_name: 'jenkins-plugins',
                start_url: '/',
                background_color: '#663399',
                theme_color: '#663399',
                display: 'minimal-ui',
                //icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
            },
        },
        {
            resolve: 'gatsby-source-jenkinsplugins',
            options: { }
        }
    ]
};
