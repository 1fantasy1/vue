<template>
  <div class="form-group">
    <label v-if="label" class="form-label" :for="inputId">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <input
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :value="modelValue"
      @input="updateValue"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      class="form-input"
      :class="{ 'form-input-error': error }"
    />
    
    <div v-if="error" class="form-error">{{ error }}</div>
    <div v-else-if="helpText" class="form-help">{{ helpText }}</div>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  emits: ['update:modelValue', 'blur', 'focus'],
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    helpText: {
      type: String,
      default: ''
    }
  },
  computed: {
    inputId() {
      return `input-${Math.random().toString(36).substr(2, 9)}`
    }
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
</script>

<style scoped>
.form-input-error {
  border-color: var(--danger-color);
}

.form-input-error:focus {
  border-color: var(--danger-color);
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-error {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--danger-color);
}

.form-help {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.text-danger {
  color: var(--danger-color);
}
</style>
