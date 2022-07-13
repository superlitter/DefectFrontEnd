<template>
  <div id="form" :visible.sync="detailVisible">
    <div class="row">
      Bug标题:<el-input
        v-model="title"
        placeholder="请输入内容"
        style="width: 1070px"
    ></el-input>
    </div>

    <div class="row">
      相关模块:<el-select
        v-model="related_module"
        placeholder="请输入内容"
        style="width: 500px"
    >
      <el-option
          v-for="item in related_modules"
          :key="item.moduleId"
          :label="item.moduleName"
          :value="item.moduleId"
      >
      </el-option>
    </el-select>
      被指派者:<el-input
        v-model="designee"
        placeholder="请输入内容"
        style="width: 500px"
    ></el-input>
    </div>
    <div class="row">
      相关需求:<el-input
        v-model="corresponding_needs"
        placeholder="请输入内容"
        style="width: 500px"
    ></el-input>
      相关任务:<el-input
        v-model="related_task"
        placeholder="请输入内容"
        style="width: 500px"
    ></el-input>
    </div>

    <div class="row">
      Bug类型:
      <el-input
          v-model="type_of_bug"
          placeholder="请输入内容"
          style="width: 500px"
      ></el-input>
      结束时间:<el-input
        v-model="endDate"
        placeholder="请输入内容"
        style="width: 500px"
    ></el-input>
    </div>

    <div class="row">
      优先级:<el-select
        v-model="value_P"
        placeholder="请选择"
        @change="$forceUpdate()"
        style="width: 500px; padding-right: 15px"
    >
      <el-option
          v-for="item in priority"
          :key="item.value_P"
          :label="item.label"
          :value="item.value_P"
      >
      </el-option>
    </el-select>
      严重程度:
      <el-select
          v-model="value_S"
          placeholder="请选择"
          @change="$forceUpdate()"
          style="width: 483px"
      >
        <el-option
            v-for="item in options_severity"
            :key="item.value_S"
            :label="item.label"
            :value="item.value_S"
        >
        </el-option>
      </el-select>
    </div>

    <div class="row">
      操作系统:<el-input
        v-model="os"
        placeholder="请输入内容"
        style="width: 500px"
    ></el-input>
      浏览器:<el-input
        v-model="web_browser"
        placeholder="请输入内容"
        style="width: 500px"
    ></el-input>
    </div>

    <mavon-editor
        v-model="content"
        ref="md"
        @save="save"
        @imgAdd="imgAdd"
        :toolbars="toolbars"
        style="width: 1090px"
    />
    <el-row style="margin-left: 465px">
      <el-button type="primary" plain @click="save()">确定</el-button>
      <el-button type="warning" plain @click="Close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { sub } from "zrender/lib/core/vector";
import store from "@/store";
import { Message } from "element-ui";

export default {
  name: "bug_form",

  created() {
    // console.log("In Created Content");
    // console.log(this.priority);
    this.related_modules = store.state.modules;
  },

  methods: {
    init(data) {
      this.detailVisible = true;
      console.log(data);
    },
    Close() {
      this.$parent.ClosetheForm();
    },
    save() {
      console.log(this.$refs.md.d_value);

      // var htmlCode = this.$refs.md.d_render;
      var markdownCode = this.$refs.md.d_render;

      this.submit.value_S = this.value_S;
      this.submit.value_P = this.value_P;
      this.submit.designee = this.designee;
      this.submit.title = this.title;
      this.submit.enddate = this.enddate;
      this.submit.related_module = this.related_module;
      this.submit.type_of_bug = this.type_of_bug;
      this.submit.bugState = "未确认";
      this.submit.bugDescription = markdownCode;
      this.submit.corresponding_needs = this.corresponding_needs;
      this.submit.web_browser = this.web_browser;
      this.submit.os = this.os;
      this.submit.creatorId = "2020214575";
      this.submit.related_task = this.related_task;

      this.postRequest("/bugs/insertbug", this.submit).then((response) => {
        if (response.code=="200")
        {Message.success({message:response.msg});}
        else {
          Message.error({message:response.msg});
        }
      });

      console.log(result);
      this.dialogFormVisible = false;
    },

    //保存图片到后台
    imgAdd(pos, $file) {
      var _this = this;
      // 第一步.将图片上传到服务器.
      console.log("pos:" + pos);
      var formdata = new FormData();
      formdata.append("img", $file);

      axios
          .post(
              "http://img.codesocean.top/upload/img",

              formdata,

              {
                headers: {
                  ApiKey: "n77Eu6QKFRvCVkMx7HEGWHxo1XTYdb",
                },
              }
          ) //补上后台接口即可
          .then((response) => {
            // 请求成功
            console.log("请求成功");
            console.log(response.url);
            var url = response.url; //取出上传成功后的url
            if (response.msg == "success") {
              //  将后端返回的url放在md中图片的指定位置
              console.log(JSON.stringify(url));
              this.$refs.md.$img2Url(pos, url);
            } else {
              this.$message({
                type: response.status,
                message: response.statusText,
              });
            }
          })
          .catch((error) => {
            // 请求失败
            console.log("请求失败");
            console.log(error);
          });

      //   axios(formdata).then((resp) => {
      //     var url = resp.data; //取出上传成功后的url
      //     if (resp.status == 200) {
      //       //  将后端返回的url放在md中图片的指定位置
      //       console.log(url);
      //       _this.$refs.md.$img2Url(pos, url);
      //     } else {
      //       _this.$message({ type: resp.status, message: resp.statusText });
      //     }
      //   });
      // },
    },

    // img_file: {},
  },
  data() {
    return {
      related_modules: [],
      affirmed_related_module: "",

      // 控制弹窗
      detailVisible: false,

      content: "",

      value_P: "",
      value_S: "",
      value: "",

      submit: {
        bugDescription: "string",
        bugState: "未确认",
        creatorId: "2020214584",
        designee: "string",
        enddate: null,
        related_module: 0,
        title: "string",
        type_of_bug: "string",
        value_P: 0,
        value_S: 0,
        related_task: "string",
        web_browser: "string",
        corresponding_needs: "string",
        os: "mac",
      },

      title: "",
      related_module: "",
      designee: "",
      corresponding_needs: "",
      related_task: "",
      type_of_bug: "",
      endDate: "",
      os: "",
      web_browser: "",

      priority: [
        {
          value_P: 1,
          label: "1",
        },
        {
          value_P: 2,
          label: "2",
        },
        {
          value_P: 3,
          label: "3",
        },
        {
          value_P: 4,
          label: "4",
        },
        {
          value_P: 5,
          label: "5",
        },
      ],
      options_severity: [
        {
          value_S: 1,
          label: "最严重",
        },
        {
          value_S: 2,
          label: "严重",
        },
        {
          value_S: 3,
          label: "一般",
        },
        {
          value_S: 4,
          label: "不重要",
        },
      ],
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
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
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
