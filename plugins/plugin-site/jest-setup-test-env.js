import '@testing-library/jest-dom';
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
