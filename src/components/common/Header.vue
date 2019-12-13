<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">考拉Saas系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/index">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator"><img src="static/img/img.jpg"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>管理员信息</el-dropdown-item>
                        <el-dropdown-item divided command="resetPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- 修改密码弹框 -->
        <el-dialog
            title="修改密码"
            :visible.sync="dialog.passwordSync"
            width="56%">
            <div>
                <div class="flex-layout">
                    <span class="mr10">旧密码</span>
                    <el-input style="width: 50%" v-model="oldPassword" type="password" placeholder="请输入旧密码"></el-input>
                </div>
                <div class="mt10 flex-layout">
                    <span class="mr10">新密码</span>
                    <el-input style="width: 50%" v-model="newPassword" type="password" placeholder="请输入新密码"></el-input>
                </div>
                <div class="mt10 flex-layout">
                    <span class="mr10">重复密码</span>
                    <el-input style="width: 50%" v-model="reNewPassword" type="password" placeholder="请输入重复密码"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.passwordSync = false">取 消</el-button>
                <el-button type="warning" @click="resetPassword">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    // bus
    import bus from '../common/bus';

    import {logout, resetPassword} from "../../api/login"
    import dialog from '@/common/dialog'
    import show from '@/common/show'

    export default {
        data(){
            return {
                collapse: true,
                fullscreen: false,
                message: 2,
                name: 'kaola',
                dialog: {
                    passwordSync: false
                },
                oldPassword: '',
                newPassword: '',
                reNewPassword: ''
            }
        },
        computed:{
            username(){
                let loginUser = JSON.parse(localStorage.getItem('loginUser'));
                console.log(loginUser);
                return loginUser.name;
            }
        },
        methods: {
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {

                let self = this
                if(command == 'loginout'){

                  logout(function (data) {
                    localStorage.removeItem('loginUser')
                      self.$router.push('/login');
                  });


                } else if (command == 'resetPassword') {
                    this.dialog.passwordSync = true
                }
            },

            resetPassword() {

                if (this.newPassword != this.reNewPassword) {
                    show.error("两次密码输入不一致")
                    return
                }
                let params = {
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword
                }

                dialog.confirm(() => {
                    resetPassword(params, (data) => {
                        show.success(data)
                    })
                })


            },

            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        }
    }
</script>

<style scoped lang="less">
    .header{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #666;
        .collapse-btn{
            float: left;
            padding: 0 21px;
            cursor: pointer;
            line-height: 70px;
        }
        .logo{
            float: left;
            width:250px;
            line-height: 70px;
        }
        .header-right{
            float: right;
            padding-right: 50px;
            .header-user-con{
                display: flex;
                height: 70px;
                align-items: center;
                .btn-fullscreen{
                    transform: rotate(45deg);
                    margin-right: 5px;
                    font-size: 24px;
                }
                .btn-bell, .btn-fullscreen{
                    position: relative;
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    border-radius: 15px;
                    cursor: pointer;
                    color: #666;
                    .el-icon-bell{
                        color: #666;
                    }
                }
                .btn-bell-badge{
                    position: absolute;
                    right: 0;
                    top: -2px;
                    width: 8px;
                    height: 8px;
                    border-radius: 4px;
                    background: #f56c6c;
                    color: #fff;
                }
                .user-avator{
                    margin-left: 20px;
                    img{
                        display: block;
                        width:40px;
                        height:40px;
                        border-radius: 50%;
                    }
                }
                .user-name{
                    margin-left: 10px;
                    .el-dropdown-link{
                        color: #666;
                        cursor: pointer;
                    }
                    .el-dropdown-menu__item{
                        text-align: center;
                    }
                }
            }
        }
    }
</style>
