<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { Close } from '@element-plus/icons-vue';
import { s2explore } from '@/api';

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, TitleComponent]);

const props = defineProps<{
  objectType: string;
  property: { apiName: string; displayName?: string; type?: string };
}>();

const emit = defineEmits<{ (e: 'remove'): void }>();

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
  if (isNumeric.value) {
    return {
      grid: { left: 48, right: 16, top: 24, bottom: 36 },
      tooltip: {
        trigger: 'axis',
        formatter: (p: any) => {
          const d = histData.value[p[0].dataIndex];
          return `区间: ${d.min.toFixed(2)} ~ ${d.max.toFixed(2)}<br/>数量: ${d.count}`;
        },
      },
      xAxis: {
        type: 'category',
        data: histData.value.map((d) => d.min.toFixed(0)),
        axisLabel: { fontSize: 9, color: '#909399' },
        name: '值',
        nameTextStyle: { fontSize: 10 },
      },
      yAxis: { type: 'value', axisLabel: { fontSize: 9, color: '#909399' } },
      series: [
        {
          type: 'bar',
          data: histData.value.map((d) => d.count),
          itemStyle: { color: '#5b8ff9', borderRadius: [2, 2, 0, 0] },
          barWidth: '70%',
        },
      ],
    };
  }
  return {
    grid: { left: 48, right: 16, top: 16, bottom: 60 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: barData.value.map((d) => d.key),
      axisLabel: { fontSize: 9, color: '#909399', rotate: 45, interval: 0 },
    },
    yAxis: { type: 'value', axisLabel: { fontSize: 9, color: '#909399' } },
    series: [
      {
        type: 'bar',
        data: barData.value.map((d) => d.count),
        itemStyle: { color: '#5b8ff9', borderRadius: [2, 2, 0, 0] },
        barWidth: '60%',
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
