<template>
  <div class="project-detail-page" v-if="!loading && project">
    <!-- 顶部 -->
    <div class="pd-header">
      <button class="back-btn" @click="goBack" title="返回">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        返回
      </button>
      <div class="title-area">
        <h1>{{ project.title }}</h1>
        <div class="meta">
          <span class="badge" :class="project.project_status">{{ statusText(project.project_status) }}</span>
          <span v-if="project.project_type" class="type-chip">{{ project.project_type }}</span>
        </div>
      </div>
      <button class="edit-btn" @click="openEdit" title="编辑项目">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M5 21h14v-2H5v2zm3.7-6.04l7.06-7.06 2.34 2.34-7.06 7.06H8.7v-2.34zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        编辑项目
      </button>
      <button class="edit-btn" v-if="existingCollectionId" @click="openEditCollection" title="编辑收藏">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M14.06,6.19L3,17.25V21H6.75L17.81,9.94M14.06,6.19L17.81,9.94M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.62L18.38,3.29C18.18,3.09 17.92,3 17.66,3Z"/></svg>
        编辑收藏
      </button>
      <button class="edit-btn" v-else :disabled="!project" @click="openCreateCollection" title="收藏此项目">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.04L12,21.35Z"/></svg>
        收藏
      </button>
    </div>

    <!-- 概览卡片 -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">状态</div>
        <div class="stat-value">
          <span class="badge sm" :class="project.project_status">{{ statusText(project.project_status) }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">起止日期</div>
        <div class="stat-value">{{ dateRange }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">每周工时</div>
        <div class="stat-value">{{ project.estimated_weekly_hours ?? '-' }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">地点</div>
        <div class="stat-value">{{ project.location || '-' }}</div>
      </div>
    </div>

    <!-- 描述卡片 -->
    <div v-if="project.description" class="card">
      <h3>项目描述</h3>
      <p class="desc">{{ project.description }}</p>
    </div>

    <div class="grid">
      <div class="card">
        <h3>关键信息</h3>
        <ul class="kv">
          <li v-if="project.project_type"><label>类型</label><span>{{ project.project_type }}</span></li>
          <li v-if="project.team_size_preference"><label>团队规模</label><span>{{ project.team_size_preference }}</span></li>
          <li v-if="project.location"><label>地点</label><span>{{ project.location }}</span></li>
          <li v-if="project.estimated_weekly_hours !== undefined"><label>每周工时</label><span>{{ project.estimated_weekly_hours }}</span></li>
          <li v-if="project.start_date"><label>开始</label><span>{{ fmtDate(project.start_date) }}</span></li>
          <li v-if="project.end_date"><label>结束</label><span>{{ fmtDate(project.end_date) }}</span></li>
          <li v-if="project.created_at"><label>创建日期</label><span>{{ fmtDateTime(project.created_at) }}</span></li>
          <li v-if="shouldShowUpdatedAt"><label>更新日期</label><span>{{ fmtDateTime(project.updated_at) }}</span></li>
        </ul>
      </div>

      <div class="card" v-if="skills.length">
        <h3>所需技能</h3>
        <ul class="skill-list">
          <li v-for="(s, i) in skills" :key="i">
            <span class="chip">{{ s.name }}</span>
            <span class="level" :class="levelClass(s.level)">{{ s.level }}</span>
          </li>
        </ul>
      </div>

      <div class="card" v-if="roles.length">
        <h3>所需角色</h3>
        <ul class="chips">
          <li v-for="(r, i) in roles" :key="i" class="chip">{{ r }}</li>
        </ul>
      </div>

      <div class="card" v-if="keywords.length">
        <h3>关键词</h3>
        <ul class="chips">
          <li v-for="(k, i) in keywords" :key="i" class="chip">#{{ k }}</li>
        </ul>
      </div>
    </div>

    <div class="card" v-if="project.expected_deliverables">
      <h3>预期交付物</h3>
      <p class="desc">{{ project.expected_deliverables }}</p>
    </div>

    <div class="card" v-if="project.learning_outcomes">
      <h3>学习成果</h3>
      <p class="desc">{{ project.learning_outcomes }}</p>
    </div>

    <div class="card" v-if="project.contact_person_info">
      <h3>联系人</h3>
      <p class="desc">{{ project.contact_person_info }}</p>
    </div>

    <!-- 项目申请和成员管理 -->
    <ProjectApplications
      :project-id="projectId"
      :is-project-creator="isProjectCreator"
      :can-apply="canApply"
      :show-members="true"
      @application-submitted="onApplicationSubmitted"
      @application-processed="onApplicationProcessed"
    />

    <!-- 学生匹配推荐 -->
    <div class="card" v-if="isProjectCreator">
      <div class="match-header">
        <h3>为该项目推荐学生</h3>
        <div class="match-controls">
          <label>
            初筛数量
            <input type="number" min="1" max="200" v-model.number="initialK" />
          </label>
          <label>
            最终数量
            <input type="number" min="1" max="50" v-model.number="finalK" />
          </label>
          <button class="match-btn" :disabled="recLoading" @click="fetchMatches">{{ recLoading ? '推荐中…' : '推荐学生' }}</button>
        </div>
      </div>

  <div v-if="recError" class="tip">{{ recError }}</div>
  <div v-else-if="recLoading" class="loading-inline">正在获取推荐结果…</div>
  <ul v-else-if="matchedStudents.length" class="match-list">
        <li v-for="s in matchedStudents" :key="s.student_id" class="match-item">
          <div class="match-main">
            <div class="match-name">{{ s.name }}</div>
            <div class="match-sub">{{ s.major || '专业未填写' }}</div>
            <div class="match-chips" v-if="Array.isArray(s.skills) && s.skills.length">
              <span v-for="(sk, i) in s.skills" :key="i" class="chip">{{ sk.name ?? sk.skill_name }} · {{ sk.level ?? sk.proficiency }}</span>
            </div>
          </div>
          <div class="match-scores">
            <div class="score"><label>相似度</label><span>{{ fmtScore(s.similarity_stage1) }}</span></div>
            <div class="score"><label>相关性</label><span>{{ fmtScore(s.relevance_score) }}</span></div>
          </div>
          <div class="match-rationale" v-if="s.match_rationale">{{ s.match_rationale }}</div>
        </li>
  </ul>
  <div v-else class="empty">点击上方“推荐学生”获取匹配结果</div>
    </div>
    <!-- 编辑弹窗 -->
    <ProjectForm
      v-if="showForm"
      :project="project"
      @cancel="closeForm"
      @success="onEditSuccess"
    />

    <CollectionModal
      :model-value="collectionModalVisible"
      @update:modelValue="v => collectionModalVisible = v"
      :is-editing="isEditingCollection"
      :initial="collectionForm"
      :show-folder="false"
  :types="['project']"
      title-text="收藏此项目"
      @submit="onCollectionSubmit"
    />
  </div>

  <div v-else class="loading-card">
    <div class="skeleton header"></div>
    <div class="skeleton row"></div>
    <div class="skeleton row"></div>
    <div class="skeleton block"></div>
    <div class="tip" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApiService } from '@/services/api.js'
import CollectionModal from '@/components/CollectionModal.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import ProjectApplications from '@/components/ProjectApplications.vue'

export default {
  name: 'ProjectDetail',
  components: { ProjectForm, CollectionModal, ProjectApplications },
  setup() {
  const route = useRoute()
  const router = useRouter()
    const loading = ref(true)
    const error = ref('')
    const project = ref(null)
    const skills = ref([])
  const roles = ref([])
  const keywords = ref([])

    // 项目权限判断
    const projectId = computed(() => route.params.id)
    const currentUserId = computed(() => {
      // 这里应该从认证状态获取当前用户ID，暂时使用模拟值
      // 实际应该从store或者认证服务获取
      return localStorage.getItem('userId') || '1'
    })
    const isProjectCreator = computed(() => {
      return project.value && project.value.creator_id && 
             project.value.creator_id.toString() === currentUserId.value.toString()
    })
    const canApply = computed(() => {
      // 项目创建者不能申请自己的项目
      // 项目状态为"招募中"才能申请
      return !isProjectCreator.value && 
             project.value && 
             project.value.project_status === '招募中'
    })

    const fmtDate = (d) => {
      try { return new Date(d).toLocaleString() } catch { return d }
    }
    
    // 专门用于显示创建/更新时间的格式化函数
    const fmtDateTime = (d) => {
      try { 
        const date = new Date(d)
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch { 
        return d 
      }
    }
    const statusText = (s) => ({ planning: '计划中', active: '进行中', paused: '已暂停', completed: '已完成' }[s] || s)
    const dateRange = computed(() => {
      const s = project.value?.start_date ? fmtDate(project.value.start_date) : '-'
      const e = project.value?.end_date ? fmtDate(project.value.end_date) : '-'
      return `${s} ~ ${e}`
    })
    
    // 判断是否显示更新日期（避免与创建日期重复）
    const shouldShowUpdatedAt = computed(() => {
      if (!project.value?.updated_at || !project.value?.created_at) return false
      const created = new Date(project.value.created_at).getTime()
      const updated = new Date(project.value.updated_at).getTime()
      // 如果更新时间与创建时间相差超过1分钟，则显示更新时间
      return Math.abs(updated - created) > 60000
    })
    const goBack = () => router.back()
    const levelClass = (lvl) => {
      switch (lvl) {
        case '初窥门径': return 'l-beginner'
        case '登堂入室': return 'l-intermediate'
        case '融会贯通': return 'l-advanced'
        case '炉火纯青': return 'l-expert'
        default: return 'l-beginner'
      }
    }

    const deriveFromProject = (p) => {
      skills.value = Array.isArray(p.required_skills)
        ? p.required_skills.map(it => ({ name: it.name ?? it.skill_name ?? '', level: it.level ?? it.proficiency ?? '' }))
        : []
      roles.value = Array.isArray(p.required_roles) ? p.required_roles : []
      keywords.value = (p.keywords || '').split(',').map(s => s.trim()).filter(Boolean)
    }

    const load = async () => {
      loading.value = true
      try {
        const id = route.params.id
        const res = await ApiService.getProject(id)
        if (res?.data?.success && res.data.data) {
          project.value = res.data.data
          deriveFromProject(project.value)
        } else {
          error.value = res?.data?.message || '加载失败'
        }
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }

    onMounted(load)

    // 收藏入口：创建/编辑
    const existingCollectionId = ref(null)
    const collectionModalVisible = ref(false)
    const isEditingCollection = ref(false)
  const collectionForm = ref({ id: null, title: '', type: 'project', url: '', content: '', tags: '' })
    const collLoading = ref(false)

    const fetchExistingCollection = async () => {
      if (!project.value?.id) return
      try {
  const res = await ApiService.getCollections({ typeFilter: 'project' })
        const list = res?.data?.data || res?.data || []
        const found = Array.isArray(list) ? list.find(c => (c.source_type === 'project' && c.source_id === project.value.id) || c.title === project.value.title) : null
        existingCollectionId.value = found?.id || null
      } catch {
        existingCollectionId.value = null
      }
    }

    // 载入项目后尝试检测收藏
    onMounted(async () => {
      await fetchExistingCollection()
    })

    const openCreateCollection = () => {
      collectionForm.value = {
        id: null,
        title: project.value?.title || '',
  type: 'project',
        url: '',
        content: project.value?.description || '',
        tags: (keywords.value || []).join(', ')
      }
      isEditingCollection.value = false
      collectionModalVisible.value = true
    }

    const openEditCollection = async () => {
      if (!existingCollectionId.value) return
      try {
        const res = await ApiService.getCollection(existingCollectionId.value)
        const c = res?.data?.data || res?.data
        collectionForm.value = {
          id: c.id,
          title: c.title || project.value?.title || '',
          type: c.type || 'project',
          url: c.url || '',
          content: c.content || '',
          tags: Array.isArray(c.tags) ? c.tags.join(', ') : (c.tags || '')
        }
        isEditingCollection.value = true
        collectionModalVisible.value = true
      } catch (e) {
        alert(e.message || '加载收藏失败')
      }
    }

    const onCollectionSubmit = async (payload, editing) => {
      if (!collectionForm.value.title?.trim()) {
        alert('请输入标题')
        return
      }
      collLoading.value = true
  payload = { ...payload, type: 'project', source_type: 'project', source_id: project.value?.id }
      try {
        if (isEditingCollection.value && collectionForm.value.id) {
          const res = await ApiService.updateCollection(collectionForm.value.id, payload)
          if (res?.data?.success === false) throw new Error(res.data.message || '保存失败')
          existingCollectionId.value = collectionForm.value.id
        } else {
          const res = await ApiService.createCollection(payload)
          const created = res?.data?.data || res?.data
          existingCollectionId.value = created?.id || null
        }
        collectionModalVisible.value = false
      } catch (e) {
        alert(e.message || '提交失败')
      } finally {
        collLoading.value = false
      }
    }

    // 编辑弹窗集成
    const showForm = ref(false)
    const openEdit = () => { showForm.value = true }
    const closeForm = () => { showForm.value = false }
    const onEditSuccess = (updated) => {
      if (updated) {
        project.value = updated
        deriveFromProject(updated)
      }
      closeForm()
    }

    // 推荐学生
    const initialK = ref(50)
    const finalK = ref(3)
    const recLoading = ref(false)
    const recError = ref('')
    const matchedStudents = ref([])
    const fmtScore = (n) => {
      if (n === undefined || n === null || isNaN(Number(n))) return '-'
      return Number(n).toFixed(2)
    }
    const fetchMatches = async () => {
      if (!project.value?.id) return
      recError.value = ''
      recLoading.value = true
      matchedStudents.value = []
      try {
        const res = await ApiService.matchStudents(project.value.id, { initialK: initialK.value, finalK: finalK.value })
        if (res?.data?.success) {
          matchedStudents.value = res.data.data || []
        } else {
          recError.value = res?.data?.message || '获取推荐失败'
        }
      } catch (e) {
        recError.value = e.message || '获取推荐失败'
      } finally {
        recLoading.value = false
      }
    }

    // 申请相关回调
    const onApplicationSubmitted = (applicationData) => {
      console.log('Application submitted:', applicationData)
      // 可以显示成功提示
      // 可以刷新项目数据或做其他处理
    }

    const onApplicationProcessed = (applicationData) => {
      console.log('Application processed:', applicationData)
      // 可以显示处理结果提示
      // 可以刷新相关数据
    }

    return { 
      loading,
      error,
      project,
      projectId,
      isProjectCreator,
      canApply,
      skills,
      roles,
      keywords,
      fmtDate,
      fmtDateTime,
      statusText,
      dateRange,
      shouldShowUpdatedAt,
      goBack,
      levelClass,
      // 编辑
      showForm,
      openEdit,
      closeForm,
      onEditSuccess,
  // 收藏
  existingCollectionId,
  collectionModalVisible,
  isEditingCollection,
  collectionForm,
  collLoading,
  openCreateCollection,
  openEditCollection,
  onCollectionSubmit,
      // 推荐
      initialK,
      finalK,
      recLoading,
      recError,
      matchedStudents,
      fetchMatches,
      fmtScore,
      // 申请
      onApplicationSubmitted,
      onApplicationProcessed
    }
  }
}
</script>

<style scoped>
.project-detail-page { padding: 24px; max-width: 1000px; margin: 0 auto; }
.pd-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.back-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 10px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #374151; cursor: pointer; }
.back-btn:hover { background: #f9fafb; }
.title-area h1 { margin: 0; font-size: 28px; line-height: 1.25; color: #111827; }
.meta { margin-top: 6px; display: flex; align-items: center; gap: 8px; }
.edit-btn { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; padding: 10px 12px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #111827; cursor: pointer; font-weight: 600; }
.edit-btn:hover { background: #f9fafb; }
.badge { padding: 4px 10px; border-radius: 999px; background: #eef2ff; color: #4f46e5; font-size: 12px; margin-right: 4px; border: 1px solid #e0e7ff; }
.badge.active { background: rgba(34,197,94,.12); color: #16a34a; border-color: rgba(34,197,94,.3); }
.badge.planning { background: rgba(245,158,11,.12); color: #d97706; border-color: rgba(245,158,11,.3); }
.badge.completed { background: rgba(59,130,246,.12); color: #2563eb; border-color: rgba(59,130,246,.3); }
.badge.paused { background: rgba(107,114,128,.12); color: #6b7280; border-color: rgba(107,114,128,.3); }
.badge.sm { font-size: 11px; padding: 2px 8px; }
.type-chip { background: #f3f4f6; color: #374151; border-radius: 999px; padding: 4px 10px; font-size: 12px; border: 1px solid #e5e7eb; }

.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 14px 16px; }
.stat-label { font-size: 12px; color: #6b7280; }
.stat-value { font-size: 16px; color: #111827; font-weight: 700; margin-top: 6px; }

.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px 18px; margin: 12px 0; }
.card h3 { margin: 0 0 10px; font-size: 16px; color: #111827; }
.desc { color: #374151; line-height: 1.7; }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.kv { list-style: none; padding: 0; margin: 0; }
.kv li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #e5e7eb; }
.kv li:last-child { border-bottom: none; }
.kv label { color: #6b7280; margin-right: 12px; }

.chips { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 0; }
.chip { background: #f5f7ff; color: #374151; border-radius: 999px; padding: 6px 10px; font-size: 13px; border: 1px solid #e0e7ff; }

.skill-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
.skill-list li { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 8px 10px; }
.level { font-size: 12px; padding: 4px 8px; border-radius: 999px; border: 1px solid transparent; }
.l-beginner { background: #eef2ff; color: #4f46e5; border-color: #e0e7ff; }
.l-intermediate { background: rgba(34,197,94,.12); color: #16a34a; border-color: rgba(34,197,94,.3); }
.l-advanced { background: rgba(245,158,11,.12); color: #d97706; border-color: rgba(245,158,11,.3); }
.l-expert { background: rgba(59,130,246,.12); color: #2563eb; border-color: rgba(59,130,246,.3); }

/* 推荐学生 */
.match-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.match-controls { display: flex; align-items: center; gap: 10px; }
.match-controls label { display: inline-flex; align-items: center; gap: 6px; color: #6b7280; font-size: 13px; }
.match-controls input { width: 80px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px 8px; }
.match-btn { border: none; background: #667eea; color: #fff; padding: 8px 12px; border-radius: 10px; cursor: pointer; }
.match-btn:disabled { opacity: .7; cursor: not-allowed; }
.match-list { list-style: none; padding: 0; margin: 10px 0 0; display: grid; gap: 12px; }
.match-item { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fafafa; }
.match-main { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
.match-name { font-weight: 700; color: #111827; }
.match-sub { color: #6b7280; font-size: 13px; }
.match-chips { display: flex; flex-wrap: wrap; gap: 6px; width: 100%; }
.match-scores { display: flex; gap: 16px; margin-top: 8px; }
.score label { color: #6b7280; font-size: 12px; margin-right: 6px; }
.match-rationale { margin-top: 8px; color: #374151; line-height: 1.6; }
.loading-inline { color: #6b7280; font-size: 14px; }
.empty { color: #6b7280; font-size: 14px; }

.loading-card { max-width: 1000px; margin: 24px auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 18px; }
.skeleton { background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%); background-size: 400% 100%; animation: shine 1.4s ease infinite; border-radius: 10px; }
.skeleton.header { height: 28px; width: 60%; margin-bottom: 12px; }
.skeleton.row { height: 16px; width: 90%; margin: 8px 0; }
.skeleton.block { height: 120px; width: 100%; margin-top: 10px; }
.tip { margin-top: 12px; color: #ef4444; text-align: center; }
@keyframes shine { 0%{background-position: 200% 0} 100%{background-position: -200% 0} }

@media (max-width: 768px) {
  .stats { grid-template-columns: 1fr 1fr; }
  .grid { grid-template-columns: 1fr; }
}

/* 简易弹窗样式，复用 Favorites 页风格 */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; width: 520px; max-width: calc(100% - 32px); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.15); overflow: hidden; }
.modal-title { margin: 0; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.modal-body { padding: 16px 20px; }
.form-row { margin-bottom: 12px; }
.form-row label { display: block; font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.form-row .input { width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid #f0f0f0; }
.btn { padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer; }
.btn.secondary { background: #f1f3f5; color: #2c3e50; }
.btn.primary { background: #667eea; color: #fff; }
</style>