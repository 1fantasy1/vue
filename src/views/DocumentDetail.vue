<template>
  <div class="doc-detail">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>{{ detailTitle }}</h2>
      <div class="actions">
        <button class="kb-btn" @click="refresh" :disabled="loadingDetail || loadingContent || loadingChunks">刷新</button>
        <button v-if="detail?.status === 'completed'" class="kb-btn secondary" @click="loadChunks">查看分块 ({{ chunks.length }})</button>
      </div>
    </div>

    <div class="meta" v-if="detail">
      <div class="meta-row">
        <span class="label">状态</span>
        <span class="value" :class="`status-${detail.status || 'unknown'}`">{{ detail.status || 'unknown' }}</span>
      </div>
      <div class="meta-row">
        <span class="label">文件名</span>
        <span class="value">{{ detail.file_name || detail.filename || detail.name || '-' }}</span>
      </div>
      <div class="meta-row">
        <span class="label">类型</span>
        <span class="value">{{ detail.file_type || detail.fileType || detail.type || '-' }}</span>
      </div>
      <div class="meta-row">
        <span class="label">大小</span>
        <span class="value">{{ detail.file_size || detail.fileSize || detail.size || '-' }}</span>
      </div>
      <div class="meta-row">
        <span class="label">创建时间</span>
        <span class="value">{{ formatDate(detail.created_at) }}</span>
      </div>
      <div class="meta-row">
        <span class="label">更新时间</span>
        <span class="value">{{ formatDate(detail.updated_at) }}</span>
      </div>
      <div class="meta-row" v-if="detail.processing_message">
        <span class="label">处理信息</span>
        <span class="value">{{ detail.processing_message }}</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>文档内容</h3>
        <button class="kb-btn small" @click="loadContent" :disabled="loadingContent">重新加载</button>
      </div>
      <div class="panel-body">
        <div v-if="loadingContent" class="loading">内容加载中...</div>
        <pre v-else-if="content" class="content-pre">{{ content }}</pre>
        <div v-else class="empty">暂无内容或未完成处理</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>分块 ({{ chunks.length }})</h3>
        <button class="kb-btn small" @click="loadChunks" :disabled="loadingChunks">重新加载</button>
      </div>
      <div class="panel-body">
        <div v-if="loadingChunks" class="loading">分块加载中...</div>
        <div v-else-if="chunks.length" class="chunks">
          <div class="chunk" v-for="c in chunks" :key="c.id">
            <div class="chunk-head">
              <span>#{{ (c.chunk_index ?? c.index ?? 0) + 1 }}</span>
              <span class="muted">ID: {{ c.id }}</span>
            </div>
            <div class="chunk-body">{{ c.content }}</div>
          </div>
        </div>
        <div v-else class="empty">暂无分块</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ApiService } from '@/services/api.js'

export default {
  name: 'DocumentDetail',
  data() {
    return {
      kbId: null,
      docId: null,
      detail: null,
      content: '',
      chunks: [],
      loadingDetail: false,
      loadingContent: false,
      loadingChunks: false
    }
  },
  computed: {
    detailTitle() {
      return (
        this.detail?.file_name || this.detail?.filename || this.detail?.name || `文档 #${this.docId}`
      )
    }
  },
  async created() {
    this.kbId = this.$route.params.kbId
    this.docId = this.$route.params.docId
    await this.loadAll()
  },
  methods: {
    async loadAll() {
      await Promise.all([this.loadDetail(), this.loadContent(), this.loadChunks()])
    },
    async loadDetail() {
      if (!this.kbId || !this.docId) return
      this.loadingDetail = true
      try {
        const res = await ApiService.getKnowledgeDocumentDetail(this.kbId, this.docId)
        // createResponse 格式: { data: { success, data, message } }
        const d = res?.data?.data || res?.data || res
        this.detail = d?.data || d?.document || d
      } catch (e) {
        console.error('加载文档详情失败:', e)
      } finally {
        this.loadingDetail = false
      }
    },
    async loadContent() {
      if (!this.kbId || !this.docId) return
      this.loadingContent = true
      this.content = ''
      try {
        const res = await ApiService.getKnowledgeDocumentContent(this.kbId, this.docId)
        const body = res?.data?.data || res?.data || {}
        this.content = body?.content || body?.text || ''
      } catch (e) {
        console.error('加载文档内容失败:', e)
        this.content = ''
      } finally {
        this.loadingContent = false
      }
    },
    async loadChunks() {
      if (!this.kbId || !this.docId) return
      this.loadingChunks = true
      this.chunks = []
      try {
        const res = await ApiService.getKnowledgeDocumentChunks(this.kbId, this.docId)
        const list = res?.data?.data || []
        this.chunks = Array.isArray(list) ? list : []
      } catch (e) {
        console.error('加载文档分块失败:', e)
        this.chunks = []
      } finally {
        this.loadingChunks = false
      }
    },
    refresh() {
      this.loadAll()
    },
    goBack() {
      if (window.history.length > 1) this.$router.back()
      else this.$router.push({ name: 'KnowledgeBase' })
    },
    formatDate(dt) {
      if (!dt) return '-'
      try {
        const d = new Date(dt)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const da = String(d.getDate()).padStart(2, '0')
        const hh = String(d.getHours()).padStart(2, '0')
        const mm = String(d.getMinutes()).padStart(2, '0')
        return `${y}-${m}-${da} ${hh}:${mm}`
      } catch {
        return String(dt)
      }
    }
  }
}
</script>

<style scoped>
.doc-detail { max-width: 960px; margin: 0 auto; padding: 20px; }
.header { display: flex; align-items: center; gap: 12px; }
.header h2 { flex: 1; margin: 0; }
.actions { display: flex; gap: 8px; }
.back-btn { border: 1px solid #e5e7eb; background: #fff; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
.meta { margin: 16px 0; background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 12px; }
.meta-row { display: flex; gap: 12px; padding: 6px 0; }
.meta-row .label { width: 80px; color: #6b7280; }
.meta-row .value { color: #111827; }
.status-completed { color: #059669; }
.status-processing { color: #f59e0b; }
.status-failed { color: #dc2626; }
.panel { border: 1px solid #eee; border-radius: 8px; margin: 16px 0; overflow: hidden; }
.panel-header { display: flex; align-items: center; justify-content: space-between; background: #f9fafb; padding: 10px 12px; }
.panel-body { padding: 12px; }
.loading { color: #6b7280; }
.empty { color: #9ca3af; }
.content-pre { background: #0b1020; color: #e4e7ef; padding: 12px; border-radius: 6px; white-space: pre-wrap; }
.chunks { display: flex; flex-direction: column; gap: 10px; }
.chunk { border: 1px solid #eee; border-radius: 6px; padding: 10px; }
.chunk-head { display: flex; justify-content: space-between; color: #6b7280; margin-bottom: 6px; }
.chunk-body { white-space: pre-wrap; }
.kb-btn { background: #2563eb; color: white; border: none; border-radius: 8px; padding: 6px 12px; cursor: pointer; }
.kb-btn.secondary { background: #6b7280; }
.kb-btn.small { padding: 4px 10px; font-size: 12px; }
</style>
