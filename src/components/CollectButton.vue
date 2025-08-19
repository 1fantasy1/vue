<template>
  <button
    :class="['collect-btn', { 'collected': isCollected, 'loading': loading }]"
  @click.stop="handleCollect"
    :disabled="loading"
    :title="buttonTitle"
  >
    <svg v-if="!loading" class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path v-if="!isCollected" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
      <path v-else d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
    </svg>
    <div v-else class="loading-spinner"></div>
    <span v-if="showText" class="collect-text">
      {{ isCollected ? '已收藏' : '收藏' }}
    </span>
  </button>
</template>

<script>
import ApiService from '@/services/api.js'

export default {
  name: 'CollectButton',
  props: {
    // 内容类型：project, course, forum_topic, note, daily_record, knowledge_article, chat_message, knowledge_document
    contentType: {
      type: String,
      required: true,
      validator: (value) => [
        'project', 'course', 'forum_topic', 'note', 
        'daily_record', 'knowledge_article', 'chat_message', 'knowledge_document'
      ].includes(value)
    },
    // 内容ID
    contentId: {
      type: [String, Number],
      required: true
    },
    // 是否显示文字
    showText: {
      type: Boolean,
      default: false
    },
    // 自定义标题
    customTitle: {
      type: String,
      default: ''
    },
    // 收藏文件夹ID
    folderId: {
      type: [String, Number],
      default: null
    },
    // 备注
    notes: {
      type: String,
      default: ''
    },
    // 是否星标
    isStarred: {
      type: Boolean,
      default: false
    },
    // 初始收藏状态
    initialCollected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollected: this.initialCollected,
      loading: false
    }
  },
  computed: {
    buttonTitle() {
      if (this.loading) return '处理中...'
      return this.isCollected ? '取消收藏' : '添加到收藏'
    }
  },
  methods: {
    async handleCollect() {
      if (this.loading) return

      try {
        this.loading = true
        
        if (this.isCollected) {
          // TODO: 实现取消收藏功能（需要后端API支持）
          this.$emit('collect-removed', {
            contentType: this.contentType,
            contentId: this.contentId
          })
        } else {
          // 添加收藏
          const collectionData = {
            shared_item_type: this.contentType,
            shared_item_id: parseInt(this.contentId),
            folder_id: this.folderId ? parseInt(this.folderId) : null,
            notes: this.notes,
            is_starred: this.isStarred,
            title: this.customTitle || null
          }

          const response = await ApiService.addPlatformContentToCollection(collectionData)
          
          if (response.data.success) {
            this.isCollected = true
            this.$emit('collected', {
              contentType: this.contentType,
              contentId: this.contentId,
              collectionData: response.data.data
            })
            
            // 显示成功提示
            this.$emit('message', {
              type: 'success',
              text: '收藏成功！'
            })
          } else {
            throw new Error(response.data.message || '收藏失败')
          }
        }
      } catch (error) {
        console.error('收藏操作失败:', error)
        this.$emit('message', {
          type: 'error',
          text: error.message || '操作失败，请重试'
        })
      } finally {
        this.loading = false
      }
    }
  },
  watch: {
    initialCollected(newVal) {
      this.isCollected = newVal
    }
  }
}
</script>

<style scoped>
.collect-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  line-height: 1;
}

.collect-btn:hover {
  border-color: #007bff;
  color: #007bff;
  background-color: #f8f9fa;
}

.collect-btn.collected {
  border-color: #007bff;
  background-color: #007bff;
  color: #fff;
}

.collect-btn.collected:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.collect-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.collect-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.collect-text {
  white-space: nowrap;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 小尺寸样式 */
.collect-btn.small {
  padding: 4px 8px;
  font-size: 12px;
}

.collect-btn.small .icon {
  width: 14px;
  height: 14px;
}

/* 大尺寸样式 */
.collect-btn.large {
  padding: 8px 16px;
  font-size: 16px;
}

.collect-btn.large .icon {
  width: 18px;
  height: 18px;
}
</style>
