<template>
  <div class="page-content">
    <!-- 完整工具栏编辑器 -->
    <ElCard class="editor-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>🛠️ 完整工具栏编辑器</span>
          <div class="header-buttons">
            <el-button size="small" @click="clearFullEditor">清空</el-button>
            <el-button size="small" @click="getFullEditorContent">获取内容</el-button>
            <el-button size="small" @click="setFullEditorDemo">设置示例</el-button>
          </div>
        </div>
      </template>

      <ArtWangEditor
        ref="fullEditorRef"
        v-model="fullEditorHtml"
        height="400px"
        placeholder="请输入内容，体验完整的编辑功能..."
        :exclude-keys="[]"
      />
    </ElCard>

    <!-- 简化工具栏编辑器 -->
    <el-card class="editor-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>✨ 简化工具栏编辑器</span>
          <div class="header-buttons">
            <el-button size="small" @click="clearSimpleEditor">清空</el-button>
            <el-button size="small" @click="getSimpleEditorContent">获取内容</el-button>
            <el-button size="small" @click="setSimpleEditorDemo">设置示例</el-button>
          </div>
        </div>
      </template>

      <ArtWangEditor
        ref="simpleEditorRef"
        v-model="simpleEditorHtml"
        height="400px"
        placeholder="请输入内容，体验简化的编辑功能..."
        :toolbar-keys="simpleToolbarKeys"
      />
    </el-card>

    <!-- 内容对比预览 -->
    <el-card class="preview-card" shadow="never">
      <template #header>
        <span>📖 内容预览对比</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <h3>完整编辑器内容</h3>
          <el-tabs v-model="fullActiveTab">
            <el-tab-pane label="渲染效果" name="preview">
              <div class="content-preview" v-html="sanitizedFullEditorHtml"></div>
            </el-tab-pane>
            <el-tab-pane label="HTML源码" name="html">
              <el-input
                v-model="fullEditorHtml"
                type="textarea"
                :rows="8"
                placeholder="HTML源码"
                readonly
              />
            </el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="12">
          <h3>简化编辑器内容</h3>
          <el-tabs v-model="simpleActiveTab">
            <el-tab-pane label="渲染效果" name="preview">
              <div class="content-preview" v-html="sanitizedSimpleEditorHtml"></div>
            </el-tab-pane>
            <el-tab-pane label="HTML源码" name="html">
              <el-input
                v-model="simpleEditorHtml"
                type="textarea"
                :rows="8"
                placeholder="HTML源码"
                readonly
              />
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- 使用说明 -->
    <el-card class="usage-card" shadow="never">
      <template #header>
        <span>📚 使用说明</span>
      </template>

      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="基础用法" name="basic">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;ArtWangEditor v-model="content" /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'

const content = ref('&lt;p&gt;初始内容&lt;/p&gt;')
&lt;/script&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="完整工具栏配置" name="full">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;!-- 显示所有工具，不排除任何功能 --&gt;
  &lt;ArtWangEditor
    v-model="content"
    :exclude-keys="[]"
  /&gt;
&lt;/template&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="简化工具栏配置" name="simple">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;!-- 只显示基础编辑工具 --&gt;
  &lt;ArtWangEditor
    v-model="content"
    :toolbar-keys="[
      'bold', 'italic', 'underline', '|',
      'bulletedList', 'numberedList', '|',
      'insertLink', 'insertImage', '|',
      'undo', 'redo'
    ]"
  /&gt;
&lt;/template&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="自定义配置" name="config">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;ArtWangEditor
    v-model="content"
    height="600px"
    placeholder="请输入您的内容..."
    :exclude-keys="['fontFamily', 'fontSize']"
    :upload-config="{
      maxFileSize: 5 * 1024 * 1024,
      maxNumberOfFiles: 5
    }"
  /&gt;
&lt;/template&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="组件方法调用" name="methods">
          <pre><code class="language-vue">&lt;template&gt;
  &lt;ArtWangEditor ref="editorRef" v-model="content" /&gt;
  &lt;el-button @click="handleClear"&gt;清空&lt;/el-button&gt;
  &lt;el-button @click="handleFocus"&gt;聚焦&lt;/el-button&gt;
  &lt;el-button @click="handleGetContent"&gt;获取内容&lt;/el-button&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'

const editorRef = ref()
const content = ref('')

const handleClear = () =&gt; {
  editorRef.value?.clear()
}

const handleFocus = () =&gt; {
  editorRef.value?.focus()
}

const handleGetContent = () =&gt; {
  const html = editorRef.value?.getHtml()
  console.log('编辑器内容:', html)
}
&lt;/script&gt;</code></pre>
        </el-collapse-item>

        <el-collapse-item title="工具栏配置说明" name="toolbar-config">
          <div class="toolbar-explanation">
            <h4>完整工具栏 vs 简化工具栏</h4>
            <el-row :gutter="16">
              <el-col :span="12">
                <h5>✅ 完整工具栏包含：</h5>
                <ul>
                  <li>文本格式：加粗、斜体、下划线、字体颜色、背景色</li>
                  <li>段落格式：标题、引用、对齐方式、缩进</li>
                  <li>列表：有序列表、无序列表、待办事项</li>
                  <li>插入：链接、图片、表格、分割线、表情</li>
                  <li>代码：代码块、行内代码</li>
                  <li>操作：撤销、重做、全屏、清除格式</li>
                </ul>
              </el-col>
              <el-col :span="12">
                <h5>⚡ 简化工具栏包含：</h5>
                <ul>
                  <li>基础格式：加粗、斜体、下划线</li>
                  <li>列表：有序列表、无序列表</li>
                  <li>插入：链接、图片</li>
                  <li>操作：撤销、重做</li>
                </ul>
                <p class="note">适用于简单的文本编辑场景，界面更清爽。</p>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { sanitizeHtml } from '@/utils/security'

  // 编辑器引用
  const fullEditorRef = ref()
  const simpleEditorRef = ref()

  // 标签页状态
  const fullActiveTab = ref('preview')
  const simpleActiveTab = ref('preview')
  const activeCollapse = ref(['basic'])

  // 简化工具栏配置
  const simpleToolbarKeys = [
    'bold',
    'italic',
    'underline',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'insertLink',
    'insertImage',
    '|',
    'undo',
    'redo'
  ]

  // 完整编辑器内容
  const fullEditorHtml = ref(`<h1>🎨 完整工具栏编辑器示例</h1>
<p>这个编辑器包含所有功能，您可以体验丰富的格式编辑功能。</p>

<h2>✨ 文本样式</h2>
<p><strong>这是加粗的文字</strong></p>
<p><em>这是斜体文字</em></p>
<p><u>这是下划线文字</u></p>
<p><span style="color: rgb(194, 79, 74);">这是彩色文字</span></p>

<h2>📝 列表和待办</h2>
<ul>
  <li>无序列表项 1</li>
  <li>无序列表项 2</li>
</ul>

<ol>
  <li>有序列表项 1</li>
  <li>有序列表项 2</li>
</ol>

<ul class="w-e-todo">
  <li class="w-e-todo-item"><input type="checkbox" checked="true" readonly="true" disabled="disabled"><span>已完成的任务</span></li>
  <li class="w-e-todo-item"><input type="checkbox" readonly="true" disabled="disabled"><span>待完成的任务</span></li>
</ul>

<h2>💬 引用和表格</h2>
<blockquote>
  这是一段引用文字，展示引用格式的效果。
</blockquote>

<table style="border-collapse: collapse; width: 100%;" border="1">
  <thead>
    <tr><th>功能</th><th>描述</th></tr>
  </thead>
  <tbody>
    <tr><td>完整工具栏</td><td>包含所有编辑功能</td></tr>
    <tr><td>自定义配置</td><td>支持灵活的工具栏配置</td></tr>
  </tbody>
</table>

<h2>💻 代码块</h2>
<pre><code class="language-javascript">// 完整编辑器支持代码高亮
function createEditor() {
  return new WangEditor({
    container: '#editor',
    toolbar: 'full' // 完整工具栏
  });
}</code></pre>

<p>🔗 <a href="https://www.wangeditor.com/" target="_blank">访问官网了解更多</a></p>`)

  // 简化编辑器内容
  const simpleEditorHtml = ref(`<h1>✨ 简化工具栏编辑器示例</h1>
<p>这个编辑器只包含基础的编辑功能，界面更加简洁。</p>

<h2>基础文本格式</h2>
<p><strong>加粗文字</strong></p>
<p><em>斜体文字</em></p>
<p><u>下划线文字</u></p>

<h2>列表功能</h2>
<ul>
  <li>无序列表项 1</li>
  <li>无序列表项 2</li>
</ul>

<ol>
  <li>有序列表项 1</li>
  <li>有序列表项 2</li>
</ol>

<h2>链接和图片</h2>
<p>支持插入 <a href="https://www.wangeditor.com/" target="_blank">链接</a> 和图片。</p>

<p>简化版编辑器专注于基础功能，适合简单的内容编辑需求。</p>`)

  const sanitizedFullEditorHtml = computed(() => sanitizeHtml(fullEditorHtml.value))
  const sanitizedSimpleEditorHtml = computed(() => sanitizeHtml(simpleEditorHtml.value))

  // 完整编辑器操作
  const clearFullEditor = () => {
    fullEditorRef.value?.clear()
    ElMessage.success('完整编辑器已清空')
  }

  const getFullEditorContent = () => {
    const content = fullEditorRef.value?.getHtml()
    console.log('完整编辑器内容:', content)
    ElMessage.success('完整编辑器内容已输出到控制台')
  }

  const setFullEditorDemo = () => {
    const demoContent = `<h2>🎉 完整编辑器演示内容</h2>
<p>这是通过方法设置的演示内容，展示完整编辑器的强大功能。</p>
<ul>
  <li>支持丰富的文本格式</li>
  <li>包含表格、代码块等高级功能</li>
  <li>提供完整的编辑体验</li>
</ul>
<table style="border-collapse: collapse; width: 100%;" border="1">
  <tr><th>特性</th><th>状态</th></tr>
  <tr><td>完整工具栏</td><td>✅ 已启用</td></tr>
  <tr><td>高级功能</td><td>✅ 已启用</td></tr>
</table>`

    fullEditorRef.value?.setHtml(demoContent)
    ElMessage.success('已设置完整编辑器演示内容')
  }

  // 简化编辑器操作
  const clearSimpleEditor = () => {
    simpleEditorRef.value?.clear()
    ElMessage.success('简化编辑器已清空')
  }

  const getSimpleEditorContent = () => {
    const content = simpleEditorRef.value?.getHtml()
    console.log('简化编辑器内容:', content)
    ElMessage.success('简化编辑器内容已输出到控制台')
  }

  const setSimpleEditorDemo = () => {
    const demoContent = `<h2>⚡ 简化编辑器演示内容</h2>
<p>这是通过方法设置的演示内容，展示简化编辑器的核心功能。</p>
<ul>
  <li><strong>基础格式</strong>：加粗、斜体、下划线</li>
  <li><em>列表支持</em>：有序和无序列表</li>
  <li><u>媒体插入</u>：链接和图片</li>
</ul>
<ol>
  <li>界面简洁清爽</li>
  <li>功能专注实用</li>
  <li>适合快速编辑</li>
</ol>
<p>🔗 <a href="https://example.com" target="_blank">这是一个链接示例</a></p>`

    simpleEditorRef.value?.setHtml(demoContent)
    ElMessage.success('已设置简化编辑器演示内容')
  }
</script>

<style lang="scss" scoped>
  .page-content {
    padding: 20px;
  }

  .editor-card {
    margin-bottom: 24px;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-buttons {
        display: flex;
        gap: 8px;
      }
    }
  }

  .editor-description {
    padding: 12px 16px;
    margin-bottom: 16px;
    background-color: var(--el-bg-color-page);
    border-left: 4px solid var(--el-color-primary);
    border-radius: 8px;

    p {
      margin: 0;
      font-size: 14px;
      color: var(--el-text-color-regular);
    }
  }

  .preview-card {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 16px;
      font-size: 16px;
      color: var(--el-text-color-primary);
    }

    .content-preview {
      min-height: 200px;
      max-height: 300px;
      padding: 16px;
      overflow-y: auto;
      background-color: var(--el-bg-color);
      border: 1px solid var(--el-border-color);
      border-radius: 6px;

      // 确保内容样式正确显示
      :deep(h1),
      :deep(h2),
      :deep(h3) {
        margin: 16px 0 8px;
      }

      :deep(p) {
        margin: 8px 0;
        line-height: 1.6;
      }

      :deep(table) {
        margin: 16px 0;

        th,
        td {
          padding: 8px 12px;
        }
      }

      :deep(pre) {
        padding: 12px;
        margin: 16px 0;
        overflow-x: auto;
        background-color: var(--el-fill-color-light);
        border-radius: 4px;
      }

      :deep(blockquote) {
        padding-left: 16px;
        margin: 16px 0;
        color: var(--el-text-color-regular);
        border-left: 4px solid var(--el-color-primary);
      }
    }
  }

  .usage-card {
    :deep(.el-collapse-item__content) {
      padding-bottom: 16px;
    }

    pre {
      padding: 16px;
      margin: 0;
      overflow-x: auto;
      background-color: var(--el-fill-color-light);
      border-radius: 6px;

      code {
        font-family: Consolas, Monaco, 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.5;
      }
    }

    .toolbar-explanation {
      h4 {
        margin: 0 0 16px;
        color: var(--el-text-color-primary);
      }

      h5 {
        margin: 0 0 8px;
        font-size: 14px;
        color: var(--el-text-color-regular);
      }

      ul {
        padding-left: 20px;
        margin: 8px 0 16px;

        li {
          margin: 4px 0;
          font-size: 13px;
          color: var(--el-text-color-regular);
        }
      }

      .note {
        margin: 8px 0 0;
        font-size: 12px;
        font-style: italic;
        color: var(--el-text-color-placeholder);
      }
    }
  }

  // 响应式设计
  @media (width <= 768px) {
    .page-content {
      padding: 12px;
    }

    .card-header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch !important;

      .header-buttons {
        justify-content: center;
      }
    }

    .preview-card {
      :deep(.el-col) {
        margin-bottom: 16px;
      }
    }
  }
</style>
