<template>
    <div>
        <!-- 弹出框-房间 -->
        <el-dialog title="房间" :visible.sync="dialogRoomVisible">
            <el-card class="item-card" shadow="hover">
                <ul class="item-info">
                    <li :class="{active : room.isSelect}"
                        @click="room.isSelect=!room.isSelect"
                        v-for="(room, index) in roomData"
                        :key="index">
                        <img src="../../../assets/mech.png" alt="">
                        <div>
                            <span>{{room.name}}</span>
                            <p>
                                <span style="color: #f63;">已用{{room.unoccupied}}</span>
                                未用{{room.occupied}}
                            </p>
                        </div>
                    </li>
                </ul>
            </el-card>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogRoomVisible = false">取 消</el-button>
                <el-button type="warning" @click="dialogRoomVisible = false">确定选择</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "order-room.vue"
    }
</script>

<style scoped>

</style>
