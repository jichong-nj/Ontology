<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Share, Plus, Edit as EditIcon, Delete } from '@element-plus/icons-vue';
import { s2shared, s2 } from '@/api';
import type { SharedProperty, ObjectType } from '@/api';

const loading = ref(false);
const list = ref<SharedProperty[]>([]);
const objectTypes = ref<ObjectType[]>([]);

// 使用某个共享属性的对象类型清单（引用 sharedRef === apiName）
const usages = computed<Record<string, string[]>>(() => {
  const map: Record<string, string[]> = {};
  for (const sp of list.value) map[sp.apiName] = [];
  for (const ot of objectTypes.value) {
    for (const p of ot.properties) {
      if (p.sharedRef && map[p.sharedRef]) map[p.sharedRef].push(ot.displayName);
    }
  }
  return map;
});

async function load() {
  loading.value = true;
  try {
    const [sps, ots] = await Promise.all([s2shared.list(), s2.listObjectTypes()]);
    list.value = sps;
    objectTypes.value = ots;
  } catch (e: any) {
    ElMessage.error(e.message || '加载失败');
  } finally {
    loading.value = false;
  }
}

// ---------- 创建 / 编辑 ----------
// 注意：required（是否必填）由各对象类型在"引用"处自行配置，共享侧只定义通用元数据。
const dialogVisible = ref(false);
const editing = ref<SharedProperty | null>(null);
const form = ref<{ apiName: string; displayName: string; type: string; description: string }>({
  apiName: '', displayName: '', type: 'string', description: '',
});
const dataTypes = ['string', 'integer', 'double', 'boolean', 'date', 'datetime'];

function openCreate() {
  editing.value = null;
  form.value = { apiName: '', displayName: '', type: 'string', description: '' };
  dialogVisible.value = true;
}

function openEdit(sp: SharedProperty) {
  editing.value = sp;
  form.value = {
    apiName: sp.apiName, displayName: sp.displayName, type: sp.type,
    description: sp.description ?? '',
  };
  dialogVisible.value = true;
}

async function save() {
  if (!form.value.apiName || !form.value.displayName) {
    ElMessage.warning('apiName / 显示名 必填');
    return;
  }
  try {
    if (editing.value) {
      await s2shared.update(editing.value.apiName, {
        displayName: form.value.displayName,
        type: form.value.type,
        description: form.value.description,
      });
      ElMessage.success('已更新共享属性（引用方未覆盖的显示名/类型将自动同步）');
    } else {
      await s2shared.create({
        apiName: form.value.apiName,
        displayName: form.value.displayName,
        type: form.value.type,
        description: form.value.description,
        version: 1,
        createdAt: '',
        updatedAt: '',
      });
      ElMessage.success('已创建共享属性');
    }
    dialogVisible.value = false;
    await load();
  } catch (e: any) {
    ElMessage.error(e.message || '保存失败');
  }
}

// 删除需二次确认（遵循"删除功能都需要确认"规则）
async function remove(sp: SharedProperty) {
  try {
    await ElMessageBox.confirm(
      `删除共享属性「${sp.displayName}（${sp.apiName}）」将解绑所有对象类型的引用，确定继续吗？`,
      '确认删除',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    );
  } catch {
    return;
  }
  try {
    await s2shared.remove(sp.apiName);
    ElMessage.success('已删除共享属性');
    await load();
  } catch (e: any) {
    ElMessage.error(e.message || '删除失败');
  }
}

onMounted(load);
</script>

<template>
  <div class="shared-page">
    <div class="shared-head">
      <div>
        <h2 class="shared-title"><ElIcon><Share /></ElIcon> 共享属性</h2>
        <p class="shared-sub">跨多个对象类型复用的属性元数据（一处定义、多处引用；元数据集中，实例数据各自持有）。</p>
      </div>
      <ElButton type="primary" :icon="Plus" @click="openCreate">新建共享属性</ElButton>
    </div>

    <ElCard shadow="never" class="shared-card">
      <ElTable :data="list" v-loading="loading" empty-text="暂无共享属性">
        <ElTableColumn prop="apiName" label="API 名称" min-width="160">
          <template #default="{ row }">
            <span class="mono">{{ row.apiName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="displayName" label="显示名" min-width="140" />
        <ElTableColumn prop="type" label="类型" width="110">
          <template #default="{ row }"><ElTag size="small">{{ row.type }}</ElTag></template>
        </ElTableColumn>
        <ElTableColumn label="被引用对象类型" min-width="220">
          <template #default="{ row }">
            <template v-if="(usages[row.apiName] || []).length">
              <ElTag v-for="u in usages[row.apiName]" :key="u" size="small" type="success" effect="plain" class="usage-tag">{{ u }}</ElTag>
            </template>
            <span v-else class="muted">—</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <ElButton size="small" text :icon="EditIcon" @click="openEdit(row)">编辑</ElButton>
            <ElButton size="small" text type="danger" :icon="Delete" @click="remove(row)">删除</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <!-- 新建 / 编辑弹窗 -->
    <ElDialog v-model="dialogVisible" :title="editing ? '编辑共享属性' : '新建共享属性'" width="460px">
      <ElForm label-width="100px">
        <ElFormItem label="API 名称">
          <ElInput v-model="form.apiName" :disabled="!!editing" placeholder="如 status" />
        </ElFormItem>
        <ElFormItem label="显示名">
          <ElInput v-model="form.displayName" placeholder="如 状态" />
        </ElFormItem>
        <ElFormItem label="类型">
          <ElSelect v-model="form.type" style="width: 100%">
            <ElOption v-for="dt in dataTypes" :key="dt" :label="dt" :value="dt" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="描述">
          <ElInput v-model="form.description" type="textarea" :rows="2" placeholder="可选" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="save">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.shared-page { max-width: 1100px; }
.shared-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4); }
.shared-title { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.shared-sub { color: var(--text-secondary); font-size: 13px; margin-top: 6px; max-width: 720px; }
.shared-card { border-radius: var(--radius); }
.mono { font-family: var(--font-mono); font-size: 12px; }
.usage-tag { margin: 0 4px 4px 0; }
.muted { color: var(--text-muted); }
</style>
