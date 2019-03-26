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
            <el-form-item label="订单号" prop="id">
                <el-input v-model="params.id" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="用户ID" prop="userId">
                <el-input v-model="params.userId" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="订单状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择">
                    <el-option v-for="item in status" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核时间" prop="date">
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
                <el-table-column align="center" label="订单号" width="180">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="债权平台" width="85">
                    <template slot-scope="scope">
                        {{scope.row.pfName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="债转连接" width="160">
                    <template slot-scope="scope">
                        {{scope.row.link}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户ID" width="80">
                    <template slot-scope="scope">
                        {{scope.row.userId}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户姓名" width="85">
                    <template slot-scope="scope">
                        {{scope.row.userName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码" width="120">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="转让金额" width="85">
                    <template slot-scope="scope">
                        {{scope.row.amount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="折扣金额" width="85">
                    <template slot-scope="scope">
                        {{scope.row.discountAmount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="转让有效期" width="100">
                    <template slot-scope="scope">
                        {{scope.row.effDay}}
                        <span v-show="scope.row.effDay">天</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加时间" width="150">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="冻结时间" width="150">
                    <template slot-scope="scope">
                        {{scope.row.inspectTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="完成时间" width="150">
                    <template slot-scope="scope">
                        {{scope.row.completeTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单状态" width="140">
                    <template slot-scope="scope">
                        <span v-for="item in status" :key="item.value" v-text="item.key" v-show="item.value == scope.row.status"></span>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" label="审核结果">
                                                                                                                    <template slot-scope="scope">
                                                                                                                        {{scope.row.bankName}}
                                                                                                                    </template>
                                                                                                                </el-table-column>-->
                <el-table-column align="center" label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="lookOver(scope.row)">查看</el-button>
                        <el-button type="primary" size="mini" @click="lookOver(scope.row, 1)" v-show="scope.row.status == 30">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="47%">
            <el-form :rules="rules" :model="alertFrom" ref="alertFrom" label-width="155" @keyup.enter.native="submitForm('alertFrom')">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="基本信息" name="first">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="订单号" prop="id">
                                    <el-input v-model="alertFrom.id" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="债权平台" prop="pfName">
                                    <el-input v-model="alertFrom.pfName" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="转让折扣" prop="discountRate">
                                    <el-input v-model="alertFrom.discountRate" readonly>
                                        <template slot="append">折</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="转让金额" prop="amount">
                                    <el-input v-model="alertFrom.amount" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="历史年化" prop="annualRate">
                                    <el-input v-model="alertFrom.annualRate" readonly>
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="折扣金额" prop="discountAmount">
                                    <el-input v-model="alertFrom.discountAmount" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="还款方式" prop="userName">
                                    <el-input v-for="item in storage.repaymentType" :key="item.value" :value="item.key" v-show="alertFrom.repaymentType == item.value" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="债权到期日" prop="surplusPeriod">
                                    <span class="input">{{alertFrom.surplusPeriod | parseTime('{y}-{m}-{d}')}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="添加时间" prop="createTime">
                                    <el-input v-model="alertFrom.createTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="转让有效期" prop="userName">
                                    <el-input v-model="alertFrom.effDay" readonly>
                                        <template slot="append">天</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="完成/下架时间" prop="completeTime">
                                    <el-input v-model="alertFrom.completeTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否定向" prop="orientFlag">
                                    <el-input v-show="alertFrom.orientFlag == 1" value="是" readonly></el-input>
                                    <el-input v-show="alertFrom.orientFlag == 0" value="否" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="是否预付" prop="prepayFlag">
                                    <el-input v-show="alertFrom.prepayFlag == 1" value="是" readonly></el-input>
                                    <el-input v-show="alertFrom.prepayFlag == 0" value="否" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="订单状态" prop="status">
                                    <el-input v-for="item in status" :key="item.value" :value="item.key" v-show="alertFrom.status == item.value" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="债转链接" prop="createTime">
                                    <el-input v-model="alertFrom.link" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="标的类型" prop="bdType">
                                    <el-input v-for="item in bdType" :key="item.value" :value="item.key" v-show="alertFrom.bdType == item.value" readonly></el-input> 
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="还款状况" prop="repayStatus">
                                    <el-input v-for="item in repayStatusList" :key="item.value" :value="item.key" v-show="alertFrom.repayStatus == item.value" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="凭证信息" name="second">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="图片" prop="userName">
                                    <img style="width: 50%;" :src="baseUrl + alertFrom.holdConfirmImg" alt="">
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="用户信息" name="third">
                        <h3 style="text-align: center; line-height:40px;">转让人信息</h3>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="用户ID" prop="userId">
                                    <el-input v-model="alertFrom.userId" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="用户姓名" prop="userName">
                                    <el-input v-model="alertFrom.userName" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="手机号码" prop="phone">
                                    <el-input v-model="alertFrom.phone" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="QQ号" prop="qqCode">
                                    <el-input v-model="alertFrom.qqCode" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div v-if="alertFrom.holdUserId">
                            <h3 style="text-align: center; line-height:40px;">承接人信息</h3>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="用户ID">
                                        <el-input v-model="alertFrom.holdData.id" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="用户姓名">
                                        <el-input v-model="alertFrom.holdData.name" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="手机号码">
                                        <el-input v-model="alertFrom.holdData.phone" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div v-if="alertFrom.status == 32 || edit">
                    <el-row>
                        <el-form-item label="选择审核结果" prop="status1">
                            <el-select v-model="alertFrom.status1" placeholder="请选择" :disabled="!edit">
                                <el-option label="通过" value="1"></el-option>
                                <el-option label="不通过" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="alertFrom.status1 == 0">
                        <el-form-item label="审核备注" prop="msg">
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="alertFrom.msg" :readonly="!edit"></el-input>
                        </el-form-item>
                    </el-row>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="edit">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('alertFrom')" :loading="loading">确 定</el-button>
            </span>
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
            storage: storage,
            baseUrl: 'https://ygg168.oss-cn-shanghai.aliyuncs.com/debt/',
            listLoading: false, //表格加载
            loading: false, //
            params: { //搜索条件
                limit: 10,
                page: 1,
                id: '',
                userId: '',
                phone: '',
                status: '',
                date: [],
                startTime: '',
                endTime: '',
                orderByField: 'inspectTime',
                isAsc: false

            },
            status: [
                { key: '冻结审核中', value: '30' },
                { key: '冻结审核通过', value: '31' },
                { key: '冻结审核失败', value: '32' }
            ],
            bdType: [//标的类型:1、个人信用贷 2、企业贷 3、房抵 4、车贷 5、自助投标
                { key: '', value: '0' },
                { key: '个人信用贷', value: '1' },
                { key: '企业贷', value: '2' },
                { key: '房抵', value: '3' },
                { key: '车贷', value: '4' },
                { key: '自助投标', value: '5' },
            ],
            repayStatusList: [//还款状况: 1、正常还款 2、逾期还款
                { key: '', value: '0' },
                { key: '正常还款', value: '1' },
                { key: '逾期还款', value: '2' },
            ],
            dataList: [], //表格list
            total: 0,
            dialogVisible: false, // 查看
            edit: false, //是否编辑
            title: '',
            activeName: 'first',
            alertFrom: {
                status1: '',
                message: '',
                holdData: {},
            },
            rules: {
                msg: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ]
            }
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
            this.params.beginTime = parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
            this.params.endTime = parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
            ajax({
                url: 'tOrderTransfer/pageInspect',
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
            downloadExecl({ url: 'tOrderTransfer/exportInspect', input: this.params, method: 'get' })
        },
        lookOver(row, number) {
            this.activeName = 'first';
            this.dialogVisible = true;
            this.loading = false;
            this.alertFrom = {};
            this.alertFrom = JSON.parse(JSON.stringify(row));
            let status = '';
            if (number) {
                this.edit = true;
                this.title = '冻结审核';
                status = '1';
                this.alertFrom.message = '';
            } else {
                this.edit = false;
                this.title = '查看';
                if (row.status == 31) {
                    status = '1';
                } else if (row.status == 32) {
                    status = '0';
                }
            }
            this.$set(this.alertFrom, 'status1', status);
            this.$set(this.alertFrom, 'holdData', {}) //承接人对象
            this.$nextTick(() => {
                this.$refs['alertFrom'].clearValidate();
            })
            if (!row.holdUserId) { //没有承接人
                return false;
            }
            this.getHoldData(row);// 获取承接人
        },
        // 获取承接人
        getHoldData(row) {
            ajax({
                url: 'appuser/simpleUserInfo/' + row.holdUserId,
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        let data = response.data ? response.data : {};
                        this.alertFrom.holdData = data;
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
        //弹框提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    ajax({
                        url: 'tOrderTransfer/inspect',
                        optionParams: {
                            orderTranId: this.alertFrom.id,
                            status: this.alertFrom.status1,
                            msg: this.alertFrom.msg
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message({
                                    message: response.message,
                                    type: 'success'
                                });
                                this.dialogVisible = false;
                                this.getTable();
                            } else {
                                this.$message({
                                    message: response.message,
                                    type: 'warning'
                                });
                                this.loading = false;
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false;
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
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


