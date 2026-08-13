<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { Close } from '@element-plus/icons-vue';
import { s2explore } from '@/api';

use([CanvasRenderer, BarChart, PieChart, LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent]);

export type ChartKind = 'bar' | 'pie' | 'line';

const props = defineProps<{
  objectType: string;
  property: { apiName: string; displayName?: string; type?: string };
  kind: ChartKind;
}>();

const emit = defineEmits<{ (e: 'remove'): void; (e: 'update:kind', kind: ChartKind): void }>();

const KIND_OPTIONS: { value: ChartKind; label: string }[] = [
  { value: 'bar', label: '柱状图' },
  { value: 'pie', label: '饼图' },
  { value: 'line', label: '折线图' },
];

// 根据类型决定图表种类：数值 -> 直方图，其它 -> 条形图
const isNumeric = computed(() =>
  ['number', 'integer', 'float', 'double', 'decimal'].includes((props.property.type || '').toLowerCase()),
);

const loading = ref(false);
const barData = ref<{ key: string; count: number }[]>([]);
const histData = ref<{ bucket: number; min: number; max: number; count: number }[]>([]);

async function load() {
  loading.value = true;
  try {
    if (isNumeric.value) {
      histData.value = await s2explore.histogram(props.objectType, props.property.apiName, 20);
    } else {
      barData.value = await s2explore.aggregate(props.objectType, props.property.apiName, 20);
    }
  } finally {
    loading.value = false;
  }
}

onMounted(load);
// 对象类型或属性变化时都要重新拉取数据（同属性名跨类型复用时必须刷新）
watch(() => [props.objectType, props.property.apiName], load);

const option = computed(() => {
  const kind = props.kind || 'bar';
  // 图表数据来源：数值属性走直方图，其它走聚合条形
  const labels = isNumeric.value
    ? histData.value.map((d) => d.min.toFixed(0))
    : barData.value.map((d) => d.key);
  const values = isNumeric.value
    ? histData.value.map((d) => d.count)
    : barData.value.map((d) => d.count);
  const pieData = labels.map((l, i) => ({ name: l, value: values[i] }));

  if (kind === 'pie') {
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { type: 'scroll', bottom: 0, textStyle: { fontSize: 9, color: '#909399' } },
      series: [
        {
          type: 'pie',
          radius: ['38%', '68%'],
          center: ['50%', '46%'],
          data: pieData,
          itemStyle: { borderRadius: 3, borderColor: '#fff', borderWidth: 1 },
          label: { fontSize: 9 },
        },
      ],
    };
  }

  // bar / line 共用坐标轴
  const base = {
    grid: { left: 48, right: 16, top: 24, bottom: isNumeric.value ? 36 : 60 },
    tooltip: isNumeric.value
      ? {
          trigger: 'axis',
          formatter: (p: any) => {
            const d = histData.value[p[0].dataIndex];
            return `区间: ${d.min.toFixed(2)} ~ ${d.max.toFixed(2)}<br/>数量: ${d.count}`;
          },
        }
      : { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { fontSize: 9, color: '#909399', rotate: isNumeric.value ? 0 : 45, interval: 0 },
      name: isNumeric.value ? '值' : '',
      nameTextStyle: { fontSize: 10 },
    },
    yAxis: { type: 'value', axisLabel: { fontSize: 9, color: '#909399' } },
  };
  if (kind === 'line') {
    return {
      ...base,
      series: [
        {
          type: 'line',
          data: values,
          smooth: true,
          showSymbol: true,
          symbolSize: 5,
          itemStyle: { color: '#5b8ff9' },
          lineStyle: { color: '#5b8ff9', width: 2 },
          areaStyle: { color: 'rgba(91,143,249,0.12)' },
        },
      ],
    };
  }
  // bar（默认）
  return {
    ...base,
    series: [
      {
        type: 'bar',
        data: values,
        itemStyle: { color: '#5b8ff9', borderRadius: [2, 2, 0, 0] },
        barWidth: isNumeric.value ? '70%' : '60%',
      },
    ],
  };
});
</script>

<template>
  <div class="prop-chart-card">
    <div class="prop-chart-card__head">
      <span class="prop-chart-card__title">{{ property.displayName || property.apiName }}</span>
      <div class="prop-chart-card__head-right">
        <span class="prop-chart-card__type">{{ isNumeric ? '数值分布' : '分类计数' }}</span>
        <el-select :model-value="kind" size="small" style="width: 96px" @change="(v: ChartKind) => emit('update:kind', v)">
          <el-option v-for="opt in KIND_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
        <button class="prop-chart-card__remove" title="移除图表" @click="emit('remove')">
          <el-icon><Close /></el-icon>
        </button>
      </div>
    </div>
    <div v-loading="loading" class="prop-chart-card__body">
      <VChart v-if="!loading && (barData.length || histData.length)" :option="option" autoresize class="chart" />
      <div v-else-if="!loading" class="chart-empty">暂无数据</div>
    </div>
  </div>
</template>

<style scoped>
.prop-chart-card {
  border: 1px solid var(--border, #e4e7ed);
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 240px;
  overflow: hidden;
}
.prop-chart-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border, #e4e7ed);
  flex-shrink: 0;
}
.prop-chart-card__title { font-weight: 600; font-size: 13px; color: var(--text-primary, #303133); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.prop-chart-card__head-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.prop-chart-card__type { font-size: 11px; color: var(--text-muted, #909399); white-space: nowrap; }
.prop-chart-card__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-muted, #909399);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.prop-chart-card__remove:hover { background: #fef0f0; color: #f56c6c; }
.prop-chart-card__body { flex: 1; position: relative; padding: 4px; }
.chart { width: 100%; height: 100%; }
.chart-empty {
  display: flex; align-items: center; justify-content: center;
  height: 100%; color: var(--text-muted, #909399); font-size: 12px;
}
</style>
