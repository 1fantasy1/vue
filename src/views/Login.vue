<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>🚀 鸿庆书云</h1>
        <p>云聚书，书载鸿，鸿成庆</p>
      </div>
      
      <div class="login-form">
        <!-- 登录方式切换 -->
        <div class="login-type-tabs">
          <button 
            type="button" 
            class="tab-btn" 
            :class="{ active: loginType === 'email' }"
            @click="switchLoginType('email')"
          >
            邮箱登录
          </button>
          <button 
            type="button" 
            class="tab-btn" 
            :class="{ active: loginType === 'phone' }"
            @click="switchLoginType('phone')"
          >
            手机号登录
          </button>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">{{ loginType === 'email' ? '邮箱' : '手机号' }}</label>
            <input
              id="username"
              v-model="loginForm.username"
              :type="loginType === 'email' ? 'email' : 'tel'"
              :placeholder="loginType === 'email' ? '请输入邮箱地址' : '请输入手机号码'"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              required
            />
          </div>
          
          <div class="form-options">
            <label class="checkbox-container">
              <input
                v-model="loginForm.remember"
                type="checkbox"
              />
              <span class="checkmark"></span>
              记住我
            </label>
            <a href="#" class="forgot-password" @click.prevent="showForgotPassword = true">
              忘记密码？
            </a>
          </div>
          
          <button
            type="submit"
            class="login-btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading">登录中...</span>
            <span v-else>登录</span>
          </button>
          
          <div class="login-divider">
            <span>或</span>
          </div>
          
          <div class="social-login">
            <button type="button" class="social-btn wechat" @click="loginWithWechat">
              <span class="social-icon">💬</span>
              微信登录
            </button>
            <button type="button" class="social-btn qq" @click="loginWithQQ">
              <span class="social-icon">🐧</span>
              QQ登录
            </button>
          </div>
          
          <div class="register-link">
            还没有账号？
            <a href="#" @click.prevent="showRegister = true">立即注册</a>
          </div>
        </form>
      </div>
    </div>

    <!-- 忘记密码弹窗：使用 BaseModal -->
    <BaseModal :show="showForgotPassword" title="重置密码" @close="showForgotPassword = false">
      <div class="form-group">
        <BaseInput
          id="reset-email"
          v-model="resetEmail"
          type="email"
          label="邮箱地址"
          placeholder="请输入注册邮箱"
          required
        />
      </div>
      <template #footer>
        <div class="d-flex" style="gap: 8px; justify-content: flex-end; width: 100%">
          <BaseButton variant="secondary" type="button" @click="showForgotPassword = false">取消</BaseButton>
          <BaseButton variant="primary" type="button" :loading="isResetting" @click="handlePasswordReset">发送重置链接</BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- 注册弹窗：使用 BaseModal -->
    <BaseModal :show="showRegister" title="用户注册" @close="showRegister = false">
      <!-- 注册方式切换 -->
      <div class="register-type-tabs">
        <button 
          type="button" 
          class="tab-btn" 
          :class="{ active: registerType === 'email' }"
          @click="switchRegisterType('email')"
        >
          邮箱注册
        </button>
        <button 
          type="button" 
          class="tab-btn" 
          :class="{ active: registerType === 'phone' }"
          @click="switchRegisterType('phone')"
        >
          手机号注册
        </button>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <BaseInput
            id="reg-username"
            v-model="registerForm.username"
            type="text"
            label="用户名"
            placeholder="请输入用户名（3-20位，仅字母数字下划线）"
            required
          />
        </div>
        
        <!-- 邮箱注册 -->
        <div v-if="registerType === 'email'" class="form-group">
          <BaseInput
            id="reg-email"
            v-model="registerForm.email"
            type="email"
            label="邮箱"
            placeholder="请输入邮箱地址"
            required
          />
        </div>
        
        <!-- 手机号注册 -->
        <div v-if="registerType === 'phone'" class="form-group">
          <BaseInput
            id="reg-phone"
            v-model="registerForm.phone_number"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
            required
          />
        </div>
        
        <!-- 手机号注册时的验证码 -->
        <div v-if="registerType === 'phone'" class="form-group">
          <label for="reg-sms-code">短信验证码</label>
          <div class="sms-input-group">
            <input
              id="reg-sms-code"
              v-model="registerForm.smsCode"
              type="text"
              class="form-input"
              placeholder="请输入验证码"
              maxlength="6"
              required
            />
            <button
              type="button"
              class="sms-btn"
              @click="sendSmsCode"
              :disabled="smsCountdown > 0 || isSendingSms"
            >
              <span v-if="isSendingSms">发送中...</span>
              <span v-else-if="smsCountdown > 0">{{ smsCountdown }}s后重试</span>
              <span v-else>获取验证码</span>
            </button>
          </div>
        </div>
        <div class="form-group">
          <BaseInput
            id="reg-password"
            v-model="registerForm.password"
            type="password"
            label="密码"
            placeholder="请输入密码（至少8位）"
            required
          />
        </div>
        <div class="form-group">
          <BaseInput
            id="reg-confirm"
            v-model="registerForm.confirmPassword"
            type="password"
            label="确认密码"
            placeholder="请再次输入密码"
            required
          />
        </div>
        <div class="form-group">
          <BaseInput
            id="reg-fullname"
            v-model="registerForm.name"
            type="text"
            label="真实姓名"
            placeholder="请输入真实姓名"
            required
          />
        </div>
        <div class="form-group">
          <BaseInput
            id="reg-school"
            v-model="registerForm.school"
            type="text"
            label="学校"
            placeholder="请输入学校名称（可选）"
          />
        </div>
        <div class="form-group">
          <BaseInput
            id="reg-major"
            v-model="registerForm.major"
            type="text"
            label="专业"
            placeholder="请输入专业名称（可选）"
          />
        </div>
        <!-- 技能列表（结构化：名称 + 熟练度） -->
        <div class="form-group">
          <label>技能列表（名称 + 熟练度）</label>
          <div class="skills-wrapper">
            <div
              class="skill-item"
              v-for="(skill, idx) in registerForm.skills"
              :key="idx"
            >
              <input
                class="skill-name form-input"
                v-model="skill.name"
                type="text"
                placeholder="技能名称 如：Python"
                maxlength="30"
              />
              <select v-model="skill.level" class="skill-level form-select">
                <option disabled value="">熟练度</option>
                <option value="初窥门径">初窥门径</option>
                <option value="登堂入室">登堂入室</option>
                <option value="融会贯通">融会贯通</option>
                <option value="炉火纯青">炉火纯青</option>
              </select>
              <button
                type="button"
                class="remove-skill-btn"
                @click="removeSkill(idx)"
                v-if="registerForm.skills.length > 1"
              >×</button>
            </div>
            <button
              type="button"
              class="add-skill-btn"
              @click="addSkill"
              :disabled="registerForm.skills.length >= 20"
            >+ 添加技能</button>
            <small class="skill-hint">不填则为空数组；熟练度枚举：初窥门径 / 登堂入室 / 融会贯通 / 炉火纯青（默认 初窥门径）</small>
          </div>
        </div>
        <div class="form-group">
          <label for="reg-bio">个人简介</label>
          <textarea
            id="reg-bio"
            v-model="registerForm.bio"
            class="form-textarea"
            placeholder="请简单介绍一下自己（可选）"
            rows="3"
          ></textarea>
        </div>
        <div class="d-flex" style="justify-content: flex-end">
          <BaseButton type="submit" variant="primary" :loading="isRegistering">注册</BaseButton>
        </div>
      </form>

      <template #footer>
        <div class="d-flex" style="justify-content: flex-end; width: 100%">
          <BaseButton variant="secondary" type="button" @click="showRegister = false">关闭</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/global'
import { usersAdapter } from '@/api/openapi/adapters/usersAdapter.js'
import { authAdapter } from '@/api/openapi/adapters/authAdapter.js'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  name: 'Login',
  components: { BaseModal, BaseInput, BaseButton },
  setup() {
    const router = useRouter()
    const globalStore = useGlobalStore()
    
    // 登录表单
    const loginForm = reactive({
      username: '',
      password: '',
      remember: false
    })
    
    // 注册表单
    const registerForm = reactive({
      username: '',
      email: '',
      phone_number: '',  // 使用后端期望的字段名
      smsCode: '',
      password: '',
      confirmPassword: '',
      name: '',  // 后端使用 name 而不是 full_name
      school: '',
      major: '',
  skills: [{ name: '', level: '初窥门径' }], // 数组形式，提交为 JSON 数组
      interests: '',
      bio: '',
      awards_competitions: '',
      academic_achievements: '',
      soft_skills: '',
      portfolio_link: '',
      preferred_role: '',
      availability: ''
    })
    
    // 状态控制
    const isLoading = ref(false)
    const isResetting = ref(false)
    const isRegistering = ref(false)
    const isSendingSms = ref(false)
    const showForgotPassword = ref(false)
    const showRegister = ref(false)
    const resetEmail = ref('')
    const loginType = ref('email') // 'email' | 'phone'
    const registerType = ref('email') // 'email' | 'phone'
    const smsCountdown = ref(0)
    
    // 处理登录
    const handleLogin = async () => {
      if (!loginForm.username || !loginForm.password) {
        alert('请填写完整的登录信息')
        return
      }
      
      // 验证输入格式
      if (loginType.value === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(loginForm.username)) {
          alert('请输入有效的邮箱地址')
          return
        }
      } else {
        const phoneRegex = /^1[3-9]\d{9}$/
        if (!phoneRegex.test(loginForm.username)) {
          alert('请输入正确的手机号码')
          return
        }
      }
      
      isLoading.value = true
      
      try {
        // 构建登录数据
        const loginData = {
          password: loginForm.password
        }
        
        if (loginType.value === 'email') {
          loginData.email = loginForm.username
        } else {
          loginData.phone_number = loginForm.username  // 修正字段名为 phone_number
        }
        
  // 调用真正的登录API（authAdapter.login 返回 { access_token, token_type, ... }）
  const authData = await authAdapter.login(loginData)
  // 登陆后获取用户信息
  const loggedUser = await usersAdapter.getMe()
  // 更新全局状态
  globalStore.login(loggedUser)

          // 尝试从返回的用户对象中推断角色并写入 localStorage，便于前端 isAdmin 判定
          try {
            const role = (
              (loggedUser.role) ||
              (Array.isArray(loggedUser.roles) ? loggedUser.roles[0] : '') ||
              (loggedUser.is_admin ? 'admin' : '')
            )
            if (role) {
              localStorage.setItem('userRole', String(role).toLowerCase())
            }
          } catch (e) {
            // 忽略角色写入失败
          }

          // 跳转到首页
          router.push('/')
          
          alert('登录成功！')
        
      } catch (error) {
        console.error('登录错误:', error)
        alert('登录失败：' + (error.message || '网络连接错误，请稍后重试'))
      } finally {
        isLoading.value = false
      }
    }
    
    // 处理注册
    const handleRegister = async () => {
      // 基本信息验证
      if (!registerForm.username || !registerForm.password || !registerForm.name) {
        alert('请填写完整的注册信息（用户名、密码、真实姓名为必填项）')
        return
      }
      
      // 验证注册方式的必填字段
      if (registerType.value === 'email') {
        if (!registerForm.email) {
          alert('请输入邮箱地址')
          return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(registerForm.email)) {
          alert('请输入有效的邮箱地址')
          return
        }
      } else {
        if (!registerForm.phone_number) {
          alert('请输入手机号码')
          return
        }
        if (!registerForm.smsCode) {
          alert('请输入短信验证码')
          return
        }
        const phoneRegex = /^1[3-9]\d{9}$/
        if (!phoneRegex.test(registerForm.phone_number)) {
          alert('请输入正确的手机号码')
          return
        }
      }
      
      if (registerForm.password !== registerForm.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      
      if (registerForm.password.length < 8) {
        alert('密码长度不能少于8位')
        return
      }
      
      // 验证用户名格式（只允许字母、数字、下划线）
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
      if (!usernameRegex.test(registerForm.username)) {
        alert('用户名只能包含字母、数字、下划线，长度3-20位')
        return
      }
      
      isRegistering.value = true
      
      try {
        // 构建请求数据，包含后端API期望的字段
        const requestData = {
          username: registerForm.username,
          password: registerForm.password,
          name: registerForm.name
        }
        
        // 根据注册类型添加邮箱或手机号
        if (registerType.value === 'email') {
          requestData.email = registerForm.email
        } else {
          requestData.phone_number = registerForm.phone_number
          requestData.sms_code = registerForm.smsCode
        }
        
        // 添加可选字段（只有非空时才添加）
        if (registerForm.school?.trim()) {
          requestData.school = registerForm.school.trim()
        }
        if (registerForm.major?.trim()) {
          requestData.major = registerForm.major.trim()
        }
        if (registerForm.bio?.trim()) {
          requestData.bio = registerForm.bio.trim()
        }
        // 组织技能数组：过滤空名称，默认熟练度
        const allowedLevels = ['初窥门径','登堂入室','融会贯通','炉火纯青']
        const cleanedSkills = (registerForm.skills || [])
          .filter(s => s.name && s.name.trim())
          .map(s => {
            const level = s.level && allowedLevels.includes(s.level) ? s.level : '初窥门径'
            return { name: s.name.trim(), level }
          })
  // 即使为空也发送，后端字段为 NOT NULL DEFAULT []
  requestData.skills = cleanedSkills
        if (registerForm.interests?.trim()) {
          requestData.interests = registerForm.interests.trim()
        }
        if (registerForm.awards_competitions?.trim()) {
          requestData.awards_competitions = registerForm.awards_competitions.trim()
        }
        if (registerForm.academic_achievements?.trim()) {
          requestData.academic_achievements = registerForm.academic_achievements.trim()
        }
        if (registerForm.soft_skills?.trim()) {
          requestData.soft_skills = registerForm.soft_skills.trim()
        }
        if (registerForm.portfolio_link?.trim()) {
          requestData.portfolio_link = registerForm.portfolio_link.trim()
        }
        if (registerForm.preferred_role?.trim()) {
          requestData.preferred_role = registerForm.preferred_role.trim()
        }
        if (registerForm.availability?.trim()) {
          requestData.availability = registerForm.availability.trim()
        }
        
        console.log('发送注册数据:', requestData)
        console.log('requestData的完整JSON:', JSON.stringify(requestData, null, 2))
        console.log('表单中的真实姓名:', registerForm.name)
        console.log('请求数据中的真实姓名:', requestData.name)
        
  // 调用真正的注册API（直接抛错或返回数据）
  const resp = await authAdapter.register(requestData)
  console.log('注册API响应:', resp)
        
  if (resp) {
          alert('注册成功！请登录')
          showRegister.value = false
          
          // 清空注册表单
          Object.assign(registerForm, {
            username: '',
            email: '',
            phone_number: '',
            smsCode: '',
            password: '',
            confirmPassword: '',
            name: '',
            school: '',
            major: '',
            skills: [{ name: '', level: '初窥门径' }],
            interests: '',
            bio: '',
            awards_competitions: '',
            academic_achievements: '',
            soft_skills: '',
            portfolio_link: '',
            preferred_role: '',
            availability: ''
          })
  }
      } catch (error) {
        console.error('注册错误详情:', error)
        console.error('错误响应:', error.response)
        
        let errorMessage = '注册失败：'
        if (error.response?.data?.detail) {
          if (Array.isArray(error.response.data.detail)) {
            // 处理验证错误数组
            const validationErrors = error.response.data.detail.map(err => {
              return `${err.loc ? err.loc.join('.') : '字段'}: ${err.msg}`
            }).join('; ')
            errorMessage += validationErrors
          } else {
            errorMessage += error.response.data.detail
          }
        } else if (error.response?.data?.message) {
          errorMessage += error.response.data.message
        } else {
          errorMessage += error.message || '网络连接错误，请稍后重试'
        }
        
        alert(errorMessage)
      } finally {
        isRegistering.value = false
      }
    }
    
    // 处理密码重置
    const handlePasswordReset = async () => {
      if (!resetEmail.value) {
        alert('请输入邮箱地址')
        return
      }
      
      isResetting.value = true
      
      try {
        // 模拟密码重置API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        alert('重置链接已发送到您的邮箱')
        showForgotPassword.value = false
        resetEmail.value = ''
      } catch (error) {
        alert('发送失败，请稍后重试')
      } finally {
        isResetting.value = false
      }
    }
    
    // 第三方登录
    const loginWithWechat = () => {
      alert('微信登录功能开发中...')
    }
    
    const loginWithQQ = () => {
      alert('QQ登录功能开发中...')
    }
    
    // 切换登录方式
    const switchLoginType = (type) => {
      loginType.value = type
      loginForm.username = '' // 清空输入
    }
    
    // 切换注册方式
    const switchRegisterType = (type) => {
      registerType.value = type
      // 清空相关字段
      if (type === 'email') {
        registerForm.phone = ''
        registerForm.smsCode = ''
      } else {
        registerForm.email = ''
      }
    }
    
    // 发送短信验证码
    const sendSmsCode = async () => {
      if (!registerForm.phone_number) {
        alert('请先输入手机号码')
        return
      }
      
      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(registerForm.phone_number)) {
        alert('请输入正确的手机号码')
        return
      }
      
      isSendingSms.value = true
      
      try {
  // 调用发送短信验证码API
  const response = await authAdapter.sendSmsCode({ phone_number: registerForm.phone_number })
        
  if (response && (response.success === undefined || response.success === true)) {
          alert('验证码已发送，请注意查收')
          
          // 开始倒计时
          smsCountdown.value = 60
          const countdown = setInterval(() => {
            smsCountdown.value--
            if (smsCountdown.value <= 0) {
              clearInterval(countdown)
            }
          }, 1000)
  }
        
      } catch (error) {
        console.error('发送短信验证码失败:', error)
        alert('发送验证码失败：' + (error.message || '请稍后重试'))
      } finally {
        isSendingSms.value = false
      }
    }

    return {
      loginForm,
      registerForm,
      isLoading,
      isResetting,
      isRegistering,
      isSendingSms,
      showForgotPassword,
      showRegister,
      resetEmail,
      loginType,
      registerType,
      smsCountdown,
      handleLogin,
      handleRegister,
      handlePasswordReset,
      loginWithWechat,
      loginWithQQ,
      switchLoginType,
      switchRegisterType,
      sendSmsCode,
      addSkill: () => {
        if (registerForm.skills.length >= 20) return
        registerForm.skills.push({ name: '', level: '初窥门径' })
      },
      removeSkill: (idx) => {
        if (registerForm.skills.length === 1) {
          // 只剩一个则清空内容不删除行
          registerForm.skills[0].name = ''
          registerForm.skills[0].level = '初窥门径'
        } else {
          registerForm.skills.splice(idx, 1)
        }
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  margin: 0;
  z-index: 9999;
  overflow: auto;
  box-sizing: border-box;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.6s ease-out;
  position: relative;
  margin: auto;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  color: #667eea;
  font-size: 28px;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

/* 登录/注册方式切换标签页 */
.login-type-tabs,
.register-type-tabs {
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-btn.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.tab-btn:hover:not(.active) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

/* 技能列表 */
.skills-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fafbfc;
  padding: 12px 14px;
  border: 1px dashed #d0d7de;
  border-radius: 8px;
}

.skill-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.skill-item input.skill-name {
  flex: 2;
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 13px;
}

.skill-item select.skill-level {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 13px;
  background: #fff;
}

.add-skill-btn {
  align-self: flex-start;
  padding: 6px 12px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.add-skill-btn:disabled {
  background: #b5b9c7;
  cursor: not-allowed;
}

.remove-skill-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  padding: 4px 8px;
  border-radius: 50%;
  font-size: 14px;
  width: 28px;
  height: 28px;
  line-height: 1;
  cursor: pointer;
}

.remove-skill-btn:hover {
  background: #e04445;
}

.skill-hint {
  color: #888;
  font-size: 12px;
}

/* 短信验证码输入组 */
.sms-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sms-input-group input {
  flex: 1;
}

.sms-btn {
  padding: 12px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  min-width: 100px;
  transition: all 0.3s ease;
}

.sms-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.sms-btn:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
  transform: none;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  margin-right: 8px;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-bottom: 20px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.login-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e5e9;
}

.login-divider span {
  background: white;
  padding: 0 15px;
  color: #666;
  font-size: 14px;
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
  font-size: 14px;
}

.social-btn:hover {
  border-color: #667eea;
}

.social-icon {
  margin-right: 5px;
}

.register-link {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
  
  .social-login {
    grid-template-columns: 1fr;
  }
}
</style>
