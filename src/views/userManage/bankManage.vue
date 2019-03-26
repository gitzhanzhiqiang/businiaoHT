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
            <el-form-item label="用户姓名" prop="idCardName">
                <el-input v-model="params.idCardName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号" prop="bankCardNo">
                <el-input v-model="params.bankCardNo" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="isMaster">
                <el-select v-model="params.isMaster" placeholder="请选择">
                    <el-option v-for="item in type" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择">
                    <el-option v-for="item in status" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="解绑类型" prop="untieType">
                <el-select v-model="params.untieType" placeholder="请选择">
                    <el-option v-for="item in unbundleType" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
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
                        {{scope.row.userId}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户姓名" width="100">
                    <template slot-scope="scope">
                        {{scope.row.idCardName}}
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
                <el-table-column align="center" label="银行卡号" width="200">
                    <template slot-scope="scope">
                        {{scope.row.bankCardNo}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型" width="100">
                    <template slot-scope="scope">
                        <span v-for="item in type" :key="item.value" v-text="item.key" v-show="item.value == scope.row.isMaster"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="绑定时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="申请解绑时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.applyUntieTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="解绑时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.untieTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="100">
                    <template slot-scope="scope">
                        <span v-for="item in status" :key="item.value" v-text="item.key" v-show="item.value == scope.row.status"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="解绑类型" width="100">
                    <template slot-scope="scope">
                        <span v-for="item in unbundleType" :key="item.value" v-text="item.key" v-show="item.value == scope.row.untieType"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="lookOver(scope.row)">查看</el-button>
                        <el-button type="primary" size="mini" @click="unbundle(scope.row, 1)" v-show="!scope.row.untieType">解绑</el-button>
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
                    <el-tab-pane label="银行卡管理" name="third">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="银行卡号" prop="bankCardNo">
                                    <el-input v-model="alertFrom.bankCardNo" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所属银行" prop="bankName">
                                    <el-input v-model="alertFrom.bankName" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="持卡人姓名" prop="name">
                                    <el-input v-model="alertFrom.name" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="银行预留手机号" prop="bankPhone">
                                    <el-input v-model="alertFrom.bankPhone" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="绑定时间" prop="bindTime">
                                    <el-input v-model="alertFrom.bindTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="申请解绑时间" prop="applyUntieTime">
                                    <el-input v-model="alertFrom.applyUntieTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="状态" prop="userName">
                                    <el-input readonly v-for="item in status" :key="item.value" :value="item.key" v-show="item.value == alertFrom.bankStatus"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="解绑时间" prop="untieTime">
                                    <el-input v-model="alertFrom.untieTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="解绑类型" prop="userName" v-if="alertFrom.untieType">
                                    <el-input readonly v-for="item in unbundleType" :key="item.value" :value="item.key" v-show="item.value == alertFrom.untieType"></el-input>
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
import { downloadExecl } from '@src/common/downloadExecl';
import { storage } from '@constants/dataStorage';
export default {
    data() {
        return {
            storage: storage,
            listLoading: false, //表格加载
            params: { //搜索条件
                limit: 10,
                page: 1,
                userId: '',
                idCardName: '',
                phone: '',
                bankCardNo: '',
                isMaster: '',
                status: '',
                untieType: '',
                orderByField: 'createTime',
                isAsc: false
            },
            type: [ //类型
                { key: '主卡', value: '1' },
                { key: '副卡', value: '2' }
            ],
            status: [ //状态
                // { key: '新建', value: '0' },
                { key: '正常', value: '1' },
                { key: '申请解绑中', value: '2' },
                { key: '解绑成功', value: '3' },
                // { key: '删除', value: '-1' }
            ],
            unbundleType: [ //解绑类型
                { key: '人工解绑', value: '1' },
                { key: '用户解绑', value: '2' },
            ],
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
            ajax({
                url: 'appuser/bankCards',
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
            downloadExecl({ url: 'appuser/exportCard', input: this.params, method: 'get' })
        },
        lookOver(row) {
            this.activeName = 'first';
            this.dialogVisible = true;
            ajax({
                url: 'appuser/details',
                optionParams: {
                    id: row.userId,
                    bankId: row.id
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
        //解绑
        unbundle(row) {
            this.$confirm('解绑后不可撤销，请核对无误后操作！', '确认解绑？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ajax({
                    url: 'appuser/untieBank',
                    optionParams: {
                        id: row.id
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


