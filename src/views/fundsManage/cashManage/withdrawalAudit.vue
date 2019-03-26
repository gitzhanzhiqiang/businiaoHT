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
            <el-form-item label="用户姓名" prop="userName">
                <el-input v-model="params.userName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="申请时间" prop="date">
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
                <el-button type="primary" size="medium" icon="el-icon-refresh" @click="getTable()">刷新</el-button>
                <el-button type="primary" size="medium" @click="batchReview">批量审核</el-button>
            </el-button-group>
        </div>
        <!-- 列表 -->
        <div class="filter-container">
            <el-table ref="multipleTable" :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
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
                        {{scope.row.userName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码" width="120">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="提现金额" width="100">
                    <template slot-scope="scope">
                        {{scope.row.amount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="到账金额" width="100">
                    <template slot-scope="scope">
                        {{scope.row.actualAmount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手续费" width="100">
                    <template slot-scope="scope">
                        {{scope.row.feeAmount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="银行账号">
                    <template slot-scope="scope">
                        {{scope.row.bankCardNo}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易流水">
                    <template slot-scope="scope">
                        {{scope.row.requestNo}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="申请时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="审核状态" width="100">
                    <template slot-scope="scope">
                        <span v-text="item.key" v-for="item in storage.verifyFlag" :key="item.value" v-show="item.value == scope.row.verifyFlag"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="audit(scope.row, 1)" v-show="scope.row.verifyFlag == 0">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="title" :visible.sync="dialogVisible" width="45%">
            <el-form :model="alertFrom" :rules="rules" ref="alertFrom" label-width="139" @keyup.enter.native="submitForm('alertFrom')">
                <div v-if="title == '提现审核'">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="提现金额" prop="amount">
                                <el-input v-model="alertFrom.amount" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="提现手续费" prop="feeAmount">
                                <el-input v-model="alertFrom.feeAmount" readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="实际到账金额" prop="actualAmount">
                                <el-input v-model="alertFrom.actualAmount" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="提现银行" prop="bank">
                                <el-input v-model="alertFrom.bank" readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="userName">
                                <el-input v-model="alertFrom.userName" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="提现卡号" prop="bankCardNo">
                                <el-input v-model="alertFrom.bankCardNo" readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-row>
                    <el-form-item label="选择审核结果" prop="verifyFlag">
                        <el-select v-model="alertFrom.verifyFlag" placeholder="请选择">
                            <el-option label="通过" value="1"></el-option>
                            <el-option label="不通过" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row v-if="alertFrom.verifyFlag == 2">
                    <el-form-item label="审核备注" prop="verifyRemark">
                        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="alertFrom.verifyRemark"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
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
export default {
    data() {
        return {
            storage: storage,
            listLoading: false, //表格加载
            loading: false, //二次提交
            params: { //搜索条件
                verifyFlag: '0',
                limit: 10,
                page: 1,
                userId: '',
                userName: '',
                phone: '',
                date: [],
                beginTime: '',
                endTime: '',
                orderByField: 'createTime',
                isAsc: false

            },
            dataList: [], //表格list
            total: 0,
            title: '',
            multipleSelection: [], //复选框选中的
            dialogVisible: false, // 查看
            alertFrom: {
                verifyFlag: '1',
                ids: [],
                verifyRemark: ''
            },
            rules: {
                verifyRemark: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ]
            }
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {
        this.getTable();
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
            this.$refs.multipleTable.clearSelection(); //取消复选框选中
            this.multipleSelection = []; //清空
            ajax({
                url: 'acUserWithdraw/page',
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
        //批量审核
        batchReview() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请选择表格用户',
                    type: 'warning'
                });
                return false;
            }
            this.dialogVisible = true;
            this.loading = false;
            this.title = '批量提现审核';
            this.$nextTick(() => {
                this.resetForm('alertFrom');
                this.alertFrom = {
                    verifyFlag: '1',
                    verifyRemark: ''
                }
            })
        },
        //多选框选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //审核
        audit(row) {
            this.title = '提现审核'
            this.$refs.multipleTable.clearSelection(); //取消复选框选中
            this.multipleSelection = []; //清空
            this.dialogVisible = true;
            this.loading = false;
            this.alertFrom = JSON.parse(JSON.stringify(row));
            this.multipleSelection.push(row);
            this.$nextTick(() => {
                this.resetForm('alertFrom');
                this.alertFrom.verifyFlag = '1';
                this.alertFrom.verifyRemark = '';
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let ids = [];
                    this.multipleSelection.map((item) => {
                        ids.push(item.id)
                    })
                    ajax({
                        url: 'acUserWithdraw/inspect',
                        optionParams: {
                            verifyFlag: this.alertFrom.verifyFlag,
                            verifyRemark: this.alertFrom.verifyRemark,
                            ids: ids
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
                                this.loading = false
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false
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


