<template>
  <div >
    <div>
      <el-select
          @change="onProChange" v-model="value" filterable placeholder="请选择">
        <el-option
            v-for="item in options"
            :key="item.projectName"
            :label="item.projectName"
            :value="item.projectName"
        >
        </el-option>
      </el-select>
    </div>

    <el-button type="text" @click="dialogFormVisible = true" style="padding-left: 77px;"
    >+ 新增模块
    </el-button>

    <el-dialog title="新增一级模块" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
      <el-form :model="form">
        <el-form-item label="模块名字" :label-width="formLabelWidth">
          <el-input v-model="form.moduleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块简介" :label-width="formLabelWidth">
          <el-input v-model="form.moduleRemark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertLevelOne(form)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增二级模块" :visible.sync="insertLevelTwoFormVisible" :modal-append-to-body="false">
      <el-form :model="form">
        <el-form-item label="模块名字" :label-width="formLabelWidth">
          <el-input v-model="form.moduleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块简介" :label-width="formLabelWidth">
          <el-input v-model="form.moduleRemark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertLevelTwoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertLevelTwo(form)">确 定</el-button>
      </div>
    </el-dialog>

    <!--Level One-->
    <el-dialog title="修改一级模块" :visible.sync="updateLevelOneFormVisible" :modal-append-to-body="false">
      <el-form :model="form">
        <el-form-item label="新名字" :label-width="formLabelWidth">
          <el-input v-model="form.moduleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新简介" :label-width="formLabelWidth">
          <el-input v-model="form.moduleRemark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateLevelOneFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateLevelOneModule(form)">确 定</el-button>
      </div>
    </el-dialog>

    <!--Level Two-->
    <el-dialog title="修改二级模块" :visible.sync="updateLevelTwoFormVisible" :modal-append-to-body="false">
      <el-form :model="form">
        <el-form-item label="新名字" :label-width="formLabelWidth">
          <el-input v-model="form.moduleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新简介" :label-width="formLabelWidth">
          <el-input v-model="form.moduleRemark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateLevelTwoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateLevelTwoModule(form)">确 定</el-button>
      </div>
    </el-dialog>

    <div style="overflow-y: hidden; overflow-x: hidden">
      <!-- <p>使用 render-content</p> -->
      <el-tree @node-click="nodeClick"
               v-if="data" :data="data"
               :show-checkbox=false
               node-key="id"
               default-expand-all
               :expand-on-click-node="false"
               :render-content="renderContent">

      </el-tree>
    </div>

  </div>
</template>


<script>
import store from '../store';
import BugContentVue from './BugContent.vue';

export default {
  name: 'side-bar',
  data () {
    const data = [];
    return {
      data: [],
      options: [],
      vm: this,
      value: '',
      // data: JSON.parse(JSON.stringify(data)),
      // data: JSON.parse(JSON.stringify(data)),
      dialogTableVisible: false,
      dialogFormVisible: false,
      nodeData: [],
      form: {
        moduleName: "",
        moduleRemark: ""
      },

      insertLevelTwoFormVisible: false,
      updateLevelOneFormVisible: false,
      updateLevelTwoFormVisible: false,

      formLabelWidth: '80px'
    }
  },
  created () {

    console.log("侧边栏 create函数执行了");
    this.$forceUpdate();
    // 此时可以获取到data中的变量值
    var numme = null;
    this.postRequest(`/projects/selectAll`, numme).then(resp => {
      // console.log(resp);
      // console.log(this.options);
      // console.log(resp);
      this.options = resp.data;
      this.update();
      // console.log(this.options);
    });
  },

  methods: {
    onProChange(val) {
      // console.log(val);
      store.commit("editProjectName", val);
      console.log("store.state.projectName 值为 " + store.state.projectName);
      // this.update();

      var _this = this;
      //Edit
      this.getRequest(`/modules/selectByProjectNameList`, {
        params: { ProjectName: store.state.projectName },
      }).then((resp) => {
        console.log("In get List function");
        // console.log(resp.data);
        this.data = resp.data;
        store.commit("editModules", resp.data);
        console.log("store.state.modules 值为 ");

        console.log(store.state.modules);
        console.log(resp.data);
        console.log("|_________________|");

        _this.update();
      });
    },

    // 插入一级模块
    insertLevelOne (form) {
      var para = {
        "moduleName": form.moduleName,
        "projectName": store.state.projectName,
        "moduleLevel": "一级",
        "moduleRemark": form.moduleRemark
      };


      console.log("In insertLevelOne para:");
      console.log(para);

      if (store.state.projectName === 'No choose') {
        this.$message.error('错了哦,请先选择项目捏');
        return;
      }
      if (form.moduleName === '') {
        this.$message.error('错了哦,请不要提交空值捏');
        return;
      }


      var _this = this;
      this.postRequest("/modules/insertModule/", para).then(resp => {
        _this.update();
      });

      this.formClear();
      this.dialogFormVisible = false;
    },

    // 插入二级模块
    insertLevelTwo (form) {

      //   console.log(form);
      //   console.log(this.nodeData);
      var para = {
        "moduleName": form.moduleName,
        "projectName": store.state.projectName,
        "moduleFather": this.nodeData.id,
        "moduleLevel": "二级",
        "moduleRemark": form.moduleRemark
      };

      if (store.state.projectName === 'No choose') {
        this.$message.error('错了哦,请先选择项目捏');
        return;
      }
      if (form.moduleName === '') {
        this.$message.error('错了哦,请不要提交空值捏');
        return;
      }

      var _this = this;
      this.postRequest("/modules/insertModule/", para).then(resp => {
        _this.update();
      });

      this.formClear();
      this.insertLevelTwoFormVisible = false;
    },

    // 更新一级模块模块
    updateLevelOneModule (form) {
      // console.log(this.nodeData)
      var para = {
        "moduleId": this.nodeData.id,
        "moduleName": form.moduleName,
        "projectName": store.state.projectName,
        // "moduleFather" : this.nodeData.id,
        "moduleLevel": "一级",
        "moduleRemark": form.moduleRemark
      };

      console.log(para)
      if (store.state.projectName === 'No choose') {
        this.$message.error('错了哦,请先选择项目捏');
        return;
      }
      if (form.moduleName === '') {
        this.$message.error('错了哦,请不要提交空值捏');
        return;
      }
      this.postRequest(`/modules/updateById`, para).then(resp => {
        // console.log("In updateById");
        // console.log(resp.data);
        this.data = resp.data;
        this.update();
      });

      this.formClear();
      this.updateLevelOneFormVisible = false;
    },

    // 更新二级模块模块
    updateLevelTwoModule (form) {
      // console.log(this.nodeData)
      var para = {
        "moduleId": this.nodeData.id,
        "moduleName": form.moduleName,
        "projectName": store.state.projectName,
        // "moduleFather" : this.nodeData.id,
        "moduleLevel": "二级",
        "moduleRemark": form.moduleRemark
      };

      console.log(para)
      if (store.state.projectName === 'No choose') {
        this.$message.error('错了哦,请先选择项目捏');
        return;
      }
      if (form.moduleName === '') {
        this.$message.error('错了哦,请不要提交空值捏');
        return;
      }

      this.postRequest(`/modules/updateById`, para).then(resp => {
        // console.log("In updateById");
        // console.log(resp.data);
        this.data = resp.data;
        this.update();
      });

      this.formClear();
      this.updateLevelTwoFormVisible = false;
    },

    formClear () {
      this.form.moduleName = "";
      this.form.moduleRemark = "";
    },

    // 此方法已弃用
    open () {
      console.log("此方法已弃用");

      this.$prompt('请输入问题名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            //   inputPattern: /$/,
            inputErrorMessage: '名称不能为空',

          },
      ).then(({value}) => {
        console.log(value);
        var pn = store.state.projectName;
        var para = {
          "moduleName": value,
          "projectName": pn,
          "moduleLevel": "一级",
          "moduleRemark": "ooo"
        };
        var _this = this;
        this.postRequest("/modules/insertModule/", para).then(resp => {
          _this.update();
        });

        this.$message({
          type: 'success',
          message: '问题为 ' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },

    // 此方法已弃用
    open2 (data) {
      console.log("此方法已弃用");

      this.$prompt('请输入问题名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        //   inputPattern: /$/,
        inputErrorMessage: '名称不能为空'
      }).then(({value}) => {
        console.log(value);
        var pn = store.state.projectName;

        console.log("IN OPEN2");
        console.log(data);

        var temp = data.id;

        var para = {
          "moduleName": value,
          "projectName": pn,
          "moduleFather": temp,
          "moduleLevel": "二级",
          "moduleRemark": "ooo"
        };
        var _this = this;
        this.postRequest("/modules/insertModule/", para).then(resp => {
          _this.update();
        });

        this.$message({
          type: 'success',
          message: '问题为 ' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },

    // 删除一级或者二级模块
    remove (node, data) {
      var para = {'moduleId': data.id};
      console.log(para);

      var _this = this;

      this.deleteRequest(`/modules/deleteById`, {params: para}).then(resp => {
        console.log("In delete");
        _this.update();
      });

      this.formClear();
    },

    update () {
      // 根据VueX中的projectName数据修改侧边栏树状视图
      var val = store.state.projectName;
      var params = {'ProjectName': val};
      this.getRequest(`/modules/selectByProjectName`, {params}).then(resp => {
        console.log("In update function");
        // console.log(resp.data);
        this.data = resp.data;
      });
    },

    renderContent (h, {node, data, store}) {
      //console.log("IN renderContent");
      //console.log(node);
      if (data.parentId != -1) { //当父亲节点不为-1时说明不是一级节点不可以新增
        return (
            <span class="custom-tree-node">
            <span>{ node.label }</span>
            <span>
                <el-button size="huge" type="text" icon='el-icon-edit' style="padding-right : 5px"
                           on-click={ () => {
                             this.updateLevelTwoFormVisible = true;
                             this.nodeData = data
                           } }></el-button>

                <el-popconfirm
                    confirm-button-text='好的'
                    cancel-button-text='不用了'
                    icon="el-icon-info"
                    icon-color="red"
                    title="您确定删除这个节点吗？"
                    on-confirm={ () => this.remove(node, data) }
                >
                    <el-button size="huge" type="text" icon='el-icon-delete' slot="reference"></el-button>
                </el-popconfirm>
            </span>
            </span>
        );
      } else { //剩余的为一级节点可以更新
        return (
            <span class="custom-tree-node">
            <span>{ node.label }</span>
            <span>
                <el-button size="huge" type="text" icon='el-icon-circle-plus-outline'
                           on-click={ () => {
                             this.insertLevelTwoFormVisible = true;
                             this.nodeData = data
                           } }
                ></el-button>

                <el-button size="huge" type="text" icon='el-icon-edit' style="padding-right : 5px"
                           on-click={ () => {
                             this.updateLevelOneFormVisible = true;
                             this.nodeData = data;
                           } }></el-button>

                <el-popconfirm
                    confirm-button-text='好的'
                    cancel-button-text='不用了'
                    icon="el-icon-info"
                    icon-color="red"
                    title="您确定删除这个节点吗？"
                    on-confirm={ () => this.remove(node, data) }
                >
                    <el-button size="huge" type="text" icon='el-icon-delete' slot="reference"></el-button>
                </el-popconfirm>
            </span>
            </span>
        );
      }
    },

    pop () {
      console.log(1);
    },

    nodeClick (data, node, com) {
      // console.log("In node click");
      // console.log(data);
      // console.log(node);
      // console.log(com);
      //console.log(data.id);
      // BugContentVue.methods.receive(data.id);
      // store.commit('editModuleId', val);

      console.log("In NodeClick");
      store.commit("editModuleId", data.id);
    }
  },

  //   getParentId(data){
  //     // console.log(this.$refs.tree.getCheckedKeys());//当前选择节点
  //     // console.log(this.$refs.tree.getHalfCheckedKeys());//父节点
  //     // return[console.log(this.$refs.tree.getHalfCheckedKeys())]
  //     return[data.parentID]
  //   },

  //   computed: {
  //     changeButton: function(){
  //       let buttonStatus = false;
  //       if (getParentId==-1){
  //           buttonStatus = true
  //       }else {
  //           buttonStatus = false
  //       }
  //       return buttonStatus;
  //     }
  //   },
}

</script>

<style scoped>
/deep/ .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

/deep/ .el-select {
  left: 13px
}
</style>
