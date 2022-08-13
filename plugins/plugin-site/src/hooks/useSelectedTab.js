export function useSelectedPluginTab(tabs) {
    const tabName = global?.window?.location?.hash?.replace('#', '') || tabs[0].id;
    return tabs.find(tab => tab.id === tabName) || tabs[0];
}
