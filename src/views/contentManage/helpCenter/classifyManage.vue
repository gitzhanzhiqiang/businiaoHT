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
            <el-form-item label="分类名称" prop="tipsTypeId1">
                <el-cascader :show-all-levels="false" :options="theCategory" :props="selectBind" v-model="params.tipsTypeId1"></el-cascader>
            </el-form-item>
            <el-form-item label="更新时间" prop="date">
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
                <el-button type="primary" size="medium" @click="editData()">添加分类</el-button>
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
                <el-table-column align="center" label="分类名称">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="排序">
                    <template slot-scope="scope">
                        {{scope.row.sort}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="图标">
                    <template slot-scope="scope">
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">
                                <img :src="scope.row.iconUrl" alt="">
                            </div>
                            <el-button size="mini">查看</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分类描述">
                    <template slot-scope="scope">
                        {{scope.row.description}}
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
        <el-dialog :title="title" :visible.sync="dialogVisible" width="47%" class="autoAlert">
            <el-form :rules="rules" :model="alertFrom" ref="alertFrom" label-width="155" @keyup.enter.native="submitFrom('alertFrom')">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="分类名称" prop="name">
                            <el-input v-model="alertFrom.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="父级分类" prop="parentId1">
                            <el-cascader :show-all-levels="true" :change-on-select="true" :options="theCategory" :props="selectBind" v-model="alertFrom.parentId1"></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="排序数值" prop="sort">
                    <el-input v-model="alertFrom.sort" :maxlength="3" @keyup.native="formatIntegery($event, 'alertFrom','userName1')"></el-input>
                </el-form-item>
                <el-row>
                    <el-form-item label="分类描述" prop="description">
                        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="alertFrom.description"></el-input>
                    </el-form-item>
                </el-row>
                <el-form-item label="上传图标" prop="iconUrl">
                    <!--<el-input v-model="alertFrom.iconUrl" placeholder="请输入"></el-input>-->
                    <upLoadimg :isOne="true" :dialogVisible="dialogVisible" :imgShow="alertFrom.iconUrl" v-on:successLoad="(value)=> successLoad(value, 'alertFrom', 'iconUrl')" v-on:handleRemove="(value)=> handleRemove(value, 'alertFrom', 'iconUrl')"></upLoadimg>
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
                id: '',
                name: '',
                tipsTypeId1: [],
                date: [],
                startTime: '',
                endTime: ''

            },
            dataList: [], //表格list
            total: 0,
            title: '',
            dialogVisible: false, // 查看
            alertFrom: {},
            rules: {
                name: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                sort: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                iconUrl: [
                    { required: true, message: '上传', trigger: 'blur' },
                ],
            },
            theCategory: [], //分类
            selectBind: {
                value: 'id',
                label: 'name'
            },
            arr: []
        }
    },
    computed: {
    },
    created() {
        this.getTable();
        this.getTheCategory();
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
            this.params.id = this.params.tipsTypeId1[this.params.tipsTypeId1.length * 1 - 1]
            ajax({
                url: 'sysTips/type/list',
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
        //获取分类
        getTheCategory() {
            ajax({
                url: 'sysTips/types',
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        let data = response.data ? response.data : {};
                        this.theCategory = [data];
                        this.processingData(this.theCategory);
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
        //处理数据
        processingData(data) {
            data.map((item) => {
                if (item.children.length == 0) {
                    this.$delete(item, 'children')
                } else {
                    this.processingData(item.children);
                }
            })

        },
        editData(row) {
            this.dialogVisible = true;
            this.loading = false;
            if (row) {
                this.title = '编辑分类';
                this.alertFrom = JSON.parse(JSON.stringify(row));
                this.processingTableData(this.theCategory, this.alertFrom.id, [])
                this.$set(this.alertFrom, 'parentId1', this.arr);
            } else {
                this.title = '添加分类';
                this.alertFrom = {
                    name: '',
                    parentId: '',
                    parentId1: [],
                    sort: '',
                    description: '',
                    iconUrl: '',
                };
                this.alertFrom.sort = parseInt(this.total) + 1;
            }
            this.$nextTick(() => {
                this.$refs['alertFrom'].clearValidate();
            })
        },
        //表格数据处理
        processingTableData(data, id, array) {
            data.map((item) => {
                let arr = array;
                if (item.id == id) {
                    // arr.push(item.id);
                    this.arr = arr;
                } else {
                    if (item.children) {
                        this.processingTableData(item.children, id, [...arr, item.id]) //数组单独提出来
                    }
                }
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
                    url: 'sysTips/type/del',
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
            console.log(this[firstName])
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
                    if (this.title == '编辑分类') {
                        url = 'sysTips/type/edit';
                        method = 'put';
                    } else {
                        url = 'sysTips/type/new';
                        method = 'post';
                    }
                    this.alertFrom.parentId =  this.alertFrom.parentId1[this.alertFrom.parentId1.length-1]
                    ajax({
                        url: url,
                        optionParams: this.alertFrom
                    })[method]()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message({
                                    message: response.message,
                                    type: 'success'
                                });
                                this.dialogVisible = false;
                                this.getTheCategory();
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
<style lang="less">
.el-tooltip__popper {
    img {
        width: 100px;
        height: 100px;
    }
}
</style>


