module.exports = () => ({
    plugins: [
        require('postcss-import')({}), // Add support for sass-like '@import'
        require('postcss-extend')(), // Add support for sass-like '@extend'
        require('postcss-url')(),
        require('postcss-css-variables')(),
        require('postcss-calc')(),
        require('postcss-nesting')(), // Add support for sass-like nesting of rules
        require('postcss-pxtorem')({
            mediaQuery: false, // Ignore media queries
            minPixelValue: 0, // Minimal pixel value that will be processed
            propList: [], // List of CSS properties that can be changed from px to rem; empty array means that all CSS properties can change from px to rem
            replace: true, // Replace pixels with rems
            rootValue: 16, // Root font-size
            selectorBlackList: ['html'], // Ignore pixels used for html
            unitPrecision: 4 // Round rem units to 4 digits
        }),
        require('postcss-preset-env')({stage: 0}),
        require('cssnano')()
    ],
});
