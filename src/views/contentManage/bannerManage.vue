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
            <el-form-item label="Banner标题" prop="title">
                <el-input v-model="params.title" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="展示端" prop="subtitle">
                <el-select v-model="params.subtitle" placeholder="请选择">
                    <el-option v-for="item in subtitle" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结束时间" prop="date">
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
                <el-table-column align="center" label="Banner标题">
                    <template slot-scope="scope">
                        {{scope.row.title}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="Banner" width="100">
                    <template slot-scope="scope">
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">
                                <img :src="scope.row.img" alt="">
                            </div>
                            <el-button size="mini">查看</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="Banner描述" width="150">
                    <template slot-scope="scope">
                        {{scope.row.remark}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="展示端" width="80">
                    <template slot-scope="scope">
                        <span v-for="item in subtitle" :key="item.value" v-text="item.key" v-show="item.value == scope.row.subtitle"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="排序" width="80">
                    <template slot-scope="scope">
                        {{scope.row.sort}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="跳转路径">
                    <template slot-scope="scope">
                        {{scope.row.rewriteUrl}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="开始时间">
                    <template slot-scope="scope">
                        {{scope.row.effTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="结束时间">
                    <template slot-scope="scope">
                        {{scope.row.expTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="仅渠道可见" width="100">
                    <template slot-scope="scope">
                        <span v-for="item in channelOnly" :key="item.value" v-text="item.key" v-show="item.value == scope.row.channelOnly"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editData(scope.row)">编辑</el-button>
                        <el-button type="primary" size="mini" @click="deleteData(scope.row)">删除</el-button>
                        <el-button type="primary" size="mini" @click="on_off(scope.row)" v-if="scope.row.status == 2">开启</el-button>
                        <el-button size="mini" @click="on_off(scope.row)" v-else>禁用</el-button>
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
                        <el-form-item label="Banner标题" prop="title">
                            <el-input v-model="alertFrom.title"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="展示端" prop="subtitle">
                            <el-select v-model="alertFrom.subtitle" placeholder="请选择">
                                <el-option v-for="item in subtitle" :key="item.value" :label="item.key" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="跳转路径" prop="rewriteUrl">
                            <el-input v-model="alertFrom.rewriteUrl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序" prop="sort">
                            <el-input v-model="alertFrom.sort" :maxlength="3" @keyup.native="formatIntegery($event, 'alertFrom','userName1')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="Banner描述" prop="remark">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="alertFrom.remark"></el-input>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="仅渠道可见" prop="channelOnly">
                            <el-select v-model="alertFrom.channelOnly" placeholder="请选择" @change="channelOnlyChange">
                                <el-option v-for="item in channelOnly" :key="item.value" :label="item.key" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="可见渠道" prop="channelId" v-if="alertFrom.channelOnly == 1">
                            <el-select v-model="alertFrom.channelId" placeholder="请选择" :disabled="alertFrom.channelOnly == 0">
                                <el-option v-for="item in channel" :key="item.value" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="Banner类型" prop="type">
                            <el-select v-model="alertFrom.type" placeholder="请选择">
                                <el-option label="首页" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="时间范围" prop="date">
                            <el-date-picker style="width: 230px;" v-model="alertFrom.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="Banner图" prop="img">
                    <!--<el-input v-show="false" v-model="rowData.coverImage" placeholder="请输入"></el-input>-->
                    <upLoadimg :isOne="true" :dialogVisible="dialogVisible" :imgShow="alertFrom.img" v-on:successLoad="(value)=> successLoad(value, 'alertFrom', 'img')" v-on:handleRemove="(value)=> handleRemove(value, 'alertFrom', 'img')"></upLoadimg>
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
                title: '',
                subtitle: '',
                date: [],
                startTime: '',
                endTime: ''

            },
            subtitle: [
                { key: 'PC', value: 1 },
                { key: 'H5', value: 2 },
                { key: 'APP', value: 3 }
            ],
            channelOnly: [
                { key: '是', value: 1 },
                { key: '否', value: 0 }
            ],
            dataList: [], //表格list
            total: 0,
            title: '',
            dialogVisible: false, // 查看
            channel: [], //渠道
            alertFrom: {},
            rules: {
                title: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                subtitle: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                rewriteUrl: [
                    // { required: true, message: '请选择', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                channelOnly: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                channelId: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                date: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                // img: [
                //     { required: true, message: '请选择', trigger: 'blur' },
                // ],
            }
        }
    },
    computed: {
    },
    created() {
        this.getTable();
        this.getChannel();
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
            ajax({
                url: 'tBanner/findPageList',
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
        //获取列表
        getChannel(isSeach) {
            ajax({
                url: 'tChannel/page',
                optionParams: {
                    page: 1,
                    limit: 999
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.channel = response.data.records ? response.data.records : [];
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
        editData(row) {
            this.dialogVisible = true;
            this.loading = false;
            if (row) {
                this.title = '编辑Banner';
                this.alertFrom = JSON.parse(JSON.stringify(row));
                this.$set(this.alertFrom, 'date', [new Date(this.alertFrom.effTime), new Date(this.alertFrom.expTime)])
            } else {
                this.title = '添加Banner';
                this.alertFrom = {
                    title: '',
                    subtitle: '',
                    rewriteUrl: '',
                    sort: '',
                    remark: '',
                    channelOnly: 1,
                    type: 1,
                    channelId: '',
                    date: []
                };
                this.alertFrom.sort = this.total * 1 + 1;
            }
            this.$nextTick(() => {
                this.$refs['alertFrom'].clearValidate();
            })
        },
        //可见渠道
        channelOnlyChange(value) {
            if (value == 0) {
                this.alertFrom.channelId = '';
            }
        },
        submitFrom(formName) {
            console.log(this.alertFrom.img)
            if(this.alertFrom.img == "" || this.alertFrom.img == undefined){
                this.$message({
                    message: '请选择图片',
                    type: 'warning'
                });
                return false
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let url = '';
                    let method = '';
                    if (this.title == '编辑Banner') {
                        url = 'tBanner/edit';
                    } else {
                        url = 'tBanner/new';
                    }
                    this.alertFrom.effTime = parseTime(this.alertFrom.date[0], '{y}-{m}-{d} {h}:{i}:{s}');
                    this.alertFrom.expTime = parseTime(this.alertFrom.date[1], '{y}-{m}-{d} {h}:{i}:{s}');
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
        //开启
        on_off(row) {
            let text = '';
            if (row.status == 2) {
                text = '开启';
            } else {
                text = '禁用'
            }
            this.$confirm('确认' + text + '吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ajax({
                    url: 'tBanner/modifyStatus',
                    optionParams: {
                        id: row.id,
                        status: row.status == 2 ? 1 : 2
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
        //删除
        deleteData(row) {
            this.$confirm('删除后不可撤销，请核对无误后操作！', '确认删除？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ajax({
                    url: 'tBanner/del',
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
            console.log(url)
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
.el-tooltip__popper {
    img {
        width: 100px;
        height: 100px;
    }
}
</style>


