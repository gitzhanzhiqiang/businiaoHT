<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getTable('isseach')">
            <el-form-item label="时间" prop="date">
                <el-date-picker v-model="params.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" icon="el-icon-search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="el-icon-setting" size="medium" @click="resetForm('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <el-button-group>
                <el-button type="primary" size="medium" icon="el-icon-refresh" @click="getTable();">刷新</el-button>
            </el-button-group>
        </div>
        <!-- 列表 -->
        <div class="filter-container">
            <table class="tbale">
                <thead>
                    <th></th>
                    <th>充值金额</th>
                    <th>交易服务费</th>
                    <th>提现在途金额</th>
                    <th>提现到账金额</th>
                    <th>提现手续费</th>
                    <th>冻结金额</th>
                    <th>可用余额</th>
                    <th>账户总额</th>
                </thead>
                <tbody>
                    <tr>
                        <td>实时累计</td>
                        <td v-text="data.recharge"></td>
                        <td v-text="data.serveFee"></td>
                        <td v-text="data.withdrawIng"></td>
                        <td v-text="data.withdraw"></td>
                        <td v-text="data.withdrawFee"></td>
                        <td v-text="data.disCount"></td>
                        <td v-text="data.balance"></td>
                        <td>{{data.disCount + data.balance}}</td>
                    </tr>
                    <tr v-if="data1">
                        <td>筛选结果</td>
                        <td v-text="data1.recharge"></td>
                        <td v-text="data1.serveFee"></td>
                        <td v-text="data1.withdrawIng"></td>
                        <td v-text="data1.withdraw"></td>
                        <td v-text="data1.withdrawFee"></td>
                        <td v-text="data1.disCount"></td>
                        <td v-text="data1.balance"></td>
                        <td>{{data1.disCount + data1.balance}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { parseTime } from '@src/filters';
import { storage } from '@constants/dataStorage';
import { downloadExecl } from '@src/common/downloadExecl';
export default {
    data() {
        return {
            storage: storage,
            listLoading: false, //表格加载
            params: { //搜索条件
                date: [],
                startTime: '',
                endTime: '',
            },
            data: {},
            data1: ''
        }
    },
    computed: {
    },
    created() {
        this.getTable(false, 1);
    },
    mounted() {

    },
    methods: {
        //获取列表
        getTable(isSeach, number) {
            if (isSeach) {
                this.listLoading = true; //列表加载状态
                let date = this.params.date ? this.params.date : []; //时间控件清除为null
                this.params.startTime = parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
                this.params.endTime = parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
            }
            ajax({
                url: 'userfund/count',
                optionParams: isSeach ? this.params : {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        if (isSeach) {
                            this.data1 = response.data ? response.data : {};
                        } else {
                            this.data = response.data ? response.data : {};
                            if (!number) {
                                this.getTable('isSeach')
                            }
                        }
                    } else {
                        this.$message({
                            message: response.message,
                            type: 'warning'
                        });
                    }
                    this.listLoading = false; //列表加载状态
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading = false; //列表加载状态
                })
        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }

    },
    filters: {
    }
}
</script>
<style lang="less" scoped>

</style>


