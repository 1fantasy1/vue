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

    <!-- 学生匹配推荐 -->
    <div class="card">
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
import ProjectForm from '@/components/ProjectForm.vue'

export default {
  name: 'ProjectDetail',
  components: { ProjectForm },
  setup() {
  const route = useRoute()
  const router = useRouter()
    const loading = ref(true)
    const error = ref('')
    const project = ref(null)
    const skills = ref([])
  const roles = ref([])
  const keywords = ref([])

    const fmtDate = (d) => {
      try { return new Date(d).toLocaleString() } catch { return d }
    }
    const statusText = (s) => ({ planning: '计划中', active: '进行中', paused: '已暂停', completed: '已完成' }[s] || s)
    const dateRange = computed(() => {
      const s = project.value?.start_date ? fmtDate(project.value.start_date) : '-'
      const e = project.value?.end_date ? fmtDate(project.value.end_date) : '-'
      return `${s} ~ ${e}`
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

    return { 
      loading,
      error,
      project,
      skills,
      roles,
      keywords,
      fmtDate,
      statusText,
      dateRange,
      goBack,
      levelClass,
      // 编辑
      showForm,
      openEdit,
      closeForm,
      onEditSuccess,
      // 推荐
      initialK,
      finalK,
      recLoading,
      recError,
      matchedStudents,
      fetchMatches,
      fmtScore
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
</style>