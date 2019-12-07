// This is the content of your gatsby-config.js
// and what you need to provide as schema:
module.exports = {
    siteMetadata: {
        url: 'https://jenkins-plugins.g4v.dev/',
        title: 'Jenkins Plugins',
        titleTemplate: '%s | Jenkins plugin',
        description: 'Jenkins – an open source automation server which enables developers around the world to reliably build, test, and deploy their software',
        image: 'https://jenkins.io/images/logo-title-opengraph.png',
        twitterUsername: '@JenkinsCI'
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
                background_color: '#2b5797',
                theme_color: '#ffffff',
                display: 'minimal-ui',
                src: 'src/images/apple-touch-icon.png' // This path is relative to the root of the site.
            },
        },
        {
            resolve: 'gatsby-source-jenkinsplugins',
            options: { }
        }
    ]
};
