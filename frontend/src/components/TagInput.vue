<template>
  <div class="tag-input-container">
    <el-input
      ref="inputRef"
      v-model="currentInput"
      :placeholder="placeholder"
      :disabled="disabled"
      :size="size"
      @keydown.enter.prevent="handleAddTag"
      @keydown.backspace="handleBackspace"
      @focus="handleFocus"
      @blur="handleBlur"
      class="tag-input"
    >
      <template #prepend>
        <div class="tags-container">
          <el-tag
            v-for="(tag, index) in tags"
            :key="index"
            :size="size"
            closable
            @close="handleRemoveTag(index)"
            class="tag-item"
          >
            {{ tag }}
          </el-tag>
        </div>
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'TagInput',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请输入标签，按Enter键添加'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      tags: [...this.modelValue],
      currentInput: ''
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.tags = [...newVal]
      },
      deep: true
    }
  },
  methods: {
    // 添加标签
    handleAddTag() {
      const tag = this.currentInput.trim()
      if (tag && !this.tags.includes(tag)) {
        this.tags.push(tag)
        this.$emit('update:modelValue', this.tags)
        this.currentInput = ''
      }
    },
    
    // 删除标签
    handleRemoveTag(index) {
      this.tags.splice(index, 1)
      this.$emit('update:modelValue', this.tags)
    },
    
    // 处理退格键删除标签
    handleBackspace(event) {
      if (this.currentInput === '' && this.tags.length > 0) {
        this.tags.pop()
        this.$emit('update:modelValue', this.tags)
      }
    },
    
    // 处理输入框聚焦
    handleFocus() {
      this.$emit('focus')
    },
    
    // 处理输入框失焦
    handleBlur() {
      this.$emit('blur')
      // 如果失焦时还有未添加的标签，自动添加
      if (this.currentInput.trim()) {
        this.handleAddTag()
      }
    }
  }
}
</script>

<style scoped>
.tag-input-container {
  width: 100%;
}

.tag-input {
  position: relative;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
  max-width: 100%;
  align-items: center;
}

.tag-item {
  margin-right: 8px;
}
</style>