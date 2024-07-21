import { computed } from 'vue';
import { useAppStore } from '@/store';
export default function useChartOption(sourceOption) {
    const appStore = useAppStore();
    const isDark = computed(() => {
        return appStore.theme === 'dark';
    });
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    // It's not used here
    // TODO echarts themes
    const chartOption = computed(() => {
        return sourceOption(isDark.value);
    });
    return {
        chartOption,
    };
}
//# sourceMappingURL=chart-option.js.map