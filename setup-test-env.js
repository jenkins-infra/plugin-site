import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';

process.env.TZ = 'UTC';

if (global.window) {
    class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }

    window.ResizeObserver = ResizeObserver;

    class MutationObserver {
        disconnect() {}
        unobserve() {}
        observe() {}
    }

    window.MutationObserver = MutationObserver;
}
