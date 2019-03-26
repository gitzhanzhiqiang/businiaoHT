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
            <el-form-item label="网贷平台名称" prop="name">
                <el-input v-model="params.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择">
                    <el-option v-for="item in status" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间" prop="date">
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
                <el-button type="primary" size="medium" @click="editData()">添加平台</el-button>
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
                <el-table-column align="center" label="网贷平台名称">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="APPlogo">
                    <template slot-scope="scope">
                        <img style="width:100px;height: 20px;" :src="scope.row.logo" alt="">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="PClogo">
                    <template slot-scope="scope">
                        <img style="width:100px;height: 20px;" :src="scope.row.logoApp" alt="">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <span v-for="item in status" :key="item.value" v-text="item.key" v-show="item.value == scope.row.status"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="更新时间">
                    <template slot-scope="scope">
                        {{scope.row.modifiedTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editData(scope.row)">编辑</el-button>
                        <el-button type="primary" size="mini" @click="deleteData(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" class="autoAlert">
            <el-form :rules="rules" :model="alertFrom" ref="alertFrom" label-width="155" @keyup.enter.native="submitFrom('alertFrom')">
                <el-form-item label="平台名称" prop="name">
                    <el-input v-model="alertFrom.name"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="alertFrom.status" placeholder="请选择">
                        <el-option v-for="item in status" :key="item.value" :label="item.key" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="域名" prop="dnsUrl">
                    <el-input v-model="alertFrom.dnsUrl" placeholder="请输入（多个域名用；隔开）"></el-input>
                </el-form-item>
                <el-form-item label="APP图片" prop="logo">
                    <!--<el-input v-show="true" v-model="alertFrom.logoApp" placeholder="请输入"></el-input>-->
                    <upLoadimg :isOne="true" :dialogVisible="dialogVisible" :imgShow="alertFrom.logo" v-on:successLoad="(value)=> successLoad(value, 'alertFrom', 'logo')" v-on:handleRemove="(value)=> handleRemove(value, 'alertFrom', 'logo')"></upLoadimg>
                </el-form-item>
                <el-form-item label="PC图片" prop="logoApp">
                    <!--<el-input v-show="true" v-model="alertFrom.logo" placeholder="请输入"></el-input>-->
                    <upLoadimg :isOne="true" :dialogVisible="dialogVisible" :imgShow="alertFrom.logoApp" v-on:successLoad="(value)=> successLoad(value, 'alertFrom', 'logoApp')" v-on:handleRemove="(value)=> handleRemove(value, 'alertFrom', 'logoApp')"></upLoadimg>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitFrom('alertFrom')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { parseTime } from '@src/filters';
import { storage } from '@constants/dataStorage';
import upLoadimg from '@src/components/upLoadimg1';
import { Common } from '@src/common/common';
export default {
    components: {
        upLoadimg
    },
    data() {
        return {
            storage: storage,
            listLoading: false, //表格加载
            loading: false,
            params: { //搜索条件
                limit: 10,
                page: 1,
                name: '',
                status: '',
                date: [],
                startTime: '',
                endTime: '',
                orderByField: 'createTime',
                isAsc: false

            },
            status: [
                { key: '可用', value: 1 },
                { key: '禁用', value: 2 },
            ],
            dataList: [], //表格list
            total: 0,
            title: '',
            dialogVisible: false, // 查看
            alertFrom: {},
            rules: {
                name: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                dnsUrl: [
                    // { required: true, message: '请输入', trigger: 'blur' }
                ],
                logoApp: [
                    { required: true, message: '请上传', trigger: 'blur' },
                ],
                logo: [
                    { required: true, message: '请上传', trigger: 'blur' },
                ],
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
            this.params.startTime = parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
            this.params.endTime = parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
            console.log(this.params)
            ajax({
                url: 'sysPlatform/page',
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
        editData(row) {
            this.dialogVisible = true;
            this.loading = false;
            if (row) {
                this.title = '编辑平台';
                this.alertFrom = JSON.parse(JSON.stringify(row));
            } else {
                this.title = '添加平台';
                this.alertFrom = {
                    name: '',
                    logo: '',
                    logoApp: '',
                    status: ''
                };
            }
            this.$nextTick(() => {
                this.$refs['alertFrom'].clearValidate();
            })
        },
        //删除
        deleteData(row) {
            this.$confirm('删除后不可撤销，请核对无误后操作！', '确认删除？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ajax({
                    url: 'sysPlatform/del',
                    optionParams: {
                        id: row.id
                    }
                }).post()
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
        //上传成功
        successLoad(url, firstName, twoName) {
            this[firstName][twoName] = url;
        },
        //删除
        handleRemove(url, firstName, twoName) {
            if (url == this[firstName][twoName]) {
                this[firstName][twoName] = '';
            }
        },
        //格式化整数
        formatIntegery(e, firstName, twoNameName) {
            let obj = {
                input: e
            }
            this[firstName][twoNameName] = Common.positiveIntegerMoney(obj); //表单赋值
        },
        submitFrom(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let url = '';
                    let method = '';
                    if (this.title == '编辑平台') {
                        url = 'sysPlatform/edit';
                    } else {
                        url = 'sysPlatform/new';
                    }
                    ajax({
                        url: url,
                        optionParams: this.alertFrom
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


