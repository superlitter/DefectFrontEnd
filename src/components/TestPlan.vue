<template>
  <div class="content" id="Content">
    <div class="Top" v-if="whether_display">
      <div class="shang">
        <!-- <Home v-if="nav_show"></Home> -->
        <div class="Inner">
          <header style="font-size: 40px">测试计划</header>
          <!-- <el-button
            type="primary"
            @click="handleClick"
            style="margin-left: 80%"
            >提交BUG</el-button
          > -->

          <!-- <el-button type="primary" @click="JumpTo">回到登录</el-button> -->
          <!-- <router-link to="/login">首页</router-link> -->

          <ul>
            <el-button size="medium" round @click="username_Designee()"
            >指派给我</el-button
            >
            <el-button size="medium" round @click="username_Creator()"
            >我创建的</el-button
            >
            <el-button size="medium" round @click="username_Closer()"
            >我关闭的</el-button
            >
            <el-button size="medium" round @click="username_solver()"
            >我完成的</el-button
            >
            <el-button size="medium" round @click="All()">全部</el-button>
            <el-input
                size=" mini"
                v-model="search"
                placeholder="搜索Bug名称"
                style="width: 500px"
            ></el-input>
            <el-button size="medium" round @click="Search()">搜索</el-button>
          </ul>
        </div>
      </div>
    </div>
    <!-- <bug_form v-if="Visiable" ref="dialog"></bug_form> -->
    <Test_Case_form v-if="Visiable"></Test_Case_form>
    <ul>
      <el-table
          :data="tableData"
          style="width: 1500px; margin-top: 0%"
          v-if="whether_display"
      >
        <el-table-column prop="title" label="测试计划" width="300px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" v-if="scope.row.seen">
            </el-input>
            <span style="margin-left: 10px" v-else>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="测试优先级" width="200px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.priority" v-if="scope.row.seen">
            </el-input>
            <span style="margin-left: 10px" v-else>{{
                scope.row.priority
              }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="测试状态" width="200px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.status" v-if="scope.row.seen">
            </el-input>
            <span style="margin-left: 10px" v-else>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建者" width="200px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.creator" v-if="scope.row.seen">
            </el-input>
            <span style="margin-left: 10px" v-else>{{
                scope.row.creator
              }}</span>
          </template></el-table-column
        >
        <el-table-column prop="startdate" label="创建日期" width="280px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.startdate" v-if="scope.row.seen">
            </el-input>
            <span style="margin-left: 10px" v-else>{{
                scope.row.startdate
              }}</span>
          </template></el-table-column
        >
        <el-table-column prop="enddate" label="结束日期" width="280px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.enddate" v-if="scope.row.seen">
            </el-input>
            <span style="margin-left: 10px" v-else>{{
                scope.row.enddate
              }}</span>
          </template></el-table-column
        >
        <el-table-column prop="designee" label="测试者" width="280px">
          <template slot-scope="scope">
            <!-- <el-input v-model="scope.row.Designee" v-if="scope.row.seen">
            </el-input> -->
            <span style="margin-left: 10px">{{ scope.row.designee }}</span>
          </template></el-table-column
        >
        <el-table-column fixed="right" label="操作" width="50px" prop="compile">
          <template slot-scope="{ row, $index }">
            <el-button
                @click="affirm(row, $index)"
                type="text"
                size="huge"
                icon="el-icon-video-play"
                style="font-size: 150%"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-button type="primary" size="medium" style="margin-top: -33%"
        >编辑</el-button
      > -->
      <div class="block" v-if="whether_display">
        <el-pagination
            @current-change.sync="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
        >
        </el-pagination>
      </div>
    </ul>
  </div>
</template>

<script>
// import Bug_Header from "./Bugheader.vue";
import store from "../store";
import axios from "axios";
import Test_Case_form from "./TestCaseForm.vue";
// import { load } from "mime";

export default {
  name: "TestCase",
  components: {
    // Bug_Header,
    Test_Case_form,
  },
  data() {
    return {
      module_id: [],

      currentPage: 1,
      pageSize: 10,
      total: 10,
      // search: "2020214584",

      DesigneeState: 0,
      CreatorState: 0,
      ClosedState: 0,
      FinishedState: 0,
      AllState: 0,

      search: "",
      Visiable: false,
      nav_show: true,
      whether_display: true,
      Page_params: {
        page: 1,
        size: 10,
        moduleId: 0,
        search: null,
      },
      Creator_params: {
        page: 1,
        size: 10,
        moduleId: 0,
        creatorId: "2020214575",
        search: null,
      },
      Closer_params: {
        creatorId: "2020214575",
        page: 1,
        size: 10,
        moduleId: 0,
        status: "已解决",
        search: null,
      },
      Designee_params: {
        designee: "2020214575",
        page: 1,
        moduleId: 0,
        size: 10,
        search: null,
      },
      Finish__params: {
        designee: "2020214584",
        status: "已解决",
        moduleId: 0,
        page: 1,
        size: 10,
        search: null,
      },
      Delete_params: {
        bugName: "",
      },
      username: "皇太极",
      moduleId: 10,
      // 当前页码
      // 总条数
      // 每页的数据条数

      Delete_dialogShow: false,
      isRow: "",
      options: [
        {
          value: "汪导",
          label: "汪导",
        },
        {
          value: "郑五十万",
          label: "郑五十万",
        },
        {
          value: "王百万",
          label: "王百万",
        },
        {
          value: "土木堡战神",
          label: "土木堡战神",
        },
        {
          value: "浩子",
          label: "浩子",
        },
        {
          value: "郑泽毅（五十万）",
          label: "郑泽毅（五十万）",
        },
      ],
      selectValue: "",
      Datas: [],
    };
  },
  mounted() {
    this.All(1);
  },

  methods: {
    Search() {
      if (this.DesigneeState == 1) {
        this.username_Designee();
      }
      if (this.CreatorState == 1) {
        this.username_Creator();
      }
      if (this.ClosedState == 1) {
        this.username_Closer();
      }
      if (this.FinishedState == 1) {
        this.username_solver();
      }
      if (this.AllState == 1) {
        this.All();
      }
    },
    handleClick(Data) {
      this.Visiable = true;
      // this.$parent.whether_display = false;
      this.whether_display = false;
      this.$nextTick(() => {
        this.$refs.dialog.init(Data);
      });
    },
    ClosetheForm(Data) {
      this.Visiable = false;
      this.$parent.whether_display = true;
      this.whether_display = true;
      this.$nextTick(() => {
        this.$refs.dialog.init(Data);
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;

      if (this.DesigneeState == 1) {
        this.username_Designee(this.currentPage);
      }
      if (this.CreatorState == 1) {
        this.username_Creator(this.currentPage);
      }
      if (this.ClosedState == 1) {
        this.username_Closer(this.currentPage);
      }
      if (this.FinishedState == 1) {
        this.username_solver(this.currentPage);
      }
      if (this.AllState == 1) {
        this.All(this.currentPage);
      }
    },
    username_Closer(num1 = 1) {
      console.log("第一层调用");

      this.DesigneeState = 0;
      this.CreatorState = 0;
      this.ClosedState = 1;
      this.FinishedState = 0;
      this.AllState = 0;

      this.Closer_params.search = this.search;
      this.Closer_params.page = num1;
      this.moduleId = store.state.moduleId;
      this.Closer_params.moduleId = this.moduleId;

      this.postRequest("/bugs/findByCloser", this.Closer_params) //补上后台接口即可
          .then((response) => {
            // 请求成功
            console.log("请求成功");
            console.log(response.data);
            this.Datas = response.data.records;
            this.currentPage = response.data.page;
            this.pageSize = response.data.pageSize;
            this.total = response.data.total;
            console.log(this.Datas.list.length);

            console.log("IN Closer");
            console.log(this.moduleId);
          })
          .catch((error) => {
            // 请求失败
            console.log("请求失败");
            console.log(error);
          });

      // return data.Closer.indexOf(this.username) > -1;
    },
    username_solver(num1 = 1) {
      console.log("第一层调用");

      this.DesigneeState = 0;
      this.CreatorState = 0;
      this.ClosedState = 0;
      this.FinishedState = 1;
      this.AllState = 0;

      this.Finish__params.search = this.search;
      this.Finish__params.page = num1;
      this.moduleId = store.state.moduleId;
      this.Finish__params.moduleId = this.moduleId;

      this.postRequest("/bugs/findByFinish", this.Finish__params) //补上后台接口即可
          .then((response) => {
            // 请求成功
            console.log("请求成功");
            console.log(response.data);
            this.Datas = response.data.records;
            this.currentPage = response.data.page;
            this.pageSize = response.data.pageSize;
            this.total = response.data.total;
            console.log(this.Datas.list.length);

            console.log("IN solver");
            console.log(this.moduleId);
          })
          .catch((error) => {
            // 请求失败
            console.log("请求失败");
            console.log(error);
          });

      // this.Datas = this.Datas.filter((data) => {
      //   return data.solver.indexOf(this.username) > -1;
      // });
    },
    username_Designee(num1 = 1) {
      console.log("第一层调用");
      this.DesigneeState = 1;
      this.CreatorState = 0;
      this.ClosedState = 0;
      this.FinishedState = 0;
      this.AllState = 0;
      this.Designee_params.search = this.search;
      this.Designee_params.page = num1;
      this.moduleId = store.state.moduleId;
      this.Designee_params.moduleId = this.moduleId;

      this.postRequest("/bugs/findByAssignee", this.Designee_params) //补上后台接口即可
          .then((response) => {
            // 请求成功
            console.log("请求成功");
            console.log(response.data);
            this.Datas = response.data.records;
            this.currentPage = response.data.page;
            this.pageSize = response.data.pageSize;
            this.total = response.data.total;
            console.log(this.Datas.list.length);
            console.log("IN Designee");
            console.log(this.moduleId);
          })
          .catch((error) => {
            // 请求失败
            console.log("请求失败");
            console.log(error);
          });
      // this.Datas = this.Datas.filter((data) => {
      //   return data.Designee.indexOf(this.username) > -1;
      // });
    },
    All(num1 = 1) {
      this.moduleId = store.state.moduleId;

      this.DesigneeState = 0;
      this.CreatorState = 0;
      this.ClosedState = 0;
      this.FinishedState = 0;
      this.AllState = 1;

      console.log("第一层调用");
      this.Page_params.page = num1;
      this.Page_params.search = this.search;

      this.Page_params.moduleId = this.moduleId;
      console.log("IN ALL");
      console.log(this.moduleId);

      this.postRequest("/bugs/dataAll", this.Page_params) //补上后台接口即可
          .then((response) => {
            // 请求成功
            console.log("请求成功");
            console.log(response.data);
            this.Datas = response.data.records;
            this.currentPage = response.data.page;
            this.pageSize = response.data.pageSize;
            this.total = response.data.total;
            console.log(this.Datas.list.length);
          })
          .catch((error) => {
            // 请求失败
            console.log("请求失败");
            console.log(error);
          });
    },
    username_Creator(num1 = 1) {
      this.moduleId = store.state.moduleId;
      console.log("第一层调用");

      this.DesigneeState = 0;
      this.CreatorState = 1;
      this.ClosedState = 0;
      this.FinishedState = 0;
      this.AllState = 0;

      this.Creator_params.search = this.search;
      this.Creator_params.page = num1;
      this.Creator_params.moduleId = this.moduleId;

      this.postRequest("/bugs/findByCreator", this.Creator_params) //补上后台接口即可
          .then((response) => {
            // 请求成功
            console.log("请求成功");
            console.log(response.data);
            this.Datas = response.data.records;
            this.currentPage = response.data.page;
            this.pageSize = response.data.pageSize;
            this.total = response.data.total;

            console.log(this.Datas.list.length);
          })
          .catch((error) => {
            // 请求失败
            console.log("请求失败");
            console.log(error);
          });

      // this.Datas = this.Datas_Copy;
      // this.Datas = this.Datas.filter((data) => {
      //   return data.creator.indexOf(this.username) > -1;
      // });
    },

    affirm(row, $index) {
      // console.log($index);
      this.Visiable = true;

      this.whether_display = false;
      console.log(row.title);

      this.postRequest("/bugs/bugsdetail", { bugName: row.title }) //补上后台接口即可
          .then((response) => {
            // 请求成功
            console.log(response.data.bugDescription);
            store.commit("editbugDescription", response.data.bugDescription);
          })
          .catch((error) => {
            // 请求失败
            console.log("请求失败");
            console.log(error);
          });
    },

    //初始化数据
    receive(ModuleId) {
      console.log("ID:", this.moduleId);
      this.moduleId = parseInt(ModuleId);
      console.log(this);
      console.log("ID:", this.moduleId);
    },
  },
  computed: {
    tableData() {
      const input = this.$store.state.value;
      // console.log(input);
      if (input) {
        return this.Datas.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1;
          });
        });
      }
      return this.Datas;
    },
  },
};
</script>

<style>
.content {
  /* position: absolute; */
  /* top: 0%;
  left: -10%; */

  height: 800px;
  /*display: flexbox;*/
  flex-direction: column;
}

.Content_ul {
  margin-top: -26%;

  display: flex;
  flex-direction: row;
  /* justify-content: space-evenly; */
  align-items: center;
}

li {
  list-style: none;
}

.Top {
  /*background-color: #e8edf7;*/
  /*display: flex;*/
  flex-direction: column;
  margin-left: 0%;
  margin-top: 0%;
}

.Top .shang ul {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-left: -50px;
}

.Top .shang ul li {
  list-style: none;
}

.shang {
  /*display: flex;*/
  flex-direction: row;
  justify-content: space-evenly;
  /* position: relative; */
  /* margin-top: 100px; */
  /* top: 20%; */
}

.header_left {
  float: left;
  font-size: 15px;
  font-weight: bold;
  margin-left: 10px;
  margin-top: 0px;
}

.header_right {
  float: right;
  padding: 7px 12px;
  font-size: 12px;
}
</style>
