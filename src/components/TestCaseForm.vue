<template>
  <div id="form" :visible.sync="detailVisible">
    <!-- 文章内容块 -->
    <article>
      <div style="padding: 20px" v-highlight>
        <!-- <h1 class="blog-title" v-text="Blog.title"></h1> -->
        <!-- 用<mavon-editor>标签显示文章内容 -->
        <mavon-editor v-html="Blog" style="padding: 20px"> </mavon-editor>
      </div>
    </article>
    <el-row style="margin-left: 465px">
      <el-button type="warning" plain @click="Close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { sub } from "zrender/lib/core/vector";
import store from "@/store";
import { marked } from "marked";

export default {
  name: "Test_Case_form",

  created() {
    // console.log("In Created Content");
    // console.log(this.priority);
    this.related_modules = store.state.modules;
    this.getBlog();
  },

  methods: {
    getBlog() {
      //将返回的数据赋值给Blog
      this.Blog = store.state.bugDescription;
      //这里的newDate[0].content就是取出来的md格式的文本内容

      //   this.Blog = "<h1>123456<\h1>";
    },
    Close() {
      this.$parent.ClosetheForm();
    },
  },
  data() {
    return {
      related_modules: [],
      affirmed_related_module: "",

      // 控制弹窗
      detailVisible: false,

      Blog: "",

      value_P: "",
      value_S: "",
      value: "",

      title: "",
      related_module: "",
      designee: "",
      corresponding_needs: "",
      related_task: "",
      type_of_bug: "",
      endDate: "",
      os: "",
      web_browser: "",

      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        ink: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        preview: true, // 预览
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        aligncenter: true,
      },
    };
  },
};
</script>

<style scoped>
#form {
  display: flex;
  flex-direction: column;
  width: 100%;
  left: 0%;
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 1160px;
  /* justify-content: space-between; */
}
</style>
