<template>
  <div class="cd-page" v-if="!loading && collection">
    <!-- 顶部渐变区 -->
    <section class="cd-hero">
      <div class="cd-hero__top">
        <button class="cd-btn cd-btn--ghost" @click="goBack" title="返回">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8 8,8 1.41-1.41L7.83,13H20v-2Z"/></svg>
          返回
        </button>
        <div class="cd-actions">
          <button v-if="collection.url" class="cd-btn cd-btn--primary" @click="openLink" title="打开链接">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59,13.41L9.17,12l4.24-4.24l1.41,1.41L12,12l4.83,4.83l-1.41,1.41L10.59,13.41z"/></svg>
            打开链接
          </button>
          <button class="cd-btn" @click="openEdit" title="编辑">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9m3.6-6c-.25,0-.51.1-.7.29l-1.83,1.83 3.75,3.75 1.83-1.83c.39-.39.39-1.04,0-1.41l-2.33-2.33c-.2-.2-.46-.29-.72-.29M14.06,6.19L3,17.25V21H6.75L17.81,9.94 14.06,6.19Z"/></svg>
            编辑
          </button>
          <button class="cd-btn cd-btn--danger" @click="remove" title="删除">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9,3v1H4v2h16V4h-5V3H9m1,6v8h2V9h-2m-4,0v8h2V9H6m8,0v8h2V9h-2Z"/></svg>
            删除
          </button>
        </div>
      </div>
      <div class="cd-hero__title">
        <h1 class="cd-title">{{ collection.title }}</h1>
        <span class="cd-type" :title="collection.type">{{ typeText(collection.type) }}</span>
      </div>
      <div class="cd-hero__meta">
        <div class="cd-meta__item" v-if="collection.access_count !== undefined">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12,6a9.77,9.77,0,0,1,9,6,9.77,9.77,0,0,1-18,0A9.77,9.77,0,0,1,12,6m0,10a4,4,0,1,0-4-4A4,4,0,0,0,12,16Z"/></svg>
          访问 {{ collection.access_count }} 次
        </div>
        <div class="cd-meta__item" v-if="collection.created_at">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19,4H5A2,2,0,0,0,3,6V20a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V6A2,2,0,0,0,19,4m0,16H5V8H19Z"/></svg>
          创建于 {{ fmtDate(collection.created_at) }}
        </div>
        <div class="cd-meta__item" v-if="collection.updated_at">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12,20A8,8,0,1,1,20,12,8,8,0,0,1,12,20ZM7,13h6V7H11v4H7Z"/></svg>
          更新于 {{ fmtDate(collection.updated_at) }}
        </div>
      </div>
    </section>

    <!-- 主体区 -->
    <section class="cd-grid">
      <div class="cd-col">
        <div class="cd-card" v-if="collection.content">
          <h3 class="cd-card__title">内容</h3>
          <div class="cd-content">{{ collection.content }}</div>
        </div>

        <div class="cd-card" v-if="displayTags.length">
          <h3 class="cd-card__title">标签</h3>
          <div class="cd-tags">
            <span v-for="t in displayTags" :key="t" class="cd-tag">#{{ t }}</span>
          </div>
        </div>
      </div>

      <aside class="cd-col cd-col--side">
        <div class="cd-card">
          <h3 class="cd-card__title">信息</h3>
          <ul class="cd-list">
            <li class="cd-list__item">
              <span class="cd-k">类型</span>
              <span class="cd-v"><span class="cd-type cd-type--pill">{{ typeText(collection.type) }}</span></span>
            </li>
            <li class="cd-list__item" v-if="collection.access_count !== undefined">
              <span class="cd-k">访问</span>
              <span class="cd-v">{{ collection.access_count }} 次</span>
            </li>
            <li class="cd-list__item" v-if="collection.created_at">
              <span class="cd-k">创建时间</span>
              <span class="cd-v">{{ fmtDate(collection.created_at) }}</span>
            </li>
            <li class="cd-list__item" v-if="collection.updated_at">
              <span class="cd-k">更新时间</span>
              <span class="cd-v">{{ fmtDate(collection.updated_at) }}</span>
            </li>
            <li class="cd-list__item" v-if="collection.url">
              <span class="cd-k">链接</span>
              <span class="cd-v cd-linkline">
                <span class="cd-host" :title="collection.url">{{ hostDomain }}</span>
                <button class="cd-btn cd-btn--mini cd-btn--primary" @click="openLink">打开</button>
              </span>
            </li>
          </ul>
        </div>
      </aside>
    </section>

    <!-- 编辑弹窗 -->
    <CollectionModal
      :model-value="editVisible"
      @update:modelValue="v => (editVisible = v)"
      :is-editing="true"
      :initial="editForm"
      :show-folder="false"
      :types="[collection?.type || 'document']"
      title-text="编辑收藏"
      @submit="onSubmit"
    />
  </div>

  <div v-else class="cd-loading">
    <div class="cd-skel cd-skel--hero"></div>
    <div class="cd-skel cd-skel--block"></div>
    <div class="cd-tip" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApiService } from '@/services/api.js'
import CollectionModal from '@/components/CollectionModal.vue'

export default {
  name: 'CollectionDetail',
  components: { CollectionModal },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const error = ref('')
    const collection = ref(null)
    const editVisible = ref(false)
    const editForm = ref({ id: null, title: '', type: 'document', url: '', content: '', tags: '' })

    const fmtDate = (d) => { try { return new Date(d).toLocaleString() } catch { return d } }
    const typeText = (t) => ({
      document: '文档', video: '视频', note: '笔记', link: '链接', file: '文件', forum_topic: '话题', course: '课程', project: '项目', knowledge_article: '知识文章', daily_record: '随手记录'
    }[t] || t)

    const displayTags = computed(() => {
      const tags = collection.value?.tags
      if (!tags) return []
      if (Array.isArray(tags)) return tags
      if (typeof tags === 'string') return tags.split(',').map(s => s.trim()).filter(Boolean)
      return []
    })

    const hostDomain = computed(() => {
      const url = collection.value?.url
      if (!url) return ''
      try { return new URL(url).hostname } catch { return url }
    })

    const load = async () => {
      loading.value = true
      error.value = ''
      try {
        const id = route.params.id
        const res = await ApiService.getCollection(id)
        if (res?.data?.success === false) throw new Error(res.data.message || '加载失败')
        collection.value = res.data?.data || res.data
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }

    onMounted(load)

    const goBack = () => router.back()
    const openLink = () => { if (collection.value?.url) window.open(collection.value.url, '_blank') }
    const openEdit = () => {
      const c = collection.value || {}
      editForm.value = {
        id: c.id,
        title: c.title || '',
        type: c.type || 'document',
        url: c.url || '',
        content: c.content || '',
        tags: Array.isArray(c.tags) ? c.tags.join(', ') : (c.tags || '')
      }
      editVisible.value = true
    }
    const onSubmit = async (payload) => {
      try {
        const toTagsString = (val) => Array.isArray(val) ? val.join(',') : (typeof val === 'string' ? val : undefined)
        const res = await ApiService.updateCollection(editForm.value.id, { ...payload, tags: toTagsString(payload.tags) })
        if (res?.data?.success === false) throw new Error(res.data.message || '保存失败')
        editVisible.value = false
        await load()
      } catch (e) {
        alert(e.message || '保存失败')
      }
    }
    const remove = async () => {
      if (!collection.value?.id) return
      if (!confirm('确定要删除该收藏吗？')) return
      try {
        const res = await ApiService.deleteCollection(collection.value.id)
        if (res?.data?.success === false) throw new Error(res.data.message || '删除失败')
        router.replace('/favorites')
      } catch (e) {
        alert(e.message || '删除失败')
      }
    }

    return { loading, error, collection, fmtDate, typeText, displayTags, hostDomain, goBack, openLink, openEdit, editVisible, editForm, onSubmit, remove }
  }
}
</script>

<style scoped>
.cd-page { padding: 0 24px 24px; max-width: 1100px; margin: 0 auto; }

/* 头图 */
.cd-hero { position: relative; border-radius: 20px; overflow: hidden; background: linear-gradient(135deg, #ff7b42 0%, #ff5722 100%); color: #fff; padding: 18px 20px 16px; box-shadow: 0 8px 24px rgba(255, 123, 66, 0.25); margin: 16px 0 20px; }
.cd-hero__top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.cd-actions { display: flex; gap: 8px; }
.cd-hero__title { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
.cd-title { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.01em; text-shadow: 0 2px 8px rgba(0,0,0,.12); }
.cd-type { background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.4); color: #fff; border-radius: 999px; padding: 4px 10px; font-size: 12px; backdrop-filter: blur(2px); }
.cd-type--pill { background: #fff3e0; color: #f57c00; border: 1px solid #ffe0b2; padding: 2px 8px; border-radius: 999px; font-size: 12px; }
.cd-hero__meta { display: flex; gap: 14px; margin-top: 8px; opacity: .95; flex-wrap: wrap; }
.cd-meta__item { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; text-shadow: 0 1px 2px rgba(0,0,0,.12); }

/* 按钮 */
.cd-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.6); background: rgba(255,255,255,.12); color: #fff; cursor: pointer; backdrop-filter: blur(2px); transition: all .2s ease; }
.cd-btn:hover { background: rgba(255,255,255,.18); transform: translateY(-1px); }
.cd-btn--ghost { background: rgba(255,255,255,.08); }
.cd-btn--primary { background: #ffffff; color: #ff5722; border-color: transparent; box-shadow: 0 4px 12px rgba(255,255,255,.25), 0 2px 10px rgba(0,0,0,.08); }
.cd-btn--primary:hover { background: #fff7f2; }
.cd-btn--danger { background: #ef4444; border-color: #ef4444; color: #fff; }
.cd-btn--mini { padding: 4px 8px; border-radius: 8px; font-size: 12px; }

/* 网格布局 */
.cd-grid { display: grid; grid-template-columns: 1.4fr .8fr; gap: 20px; }
.cd-col { display: flex; flex-direction: column; gap: 16px; }
.cd-col--side { min-width: 260px; }

/* 卡片 */
.cd-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 16px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.04); }
.cd-card__title { margin: 0 0 10px; font-size: 15px; color: #6b7280; font-weight: 600; }
.cd-content { white-space: pre-wrap; line-height: 1.8; font-size: 15px; color: #2c3e50; }

/* 标签 */
.cd-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.cd-tag { background: #fff3e0; color: #ff7b42; padding: 6px 10px; border-radius: 999px; font-size: 12px; border: 1px solid #ffe0b2; font-weight: 600; }

/* 侧栏信息 */
.cd-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.cd-list__item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 10px; border: 1px dashed #f2f2f2; border-radius: 10px; }
.cd-k { color: #6b7280; font-size: 13px; }
.cd-v { color: #111827; font-weight: 600; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; }
.cd-linkline { display: inline-flex; align-items: center; gap: 8px; }
.cd-host { max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; color: #374151; }

/* 加载态 */
.cd-loading { padding: 24px; max-width: 900px; margin: 0 auto; }
.cd-skel { background: linear-gradient(90deg, #f6f7f9 25%, #eceef1 37%, #f6f7f9 63%); animation: cd-shine 1.3s infinite; border-radius: 14px; margin-bottom: 14px; }
.cd-skel--hero { height: 120px; }
.cd-skel--block { height: 200px; }
.cd-tip { color: #ef4444; font-size: 13px; }
@keyframes cd-shine { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }

/* 响应式 */
@media (max-width: 900px) {
  .cd-grid { grid-template-columns: 1fr; }
  .cd-col--side { min-width: 0; }
}
@media (max-width: 600px) {
  .cd-page { padding: 0 16px 16px; }
  .cd-title { font-size: 22px; }
  .cd-hero { padding: 14px; border-radius: 16px; }
}
</style>
