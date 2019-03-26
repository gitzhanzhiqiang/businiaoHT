<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getTable('isseach')">
            <el-form-item label="当前页:" prop="limit" v-show="false">
                <el-input v-model="params.limit"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="page" v-show="false">
                <el-input v-model="params.page"></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="username">
                <el-input v-model="params.username" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="工号" prop="jobNumber">
                <el-input v-model="params.jobNumber" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="deptName">
                <el-input v-model="params.deptName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-select v-model="params.roleId" placeholder="请选择">
                    <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
                </el-select>
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
                <el-button type="primary" size="medium" @click="editData()">添加用户</el-button>
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
                <el-table-column align="center" label="登录名">
                    <template slot-scope="scope">
                        {{scope.row.username}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="真实姓名">
                    <template slot-scope="scope">
                        {{scope.row.realName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="工号">
                    <template slot-scope="scope">
                        {{scope.row.jobNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属部门">
                    <template slot-scope="scope">
                        {{scope.row.deptName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="角色名称">
                    <template slot-scope="scope">
                        <span v-for="(i,index) in scope.row.roleList">
                            <span v-text="i.roleName"></span>
                            <span v-show="scope.row.roleList.length - 1 != index">、</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <span v-for="item in status" :key="item.value" v-text="item.key" v-show="item.value == scope.row.status"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editData(scope.row, 1)">查看</el-button>
                        <el-button type="primary" size="mini" @click="editData(scope.row, 2)">编辑</el-button>
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
                        <el-form-item label="登录名称" prop="username">
                            <el-input v-model="alertFrom.username" :readonly="title == '查看用户'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录密码" prop="password" v-if="title == '添加用户'">
                            <el-input v-model="alertFrom.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所属角色" prop="role">
                            <el-select v-model="alertFrom.role" multiple placeholder="请选择" :disabled="title == '查看用户'">
                                <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属部门" prop="deptName">
                            <el-input v-model="alertFrom.deptName" :readonly="title == '查看用户'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="真实姓名" prop="realName">
                            <el-input v-model="alertFrom.realName" :readonly="title == '查看用户'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工号" prop="jobNumber">
                            <el-input v-model="alertFrom.jobNumber" :readonly="title == '查看用户'" @keyup.native="formatIntegery($event, 'alertFrom','jobNumber')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="手机" prop="phone">
                            <el-input v-model="alertFrom.phone" :readonly="title == '查看用户'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="mail">
                            <el-input v-model="alertFrom.mail" :readonly="title == '查看用户'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                            <el-input v-if="title == '查看用户'" :value="alertFrom.status" readonly></el-input>
                            <el-select v-else v-model="alertFrom.status" placeholder="请选择">
                                <el-option v-for="item in status" :key="item.value" :label="item.key" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="alertFrom.sex" placeholder="请选择" :disabled="title == '查看用户'">
                                <el-option v-for="item in sexData" :key="item.value" :label="item.key" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" :rows="3" placeholder="请输入" v-model="alertFrom.remark" :readonly="title == '查看用户'"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="title != '查看用户'">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitFrom('alertFrom',title)" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { parseTime } from '@src/filters';
import { storage } from '@constants/dataStorage';
import { Common } from '@src/common/common';
import { validate } from '@src/utils/validation';
export default {
    components: {
    },
    data() {
        var phone = (rule, value, callback) => {
            if (!validate.validatPhone(value)) {
                callback(new Error('手机号号码格式不正确'));
                return false;
            }
            callback();
        };
        var email = (rule, value, callback) => {
            if (!value) {
                callback();
                return false;
            }
            if (!validate.validaEmail(value)) {
                callback(new Error('邮箱格式不正确'));
                return false;
            }
            callback();
        };
        return {
            storage: storage,
            listLoading: false, //表格加载
            loading: false,
            params: { //搜索条件
                limit: 10,
                page: 1,
                username: '',
                jobNumber: '',
                deptName: '',
                roleId: '',
                status: null,
                date: [],
                beginTime: '',
                endTime: ''
            },
            status: [
                { key: '可用', value: '1' },
                { key: '禁用', value: '0' }
            ],
            sexData: [
                { key: '男', value: 1 },
                { key: '女', value: 0 }
            ],
            dataList: [], //表格list
            total: 0,
            title: '',
            dialogVisible: false, // 查看
            roleList: [], //角色
            alertFrom: {},
            rules: {
                username: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                jobNumber: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                role: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入', trigger: 'blur' },
                    { validator: phone, trigger: 'blur' }
                ],
                mail: [
                    { validator: email, trigger: 'blur' }
                ],
                realName: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                delFlag: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请输入', trigger: 'change' },
                ],
                sex: [
                    { required: true, message: '请输入', trigger: 'change' },
                ],
            }
        }
    },
    computed: {
    },
    created() {
        this.getTable();
        this.getroleData();
    },
    mounted() {

    },
    methods: {
        getroleData() {
            ajax({
                url: 'sysUserRole/rolePage',
                optionParams: {
                    limit: 999,
                    page: 1,
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.roleList = response.data.records ? response.data.records : [];
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
            this.params.beginTime = parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
            this.params.endTime = parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
            ajax({
                url: 'sysUser/page',
                optionParams: this.params
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.dataList = response.data.records ? response.data.records : [];
                        // this.roleList = this.dataList.roleList[0] ? this.dataList.roleList[0] : []
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
        editData(row, number) {
            this.dialogVisible = true;
            this.loading = false;
            this.$nextTick(() => {
                this.$refs['alertFrom'].clearValidate();
            });
            if (row) {
                this.alertFrom = JSON.parse(JSON.stringify(row));
                let role = [];
                this.alertFrom.roleList.map((item) => {
                    role.push(item.roleId)
                });
                this.$set(this.alertFrom, 'role', role);
                if (number == 1) {
                    this.title = '查看用户'
                } else {
                    this.title = '编辑用户';
                }
            } else {
                this.title = '添加用户';
                this.alertFrom = {
                    delFlag: '',
                    mail: '',
                    password: '',
                    phone: '',
                    realName: '',
                    status: '',
                    username: '',
                    userId: '',
                    sex: null,
                    deptName: '',//部门名称
                    jobNumber: '',//部门id
                    role: [] //角色集合
                };
            }
        },
        //格式化整数
        formatIntegery(e, firstName, twoNameName) {
            let obj = {
                input: e
            }
            this[firstName][twoNameName] = Common.positiveIntegerMoney(obj); //表单赋值
        },
        submitFrom(formName, title) {

            // /sysUser
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.alertFrom.deptId)
                    this.loading = true;
                    let url = 'sysUser';
                    let method = '';
                    if (this.title == '编辑用户') {
                        method = 'put';
                    } else {
                        method = 'post';
                    }
                    ajax({
                        url: url,
                        optionParams: this.alertFrom
                    })[method]()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message);
                                this.dialogVisible = false;
                                this.getTable();
                            } else {
                                this.$message.warning(response.message);
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
