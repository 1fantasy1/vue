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
  :is-admin="isAdmin"
  :current-user-id="currentUserId"
  :current-student-id="currentUserId"
  :current-user-email="currentUserEmail"
      :can-apply="canApply"
      :show-members="true"
      @application-submitted="onApplicationSubmitted"
      @application-processed="onApplicationProcessed"
    />

  <!-- 学生匹配推荐 -->
  <div class="card" v-if="showRecommendSection">
      <div class="match-header">
        <h3>为该项目推荐学生</h3>
        <div class="match-description">
          <p>基于项目需求的技能、角色和关键词，为您智能推荐最合适的学生。</p>
        </div>
        <div class="match-controls">
          <label>
            初筛数量
            <input type="number" min="1" max="200" v-model.number="initialK" />
            <small>从所有学生中初步筛选的数量</small>
          </label>
          <label>
            最终数量
            <input type="number" min="1" max="50" v-model.number="finalK" />
            <small>最终推荐的学生数量</small>
          </label>
          <button class="match-btn" :disabled="recLoading" @click="fetchMatches">
            <span v-if="recLoading">🔄 推荐中…</span>
            <span v-else>🎯 推荐学生</span>
          </button>
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
          <div class="match-actions">
            <button class="contact-btn" @click="contactStudent(s)">📨 联系TA</button>
          </div>
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
import { collectionsAdapter } from '@/api/openapi/adapters/collectionsAdapter.js'
import { projectsAdapter } from '@/api/openapi/adapters/projectsAdapter.js'
import CollectionModal from '@/components/CollectionModal.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import ProjectApplications from '@/components/ProjectApplications.vue'
import { useGlobalStore } from '@/stores/global.js'

export default {
  name: 'ProjectDetail',
  components: { ProjectForm, CollectionModal, ProjectApplications },
  setup() {
  const route = useRoute()
  const router = useRouter()
  const globalStore = useGlobalStore()
  try { globalStore.initAuth() } catch {}
    const loading = ref(true)
    const error = ref('')
    const project = ref(null)
    const skills = ref([])
  const roles = ref([])
  const keywords = ref([])

    // 项目权限判断
    const projectId = computed(() => route.params.id)
    const currentUserId = computed(() => {
      // 优先从全局store获取，其次从登录缓存获取，最后退回旧localStorage
      const sid = globalStore?.user?.id
      if (sid) return String(sid)
      try {
        const me = JSON.parse(localStorage.getItem('currentUser') || 'null')
        if (me?.id) return String(me.id)
      } catch {}
      // 不再使用 '1' 作为回退，避免误判为创建者
      const legacy = localStorage.getItem('userId')
      return legacy ? String(legacy) : ''
    })
  const isProjectCreator = computed(() => {
      const p = project.value
      if (!p) return false
      const myId = currentUserId.value?.toString()
      const candidates = []
      // 常见后端字段兼容
      if (p.creator_id != null) candidates.push(p.creator_id)
      if (p.creator_user_id != null) candidates.push(p.creator_user_id)
      if (p.created_by != null) candidates.push(p.created_by)
      if (p.created_by_user_id != null) candidates.push(p.created_by_user_id)
      if (p.owner_id != null) candidates.push(p.owner_id)
      if (p.owner?.id != null) candidates.push(p.owner.id)
      if (p.creator?.id != null) candidates.push(p.creator.id)
      if (p.creator?.user_id != null) candidates.push(p.creator.user_id)
      return candidates.some(id => id != null && id.toString() === myId)
    })
    // 当前用户邮箱（用于与成员列表比对）
    const currentUserEmail = computed(() => {
      const u = globalStore?.user || {}
      if (u.email) return String(u.email)
      try {
        const me = JSON.parse(localStorage.getItem('currentUser') || 'null')
        if (me?.email) return String(me.email)
      } catch {}
      return ''
    })
    // 管理员识别（仅信任后端来源：store 或登录缓存 currentUser）
    const isAdmin = computed(() => {
      // pinia store
      const u = globalStore?.user || {}
      const role = (u.role || '').toLowerCase()
      if (role === 'admin') return true
      if (Array.isArray(u.roles) && u.roles.map(r => String(r).toLowerCase()).includes('admin')) return true
      // 登录缓存 currentUser
      try {
        const me = JSON.parse(localStorage.getItem('currentUser') || 'null')
        if (me) {
          const mr = (me.role || '').toLowerCase()
          if (mr === 'admin') return true
          if (Array.isArray(me.roles) && me.roles.map(r => String(r).toLowerCase()).includes('admin')) return true
        }
      } catch {}
      return false
    })
    // 项目级别的admin角色检查
    const isProjectAdmin = ref(false)
    
    // 检查当前用户在项目中的角色
    const checkProjectRole = async () => {
      if (!project.value?.id || !currentUserId.value) return
      try {
  const members = await projectsAdapter.getProjectMembers(project.value.id)
  if (Array.isArray(members)) {
          const myId = currentUserId.value.toString()
          const myEmail = currentUserEmail.value.toLowerCase()
          
          const me = members.find(m => {
            const memberId = (m?.user_id ?? m?.student_id ?? m?.id ?? m?.member_id)?.toString()
            const memberEmail = (m?.email ?? m?.user_email ?? m?.contact_email ?? '').toLowerCase()
            return (memberId === myId) || (myEmail && memberEmail === myEmail)
          })
          
          if (me && me.role === 'admin') {
            isProjectAdmin.value = true
          }
  }
      } catch (e) {
        console.warn('检查项目角色失败:', e)
      }
    }
    
    const showRecommendSection = computed(() => isProjectCreator.value || isAdmin.value || isProjectAdmin.value)
    const canApply = computed(() => {
      // 项目创建者不能申请自己的项目
      // 仅在项目开放招募时可以申请，兼容中英文状态
      if (isProjectCreator.value || !project.value) return false
      const s = (project.value.project_status || '').toString().toLowerCase()
      // 认为以下状态可申请：招募中/计划中/进行中/active/planning
      const open = ['招募中', '计划中', '进行中']
      const openEn = ['planning', 'active']
      return open.includes(project.value.project_status) || openEn.includes(s)
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
  const data = await projectsAdapter.getProjectById(id)
        if (data) {
          project.value = data
          deriveFromProject(project.value)
          // 检查项目角色
          await checkProjectRole()
        } else {
          error.value = '加载失败'
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
  const list = await collectionsAdapter.getAllCollections({ typeFilter: 'project' })
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
  const c = await collectionsAdapter.getCollectionById(existingCollectionId.value)
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
          await collectionsAdapter.updateCollection(collectionForm.value.id, payload)
          existingCollectionId.value = collectionForm.value.id
        } else {
          const created = await collectionsAdapter.createCollection(payload)
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
  const list = await projectsAdapter.matchStudents(project.value.id, initialK.value, finalK.value)
  matchedStudents.value = Array.isArray(list) ? list : []
      } catch (e) {
        recError.value = e.message || '获取推荐失败'
      } finally {
        recLoading.value = false
      }
    }

    // 联系学生功能
    const contactStudent = (student) => {
      // 这里可以实现联系学生的功能
      // 比如发送邮件或显示联系信息
      const subject = encodeURIComponent(`项目合作邀请：${project.value.title}`)
      const body = encodeURIComponent(`您好 ${student.name}，

我看到您的技能和经验非常符合我的项目需求。项目详情：

项目名称：${project.value.title}
项目描述：${project.value.description || '详见项目页面'}

希望能与您进一步交流合作可能性。

此致
敬礼！`)
      
      // 尝试打开邮件客户端
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
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
  isAdmin,
  isProjectAdmin,
  currentUserId,
  currentUserEmail,
      canApply,
  showRecommendSection,
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
      contactStudent,
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
.match-header { 
  display: flex; 
  flex-direction: column;
  gap: 12px; 
}

.match-description {
  color: #6b7280;
  font-size: 14px;
  margin: 8px 0;
}

.match-description p {
  margin: 0;
}

.match-controls { 
  display: flex; 
  align-items: flex-end; 
  gap: 16px; 
  flex-wrap: wrap;
}

.match-controls label { 
  display: flex; 
  flex-direction: column;
  gap: 4px; 
  color: #374151; 
  font-size: 13px; 
  font-weight: 500;
}

.match-controls label small {
  color: #9ca3af;
  font-size: 11px;
  font-weight: normal;
}

.match-controls input { 
  width: 100px; 
  border: 1px solid #e5e7eb; 
  border-radius: 8px; 
  padding: 8px 10px; 
  font-size: 14px;
}

.match-controls input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.match-btn { 
  border: none; 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff; 
  padding: 10px 20px; 
  border-radius: 10px; 
  cursor: pointer; 
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.match-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.match-btn:disabled { 
  opacity: .7; 
  cursor: not-allowed; 
  transform: none;
}

.error-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
}

.loading-inline { 
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280; 
  font-size: 14px; 
  padding: 20px;
  text-align: center;
  background: #f9fafb;
  border-radius: 8px;
  margin: 12px 0;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #374151;
}

.empty-hint {
  font-size: 14px;
  color: #9ca3af;
}

.match-list { 
  list-style: none; 
  padding: 0; 
  margin: 16px 0 0; 
  display: grid; 
  gap: 16px; 
}

.match-item { 
  border: 1px solid #e5e7eb; 
  border-radius: 12px; 
  padding: 20px; 
  background: #fff;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.match-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.match-rank {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.match-main { 
  display: grid; 
  gap: 8px; 
  margin-bottom: 12px;
  padding-right: 50px;
}

.match-name { 
  font-weight: 700; 
  color: #111827; 
  font-size: 16px;
}

.match-sub { 
  color: #6b7280; 
  font-size: 14px; 
}

.match-chips { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 8px; 
  margin-top: 8px;
}

.match-chips .chip {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.skill-level {
  background: #667eea;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.match-scores { 
  display: flex; 
  gap: 20px; 
  margin: 12px 0;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.score label { 
  color: #6b7280; 
  font-size: 12px; 
  font-weight: 500;
}

.score span {
  font-size: 16px;
  font-weight: 700;
}

.score.primary span {
  color: #667eea;
}

.score.secondary span {
  color: #10b981;
}

.match-rationale { 
  margin: 12px 0; 
  background: #fef7ed;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 12px;
}

.rationale-label {
  font-weight: 600;
  color: #ea580c;
  margin-bottom: 6px;
  font-size: 13px;
}

.rationale-text {
  color: #9a3412; 
  line-height: 1.6; 
  font-size: 14px;
}

.match-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.contact-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

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