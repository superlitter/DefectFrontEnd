import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    // 存储token
    Authorization: sessionStorage.getItem('Authorization') ? sessionStorage.getItem('Authorization') : '',
     projectName:"No choose",
    userName:"",
    moduleId:0,
    modules:[],
    bugDescription:""
  },

  mutations: {
    // 修改token，并将token存入sessionStorage
    changeLogin (state, user) {
      state.Authorization = user.Authorization;
      sessionStorage.setItem('Authorization', user.Authorization);
    },
    editProjectName(state, x) {
      state.projectName = x
    },
    editUserName(state, x) {
      state.userName = x
    },
    editModuleId(state, x) {
      state.moduleId = x
    },
    editModules(state, x) {
      state.modules = x
    },
    editbugDescription(state,x){
      state.bugDescription = x;
    }
  }
})

export default store




