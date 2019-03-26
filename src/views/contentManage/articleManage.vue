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
            <el-form-item label="问题" prop="userName">
                <el-input v-model="params.userName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="value">
                <el-select v-model="params.value" placeholder="请选择">
                    <el-option v-for="item in status" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
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
                <el-button type="primary" size="medium" @click="editData()">添加文章</el-button>
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
                <el-table-column align="center" label="文章标题">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属分类">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="更新时间">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="250">
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
        <el-dialog :title="title" :visible.sync="dialogVisible" class="autoAlert">
            <el-form :rules="rules" :model="alertFrom" ref="alertFrom" label-width="100" @keyup.enter.native="submitFrom('alertFrom')">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="文章标题" prop="userName">
                            <el-input v-model="alertFrom.userName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属栏目" prop="value">
                            <el-select v-model="alertFrom.value" placeholder="请选择">
                                <el-option label="pc端" value="32"></el-option>
                                <el-option label="移动端" value="32"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="是否推荐" prop="value">
                            <el-select v-model="alertFrom.value" placeholder="请选择">
                                <el-option label="是" value="32"></el-option>
                                <el-option label="否" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否置顶" prop="value">
                            <el-select v-model="alertFrom.value" placeholder="请选择">
                                <el-option label="是" value="32"></el-option>
                                <el-option label="否" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="文章简介" prop="userName">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="alertFrom.userName"></el-input>
                </el-form-item>
                <el-form-item label="封面图" prop="coverImage">
                    <!--<el-input v-show="false" v-model="rowData.coverImage" placeholder="请输入"></el-input>-->
                    <upLoadimg :isOne="true" :dialogVisible="dialogVisible" :imgShow="alertFrom.coverImage" v-on:successLoad="(value)=> successLoad(value, 'alertFrom', 'coverImage')" v-on:handleRemove="(value)=> handleRemove(value, 'alertFrom', 'coverImage')"></upLoadimg>
                </el-form-item>
                <el-form-item label="SEO标题" prop="userName1">
                    <el-input v-model="alertFrom.userName1"></el-input>
                </el-form-item>
                <el-form-item label="封面图描述" prop="userName2">
                    <el-input v-model="alertFrom.userName2"></el-input>
                </el-form-item>
                <el-form-item label="SEO关键词" prop="userName3">
                    <el-input v-model="alertFrom.userName3"></el-input>
                </el-form-item>
                <el-form-item label="SEO描述" prop="userName4">
                    <el-input v-model="alertFrom.userName4"></el-input>
                </el-form-item>
                <el-form-item label="活动简介" prop="content" class="weditor_width">
                    <!--<el-input v-model="rowData.content" placeholder="请输入"></el-input>-->
                    <weditor v-bind:editorName="'subjectEditorName'" :isAlert="true" v-on:listenWEditorChange="(value) =>wEditorChange(value, 'alertFrom', 'content')" v-model="alertFrom.content" style="width:60%;" ref="post_body"></weditor>
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
import weditor from '@src/components/WEditor/WEditor';
export default {
    components: {
        upLoadimg,
        weditor
    },
    data() {
        return {
            storage: storage,
            listLoading: false, //表格加载
            loading: false,
            params: { //搜索条件
                limit: 10,
                page: 1,
                userName: '',
                value: '',
                value1: '',
                date: [],
                startTime: '',
                endTime: ''

            },
            status: [
                { key: '冻结中', value: '1' },
                { key: '审核结束', value: '2' },
            ],
            dataList: [], //表格list
            total: 0,
            title: '',
            dialogVisible: false, // 查看
            alertFrom: {
                value: '',
                coverImage: ''
                // https://img.zhaogu168.com/jmlc/infoimg/202809/201810091756325528.png
            },
            rules: {
                userName: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                value: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                coverImage: [
                    { required: true, message: '请选择', trigger: 'blur' },
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
                url: 'product/findPageList',
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
            console.log(row)
            if (row) {
                this.title = '编辑文章';
            } else {
                this.title = '添加文章';
                this.alertFrom = {};
            }
            this.dialogVisible = true;
            this.loading = false;
            this.$nextTick(() => {
                this.$refs['alertFrom'].clearValidate();
            })
            // ajax({
            //     url: 'product/findPageList',
            //     optionParams: row.id
            // }).post()
            //     .then(response => {
            //         if (response.code === 200) {
            //             this.alertFrom = response.data ? response.data : {};
            //         } else {
            //             this.$message({
            //                 message: response.message,
            //                 type: 'warning'
            //             });
            //         }
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     })
        },
        //删除
        deleteData(row) {
            this.$confirm('删除后不可撤销，请核对无误后操作！', '确认删除？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

            }).catch(() => {
            });
        },
        //上传成功
        successLoad(url, firstName, twoName) {
            console.log(url)
            this[firstName][twoName] = url;
        },
        //删除
        handleRemove(url, firstName, twoName) {
            if (url == this[firstName][twoName]) {
                this[firstName][twoName] = '';
            }
        },
        //复文本
        wEditorChange(html, firstName, twoName) {
            this[firstName][twoName] = html;
            console.log(html)
        },
        submitFrom(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
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


