import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';

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
