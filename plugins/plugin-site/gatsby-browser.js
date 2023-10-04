exports.onClientEntry = function () {
    if (window.location.hash === '#releases') {
        window.location.href = `/${window.location.pathname.split('/')[1]}/releases/`;
    }
    else if (window.location.hash === '#issues') {
        window.location.href = `/${window.location.pathname.split('/')[1]}/issues/`;
    }
    else if (window.location.hash === '#dependencies') {
        window.location.href = `/${window.location.pathname.split('/')[1]}/dependencies/`;
    }
};

