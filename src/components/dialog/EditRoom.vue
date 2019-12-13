<template>
    <div>
        <!-- 弹出框-添加/编辑房间 -->
        <el-dialog :title=" curRoom.id ? '编辑门店' : '添加房间' " :visible.sync="dialogEditRoomVisible" :close-on-click-modal="false">
            <div>
                <div class="flex-layout">
                    <span class="mr10">房间名称</span>
                    <el-input style="width: 50%" v-model="curRoom.name" placeholder="请输入房间名称"></el-input>
                </div>
                <div class="mt10 flex-layout">
                    <span class="mr10">床位编号(可不填)</span>
                    <el-input style="width: 50%" v-model="curShop.bedNo" placeholder="请输入床位编号"></el-input>
                </div>
                <div class="mt10 flex-layout">
                    <span class="mr10">床位个数</span>
                    <el-input style="width: 50%" v-model="curShop.bedCount" placeholder="请输入床位个数"></el-input>
                </div>
                <div class="mt10 flex-layout">
                    <div style="display:flex;margin-right:30px">
                        <span style="flex:1; text-align: right;margin-right:20px;margin-left:25px">床位分布图</span>
                        <el-upload
                            class="avatar-uploader"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessStore"
                            :before-upload="beforeAvatarUploadStore">
                            <img v-if="dialog_store_imageUrl" :src="dialog_store_imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogEditRoomVisible = false">取 消</el-button>
                <el-button type="warning" @click="clickSaveRoom">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "EditRoom",
        props: [
            'brandId',
            'shopId',
            'show'
        ],

        data() {
            return {
                room: {
                    name: '',
                    bedNo: '',

                }

            }
        },

        mounted() {

        },

        watch: {

        },

        methods: {

        }

    }
</script>

<style scoped>

</style>
