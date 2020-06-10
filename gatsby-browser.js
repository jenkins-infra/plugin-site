exports.onClientEntry = function () {
    require.ensure(['@sentry/browser'], (require) => {
        const Sentry = require('@sentry/browser');
        Sentry.init({
            dsn: 'https://495b0bd32a5e4a2287c3fe4b061ee24f@sentry.io/1882460',
            environment: process.env.NODE_ENV,
            enabled: ['production', 'stage'].includes(process.env.NODE_ENV),
            // from https://docs.sentry.io/platforms/javascript/#decluttering-sentry
            ignoreErrors: [
                // Random plugins/extensions
                'top.GLOBALS',
                // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
                'originalCreateNotification',
                'canvas.contentDocument',
                'MyApp_RemoveAllHighlights',
                'http://tt.epicplay.com',
                'Can\'t find variable: ZiteReader',
                'jigsaw is not defined',
                'ComboSearch is not defined',
                'http://loading.retry.widdit.com/',
                'atomicFindClose',
                // Facebook borked
                'fb_xd_fragment',
                // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
                // reduce this. (thanks @acdha)
                // See http://stackoverflow.com/questions/4113268
                'bmi_SafeAddOnload',
                'EBCallBackMessageReceived',
                // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
                'conduitPage',
                'Cannot redefine property: BetterJsPop',
                'should_do_lastpass_here',
            ],
            blacklistUrls: [
                /^moz-extension:\//,
                // Facebook flakiness
                /graph\.facebook\.com/i,
                // Facebook blocked
                /connect\.facebook\.net\/en_US\/all\.js/i,
                // Woopra flakiness
                /eatdifferent\.com\.woopra-ns\.com/i,
                /static\.woopra\.com\/js\/woopra\.js/i,
                // Chrome extensions
                /^chrome-extension:\//,
                /extensions\//i,
                /^chrome:\/\//i,
                // Other plugins
                /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
                /webappstoolbarba\.texthelp\.com\//i,
                /metrics\.itunes\.apple\.com\.edgesuite\.net\//i
            ]
        });
        window.Sentry = Sentry;
    });
};

