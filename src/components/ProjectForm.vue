<template>
	<teleport to="body">
	<div class="pf-wrapper">
		<div class="pf-card">
			<div class="pf-header">
				<h3>{{ isEdit ? '编辑项目' : '创建项目' }}</h3>
				<button class="pf-close" @click="$emit('cancel')">×</button>
			</div>

			<form class="pf-form" @submit.prevent="handleSubmit">
				<div class="pf-grid">
					<div class="pf-field full">
						<label>项目标题<span class="req">*</span></label>
						<input v-model.trim="form.title" type="text" placeholder="请输入项目标题" required />
					</div>

					<div class="pf-field full">
						<label>项目描述</label>
						<textarea v-model.trim="form.description" rows="3" placeholder="简要介绍项目目标、背景与范围"></textarea>
					</div>

					<div class="pf-field">
						<label>项目类型</label>
						<input v-model.trim="form.project_type" type="text" placeholder="例如：课程项目 / 科研 / 实训" />
					</div>

					<div class="pf-field">
						<label>项目状态</label>
						<select v-model="form.project_status">
							<option value="招募中">招募中</option>
							<option value="进行中">进行中</option>
							<option value="已完成">已完成</option>
							<option value="暂停">暂停</option>
						</select>
					</div>

					<div class="pf-field">
						<label>开始日期</label>
						<input v-model="form.start_date" type="date" />
					</div>

					<div class="pf-field">
						<label>结束日期</label>
						<input v-model="form.end_date" type="date" />
					</div>

					<div class="pf-field">
						<label>预计每周工时</label>
						<input v-model.number="form.estimated_weekly_hours" type="number" min="0" placeholder="例如：8" />
					</div>

					<div class="pf-field">
						<label>团队规模偏好</label>
						<input v-model.trim="form.team_size_preference" type="text" placeholder="例如：3-5人" />
					</div>

					<div class="pf-field full">
						<label>关键词</label>
						<div class="tags-input">
							<div class="tags-container">
								<span v-for="(keyword, index) in keywords" :key="index" class="tag">
									{{ keyword }}
									<button type="button" @click="removeKeyword(index)" class="tag-remove">×</button>
								</span>
								<input 
									v-model="keywordInput" 
									@keydown.enter.prevent="addKeyword"
									@keydown.comma.prevent="addKeyword"
									@keydown.backspace="handleKeywordBackspace"
									@paste="handleKeywordPaste"
									type="text" 
									placeholder="输入关键词后按回车或逗号添加"
									class="tag-input"
								/>
							</div>
						</div>
						<small class="pf-hint">可以直接粘贴逗号分隔的文本，例如：AI, 前端, 数据分析</small>
					</div>

					<div class="pf-field full">
						<label>项目所需角色</label>
						<div class="tags-input">
							<div class="tags-container">
								<span v-for="(role, index) in roles" :key="index" class="tag">
									{{ role }}
									<button type="button" @click="removeRole(index)" class="tag-remove">×</button>
								</span>
								<input 
									v-model="roleInput" 
									@keydown.enter.prevent="addRole"
									@keydown.comma.prevent="addRole"
									@keydown.backspace="handleRoleBackspace"
									@paste="handleRolePaste"
									type="text" 
									placeholder="输入角色后按回车或逗号添加"
									class="tag-input"
								/>
							</div>
						</div>
						<small class="pf-hint">可以直接粘贴逗号分隔的文本，例如：前端开发, 后端开发, 产品经理</small>
					</div>

								<div class="pf-field full">
									<label>项目所需技能</label>
												<div class="skills">
													<div class="skill-row" v-for="(s, idx) in skills" :key="idx">
														<input v-model.trim="s.name" type="text" placeholder="技能名称 如：Python" />
														<select v-model="s.level">
															<option v-for="opt in LEVEL_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
														</select>
														<button type="button" class="link danger" @click="removeSkill(idx)">移除</button>
													</div>
													<button type="button" class="link" @click="addSkill">+ 添加技能</button>
													<small class="pf-hint">熟练度需为：初窥门径 / 登堂入室 / 融会贯通 / 炉火纯青</small>
												</div>
								</div>

					<div class="pf-field full">
						<label>预期交付物</label>
						<textarea v-model.trim="form.expected_deliverables" rows="2" placeholder="例如：原型、报告、演示"></textarea>
					</div>

					<div class="pf-field">
						<label>联系人信息</label>
						<input v-model.trim="form.contact_person_info" type="text" placeholder="姓名 / 邮箱 / 电话" />
					</div>

					<div class="pf-field">
						<label>项目地点</label>
						<input v-model.trim="form.location" type="text" placeholder="例如：杭州 / 远程" />
					</div>

					<div class="pf-field full">
						<label>学习成果</label>
						<textarea v-model.trim="form.learning_outcomes" rows="2" placeholder="项目完成后可获得的技能或成果"></textarea>
					</div>
				</div>

				<div class="pf-actions">
					<button type="button" class="btn ghost" @click="$emit('cancel')">取消</button>
					<button type="submit" class="btn primary" :disabled="submitting">
						{{ submitting ? '提交中...' : (isEdit ? '保存修改' : '创建项目') }}
					</button>
				</div>
			</form>
		</div>
		</div>
		</teleport>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { ApiService } from '@/services/api.js'

export default {
	name: 'ProjectForm',
	props: {
		project: { type: Object, default: null }
	},
	emits: {
		// 取消操作，关闭表单
		cancel: null,
		// 成功创建或更新项目
		success: (projectData) => {
			// 验证返回的项目数据是否包含必要字段
			return projectData && typeof projectData === 'object' && projectData.id
		}
	},
	setup(props, { emit }) {
		const isEdit = computed(() => !!props.project?.id)
		const submitting = ref(false)

		const form = ref({
			title: '',
			description: '',
			required_roles: null,
			required_skills: null,
			keywords: '',
			project_type: '',
			expected_deliverables: '',
			contact_person_info: '',
			learning_outcomes: '',
			team_size_preference: '',
			project_status: '招募中',
			start_date: '',
			end_date: '',
			estimated_weekly_hours: null,
			location: ''
		})

		// 角色与技能的本地输入辅助
		const rolesInput = ref('')
		const keywords = ref([])
		const keywordInput = ref('')
		const roles = ref([])
		const roleInput = ref('')

		// 标签输入相关方法
		const addKeyword = () => {
			const keyword = keywordInput.value.trim()
			if (keyword && !keywords.value.includes(keyword)) {
				keywords.value.push(keyword)
				keywordInput.value = ''
			}
		}

		const removeKeyword = (index) => {
			keywords.value.splice(index, 1)
		}

		const handleKeywordPaste = (e) => {
			e.preventDefault()
			const pastedText = (e.clipboardData || window.clipboardData).getData('text')
			const newKeywords = pastedText.split(/[,，\n]/).map(k => k.trim()).filter(k => k && !keywords.value.includes(k))
			keywords.value.push(...newKeywords)
			keywordInput.value = ''
		}

		const handleKeywordBackspace = () => {
			if (keywordInput.value === '' && keywords.value.length > 0) {
				keywords.value.pop()
			}
		}

		const addRole = () => {
			const role = roleInput.value.trim()
			if (role && !roles.value.includes(role)) {
				roles.value.push(role)
				roleInput.value = ''
			}
		}

		const removeRole = (index) => {
			roles.value.splice(index, 1)
		}

		const handleRolePaste = (e) => {
			e.preventDefault()
			const pastedText = (e.clipboardData || window.clipboardData).getData('text')
			const newRoles = pastedText.split(/[,，\n]/).map(r => r.trim()).filter(r => r && !roles.value.includes(r))
			roles.value.push(...newRoles)
			roleInput.value = ''
		}

		const handleRoleBackspace = () => {
			if (roleInput.value === '' && roles.value.length > 0) {
				roles.value.pop()
			}
		}
			const LEVEL_OPTIONS = ['初窥门径', '登堂入室', '融会贯通', '炉火纯青']
			const toLevelStr = (val) => {
				if (!val && val !== 0) return LEVEL_OPTIONS[0]
				if (typeof val === 'string') {
					return LEVEL_OPTIONS.includes(val) ? val : LEVEL_OPTIONS[0]
				}
				const n = Number(val) || 1
				if (n <= 1) return '初窥门径'
				if (n === 2) return '登堂入室'
				if (n === 3) return '融会贯通'
				return '炉火纯青'
			}
			const skills = ref([]) // [{ name: 'Python', level: '登堂入室' }]

		const loadFromProject = () => {
			if (!props.project) return
			const p = props.project
			form.value = {
				title: p.title || '',
				description: p.description || '',
				required_roles: p.required_roles || null,
				required_skills: p.required_skills || null,
				keywords: p.keywords || '',
				project_type: p.project_type || '',
				expected_deliverables: p.expected_deliverables || '',
				contact_person_info: p.contact_person_info || '',
				learning_outcomes: p.learning_outcomes || '',
				team_size_preference: p.team_size_preference || '',
				project_status: p.project_status || '招募中',
				start_date: p.start_date ? p.start_date.substring(0,10) : '',
				end_date: p.end_date ? p.end_date.substring(0,10) : '',
				estimated_weekly_hours: p.estimated_weekly_hours ?? null,
				location: p.location || ''
			}

			// 处理角色标签
			roles.value = Array.isArray(p.required_roles) ? [...p.required_roles] : []
			rolesInput.value = Array.isArray(p.required_roles) ? p.required_roles.join(',') : ''
			
			// 处理关键词标签
			if (p.keywords) {
				if (typeof p.keywords === 'string') {
					keywords.value = p.keywords.split(',').map(k => k.trim()).filter(Boolean)
				} else if (Array.isArray(p.keywords)) {
					keywords.value = [...p.keywords]
				}
			} else {
				keywords.value = []
			}
			
			skills.value = Array.isArray(p.required_skills)
				? p.required_skills.map(it => ({
						name: it.name ?? it.skill_name ?? '',
						level: toLevelStr(it.level ?? it.proficiency)
					}))
				: []
		}

		watch(() => props.project, loadFromProject, { immediate: true })

		const addSkill = () => skills.value.push({ name: '', level: LEVEL_OPTIONS[0] })
		const removeSkill = (idx) => skills.value.splice(idx, 1)

			const toISODate = (d) => {
				if (!d) return undefined
				try { return new Date(d).toISOString() } catch { return undefined }
			}

			const buildPayload = () => {
			const payload = { ...form.value }
			
			// roles - 使用标签数组
			if (roles.value.length) {
				payload.required_roles = [...roles.value]
			} else {
				delete payload.required_roles
			}

			// keywords - 使用标签数组
			if (keywords.value.length) {
				payload.keywords = keywords.value.join(',')
			} else {
				delete payload.keywords
			}

			// skills
							const cleanSkills = skills.value
								.filter(s => s.name && s.name.trim())
								.map(s => ({ name: s.name.trim(), level: toLevelStr(s.level) }))
			if (cleanSkills.length) payload.required_skills = cleanSkills
			else delete payload.required_skills

			// 日期转 ISO 8601
			if (payload.start_date) payload.start_date = toISODate(payload.start_date)
			if (payload.end_date) payload.end_date = toISODate(payload.end_date)

			// 空字符串/空值删除，避免触发后端校验
			Object.keys(payload).forEach(k => {
				if (payload[k] === '' || payload[k] === null) delete payload[k]
			})

			return payload
		}

		const handleSubmit = async () => {
			if (!form.value.title?.trim()) return
			submitting.value = true
			try {
				const payload = buildPayload()
				let res
				if (isEdit.value) {
					res = await ApiService.updateProject(props.project.id, payload)
				} else {
					res = await ApiService.createProject(payload)
				}
						if (res?.data?.success) {
					emit('success', res.data.data)
				} else {
							alert(res?.data?.message || '提交失败：请检查必填项')
				}
			} catch (e) {
						alert(e.message || '提交失败：请检查必填项与字段格式')
			} finally {
				submitting.value = false
			}
		}

		return {
			isEdit,
			submitting,
			form,
			rolesInput,
			keywords,
			keywordInput,
			roles,
			roleInput,
			skills,
			LEVEL_OPTIONS,
			addSkill,
			removeSkill,
			addKeyword,
			removeKeyword,
			handleKeywordPaste,
			handleKeywordBackspace,
			addRole,
			removeRole,
			handleRolePaste,
			handleRoleBackspace,
			handleSubmit
		}
	}
}
</script>

<style scoped>
.pf-wrapper {
	position: fixed;
	inset: 0;
	background: rgba(0,0,0,0.35);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 20000;
}
.pf-card {
	width: min(880px, 92vw);
	max-height: 90vh;
	overflow: auto;
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 20px 60px rgba(0,0,0,0.25);
	padding: 20px 20px 16px;
}
.pf-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 10px; }
.pf-header h3 { margin: 0; font-size: 18px; font-weight: 700; }
.pf-close { border:none; background:transparent; font-size: 22px; line-height: 1; cursor: pointer; }

.pf-form { margin-top: 8px; }
.pf-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 14px 16px; }
.pf-field { display:flex; flex-direction:column; gap:6px; }
.pf-field.full { grid-column: 1 / -1; }
label { font-size: 13px; color:#444; font-weight:600; }
.req { color:#ef4444; margin-left: 4px; }
input, select, textarea {
	border: 1px solid #e5e7eb;
	border-radius: 10px;
	padding: 10px 12px;
	font-size: 14px;
	outline: none;
}
input:focus, select:focus, textarea:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.15); }
.pf-hint { color:#888; font-size: 12px; }
.skills { display:flex; flex-direction:column; gap:8px; }
.skill-row { display:grid; grid-template-columns: 1fr 140px auto; gap:8px; }
.link { border:none; background:transparent; color:#667eea; cursor:pointer; padding: 6px 8px; border-radius: 8px; }
.link:hover { background:#f5f7ff; }
.link.danger { color:#ef4444; }

.pf-actions { display:flex; justify-content:flex-end; gap:10px; margin-top: 10px; }
.btn { border:none; border-radius: 10px; padding: 10px 16px; font-weight: 600; cursor: pointer; }
.btn.ghost { background:#f3f4f6; color:#374151; }
.btn.primary { background:#667eea; color:#fff; }
.btn.primary:disabled { opacity: .7; cursor: not-allowed; }

@media (max-width: 640px) {
	.pf-grid { grid-template-columns: 1fr; }
}

/* 标签输入框样式 */
.tags-input {
	border: 1px solid #e5e7eb;
	border-radius: 10px;
	padding: 4px;
	background: white;
	min-height: 44px;
	display: flex;
	align-items: center;
}

.tags-input:focus-within {
	border-color: #667eea;
	box-shadow: 0 0 0 3px rgba(102,126,234,0.15);
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	align-items: center;
	width: 100%;
	padding: 2px;
}

.tag {
	display: inline-flex;
	align-items: center;
	background: #667eea;
	color: white;
	padding: 4px 8px;
	border-radius: 6px;
	font-size: 13px;
	font-weight: 500;
	gap: 4px;
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.tag-remove {
	background: none;
	border: none;
	color: white;
	cursor: pointer;
	font-size: 16px;
	line-height: 1;
	padding: 0;
	margin-left: 4px;
	border-radius: 50%;
	width: 16px;
	height: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.8;
	transition: opacity 0.2s;
}

.tag-remove:hover {
	opacity: 1;
	background: rgba(255, 255, 255, 0.2);
}

.tag-input {
	border: none;
	outline: none;
	padding: 6px 4px;
	font-size: 14px;
	flex: 1;
	min-width: 120px;
	background: transparent;
}

.tag-input::placeholder {
	color: #9ca3af;
}

@media (max-width: 640px) {
	.tags-container {
		gap: 4px;
	}
	
	.tag {
		font-size: 12px;
		padding: 3px 6px;
		max-width: 150px;
	}
	
	.tag-input {
		min-width: 100px;
		font-size: 13px;
	}
}
</style>
