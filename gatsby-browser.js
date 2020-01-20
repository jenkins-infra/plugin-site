exports.onInitialClientRender = () => {
    // ugly fallback, wait 250ms, and if any css that didn't preload (firefox), tell it to load
    setTimeout(() => {
        document.querySelectorAll('link[rel="preload"]').forEach(elm => {
            elm.onload=null; elm.rel='stylesheet';
        });
    }, 250);
};

