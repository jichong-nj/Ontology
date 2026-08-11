<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElButton, ElCard, ElMessage, ElTag, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import { s2, s2link } from '@/api';
import type { ObjectType, LinkType } from '@/api';
import { tryRequest } from '@/utils/error';

const links = ref<LinkType[]>([]);
const objects = ref<ObjectType[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const form = ref({
  apiName: '', displayName: '',
  sourceType: '', targetType: '', cardinality: 'one-to-many', instanceSource: 'source' as 'source' | 'managed',
  version: 1,
});

async function load() {
  loading.value = true;
  await tryRequest(async () => {
    const [l, o] = await Promise.all([s2link.listLinkTypes(), s2.listObjectTypes()]);
    links.value = l;
    objects.value = o;
  });
  loading.value = false;
}

function openCreate() {
  form.value = { apiName: '', displayName: '', sourceType: '', targetType: '', cardinality: 'one-to-many', instanceSource: 'source', version: 1 };
  dialogVisible.value = true;
}

async function submit() {
  await tryRequest(async () => {
    await s2link.createLinkType({ ...form.value });
    ElMessage.success('关系类型创建成功');
    dialogVisible.value = false;
    await load();
  });
}

async function onDelete(l: LinkType) {
  await tryRequest(async () => {
    await s2link.deleteLinkType(l.apiName);
    ElMessage.success('已删除');
    await load();
  });
}

function objName(apiName: string) {
  return objects.value.find((o) => o.apiName === apiName)?.displayName || apiName;
}

onMounted(load);
</script>

<template>
  <div class="page">
    <header class="page__head">
      <div>
        <h2 class="section-title">Link Types</h2>
        <p class="section-sub">{{ links.length }} 个关系类型</p>
      </div>
      <ElButton type="primary" @click="openCreate">新建关系类型</ElButton>
    </header>

    <div v-loading="loading" class="link-list">
      <ElCard v-for="l in links" :key="l.apiName" class="link-card" shadow="hover">
        <div class="link-card__head">
          <span class="link-card__name">{{ l.displayName }}</span>
          <ElTag size="small" type="info">{{ l.apiName }}</ElTag>
        </div>
        <div class="link-card__path">
          <span class="link-node">{{ objName(l.sourceType) }}</span>
          <span class="link-arrow">→</span>
          <span class="link-node">{{ objName(l.targetType) }}</span>
        </div>
        <p class="link-card__desc">基数：{{ l.cardinality }}</p>
        <div class="link-card__actions">
          <ElButton size="small" text type="danger" @click="onDelete(l)">删除</ElButton>
        </div>
      </ElCard>

      <div v-if="!loading && links.length === 0" class="empty-hint">
        暂无关系类型，点击右上角「新建关系类型」。
      </div>
    </div>

    <ElDialog v-model="dialogVisible" title="新建关系类型" width="520px">
      <ElForm label-position="top">
        <ElFormItem label="显示名称"><ElInput v-model="form.displayName" /></ElFormItem>
        <ElFormItem label="API 名称"><ElInput v-model="form.apiName" /></ElFormItem>
        <ElFormItem label="源对象类型">
          <ElSelect v-model="form.sourceType" placeholder="选择" style="width: 100%">
            <ElOption v-for="o in objects" :key="o.apiName" :label="o.displayName" :value="o.apiName" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="目标对象类型">
          <ElSelect v-model="form.targetType" placeholder="选择" style="width: 100%">
            <ElOption v-for="o in objects" :key="o.apiName" :label="o.displayName" :value="o.apiName" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="基数">
          <ElSelect v-model="form.cardinality" style="width: 100%">
            <ElOption label="one-to-one" value="one-to-one" />
            <ElOption label="one-to-many" value="one-to-many" />
            <ElOption label="many-to-many" value="many-to-many" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="实例来源">
          <ElSelect v-model="form.instanceSource" style="width: 100%">
            <ElOption label="source（源端下推）" value="source" />
            <ElOption label="managed（平台托管）" value="managed" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="submit">创建</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.page__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.link-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.link-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.link-card__name {
  font-weight: 600;
  font-size: 14px;
}
.link-card__path {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: var(--space-2) 0;
  font-size: 13px;
}
.link-node {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
}
.link-arrow {
  color: var(--text-muted);
}
.link-card__desc {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}
.link-card__actions {
  margin-top: var(--space-1);
  display: flex;
  justify-content: flex-end;
}
.empty-hint {
  padding: var(--space-6);
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
