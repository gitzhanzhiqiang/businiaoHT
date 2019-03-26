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
            <el-form-item label="用户姓名" prop="userName">
                <el-input v-model="params.id" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="用户ID" prop="userId">
                <el-input v-model="params.userId" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入"></el-input>
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
                <el-table-column align="center" label="QQ" width="120">
                    <template slot-scope="scope">
                        {{scope.row.qqCode}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码" width="120">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="邮箱" width="180">
                    <template slot-scope="scope">
                        {{scope.row.mail}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="投资平台个数" width="120">
                    <template slot-scope="scope">
                        {{scope.row.platformCount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="待收标的个数" width="120">
                    <template slot-scope="scope">
                        {{scope.row.bdCount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="待收总金额（元）">
                    <template slot-scope="scope">
                        {{scope.row.baseAmountTotal}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="注册时间" width="150">
                    <template slot-scope="scope">
                        {{scope.row.regeditTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加时间" width="150">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="getDownloadList(scope.row.userId,2);userId = scope.row.userId;dialogVisible = true;">查看附件</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="查看附件" :visible.sync="dialogVisible" width="47%">
            <el-form ref="alertFrom" label-width="155">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="协议合同" name="first">
                        <div style="margin-bottom:20px;">
                            <!-- <el-button type="primary" size="medium" @click="importFile()">导出</el-button> -->
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="其他资料" name="second">
                        <div style="margin-bottom:20px;">
                            <!-- <el-button type="primary" size="medium" @click="importFile()">导出</el-button> -->
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div style="width:100%;" v-if="downloadList.length">

                    <div v-for="(item,index) in downloadList" :key="index" style="margin-right:20px;width:30%;float:left;cursor:pointer;" @click="openUrl(item.link)">
                        <div v-if="item.fileName.indexOf('png')!=-1||item.fileName.indexOf('jpg')!=-1||item.fileName.indexOf('jpeg')!=-1">
                            <img :src="item.link" alt="" width="110" height="94">
                        </div>
                        <div v-if="item.fileName.indexOf('pdf')!=-1">
                            <img src="https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/s%3D220/sign=0582163f3a12b31bc36cca2bb6183674/54fbb2fb43166d2239459fec452309f79052d29c.jpg" alt="" width="110" height="94">
                            
                        </div>
                        <div>{{item.fileName}}</div>
                        <!-- <a download="图片" :href="item.link" target="_blank">{{item.fileName}}</a> -->
                    </div>
                </div>
                <div style="width:100%;" v-if="!downloadList.length">
                    暂无上传的附件
                </div>
                <div>
                </div>
            </el-form>
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
            listLoading: false, //表格加载
            baseUrl: 'https://ygg168.oss-cn-shanghai.aliyuncs.com/debt/',
            loading: false, //二次提交
            params: { //搜索条件
                limit: 10,
                page: 1,
                id: '',
                userId: null,
                phone: '',
                userName: '',
                date: [],
                beginTime: '',
                endTime: '',
                orderByField: 'createTime',
                isAsc: false

            },
            userId: '',
            dataList: [], //表格list
            total: 0,
            dialogVisible: false, // 查看
            activeName: 'first',
            downloadList: [],
            downloadParams: {
                url: '',
                fileName: ''
            },
            rules: {
                message: [
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
                url: 'userInvokeProtect/pageGroupUser',
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
            downloadExecl({ url: 'userInvokeProtect/export', input: this.params, method: 'get' })
        },
        // 查看附件
        getDownloadList(val, val1) {
            let url
            if (val1 === 1) {
                url = 'userInvokeProtect/documents/' + val + '?other=' + '其他附件';
            } else {
                url = 'userInvokeProtect/documents/' + val + '?contract=' + '合同附件';
            }
            ajax({
                url: url,
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        if (val1 === 1) {
                            this.downloadList = response.data.other
                        }
                        if (val1 === 2) {
                            this.downloadList = response.data.contract
                        }
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
        //
        openUrl(val) {
            window.open(val)
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
        handleClick(tab, event) {
            if (tab.name == 'second') { //合同
                this.getDownloadList(this.userId, 1)

            } else if (tab.name == 'first') { //其他
                this.getDownloadList(this.userId, 2)
            }
        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //点击下载
        clickDownload() {
            console.log(1112);
        },
        //导出
        importFile() {
            console.log(1111);
            let that = this;
            this.downloadList.forEach((item, index) => {
                // that.downloadParams.url = item.link;
                // that.downloadParams.fileName = item.fileName;
                // that.clickDownload();
                var alink = document.createElement("a");
                alink.href = item.link;
                // alink.href = "@res/img/icon-message.png";
                alink.setAttribute('download', '图片');
                // alink.download = item.fileName; //图片名
                alink.click();
            })
        },
        get64(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                console.log(reader.result);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        },
        getBase64() {
            var file = new File("https://ygg168.oss-cn-shanghai.aliyuncs.com/activit/2057/201811281002499565.pdf", "r");
            this.get64(file);
        }
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>

</style>


