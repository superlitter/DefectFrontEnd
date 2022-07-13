<template>
  <el-container>
      <el-aside width="280px" class="table_left">
        <side-bar></side-bar>
      </el-aside>
    <el-main
        class="table_right"
        style="overflow-y: scroll; scrollbar-width: none"
    >
      <div id="Bug">
        <TestCase ref="TestCase"></TestCase>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import TestCase from "../components/TestCase.vue";
import SideBar from "../components/SideBar.vue";

export default {
  name: "Bug",
  data() {
    return {
      whether_display: true,
      if_display: true,
      N_display: true,
    };
  },
  methods: {
    child_username_Creator() {
      console.log("第二层调用");
      this.$refs.Content.username_Creator();
    },
    child_username_Designee() {
      console.log("第二层调用");
      this.$refs.Content.username_Designee();
    },
    child_All() {
      console.log("第二层调用");
      this.$refs.Content.All();
    },
    child_username_Closer() {
      console.log("第二层调用");
      this.$refs.Content.username_Closer();
    },
    child_username_solver() {
      console.log("第二层调用");
      this.$refs.Content.username_solver();
    },
  },
  components: {
    TestCase,
    SideBar,
  },
};
</script>

<style scoped>
html {
  background-color: #e8edf7;
}
.table_left {
  margin-top: 10px;
  margin-left: 20px;
  border-radius: 15px;
  padding: 15px 35px 25px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  height: 570px;
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
}
</style>
