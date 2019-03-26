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
            <el-form-item label="用户ID" prop="id">
                <el-input v-model="params.id" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" prop="name">
                <el-input v-model="params.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="注册来源" prop="source">
                <el-select v-model="params.source" placeholder="请选择">
                    <el-option v-for="item in storage.source" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择">
                    <el-option v-for="item in storage.userStatus" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="注册时间" prop="date">
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
                <el-button type="primary" size="medium" @click="download">导出</el-button>
            </el-button-group>
        </div>
        <!-- 列表 -->
        <div class="filter-container">
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="70">
                    <template slot-scope="scope">
                        {{(params.page-1)*params.limit+parseInt(scope.$index) + 1}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户ID" width="100">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户姓名" width="100">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="身份证号" width="200">
                    <template slot-scope="scope">
                        {{scope.row.idCardNo}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码" width="200">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="注册来源" width="100">
                    <template slot-scope="scope">
                        <span v-for="item in storage.source" :key="item.value" v-text="item.key" v-show="item.value == scope.row.source"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="注册时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="最后登录时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.lastLoginTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户状态" width="100">
                    <template slot-scope="scope">
                        <span v-for="item in storage.userStatus" :key="item.value" v-text="item.key" v-show="item.value == scope.row.status"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="lookOver(scope.row)">查看</el-button>
                        <el-button type="primary" size="mini" v-if="scope.row.status == 1" @click="forbidden(scope.row)">禁用</el-button>
                        <el-button size="mini" @click="forbidden(scope.row)" v-else>解禁</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog title="查看" :visible.sync="dialogVisible" width="45%">
            <el-form :model="alertFrom" ref="alertFrom" label-width="139">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="用户管理" name="first">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="用户ID" prop="id">
                                    <el-input v-model="alertFrom.id" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="手机号码" prop="phone">
                                    <el-input v-model="alertFrom.phone" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="真实姓名" prop="name">
                                    <el-input v-model="alertFrom.name" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="身份证号" prop="idCardNo">
                                    <el-input v-model="alertFrom.idCardNo" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="注册ip" prop="ip">
                                    <el-input v-model="alertFrom.ip" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="注册时间" prop="createTime">
                                    <el-input v-model="alertFrom.createTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="最后登录ip" prop="lastLoginIp">
                                    <el-input v-model="alertFrom.lastLoginIp" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="最后登录时间" prop="lastLoginTime">
                                    <el-input v-model="alertFrom.lastLoginTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="状态" prop="status">
                                    <el-input readonly v-for="item in storage.userStatus" :key="item.value" :value="item.key" v-show="alertFrom.status == item.value"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="注册来源" prop="source">
                                    <el-input readonly v-for="item in storage.source" :key="item.value" :value="item.key" v-show="alertFrom.source == item.value"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="资金信息" name="second">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="可用余额（元）" prop="balance">
                                    <el-input v-model="alertFrom.balance" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="冻结金额（元）" prop="freezeAmount">
                                    <el-input v-model="alertFrom.freezeAmount" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="总充值金额（元）" prop="totalRechargeAmount">
                                    <el-input v-model="alertFrom.totalRechargeAmount" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="总提现金额（元）" prop="totalWithdrawAmount">
                                    <el-input v-model="alertFrom.totalWithdrawAmount" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="总充值手续费（元）" prop="rechargeFee">
                                    <el-input v-model="alertFrom.rechargeFee" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="总提现手续费（元）" prop="withdrawFee">
                                    <el-input v-model="alertFrom.withdrawFee" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="总返现收益（元）" prop="totalIncome">
                                    <el-input v-model="alertFrom.totalIncome" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="总支出返现（元）" prop="totalExpenditure">
                                    <el-input v-model="alertFrom.totalExpenditure" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="账户总额（元）" prop="totalAmount">
                                    <el-input v-model="alertFrom.totalAmount" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-dialog>
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
            listLoading: false, //表格加载
            storage: storage,
            params: { //搜索条件
                limit: 10,
                page: 1,
                id: '',
                phone: '',
                name: '',
                source: '', //客户端
                status: '', //状态
                date: '',
                startTime: '',
                endTime: '',
                orderByField: 'createTime',
                isAsc: false
            },
            dataList: [], //表格list
            total: 0,
            dialogVisible: false, // 查看
            activeName: 'first',
            alertFrom: {}
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
            let date = this.params.date ? this.params.date : []; //时间控件清除为null
            this.params.startTime = parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
            this.params.endTime = parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
            console.log(this.params)
            ajax({
                url: 'appuser/list',
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
            downloadExecl({ url: 'appuser/export', input: this.params, method: 'get' })
        },
        lookOver(row) {
            this.activeName = 'first';
            this.dialogVisible = true;
            ajax({
                url: 'appuser/details',
                optionParams: {
                    id: row.id
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.alertFrom = response.data ? response.data : {};
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
        },
        //禁用
        forbidden(row) {
            let text = row.status == 1 ? '禁用' : '解禁';
            this.$confirm('确定' + text + '吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ajax({
                    url: 'appuser/status',
                    optionParams: {
                        id: row.id,
                        status: row.status == 1 ? 2 : 1
                    }
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
                        this.listLoading = false; //列表加载状态
                    })
                    .catch(error => {
                        console.log(error);
                        this.listLoading = false; //列表加载状态
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


