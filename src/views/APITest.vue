<template>
  <div class="api-test-view">
    <APITestTool />
  </div>
</template>

<script>
import APITestTool from '@/components/APITestTool.vue'

export default {
  name: 'APITest',
  components: {
    APITestTool
  }
}
</script>

<style scoped>
.api-test-view {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px 0;
}
</style>