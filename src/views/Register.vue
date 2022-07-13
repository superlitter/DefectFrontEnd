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

      <el-form :rules="rules" ref="registerForm" :model="registerForm" class="loginContainer"
               v-loading="loading"
               element-loading-text="正在跳转到登录页面中...">
        <h3 class="loginTitle">注&nbsp;&nbsp;册</h3>
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="邮箱验证"></el-step>
          <el-step title="注册信息确认"></el-step>
          <el-step title="注册成功"></el-step>
        </el-steps>

        <el-form-item prop="staffId">
          <el-input auto-complete="false" v-model="registerForm.staffId" placeholder="请输入帐号ID" clearable></el-input>
        </el-form-item>
        <el-form-item prop="staffName">
          <el-input auto-complete="false" v-model="registerForm.staffName" placeholder="请输入您的姓名" clearable></el-input>
        </el-form-item>
        <el-form-item prop="staffMail" style="display: flow">
          <el-input auto-complete="false" v-model="registerForm.staffMail" placeholder="请输入账户绑定邮箱" clearable style="width: 300px"></el-input>
          <el-button @click="checkMail" style="width: 80px;margin-left: 20px">验证</el-button>
        </el-form-item>
        <el-form-item  prop="staffCodeCheck">
          <el-input v-model="registerForm.staffCodeCheck" autocomplete="off" placeholder="请输入验证码"  clearable></el-input>
        </el-form-item>
        <el-form-item  prop="staffPswd">
          <el-input type="password" v-model="registerForm.staffPswd" autocomplete="off" placeholder="设置用户密码" show-password clearable></el-input>
        </el-form-item>
        <el-form-item  prop="checkPswd">
          <el-input type="password" v-model="registerForm.checkPswd" autocomplete="off" placeholder="确认密码" show-password clearable></el-input>
        </el-form-item>
        <span class="font_account">已有帐号?</span>
        <el-link target="_blank" @click="submitLogin" class="loginButton">立即登录</el-link>
        <el-button type="primary" style="width:100%" @click="submitRegister" class="registerButton" :disabled="disabled">注册</el-button>
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
    var validatePass2 = (rule, value, callback) => {
     if (value !== this.registerForm.staffPswd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return{
      disabled: true,
      staffType: "普通员工",
      active: 0,
      registerForm:{
        staffCodeCheck:"",
        staffId:"",
        staffMail:"",
        staffName:"",
        staffPswd:"",
        checkPswd:""
      },
      loading: false,
      //rules内容与prop的内容相对应  提示
      rules:{
        staffId:[
          {required:true,message:'请输入用户名',trigger:'blur'}
        ],
        staffName:[
          {required:true,message:'请输入姓名',trigger:'blur'}
        ],
        staffMail:[
          {required:true,message:'请输入账户绑定邮箱',trigger:'blur'}
        ],
        staffPswd:[
          {required:true,message:'请输入密码',trigger:'blur'}
        ],
        checkPswd:[{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods:{
    checkMail(){
      this.postRequest('/mail/mailcheck',{
        "codeCheck": this.registerForm.staffCodeCheck,
        "staffId": this.registerForm.staffId,
        "staffMail": this.registerForm.staffMail,
        "staffName": this.registerForm.staffName,
        "staffPswd": this.registerForm.staffPswd,
        "staffType": this.staffType
      }).then(resp=>{
        if(resp.code === "200"){
          this.loading = false;
          //存储用户token
          //跳转首页
          this.disabled = false;
          this.active = 1;
        }
        else{
          this.loading = false;
          this.registerForm.staffId="";
          this.registerForm. staffPswd="";
          this.registerForm.staffName="";
          this.registerForm.staffMail="";
          this.registerForm.staffCodeCheck="";
          this.registerForm.checkPswd="";
        }
      })
    },
    submitLogin(){
      this.$router.push('/login');
    },
    submitRegister(){
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.active = 2;
          this.postRequest('/staff/register',{
            "codeCheck": this.registerForm.staffCodeCheck,
            "staffId": this.registerForm.staffId,
            "staffMail": this.registerForm.staffMail,
            "staffName": this.registerForm.staffName,
            "staffPswd": this.registerForm.staffPswd,
            "staffType": this.staffType
          }).then(resp=>{
            if(resp.code === "200"){
              Message.success({message: resp.msg});
              this.$router.push('/login');
            }
            else if(resp.code === "-2"){
              this.active = 1;
              //重名
              this.registerForm.staffId="";
              Message.error({message: resp.msg});
            }else{
              //验证码错误,请重新验证并填写信息
              Message.error({message: resp.msg});
              this.active = 0;
              this.registerForm.staffId="";
              this.registerForm. staffPswd="";
              this.registerForm.staffName="";
              this.registerForm.staffMail="";
              this.registerForm.staffCodeCheck="";
              this.registerForm.checkPswd="";
              this.disabled = true;
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
  margin: 40px 140px;
  width: 400px;
  height: 660px;
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
.loginButton{
  margin-top: -3px;
  margin-left: 10px;
  font-weight: bold;
}
.font_account{
  color: #606266;
  font-size: 14px;
  font-weight: 500;
}
.registerButton{
  margin-top:23px;
  margin-left: 0px;
}
</style>
