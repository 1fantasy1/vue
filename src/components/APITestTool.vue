<template>
  <div class="api-test-tool">
    <div class="header">
      <h2>API 连接测试工具</h2>
      <div class="status-indicator" :class="systemStatus?.status">
        <span class="dot"></span>
        <span>{{ getStatusText() }}</span>
      </div>
    </div>

    <div class="config-section">
      <h3>当前配置</h3>
      <div class="config-info">
        <div class="config-item">
          <label>数据源:</label>
          <span :class="{ 'remote': !isUsingLocal, 'local': isUsingLocal }">
            {{ isUsingLocal ? '本地数据' : '远程API' }}
          </span>
          <button @click="toggleDataSource" class="toggle-btn">
            切换到{{ isUsingLocal ? '远程API' : '本地数据' }}
          </button>
        </div>
        <div class="config-item" v-if="!isUsingLocal">
          <label>API地址:</label>
          <span>{{ config.api.baseURL }}</span>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h3>API 测试</h3>
      
      <!-- 健康检查 -->
      <div class="test-item">
        <div class="test-header">
          <h4>1. 健康检查</h4>
          <button @click="testHealth" :disabled="healthLoading" class="test-btn">
            {{ healthLoading ? '测试中...' : '测试' }}
          </button>
        </div>
        <div class="test-result" v-if="healthResult">
          <pre>{{ JSON.stringify(healthResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- 学生列表 -->
      <div class="test-item">
        <div class="test-header">
          <h4>2. 获取学生列表</h4>
          <button @click="testStudents" :disabled="studentsLoading" class="test-btn">
            {{ studentsLoading ? '测试中...' : '测试' }}
          </button>
        </div>
        <div class="test-result" v-if="studentsResult">
          <div class="result-summary">
            找到 {{ studentsResult.length }} 个学生
          </div>
          <pre v-if="studentsResult.length > 0">{{ JSON.stringify(studentsResult[0], null, 2) }}</pre>
        </div>
      </div>

      <!-- 项目列表 -->
      <div class="test-item">
        <div class="test-header">
          <h4>3. 获取项目列表</h4>
          <button @click="testProjects" :disabled="projectsLoading" class="test-btn">
            {{ projectsLoading ? '测试中...' : '测试' }}
          </button>
        </div>
        <div class="test-result" v-if="projectsResult">
          <div class="result-summary">
            找到 {{ projectsResult.length }} 个项目
          </div>
          <pre v-if="projectsResult.length > 0">{{ JSON.stringify(projectsResult[0], null, 2) }}</pre>
        </div>
      </div>

      <!-- 工作台概览 -->
      <div class="test-item">
        <div class="test-header">
          <h4>4. 工作台概览</h4>
          <button @click="testDashboard" :disabled="dashboardLoading" class="test-btn">
            {{ dashboardLoading ? '测试中...' : '测试' }}
          </button>
        </div>
        <div class="test-result" v-if="dashboardResult">
          <pre>{{ JSON.stringify(dashboardResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- AI问答测试 -->
      <div class="test-item">
        <div class="test-header">
          <h4>5. AI问答测试</h4>
          <div class="ai-test-input">
            <input 
              v-model="aiQuery" 
              placeholder="输入测试问题..." 
              @keyup.enter="testAI"
            />
            <button @click="testAI" :disabled="aiLoading || !aiQuery.trim()" class="test-btn">
              {{ aiLoading ? '测试中...' : '测试' }}
            </button>
          </div>
        </div>
        <div class="test-result" v-if="aiResult">
          <pre>{{ JSON.stringify(aiResult, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <div class="logs-section" v-if="logs.length > 0">
      <h3>测试日志</h3>
      <div class="logs">
        <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
          <span class="timestamp">{{ log.timestamp }}</span>
          <span class="message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAppConfig, useSystemHealth, useStudentsData, useProjectsData, useDashboardData, useAI } from '@/composables/useApiData.js'

export default {
  name: 'APITestTool',
  setup() {
    const { config, isUsingLocalData, switchToRemoteAPI, switchToLocalData } = useAppConfig()
    const { status: systemStatus, checkHealth } = useSystemHealth()
    const { students, fetchStudents } = useStudentsData()
    const { projects, fetchProjects } = useProjectsData()
    const { summary: dashboardSummary, fetchSummary } = useDashboardData()
    const { askQuestion } = useAI()

    // 测试状态
    const healthLoading = ref(false)
    const studentsLoading = ref(false)
    const projectsLoading = ref(false)
    const dashboardLoading = ref(false)
    const aiLoading = ref(false)

    // 测试结果
    const healthResult = ref(null)
    const studentsResult = ref(null)
    const projectsResult = ref(null)
    const dashboardResult = ref(null)
    const aiResult = ref(null)

    // AI测试
    const aiQuery = ref('这是一个测试问题')

    // 日志
    const logs = ref([])

    const isUsingLocal = computed(() => isUsingLocalData())

    const addLog = (message, type = 'info') => {
      logs.value.unshift({
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      })
      if (logs.value.length > 50) {
        logs.value = logs.value.slice(0, 50)
      }
    }

    const getStatusText = () => {
      if (!systemStatus.value) return '未知'
      if (systemStatus.value.status === 'ok') return '正常'
      if (systemStatus.value.status === 'error') return '错误'
      return systemStatus.value.status
    }

    const toggleDataSource = () => {
      if (isUsingLocal.value) {
        switchToRemoteAPI()
        addLog('切换到远程API模式，请刷新页面', 'info')
      } else {
        switchToLocalData()
        addLog('切换到本地数据模式，请刷新页面', 'info')
      }
    }

    const testHealth = async () => {
      healthLoading.value = true
      healthResult.value = null
      addLog('开始健康检查测试')
      
      try {
        const result = await checkHealth()
        healthResult.value = result
        addLog('健康检查测试成功', 'success')
      } catch (error) {
        healthResult.value = { error: error.message }
        addLog(`健康检查测试失败: ${error.message}`, 'error')
      } finally {
        healthLoading.value = false
      }
    }

    const testStudents = async () => {
      studentsLoading.value = true
      studentsResult.value = null
      addLog('开始学生列表测试')
      
      try {
        await fetchStudents()
        studentsResult.value = students.value
        addLog(`学生列表测试成功，获取到 ${students.value.length} 个学生`, 'success')
      } catch (error) {
        studentsResult.value = { error: error.message }
        addLog(`学生列表测试失败: ${error.message}`, 'error')
      } finally {
        studentsLoading.value = false
      }
    }

    const testProjects = async () => {
      projectsLoading.value = true
      projectsResult.value = null
      addLog('开始项目列表测试')
      
      try {
        await fetchProjects()
        projectsResult.value = projects.value
        addLog(`项目列表测试成功，获取到 ${projects.value.length} 个项目`, 'success')
      } catch (error) {
        projectsResult.value = { error: error.message }
        addLog(`项目列表测试失败: ${error.message}`, 'error')
      } finally {
        projectsLoading.value = false
      }
    }

    const testDashboard = async () => {
      dashboardLoading.value = true
      dashboardResult.value = null
      addLog('开始工作台概览测试')
      
      try {
        await fetchSummary()
        dashboardResult.value = dashboardSummary.value
        addLog('工作台概览测试成功', 'success')
      } catch (error) {
        dashboardResult.value = { error: error.message }
        addLog(`工作台概览测试失败: ${error.message}`, 'error')
      } finally {
        dashboardLoading.value = false
      }
    }

    const testAI = async () => {
      if (!aiQuery.value.trim()) return
      
      aiLoading.value = true
      aiResult.value = null
      addLog(`开始AI问答测试: ${aiQuery.value}`)
      
      try {
        const result = await askQuestion(aiQuery.value)
        aiResult.value = result
        addLog('AI问答测试成功', 'success')
      } catch (error) {
        aiResult.value = { error: error.message }
        addLog(`AI问答测试失败: ${error.message}`, 'error')
      } finally {
        aiLoading.value = false
      }
    }

    // 自动执行健康检查
    onMounted(() => {
      testHealth()
    })

    return {
      config,
      isUsingLocal,
      systemStatus,
      healthLoading,
      studentsLoading,
      projectsLoading,
      dashboardLoading,
      aiLoading,
      healthResult,
      studentsResult,
      projectsResult,
      dashboardResult,
      aiResult,
      aiQuery,
      logs,
      getStatusText,
      toggleDataSource,
      testHealth,
      testStudents,
      testProjects,
      testDashboard,
      testAI
    }
  }
}
</script>

<style scoped>
.api-test-tool {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
}

.status-indicator.ok {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.status-indicator.error {
  background-color: #ffebee;
  color: #c62828;
}

.status-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}

.config-section,
.test-section,
.logs-section {
  margin-bottom: 30px;
}

.config-info {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.config-item label {
  font-weight: 500;
  min-width: 80px;
}

.config-item .remote {
  color: #1976d2;
  font-weight: 500;
}

.config-item .local {
  color: #f57c00;
  font-weight: 500;
}

.toggle-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.toggle-btn:hover {
  background-color: #1565c0;
}

.test-item {
  margin-bottom: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.test-header h4 {
  margin: 0;
}

.ai-test-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.ai-test-input input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.test-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.test-btn:hover {
  background-color: #45a049;
}

.test-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.test-result {
  padding: 15px;
  background-color: #fff;
}

.result-summary {
  margin-bottom: 10px;
  font-weight: 500;
  color: #4caf50;
}

.test-result pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.logs {
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 15px;
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.log-item {
  margin-bottom: 5px;
  display: flex;
  gap: 10px;
}

.log-item.success {
  color: #4caf50;
}

.log-item.error {
  color: #f44336;
}

.log-item.info {
  color: #2196f3;
}

.timestamp {
  color: #888;
  min-width: 80px;
}

.message {
  flex: 1;
}
</style>
