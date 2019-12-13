<template>
    <div class="login-wrap">
        <div class="ms-title">考拉Saas系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" v-model="ruleForm.password" placeholder="password"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {login} from '../../api/login'

    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {

            //提交表单
            submitForm: function (formName) {

                //
                const username = this.ruleForm.username;
                const password = this.ruleForm.password;

                this.login(username, password);
            },

            //登录
            login: function(loginName, password) {

              var self = this;
                //登陆
                login(loginName, password, function(data){

                    //登录成功
                  console.log('登录成功');
                  localStorage.setItem('loginUser', JSON.stringify(data));
                  self.$router.push('/');

                });

            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: url(../../assets/bg.jpg) no-repeat center center;
        /* background-size: 100% auto; */
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        font-size: 14px;
    }
</style>
