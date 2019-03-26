<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getTable('isseach')">
            <el-form-item label="当前页:" prop="page" v-show="false">
                <el-input v-model="params.page"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="limit" v-show="false">
                <el-input v-model="params.limit"></el-input>
            </el-form-item>
            <el-form-item label="用户ID" prop="userId">
                <el-input v-model="params.userId" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" prop="name">
                <el-input v-model="params.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" icon="el-icon-search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="el-icon-setting" size="medium" @click="resetForm('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <el-button-group>
                <el-button type="primary" size="medium" icon="el-icon-refresh" @click="$refs.multipleTable.clearSelection();getTable();">刷新</el-button>
                <el-button type="primary" size="medium" @click="download">导出</el-button>
            </el-button-group>
        </div>
        <!-- 列表 -->
        <div class="filter-container">
            <el-table ref="multipleTable" :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="70">
                    <template slot-scope="scope">
                        {{(params.page-1)*params.limit+parseInt(scope.$index) + 1}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户id">
                    <template slot-scope="scope">
                        {{scope.row.userId}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户姓名">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码" width="120">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="账户总额">
                    <template slot-scope="scope">
                        {{scope.row.totalAmount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="可用余额">
                    <template slot-scope="scope">
                        {{scope.row.balance}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="冻结金额">
                    <template slot-scope="scope">
                        {{scope.row.freezeAmount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总充值到账金额">
                    <template slot-scope="scope">
                        {{scope.row.totalRechargeAmount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总充值手续费">
                    <template slot-scope="scope">
                        {{scope.row.rechargeFee}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总提现到账金额">
                    <template slot-scope="scope">
                        {{scope.row.totalWithdrawAmount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总提现手续费">
                    <template slot-scope="scope">
                        {{scope.row.withdrawFee}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总返现收益">
                    <template slot-scope="scope">
                        {{scope.row.totalIncome}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总支出返现">
                    <template slot-scope="scope">
                        {{scope.row.totalExpenditure}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="on_off(scope.row, 'withdrawSwitch', 0)" v-if="scope.row.withdrawSwitch == 1">禁止提现</el-button>
                        <el-button type="primary" size="mini" @click="on_off(scope.row,'withdrawSwitch', 1)" v-else>开启提现</el-button>
                        <el-button size="mini" @click="on_off(scope.row, 'rechargeSwitch', 0)" v-if="scope.row.rechargeSwitch  == 1">禁止充值</el-button>
                        <el-button type="primary" size="mini" @click="on_off(scope.row, 'rechargeSwitch', 1)" v-else>开启充值</el-button>
                        <el-button size="mini" @click="on_off(scope.row, 'shopSwitch', 0)" v-if="scope.row.shopSwitch  == 1">禁止购买</el-button>
                        <el-button type="primary" size="mini" @click="on_off(scope.row, 'shopSwitch', 1)" v-else>开启购买</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

    </div>
</template>
<script>
import ajax from '@utils/config';
import { parseTime } from '@src/filters';
import { downloadExecl } from '@src/common/downloadExecl';
export default {
    data() {
        return {
            listLoading: false, //表格加载
            params: { //搜索条件
                limit: 10,
                page: 1,
                userId: '',
                name: '',
                phone: ''
            },
            dataList: [], //表格list
            total: 0
        }
    },
    computed: {
    },
    created() {
        this.getTable();
    },
    mounted() {

    },
    methods: {
        //获取列表
        getTable(isSeach) {
            this.listLoading = true; //列表加载状态
            if (isSeach) {
                this.params.page = 1;
            }
            ajax({
                url: 'userfund/userinfos',
                optionParams: this.params
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.dataList = response.data.records ? response.data.records : [];
                        this.total = response.data.total;
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
        download() {
            downloadExecl({ url: 'userfund/exportInfos', input: this.params, method: 'get' })
        },
        //开关
        on_off(row, name, status) {
            let text = '';
            if (name == 'withdrawSwitch') {
                if (status == 0) {
                    text = '禁止提现';
                } else {
                    text = '开启提现';
                }
            }
            if (name == 'rechargeSwitch') {
                if (status == 0) {
                    text = '禁止充值';
                } else {
                    text = '开启充值';
                }
            }
            if (name == 'shopSwitch') {
                if (status == 0) {
                    text = '禁止购买';
                } else {
                    text = '开启购买';
                }
            }
            let obj = {
                userId: row.userId
            }
            obj[name] = status;
            this.$confirm('确定' + text + '吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ajax({
                    url: 'userfund/switch',
                    optionParams: obj
                }).put()
                    .then(response => {
                        if (response.code === 200) {
                            this.$message({
                                message: response.message,
                                type: 'success'
                            });
                            this.getTable();
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
            }).catch(() => {
            });
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.params.limit = val;
            this.params.page = 1; //从第一页开始
            this.getTable();
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.params.page = val;
            this.getTable();
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


