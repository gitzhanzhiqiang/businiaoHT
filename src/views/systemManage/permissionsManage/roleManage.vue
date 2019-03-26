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
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="params.roleName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="del_flag">
                <el-select v-model="params.del_flag" placeholder="请选择">
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
                <el-button type="primary" size="medium" @click="editData()">添加角色</el-button>
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
                <el-table-column align="center" label="角色名称">
                    <template slot-scope="scope">
                        {{scope.row.roleName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="角色描述">
                    <template slot-scope="scope">
                        {{scope.row.roleDesc}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        {{scope.row.delFlag|delFlagFilters}}
                        <!--<span v-for="item in status" :key="item.value" v-text="item.key" v-show="item.value == 2"></span>-->
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editData(scope.row)">编辑</el-button>
                        <el-button type="primary" size="mini" @click="permissions(scope.row)">权限</el-button>
                        <el-button type="primary" size="mini" @click="look_over(scope.row)">用户组员</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination background @size-change="(value)=> handleSizeChange(value, 'params', 'getTable')" @current-change="(value)=> handleCurrentPageChange(value, 'params', 'getTable')" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" class="autoAlert">
            <el-form :rules="rules" :model="alertFrom" ref="alertFrom" label-width="100" @keyup.enter.native="submitFrom('alertFrom')">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="alertFrom.roleName"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="delFlag">
                    <el-select v-model="alertFrom.delFlag" placeholder="请选择">
                        <el-option v-for="item in status" :key="item.value" :label="item.key" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input type="textarea" :rows="8" placeholder="请输入" v-model="alertFrom.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitFrom('alertFrom',title)" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="权限配置" :visible.sync="dialogVisible1" width="30%" class="autoAlert">
            <el-tree ref="tree" :data="listInfo" show-checkbox node-key="id" :props="defaultProps" default-expand-all>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="SubmitPermissions('alertFrom1')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="查看用户" :visible.sync="dialogVisible2">
            <el-table ref="multipleTable" :data="dataList1" v-loading="listLoading1" border fit highlight-current-row style="width: 100%">
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
                <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                        {{scope.row.realName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属部门">
                    <template slot-scope="scope">
                        {{scope.row.deptName}}
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div v-if="total1" class="pagination-container">
                <el-pagination background @size-change="(value) => handleSizeChange(value, 'params1', 'getAlertTable')" @current-change="(value) =>handleCurrentPageChange(value, 'params1', 'getAlertTable')" :current-page.sync="params1.page" :page-sizes="[10,20,30, 50]" :page-size="params1.limit" layout="total, sizes, prev, pager, next, jumper" :total="total1">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { parseTime } from '@src/filters';
import { storage } from '@constants/dataStorage';
export default {
    components: {
    },
    data() {
        return {
            storage: storage,
            listLoading: false, //表格加载
            loading: false,
            params: { //搜索条件
                limit: 10,
                page: 1,
                roleName: null,//角色名称
                del_flag: null,//状态
                date: [],
                orderByField: 'createTime',
                isAsc: false
            },
            dataList: [], //表格list
            total: 0,
            status: [
                { key: '可用', value: '0' },
                { key: '禁用', value: '1' }
            ],
            title: '',
            dialogVisible: false, // 查看
            alertFrom: {},
            rules: {
                roleDesc: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                roleName: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                delFlag: [
                    { required: true, message: '请输入', trigger: 'change' },
                ],
            },
            dialogVisible1: false, //权限
            listInfo: [], //树形
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            dialogVisible2: false, //查看
            dataList1: [], //表格list
            total1: 0,
            listLoading1: false, //表格加载
            params1: { //搜索条件
                limit: 10,
                page: 1,
            },
            roleId: '' //角色id保存
        }
    },
    computed: {
    },
    created() {
        this.getTable();
        this.getMenuList();
    },
    mounted() {

    },
    methods: {
        //获取菜单
        getMenuList() {
            ajax({
                url: 'auth/menuTree',
            }).fetch()
                .then(res => {
                    this.listInfo = res.data ? res.data : [];
                })
                .catch(error => {
                    console.log(error)
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
            console.log(this.params);
            ajax({
                url: 'sysUserRole/rolePage',
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
            this.$nextTick(() => {
                this.$refs['alertFrom'].clearValidate();
            });
            if (row) {
                this.alertFrom = JSON.parse(JSON.stringify(row));
                this.title = '编辑角色';
                this.alertFrom = row;
            } else {
                this.title = '添加角色';
                this.alertFrom = {
                    roleDesc: '',
                    roleId: '',
                    roleName: '',
                    delFlag: '',
                    menuIds: []
                };
            }
        },
        //提交
        submitFrom(formName, title) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let method;
                    if (title == '编辑角色') {
                        method = 'put'
                    } else {
                        method = 'post'
                    }
                    ajax({
                        url: 'sysUserRole',
                        optionParams: this.alertFrom
                    })[method]()
                        .then(response => {
                            console.log('response ==', response)
                            if (response.code === 200) {
                                this.$message.success(response.message);
                                this.dialogVisible = false;
                                this.getTable()
                            } else {
                                this.loading = false;
                                this.$message.warning(response.message)
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
        //权限
        permissions(row) {
            this.dialogVisible1 = true;
            this.loading = false;
            this.roleId = row.roleId;
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(row.menuIds);
            })
        },
        //提交权限
        SubmitPermissions() {
            let tree = this.$refs.tree.getCheckedKeys();
            if (tree.length == 0) {
                this.$message({
                    message: '至少选择一项',
                    type: 'warning'
                });
                return false;
            }
            let nodes = this.$refs.tree.getHalfCheckedKeys().concat(tree); //获取版选择 新版api修改了， 获娶不到父级
            this.loading = true;
            ajax({
                url: 'sysUserRole/roleMenuUpd',
                optionParams: {
                    menuIds: nodes,
                    roleId: this.roleId
                }
            }).put()
                .then(response => {
                    if (response.code === 200) {
                        this.$message.success(response.message);
                        this.dialogVisible1 = false;
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
                });
        },
        //查看
        look_over(row) {
            this.dialogVisible2 = true;
            this.params1.page = 1;
            this.params1.roleId = row.roleId;
            this.getAlertTable();
        },
        //获取列表
        getAlertTable(isSeach) {
            this.listLoading1 = true; //列表加载状态
            if (isSeach) {
                this.params1.page = 1;
            }
            ajax({
                url: 'sysUser/page',
                optionParams: this.params1
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.dataList1 = response.data.records ? response.data.records : [];
                        this.total1 = response.data.total;
                    } else {
                        this.$message({
                            message: response.message,
                            type: 'warning'
                        });
                    }
                    this.listLoading1 = false; //列表加载状态
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading1 = false; //列表加载状态
                })
        },
        // 改变每一页的条数
        handleSizeChange(val, name, fn) {
            this[name].limit = val;
            this[name].page = 1; //从第一页开始
            this[fn]();
        },
        // 切换页码
        handleCurrentPageChange(val, name, fn) {
            this[name].page = val;
            this[fn]();
        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }

    },
    filters: {
        delFlagFilters(val) {
            let value = parseInt(val);
            if (value == 0) {
                return '可用'
            } else if (value == 1) {
                return '禁用';
            } else {
                return "异常"
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>
