<script setup lang="ts">
import { computed } from 'vue';
import { ElSelect, ElOption, ElInput, ElButton, ElTag } from 'element-plus';

interface ObjectTypeLite {
  apiName: string;
  displayName: string;
  properties?: { apiName: string; displayName: string; type: string }[];
}

const props = defineProps<{
  modelValue: any;
  objectTypes: ObjectTypeLite[];
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void;
  (e: 'remove'): void;
}>();

const OPERATORS = [
  { value: 'gt', label: '>' }, { value: 'gte', label: '>=' },
  { value: 'lt', label: '<' }, { value: 'lte', label: '<=' },
  { value: 'eq', label: '=' }, { value: 'neq', label: '!=' },
];
const AGGREGATIONS = ['count', 'sum', 'avg', 'min', 'max'];

const node = computed<any>(() => props.modelValue ?? { kind: 'property', objectType: '', property: '', operator: 'gt', value: '' });
const isGroup = computed(() => node.value.kind === 'all' || node.value.kind === 'any');

function update(patch: any) {
  emit('update:modelValue', { ...node.value, ...patch });
}
function propsOf(apiName: string) {
  return props.objectTypes.find((o) => o.apiName === apiName)?.properties ?? [];
}
function changeObjectType(apiName: string) {
  update({ objectType: apiName, property: '' });
}
function changeKind(kind: string) {
  if (kind === 'all' || kind === 'any') {
    emit('update:modelValue', { kind, conditions: [{ kind: 'property', objectType: props.objectTypes[0]?.apiName ?? '', property: '', operator: 'gt', value: '' }] });
  } else {
    emit('update:modelValue', { kind, objectType: props.objectTypes[0]?.apiName ?? '', property: '', aggregation: 'count', operator: 'gt', value: '' });
  }
}
function updateChild(i: number, v: any) {
  const list = [...(node.value.conditions ?? [])];
  list[i] = v;
  update({ conditions: list });
}
function addChild(kind: 'property' | 'aggregate' | 'all' | 'any') {
  const list = [...(node.value.conditions ?? [])];
  list.push(kind === 'all' || kind === 'any'
    ? { kind, conditions: [{ kind: 'property', objectType: props.objectTypes[0]?.apiName ?? '', property: '', operator: 'gt', value: '' }] }
    : { kind, objectType: props.objectTypes[0]?.apiName ?? '', property: '', aggregation: 'count', operator: 'gt', value: '' });
  update({ conditions: list });
}
function toGroup() {
  emit('update:modelValue', { kind: 'all', conditions: [node.value] });
}
function removeChild(i: number) {
  const list = [...(node.value.conditions ?? [])];
  list.splice(i, 1);
  update({ conditions: list });
}
</script>

<template>
  <div class="expr">
    <!-- 分组节点：AND / OR -->
    <div v-if="isGroup" class="expr-group">
      <div class="expr-group__head">
        <ElTag size="small" type="info">分组</ElTag>
        <ElSelect :model-value="node.kind" style="width: 110px" @change="(v:string)=>update({kind:v})">
          <ElOption label="全部满足 (AND)" value="all" />
          <ElOption label="任一满足 (OR)" value="any" />
        </ElSelect>
        <ElButton size="small" text type="danger" @click="emit('remove')">删除分组</ElButton>
      </div>
      <div class="expr-group__children">
        <div v-for="(child, i) in (node.conditions ?? [])" :key="i" class="expr-child">
          <RuleExpressionBuilder
            :model-value="child"
            :object-types="objectTypes"
            @update:model-value="(v:any)=>updateChild(i,v)"
            @remove="removeChild(i)"
          />
        </div>
        <div class="expr-group__actions">
          <ElButton size="small" @click="addChild('property')">+ 比较</ElButton>
          <ElButton size="small" @click="addChild('all')">+ 分组</ElButton>
        </div>
      </div>
    </div>

    <!-- 比较节点：属性 / 聚合 -->
    <div v-else class="expr-compare">
      <ElSelect :model-value="node.kind" style="width: 96px" @change="changeKind">
        <ElOption label="属性" value="property" />
        <ElOption label="聚合" value="aggregate" />
      </ElSelect>
      <ElSelect :model-value="node.objectType" style="width: 150px" placeholder="对象类型" @change="changeObjectType">
        <ElOption v-for="o in objectTypes" :key="o.apiName" :label="`${o.displayName} (${o.apiName})`" :value="o.apiName" />
      </ElSelect>
      <ElSelect v-if="node.kind === 'aggregate'" :model-value="node.aggregation ?? 'count'" style="width: 100px" @change="(v:string)=>update({aggregation:v})">
        <ElOption v-for="a in AGGREGATIONS" :key="a" :label="a" :value="a" />
      </ElSelect>
      <ElSelect
        v-if="node.kind === 'property' || (node.aggregation ?? 'count') !== 'count'"
        :model-value="node.property"
        style="width: 150px"
        filterable
        placeholder="属性"
        @change="(v:string)=>update({property:v})"
      >
        <ElOption v-for="p in propsOf(node.objectType)" :key="p.apiName" :label="`${p.displayName} (${p.apiName})`" :value="p.apiName" />
      </ElSelect>
      <ElSelect :model-value="node.operator ?? 'gt'" style="width: 80px" @change="(v:string)=>update({operator:v})">
        <ElOption v-for="op in OPERATORS" :key="op.value" :label="op.label" :value="op.value" />
      </ElSelect>
      <ElInput :model-value="node.value" style="width: 110px" placeholder="值/阈值" @update:model-value="(v:string)=>update({value:v})" />
      <ElButton size="small" text @click="toGroup">转为分组</ElButton>
      <ElButton size="small" text type="danger" @click="emit('remove')">删除</ElButton>
    </div>
  </div>
</template>

<style scoped>
.expr { width: 100%; }
.expr-group { border-left: 3px solid var(--el-color-primary-light-5, #a0cfff); padding-left: 10px; }
.expr-group__head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.expr-group__children { display: flex; flex-direction: column; gap: 8px; }
.expr-child { background: var(--el-fill-color-lighter, #fafafa); padding: 8px; border-radius: 4px; }
.expr-compare { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.expr-group__actions { display: flex; gap: 8px; }
</style>
