<template>
  <el-container>
    <div style = 'width:300px;margin-left:20px;'>
      <el-aside width="280px" class="table_left">
        <div class="table_left_topFont">请选择报表类型</div>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="table_left_checkbox_all">全选</el-checkbox>
        <el-checkbox-group v-model="checkedTypes" @change="handleCheckedTypesChange">
          <el-checkbox v-for="item in types" :label="item.name" :key="item.name" @change="handleChange($event,item.id)">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <div class="table_left_button">
          <el-button type="primary" plain @click="submitInformation">生成报表</el-button>
        </div>
      </el-aside>
    </div>
    <el-main class="table_right" style = "overflow-y: scroll;scrollbar-width:none">
      <el-container>
        <el-header>
          <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-select v-if="inputVisible" v-model="value" class="input-new-tag" placeholder="请输入要进行筛选的项目名称"  ref="saveTagInput" @change="onProChange" >
            <el-option
                v-for="item in options"
                :key="item.projectName"
                :label="item.projectName"
                :value="item.projectName"
                :disabled="item.disabled"
                >
            </el-option>
          </el-select>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 筛选</el-button>
          <el-button size="small" type="primary" icon="el-icon-search" class="searchButton" @click="requestClick">查询</el-button>
        </el-header>
        <el-main>
          <el-tabs v-model="chartsType" @tab-click="searchClick">
            <el-tab-pane label="条形图" name="bar">
              <barTemplate :chosenData="returnData" :dataOfCheck="dataChecked" :typeOfOptions="types" v-if="barShow"></barTemplate>
            </el-tab-pane>
            <el-tab-pane label="折线图" name="line">
              <lineTemplate :chosenDataLine="returnData" :dataOfCheckLine="dataChecked" :typeOfOptionsLine="types" v-if="lineShow"></lineTemplate>
            </el-tab-pane>
            <el-tab-pane label="饼状图" name="pie">
              <pieTemplate :chosenDataPie="returnData" :dataOfCheckPie="dataChecked" :typeOfOptionsPie="types" v-if="pieShow"></pieTemplate>
            </el-tab-pane>
            <el-tab-pane label="对比分析图" name="contrast">
              <contrastTemplate :chosenDataContrast="returnData" :dataOfCheckContrast="dataChecked" :typeOfOptionsContrast="types" v-if="contrastShow"></contrastTemplate>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import barTemplate from "../components/Bar.vue";
import lineTemplate from "../components/Line.vue";
import pieTemplate from "../components/Pie.vue";
import contrastTemplate from "../components/Contrast";
const typeOptions = [
  {
    'id': 1,
    'name': '按项目统计bug数'
  },
  {
    'id': 2,
    'name': '按模块统计bug数'
  },
  {
    'id': 3,
    'name': '每天新增的bug数'
  },
  {
    'id': 4,
    'name': '每日关闭bug数'
  },
  {
    'id': 5,
    'name': '每人创建bug数'
  },
  {
    'id': 6,
    'name': '每人完成bug数'
  },
  {
    'id': 7,
    'name': '每人关闭bug数'
  },
  {
    'id': 8,
    'name': '按bug类型统计bug数'
  },
  {
    'id': 9,
    'name': '按紧急程度统计'
  },
  {
    'id': 10,
    'name': '按优先级统计'
  },
  {
    'id': 11,
    'name': '按状态统计'
  }
];
export default {
  name: "Report",
  components:{barTemplate, lineTemplate, pieTemplate, contrastTemplate},
  data () {
    return {
      input:'OTC研发项目',
      chartsType:'bar',
      checkAll: false,
      checkedTypes: [],
      types: typeOptions, // 可供的选项内容
      dataChecked:[], // 已选择的内容
      isIndeterminate: true,
      returnData:[],
      barShow: false,
      pieShow: false,
      lineShow: false,
      contrastShow: false,
      dynamicTags: [],
      inputVisible: false,
      options: [],
      value: '',
      selectData:{},
      isQuery: false
    }
  },
  created(){
    let numme = null;
    this.postRequest(`/projects/selectAll`, numme).then(resp=>{
      this.options = resp.data;
    });
  },
  methods: {
    // 关于筛选所涉及到的方法
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      // 去掉禁选项
      for(let i = 0; i < this.options.length; i++){
        if(tag == this.options[i].projectName){
          this.options[i].disabled = false;
        }
      }
    },

    showInput() {
      this.inputVisible = true;
    },

    onProChange() {
      let value = this.value;
      if (value) {
        this.dynamicTags.push(value);
        // 设置禁选项
        for(let i = 0; i < this.options.length; i++){
          if(value == this.options[i].projectName){
            this.options[i].disabled = true;
          }
        }
      }
      this.inputVisible = false;
      this.value = '';
    },

    // 多选框使用的方法
    handleCheckAllChange (val) {
      // val: 选中为true、未选中为false
      let i;
      let checkedList = [];
      let dataCheckedId = [];
      if(val){
        for(i = 0; i < 11 ;i++){
          dataCheckedId.push(i+1);
          checkedList.push(typeOptions[i].name);
        }
        this.dataChecked = dataCheckedId;
       // console.log(this.dataChecked);
        this.checkedTypes = checkedList;
      }
      else{
        this.dataChecked = [];
        //console.log(this.dataChecked);
        this.checkedTypes = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedTypesChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.types.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.types.length;
    },
    handleChange (e,id) {
      if(e){
        this.dataChecked.push(id);
      }
      else{
        this.delete(id);
      }
    },
    delete(id){
        let index = this.dataChecked.findIndex(item => {
          if(item == id){
            return true;
          }
        });
        this.dataChecked.splice(index,1);
    },
    searchClick (tab, event) {
      console.log(tab, event);
    },
    requestClick(){
      this.isQuery = true;
      this.submitInformation();
    },
    submitInformation () {
      this.dataChecked.sort(function (a, b) {
        return a - b;
      });
      if(this.dynamicTags.length != 0){
        this.selectData = {
          "arr": this.dataChecked,
          "strings": this.dynamicTags
        }
      }
      else{
        this.selectData = {
          "arr": this.dataChecked,
          "strings": this.options.map(element => element.projectName)
        }
      }
      console.log(this.dataChecked);
      if(this.dataChecked.length == 0){
        this.$message.error('请选择要生成的报表类型!');
      }
      else{
        this.postRequest('/bugs/charts',this.selectData).then(resp =>{
          // 反馈回来各个报表类型所对应的报表名称及其bug数.
          if(resp.code == "200"){
            if(this.isQuery){
              this.$message({
                message: '查询成功!',
                type: 'success'
              });
            }
            else{
              this.$message({
                message: '生成报表成功!',
                type: 'success'
              });
            }
            this.returnData = resp.data;
            this.barShow = false;
            this.pieShow = false;
            this.lineShow = false;
            this.contrastShow = false;
            this.$nextTick(function(){
              // 加载
              this.barShow = true;
              this.pieShow = true;
              this.lineShow = true;
              this.contrastShow = true;
            });
          }
          else{
            if(this.isQuery){
              this.$message.error('查询失败!');
            }
            else{
              this.$message.error('生成报表失败!');
            }
          }
          this.isQuery = false;
        })
      }
    }
  }
};
</script>

<style scoped>

.table_left{
  margin-left: 10px;
  margin-top: 10px;
  border-radius: 15px;
  padding: 15px 35px 25px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.table_left_topFont{
  margin-left: 20px;
  font-weight: bold;
  margin-top: 10px;
  font-family:"Microsoft YaHei";
}
/deep/.el-checkbox{
  margin-top: 12px;
  margin-left: 20px;
  letter-spacing: 0.5px;
  font-family:"Microsoft YaHei";
}
/deep/.el-checkbox__label{
  font-weight:500;
}
.table_left_checkbox_all{
  margin-top:20px;
}
.table_left_button{
  margin-top:20px;
  text-align: center;
}
.table_right {
  margin-left: 10px;
  margin-top: 10px;
  border-radius: 15px;
  padding: 15px 35px 25px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  margin-right: 20px;
  height: 575px;
  /*box-shadow: 0 0 25px #cac6c6;*/
}
/deep/.el-header{
  padding:0px 0px !important;
}
.selectButton{
  margin-left:10px !important;
}
.searchButton{
  margin-left:16px !important;
}
/deep/.el-tabs__header{
  margin-top:-30px !important;
}
/*.chartsStyle{*/
/*  width:500px;*/
/*}*/
/*筛选、下拉框的样式*/
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 33px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  font-weight: bold;
  color: black;
  font-size: 12px;
  font-family: "Microsoft YaHei";
}
.input-new-tag {
  width: 250px;
  margin-left: 10px;
  vertical-align: bottom;
}
/deep/.el-input__inner{
  height:32px;
}
/deep/.el-input__icon{
  line-height: 30px;
}
/deep/.el-input{
  font-size: 13px;
}

</style>
