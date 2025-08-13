<template>
  <div v-if="modelValue" class="cm-backdrop">
    <div class="cm-modal">
      <h3 class="cm-title">{{ titleText || (isEditing ? '编辑收藏' : '新建收藏') }}</h3>
      <div class="cm-body">
        <div class="row">
          <label>标题<span class="req">*</span></label>
          <input v-model="form.title" class="inp" placeholder="请输入标题" />
        </div>
        <div class="row two">
          <div>
            <label>类型</label>
            <select v-model="form.type" class="inp">
              <option v-for="t in types" :key="t" :value="t">{{ typeText(t) }}</option>
            </select>
          </div>
          <div v-if="showFolder">
            <label>文件夹</label>
            <select v-model="form.folder_id" class="inp">
              <option :value="null">无（根目录）</option>
              <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <label>URL</label>
          <input v-model="form.url" class="inp" placeholder="https://..." />
        </div>
        <div class="row">
          <label>标签（用逗号分隔）</label>
          <input v-model="form.tags" class="inp" placeholder="tag1, tag2" />
        </div>
        <div class="row">
          <label>内容</label>
          <textarea v-model="form.content" class="inp" rows="4" style="resize: vertical;"></textarea>
        </div>
      </div>
      <div class="cm-footer">
        <button class="btn secondary" @click="$emit('update:modelValue', false)">取消</button>
        <button class="btn primary" :disabled="submitting" @click="submit">{{ submitting ? '提交中…' : (isEditing ? '保存' : '创建') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'CollectionModal',
  props: {
    modelValue: { type: Boolean, required: true },
    isEditing: { type: Boolean, default: false },
    initial: { type: Object, default: () => ({}) },
    folders: { type: Array, default: () => [] },
    showFolder: { type: Boolean, default: false },
  // 后端允许的类型枚举，父组件可按需传子集
  types: { type: Array, default: () => ['document', 'video', 'note', 'link', 'file', 'forum_topic', 'course', 'project', 'knowledge_article', 'daily_record'] },
    titleText: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'submit'],
  setup(props, { emit }) {
  const form = ref({ id: null, title: '', type: (props.types && props.types[0]) || 'document', url: '', content: '', tags: '', folder_id: null })
    const submitting = ref(false)

    const syncFromProps = () => {
      const init = props.initial || {}
      form.value = {
        id: init.id ?? null,
        title: init.title ?? '',
    type: init.type ?? (props.types && props.types[0]) ?? 'document',
        url: init.url ?? '',
        content: init.content ?? '',
        tags: Array.isArray(init.tags) ? init.tags.join(', ') : (init.tags ?? ''),
        folder_id: init.folder_id ?? null
      }
    }

    watch(() => props.initial, syncFromProps, { immediate: true, deep: true })
    watch(() => props.modelValue, (v) => { if (v) syncFromProps() })

    const typeText = (t) => ({
      document: '文档',
      video: '视频',
      note: '笔记',
      link: '链接',
      file: '文件',
      forum_topic: '论坛话题',
      course: '课程',
      project: '项目',
      knowledge_article: '知识文章',
      daily_record: '每日记录'
    }[t] || t)

    const submit = async () => {
      if (!form.value.title?.trim()) return
      submitting.value = true
      try {
        const payload = {
          id: form.value.id ?? undefined,
          title: form.value.title.trim(),
          type: form.value.type,
          url: form.value.url || undefined,
          content: form.value.content || undefined,
          tags: form.value.tags || undefined,
          folder_id: form.value.folder_id ?? undefined
        }
        emit('submit', payload, props.isEditing)
      } finally {
        submitting.value = false
      }
    }

    return { form, submitting, submit, typeText }
  }
}
</script>

<style scoped>
.cm-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.cm-modal { background: #fff; width: 520px; max-width: calc(100% - 32px); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.15); overflow: hidden; }
.cm-title { margin: 0; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.cm-body { padding: 16px 20px; }
.row { margin-bottom: 12px; }
.row.two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.row label { display: block; font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.inp { width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; }
.cm-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid #f0f0f0; }
.btn { padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer; }
.btn.secondary { background: #f1f3f5; color: #2c3e50; }
.btn.primary { background: #667eea; color: #fff; }
.req { color: #d9534f; margin-left: 4px; }
</style>
