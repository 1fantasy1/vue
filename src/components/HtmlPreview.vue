<template>
  <div class="html-preview" :style="{ minHeight: minHeight + 'px' }">
    <div v-if="errorMsg" class="error-box">脚本加载失败：{{ errorMsg }}</div>
    <iframe
      class="html-iframe"
      ref="iframeRef"
      :style="{ height: iframeHeight + 'px' }"
      :srcdoc="wrappedHtml"
      sandbox="allow-scripts allow-popups"
      scrolling="no"
    />
  </div>
  
</template>

<script>
import { computed, defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'

export default defineComponent({
  name: 'HtmlPreview',
  props: {
    html: { type: String, required: true },
    minHeight: { type: Number, default: 420 }
  },
  setup(props) {
  const iframeRef = ref(null)
  const iframeHeight = ref(props.minHeight)
  const errorMsg = ref('')
  const id = `hp_${Math.random().toString(36).slice(2)}`

    // 包一层基础样式，确保 body 无外边距且容器自适应
    const wrappedHtml = computed(() => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body { margin: 0; padding: 0; }
  /* 强制 canvas 稳定尺寸，避免反复变化 */
  canvas { 
    display: block !important; 
    width: 100% !important; 
    height: auto !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  /* 图表容器也需要稳定 */
  .chart-container, #chart, [id*="chart"], [class*="chart"] {
    width: 100% !important;
    height: auto !important;
  }
  #app, .container { max-width: 100%; }
  /* 隐藏高度检测脚本，避免文本显示 */
  #__height_detector { display: none !important; }
</style>
</head>
<body>
${props.html}
<div id="__height_detector">
<scr"+"ipt>
  (function(){
    var ID = ${JSON.stringify(id)};
    var lastHeight = 0;
    var stabilized = false;
    
    function sendHeight(){
      try {
        // 只计算可见内容的高度，排除脚本容器
        var body = document.body;
        var detector = document.getElementById('__height_detector');
        if (detector) detector.style.display = 'none';
        
        // 强制所有 canvas 保持稳定状态
        var canvases = document.querySelectorAll('canvas');
        canvases.forEach(function(canvas) {
          if (canvas.style.width !== '100%') {
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            canvas.style.display = 'block';
          }
        });
        
        var h = Math.max(body.scrollHeight, body.offsetHeight);
        
        // 稳定后减少频繁更新
        var threshold = stabilized ? 15 : 8;
        if (Math.abs(h - lastHeight) > threshold) {
          lastHeight = h;
          parent && parent.postMessage({ __htmlPreview: true, id: ID, type: 'resize', height: h }, '*');
        }
      } catch (e) {}
    }
    
    // 延迟初始化，让图表先渲染
    setTimeout(function(){
      sendHeight();
      setTimeout(sendHeight, 300);
      setTimeout(function(){
        sendHeight();
        stabilized = true; // 标记为已稳定
      }, 800);
    }, 150);
    
    // 减少 ResizeObserver 的触发频率
    try {
      if (window.ResizeObserver) {
        var resizeTimer;
        var ro = new ResizeObserver(function(){ 
          if (!stabilized) return;
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(sendHeight, 200); 
        });
        ro.observe(document.body);
      }
    } catch (e) {}
    
    window.addEventListener('error', function(ev){
      var msg = (ev && (ev.message || (ev.error && ev.error.message))) || 'unknown error';
      parent && parent.postMessage({ __htmlPreview: true, id: ID, type: 'error', message: msg }, '*');
    }, true);
    window.addEventListener('unhandledrejection', function(ev){
      var msg = (ev && (ev.reason && (ev.reason.message || String(ev.reason)))) || 'unhandled rejection';
      parent && parent.postMessage({ __htmlPreview: true, id: ID, type: 'error', message: msg }, '*');
    });
  })();
</scr"+"ipt>
</div>
</body>
</html>`)

    const onMessage = (e) => {
      const data = e.data || {}
      if (!data || !data.__htmlPreview || data.id !== id) return
      if (data.type === 'resize') {
        const h = Number(data.height) || props.minHeight
        const next = Math.max(props.minHeight, Math.min(h, 3000))
        // 更大的阈值防止抖动，特别是稳定后
        const threshold = iframeHeight.value > props.minHeight ? 12 : 8
        if (Math.abs(next - iframeHeight.value) > threshold) {
          iframeHeight.value = next
        }
      } else if (data.type === 'error') {
        if (!errorMsg.value) errorMsg.value = String(data.message || '脚本加载失败')
      }
    }

    onMounted(() => {
      window.addEventListener('message', onMessage)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('message', onMessage)
    })

    return { iframeRef, wrappedHtml, iframeHeight, errorMsg }
  }
})
</script>

<style scoped>
.html-preview {
  width: 100%;
}

.html-iframe {
  width: 100%;
  border: 0;
  /* 高度由脚本动态控制，避免 min-height 造成抖动 */
}

.error-box {
  margin-bottom: 8px;
  padding: 8px 12px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #9a3412;
  border-radius: 6px;
  font-size: 13px;
}
</style>
