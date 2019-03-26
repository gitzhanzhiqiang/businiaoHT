<template>
    <div class="app-container calendar-list-container ggg_user">
        <div class="content">
            <el-row>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <p>
                            <span>注册总人数</span>
                        </p>
                        <p>
                            <span>{{data.totalRegister}}</span>
                        </p>
                        <p>
                            <span>昨日（人）：{{data.yesterdayRegister}}</span>
                        </p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <p>
                            <span>发布总笔数</span>
                        </p>
                        <p>
                            <span>{{data.totalRelease}}</span>
                        </p>
                        <p>
                            <span>昨日（笔）：{{data.yesterdayRelease}}</span>
                        </p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <p>
                            <span>成交总笔数</span>
                        </p>
                        <p>
                            <span>{{data.totalDeal}}</span>
                        </p>
                        <p>
                            <span>昨日（笔）：{{data.yesterdayDeal}}</span>
                        </p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <p>
                            <span>成交总金额</span>
                        </p>
                        <p>
                            <span>{{data.totalAmount}}</span>
                        </p>
                        <p>
                            <span>昨日（元）：{{data.yesterdayAmount}}</span>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { parseTime } from '@src/filters';
export default {
    data() {
        return {
            data: {}
        }
    },
    computed: {
    },
    created() {
           this.getData();
    },
    mounted() {

    },
    methods: {
        //获取数据
        getData() {
            ajax({
                url: 'index/info',
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        this.data = response.data ? response.data : [];
                    } else {
                        this.$message({
                            message: response.message,
                            type: 'warning'
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #F2F2F2;
    p {
        text-align: center;
        line-height: 40px;
        font-weight: bold;
        font-size: 16px;
        &:last-child {
            font-weight: normal;
        }
        &:nth-child(2) {
            padding: 5px 0;
        }
    }
}

.grid-content {
    min-height: 36px;
}
.content{
    padding: 0 30px;
}
</style>


