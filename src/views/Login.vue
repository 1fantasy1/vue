<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>🚀 鸿庆书云</h1>
        <p>云聚书，书载鸿，鸿成庆</p>
      </div>
      
      <div class="login-form">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">邮箱</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="email"
              placeholder="请输入邮箱地址"
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

    <!-- 忘记密码弹窗 -->
    <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>重置密码</h3>
          <button class="close-btn" @click="showForgotPassword = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="reset-email">邮箱地址</label>
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              placeholder="请输入注册邮箱"
              required
            />
          </div>
          <button
            type="button"
            class="reset-btn"
            @click="handlePasswordReset"
            :disabled="isResetting"
          >
            <span v-if="isResetting">发送中...</span>
            <span v-else>发送重置链接</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="showRegister" class="modal-overlay" @click="showRegister = false">
      <div class="modal-content register-modal" @click.stop>
        <div class="modal-header">
          <h3>用户注册</h3>
          <button class="close-btn" @click="showRegister = false">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="reg-username">用户名</label>
              <input
                id="reg-username"
                v-model="registerForm.username"
                type="text"
                placeholder="请输入用户名（3-20位，仅字母数字下划线）"
                required
              />
            </div>
            <div class="form-group">
              <label for="reg-email">邮箱</label>
              <input
                id="reg-email"
                v-model="registerForm.email"
                type="email"
                placeholder="请输入邮箱地址"
                required
              />
            </div>
            <div class="form-group">
              <label for="reg-password">密码</label>
              <input
                id="reg-password"
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码（至少8位）"
                required
              />
            </div>
            <div class="form-group">
              <label for="reg-confirm">确认密码</label>
              <input
                id="reg-confirm"
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                required
              />
            </div>
            <div class="form-group">
              <label for="reg-fullname">真实姓名</label>
              <input
                id="reg-fullname"
                v-model="registerForm.full_name"
                type="text"
                placeholder="请输入真实姓名"
                required
              />
            </div>
            <div class="form-group">
              <label for="reg-bio">个人简介</label>
              <textarea
                id="reg-bio"
                v-model="registerForm.bio"
                placeholder="请简单介绍一下自己（可选）"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="reg-skills">技能</label>
              <input
                id="reg-skills"
                v-model="registerForm.skills"
                type="text"
                placeholder="例如：Vue.js, Python, 数据分析"
              />
            </div>
            <div class="form-group">
              <label for="reg-interests">兴趣爱好</label>
              <input
                id="reg-interests"
                v-model="registerForm.interests"
                type="text"
                placeholder="例如：前端开发, 机器学习, 阅读"
              />
            </div>
            <button
              type="submit"
              class="register-btn"
              :disabled="isRegistering"
            >
              <span v-if="isRegistering">注册中...</span>
              <span v-else>注册</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/global'
import { ApiService } from '../services/api.js'

export default {
  name: 'Login',
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
      password: '',
      confirmPassword: '',
      full_name: '',
      bio: '',
      skills: '',
      interests: ''
    })
    
    // 状态控制
    const isLoading = ref(false)
    const isResetting = ref(false)
    const isRegistering = ref(false)
    const showForgotPassword = ref(false)
    const showRegister = ref(false)
    const resetEmail = ref('')
    
    // 处理登录
    const handleLogin = async () => {
      if (!loginForm.username || !loginForm.password) {
        alert('请填写完整的登录信息')
        return
      }
      
      isLoading.value = true
      
      try {
        // 调用真正的登录API
        const response = await ApiService.login({
          email: loginForm.username, // 将用户名当作邮箱发送
          password: loginForm.password
        })
        
        if (response.data.success) {
          // 登录成功，更新全局状态
          globalStore.login(response.data.data.user)
          
          // 跳转到首页
          router.push('/')
          
          alert('登录成功！')
        } else {
          // 登录失败，显示错误信息
          alert(response.data.message || '登录失败，请检查用户名和密码')
        }
      } catch (error) {
        console.error('登录错误:', error)
        alert('登录失败：' + (error.message || '网络连接错误，请稍后重试'))
      } finally {
        isLoading.value = false
      }
    }
    
    // 处理注册
    const handleRegister = async () => {
      if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.full_name) {
        alert('请填写完整的注册信息（用户名、邮箱、密码、真实姓名为必填项）')
        return
      }
      
      if (registerForm.password !== registerForm.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      
      if (registerForm.password.length < 8) {
        alert('密码长度不能少于8位')
        return
      }
      
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(registerForm.email)) {
        alert('请输入有效的邮箱地址')
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
        // 处理技能和兴趣字符串
        const skillsString = registerForm.skills ? registerForm.skills.trim() : ''
        const interestsString = registerForm.interests ? registerForm.interests.trim() : ''
        
        // 构建请求数据，只包含非空字段
        const requestData = {
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
          full_name: registerForm.full_name
        }
        
        // 只有非空时才添加可选字段，并且作为字符串发送
        if (registerForm.bio && registerForm.bio.trim()) {
          requestData.bio = registerForm.bio.trim()
        }
        
        if (skillsString) {
          requestData.skills = skillsString  // 发送字符串而不是数组
        }
        
        if (interestsString) {
          requestData.interests = interestsString  // 发送字符串而不是数组
        }
        
        console.log('发送注册数据:', requestData)
        console.log('requestData的完整JSON:', JSON.stringify(requestData, null, 2))
        
        // 调用真正的注册API
        const response = await ApiService.register(requestData)
        
        if (response.data.success) {
          alert('注册成功！请登录')
          showRegister.value = false
          
          // 清空注册表单
          Object.assign(registerForm, {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            full_name: '',
            bio: '',
            skills: '',
            interests: ''
          })
        } else {
          console.error('注册失败详情:', response)
          alert(response.data.message || '注册失败，请稍后重试')
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
    
    return {
      loginForm,
      registerForm,
      isLoading,
      isResetting,
      isRegistering,
      showForgotPassword,
      showRegister,
      resetEmail,
      handleLogin,
      handleRegister,
      handlePasswordReset,
      loginWithWechat,
      loginWithQQ
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

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideUp 0.3s ease-out;
}

.register-modal {
  max-width: 600px;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e1e5e9;
}

.modal-header h3 {
  color: #333;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.reset-btn,
.register-btn {
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
}

.reset-btn:hover:not(:disabled),
.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.reset-btn:disabled,
.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
