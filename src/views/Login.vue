<template>
  <div class="loginPage">
    <div class="left">
      <div class="top">
        <div class="topLogo">
          <img src="../assets/img_1.png" class="imageLogo"/>
        </div>
        <div class="topName">
          科大国创项目管理系统
        </div>
      </div>
      <div class="content"></div>
    </div>
    <div class="right">
      <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer"
               v-loading="loading"
               element-loading-text="正在登录中...">
        <h3 class="loginTitle">登&nbsp;&nbsp;陆</h3>
        <el-form-item prop="staffId">
          <el-input auto-complete="false" v-model="loginForm.staffId" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item prop="staffPswd">
          <el-input auto-complete="false" v-model="loginForm.staffPswd" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <span class="font_account">还没帐号?</span>
        <el-link target="_blank" @click="submitRegister" class="registerButton">立即注册</el-link>
        <el-button type="primary" style="width:100%" @click="submitLogin" class="loginButton">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import store from "@/store";
import { JSEncrypt } from "jsencrypt";
import { Message } from "element-ui";
export default {
  name: "Login",
  data(){
    return{
      loginForm:{
        staffId:"",
        staffPswd:""
      },
      loading: false,
      //rules内容与prop的内容相对应  提示
      rules:{
        staffId:[
          {required:true,message:'请输入用户名',trigger:'blur'}
        ],
        staffPswd:[
          {required:true,message:'请输入密码',trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    ...mapMutations(['changeLogin']),
    submitRegister(){
      this.$router.push('/register');
    },
    submitLogin(){
      // ref中的loginForm  输入满足要求(valid) => 发送给后端接口 => 后端验证后返回token => 前端根据后端递交内容进行页面展示
      let encryptor = new JSEncrypt();
      let publicKey = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKuixQs2lsUfhayr1otJb/eR/wurxt+IlKEtA8aXCUtR5Bxh/LbJrHinyRpSGMfveYVKodVJmoATNKkTd86GcjMCAwEAAQ==";
      encryptor.setPublicKey(publicKey);
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest('/staff/login',{
            "staffId":this.loginForm.staffId,
            "staffPswd":encryptor.encrypt(this.loginForm.staffPswd)
            // "staffId":this.loginForm.staffId,
            // "staffPswd":this.loginForm.staffPswd,
          }).then(resp=>{
            if(resp.code === "200"){
              // 提示登录成功
              Message.success({message: '登陆成功!'});
              this.loading = false;
              //存储用户token
              const tokenStr = resp.token;
              window.sessionStorage.setItem('tokenStr',tokenStr);
              //将token存储到vuex中
              this.changeLogin({Authorization : tokenStr});
              store.commit('editUserName', resp.data.staffName);
              //跳转首页
              this.$router.replace('/home');
            }
            else if(resp.code === "-1"){
              this.loading = false;
              Message.error({message: resp.msg});
              this.loginForm.staffId="";
              this.loginForm.staffPswd="";
            }
          })
        } else {
          this.$message.error('请输入所有字段!');
          return false;
        }
      });
    },
  },
  beforeRouteEnter (to, from, next) {
    document.querySelector('body').setAttribute('style', 'margin:0;padding:0')
    next()
  }
}
</script>

<style scoped>
.loginPage{
  background-color: #ffffff;
  height: 100%;
  position: fixed;
  width: 100%;
  border:none;
}
.left{
  float: left;
  width:55%;
  height:100%;
}
.right{
  float: left;
  width:45%;
  height:100%;
}
.topLogo{
  float:left;
}
.imageLogo{
  height:40px;
  width:110px;
}
.topName{
  float: left;
  font-weight: bold;
  height: 20px;
  width: 300px;
  margin: 8px 5px 15px 30px;
}
.content{
  margin-top:40px;
  background-image: url("../assets/background.png");
  background-size: 100% 100%;
  height: 95%;
  width: 55%;
  position: fixed;
}
.loginContainer{
  border-radius: 15px;
  background-clip: padding-box;
  margin: 200px 140px;
  width: 350px;
  height: 350px;
  padding: 15px 35px 25px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.loginTitle{
  margin: 20px auto 45px auto;
  text-align: center;
  font-weight: bold;
  font-size: 26px;
}
/deep/.el-form-item{
  margin-bottom:30px;
}
.registerButton{
  margin-top: -3px;
  margin-left: 10px;
  font-weight: bold;
}
.font_account{
  color: #606266;
  font-size: 14px;
  font-weight: 500;
}
.loginButton{
  margin-top:23px;
  margin-left: 0px;
}
</style>
