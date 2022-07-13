<template>
  <div class="back">
    <div class="header">
      <div class="imageDiv">
        <img src="../assets/projectLogo.png" class="imageLogo"/>
      </div>
      <div class="fontStyle">
        科大国创项目管理系统
      </div>
      <el-radio-group v-model="tabPosition" class="headHeader">
        <el-radio-button label="workPlace">工作台</el-radio-button>
        <el-radio-button label="contract">合同</el-radio-button>
        <el-radio-button label="project">项目</el-radio-button>
        <el-radio-button label="demand">需求</el-radio-button>
        <el-radio-button label="bug">缺陷</el-radio-button>
        <el-radio-button label="PMO">PMO</el-radio-button>
      </el-radio-group>
      <div class="personalInformation">
        <img src="../assets/img.png" class="imageUser"/>
<!--        handleCommand处理的内容与command的标志绑定-->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link"
          :title = "`${userName}`"
          > {{ userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setInformation">设置个人信息</el-dropdown-item>
            <el-dropdown-item command="selectProject">API开发</el-dropdown-item>
            <el-dropdown-item command="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Bug" name="first">
          <bugTemplate></bugTemplate>
        </el-tab-pane>
        <el-tab-pane label="测试用例" name="second">
          <testCaseTemplate></testCaseTemplate>
        </el-tab-pane>
        <el-tab-pane label="测试计划" name="third">
          <testPlanTemplate></testPlanTemplate>
        </el-tab-pane>
        <el-tab-pane label="报表" name="fourth">
          <reportTemplate></reportTemplate>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import reportTemplate from './Report.vue'
import bugTemplate from './Bug.vue'
import testCaseTemplate from './TestCase.vue'
import testPlanTemplate from './TestPlan.vue'
import store from "@/store";
export default {
  // 组件
  components:{reportTemplate, bugTemplate, testCaseTemplate, testPlanTemplate},
  name: "Home",
  // 针对v-model的默认数据返回与加载
  data () {
    return {
      // 页面默认加载样式
      activeName: 'first',
      tabPosition: 'bug',
      userName:""

    }
  },
  created() {
    this.userName = store.state.userName;
  },
  // 实现上面@后命令的方法
  methods: {
    // 控制台打印日志
    handleClick (tab, event) {
      console.log(tab, event);
    },
    // 处理handleCommand提供的命令，利用command是否包括来判断，command与el-dropdown-item中的内容相对应
    handleCommand (command) {
      if(command.includes("setInformation")){
        this.$router.push('/bug');
      }else if(command.includes("selectProject")){
        window.location.href = 'http://momoko46.azurewebsites.net/swagger-ui.html';
      }else if(command.includes("logOut")){
        sessionStorage.removeItem('Authorization');
        this.$router.replace('/login');
      }
    }
  },
  // 路由进入此页面前就进行加载设置，消除自动设置的最外圈的margin
  beforeRouteEnter (to, from, next) {
    document.querySelector('body').setAttribute('style', 'margin:0;padding:0')
    next()
  }
};
</script>

<style scoped>
.header{
  background-color: #ffffff;
  height:55px;
  border: 1px solid #eaeaea;
  border-left:none;
  border-right:none;
  box-shadow: 0 0 25px #cac6c6;
}
.imageLogo{
  width: 60px;
  height: 50px;
  margin: 5px 10px 5px 10px;
}
.imageDiv{
  float:left;
  height:55px;
  border: 1px solid #eaeaea;

}
.fontStyle{
  float: left;
  font-weight: bold;
  height: 20px;
  width: 300px;
  margin: 17px 5px 15px 30px;
}
.headHeader{
  margin:8px 10px 9px 112px;
}
/deep/.el-radio-button__inner{
  border:none;
  border-radius: 0px;
  font-size:16px;
  font-weight:600;

}
/deep/.el-radio-button:first-child .el-radio-button__inner{
  border-radius: 0 0 0 0;
  border-left:none;
}
/deep/.el-radio-button:last-child .el-radio-button__inner{
  border-radius: 0 0 0 0;
}

/deep/.el-tabs__header{
  height:50px;
}
/deep/.el-tabs__nav-wrap,/deep/.el-tabs__nav-scroll{
  background-color: #ffffff;
  height:50px;
}
/deep/.el-tabs__nav{
  margin-left:40px;
  height:50px;
}
.back{
  background-color: #E8EDF7;
  height: 100%;
  position: fixed;
  width: 100%;
}
/deep/.el-tabs__item{
  font-weight:600;
  height:50px;
  line-height:50px;
}
/deep/.el-tabs__active-bar{
  height:3px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.imageUser{
  float: left;
  margin:-7px -9px -2px 50px;
  width: 46px;
  height: 36px;
}
.personalInformation{
  float: right;
  margin: 17px 10px 10px 50px;
}
.el-dropdown-link[data-v-fae5bece]{
  color:#000000;
}
</style>
