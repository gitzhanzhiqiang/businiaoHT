<template>
    <div class="app-container calendar-list-container ggg_user">
        <div class="content">
            <el-row>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <p>
                            <span>总充值到账金额</span>
                        </p>
                        <p>
                            <span>{{data.totalAmount}}</span>
                        </p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <p>
                            <span>总充值手续费金额</span>
                        </p>
                        <p>
                            <span>{{data.totalFee}}</span>
                        </p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <p>
                            <span>昨日充值到账金额</span>
                        </p>
                        <p>
                            <span>{{data.yesterdayAmount}}</span>
                        </p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <p>
                            <span>昨日充值手续费金额</span>
                        </p>
                        <p>
                            <span>{{data.yesterdayFee}}</span>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
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
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="充值来源" prop="source">
                <el-select v-model="params.source" placeholder="请选择">
                    <el-option v-for="item in storage.source" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择">
                    <el-option v-for="item in status" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
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
                <el-table-column align="center" label="用户ID" width="100">
                    <template slot-scope="scope">
                        {{scope.row.userId}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户姓名" width="100">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充值金额" width="100">
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
                <el-table-column align="center" label="充值方式" width="100">
                    <template slot-scope="scope">
                        <span v-for="item in type" :key="item.value" v-text="item.key" v-show="item.value == scope.row.type"></span>
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
                <el-table-column align="center" label="完成时间">
                    <template slot-scope="scope">
                        {{scope.row.modifiedTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充值卡号">
                    <template slot-scope="scope">
                        {{scope.row.bankCardNo}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充值来源" width="90">
                    <template slot-scope="scope">
                        <span v-for="item in storage.source" :key="item.value" v-text="item.key" v-show="item.value == scope.row.source"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="100">
                    <template slot-scope="scope">
                        <span v-for="item in status" :key="item.value" v-text="item.key" v-show="item.value == scope.row.status"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="alertFrom = scope.row;dialogVisible = true;">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- 查看 -->
        <el-dialog title="充值查看" :visible.sync="dialogVisible" width="47%">
            <el-form :model="alertFrom" ref="alertFrom" label-width="100">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="用户ID" prop="userId">
                                    <el-input  v-model="alertFrom.userId" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="用户姓名" prop="name">
                                    <el-input  v-model="alertFrom.name" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="手机号码" prop="phone">
                                    <el-input  v-model="alertFrom.phone" readonly>
                                        
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="充值金额" prop="amount">
                                    <el-input  v-model="alertFrom.amount" readonly>
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="到账金额" prop="actualAmount">
                                    <el-input  v-model="alertFrom.actualAmount" readonly>
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="手续费" prop="feeAmount">
                                    <el-input  v-model="alertFrom.feeAmount" readonly>
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="充值方式" prop="userName">
                                    <el-input  v-for="item in type" :key="item.value" v-model="item.key" v-show="item.value == alertFrom.type" readonly></el-input>
                                    <!-- <span v-for="item in type" :key="item.value" v-text="item.key" v-show="item.value == alertFrom.type"></span> -->
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="交易流水" prop="requestNo">
                                    <el-input  v-model="alertFrom.requestNo" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="充值卡号" prop="bankCardNo">
                                    <el-input  v-model="alertFrom.bankCardNo" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所属银行" prop="bank">
                                    <el-input  v-model="alertFrom.bank" readonly>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-if="alertFrom.status === 3">
                            <el-col :span="12">
                                <el-form-item label="失败原因" prop="completeTime">
                                    <el-input  v-model="alertFrom.verifyRemark" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                            </el-col>
                        </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
            data: '', //统计
            listLoading: false, //表格加载
            params: { //搜索条件
                limit: 10,
                page: 1,
                userId: '',
                phone: '',
                source: '',
                status: '',
                date: [],
                startTime: '',
                endTime: '',
                orderByField: 'createTime',
                isAsc: false

            },
            status: [
                { key: '未充值', value: '0' },
                { key: '充值中', value: '1' },
                { key: '充值成功', value: '2' },
                { key: '充值失败', value: '3' }
            ],
            //充值方式
            type: [
                { key: '网银充值', value: '1' },
                { key: '快捷充值', value: '2' },
                { key: 'APP充值', value: '3' }
            ],
            dataList: [true, 1, 2], //表格list
            total: 0,
            dialogVisible: false,
            alertFrom: {},//查看详情
        }
    },
    computed: {
    },
    created() {
        this.getData();
        this.getTable();
    },
    mounted() {

    },
    methods: {
        getData() {
            ajax({
                url: 'userfund/totalCountRecharge',
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        this.data = response.data ? response.data : '';
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
                url: 'userfund/rechargeRecord',
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
            downloadExecl({ url: 'userfund/exportRechargeRecords', input: this.params, method: 'get' })
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

.content {
    padding: 0 30px;
    margin-bottom: 30px;
}
</style>


