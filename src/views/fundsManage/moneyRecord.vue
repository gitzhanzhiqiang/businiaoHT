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
            <el-form-item label="交易类型" prop="revenueExpendType">
                <el-select v-model="params.revenueExpendType" placeholder="请选择">
                    <el-option v-for="item in storage.tradeType" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
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
                <el-table-column align="center" label="手机号码" width="120">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="流水编号">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易流水">
                    <template slot-scope="scope">
                        {{scope.row.requestNo}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="到账金额" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.revenueExpendType == 2">{{scope.row.amount*1 - scope.row.feeAmount*1}}</span>
                        <span v-else>{{scope.row.amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作金额" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.revenueExpendType == 2">{{scope.row.amount}}</span>
                         <span v-else-if="scope.row.revenueExpendType == 6">{{scope.row.amount}}</span>
                        <span v-else>{{Number(scope.row.amount*100 + scope.row.feeAmount*100).toFixed(2)/100}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手续费" width="100">
                    <template slot-scope="scope">
                        {{scope.row.feeAmount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易类型" width="120">
                    <template slot-scope="scope">
                        <span v-for="item in storage.tradeType" :key="item.value" v-text="item.key" v-show="item.value == scope.row.revenueExpendType"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易内容">
                    <template slot-scope="scope">
                        {{scope.row.remark}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作时间" width="150">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="可用金额" width="100">
                    <template slot-scope="scope">
                        {{scope.row.currentTotalAmount}}
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" label="冻结金额">
                                        <template slot-scope="scope">
                                            {{scope.row.bankName}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" label="净资产">
                                        <template slot-scope="scope">
                                            {{scope.row.bankName}}
                                        </template>
                                    </el-table-column>-->
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
import { storage } from '@constants/dataStorage';
import { downloadExecl } from '@src/common/downloadExecl';
export default {
    data() {
        return {
            storage: storage,
            listLoading: false, //表格加载
            params: { //搜索条件
                limit: 10,
                page: 1,
                userId: '',
                name: '',
                phone: '',
                revenueExpendType: '',
                orderByField: 'createTime',
                isAsc: false
            },
            dataList: [], //表格list
            total: 0
        }
    },
    computed: {
    },
    created() {
        this.getTable();
        console.log(11111+32222);
        console.log((3).toFixed(2));
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
            console.log(this.params)
            ajax({
                url: 'userfund/record',
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
            downloadExecl({ url: 'userfund/exportRecord', input: this.params, method: 'get' })
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


