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
            <el-form-item label="订单号" prop="id">
                <el-input v-model="params.id" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="用户ID" prop="userId">
                <el-input v-model="params.userId" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="订单状态" prop="status">
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
                <el-table-column align="center" label="订单号" width="180">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="债权平台" width="85">
                    <template slot-scope="scope">
                        {{scope.row.pfName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="债转连接" width="160">
                    <template slot-scope="scope">
                        {{scope.row.link}}
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
                <el-table-column align="center" label="手机号码" width="120">
                    <template slot-scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="转让金额" width="85">
                    <template slot-scope="scope">
                        {{scope.row.amount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="折扣金额" width="85">
                    <template slot-scope="scope">
                        {{scope.row.discountAmount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="转让有效期" width="100">
                    <template slot-scope="scope">
                        {{scope.row.effDay}}
                        <span v-if="scope.row.effDay">天</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加时间" width="150">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="承接时间" width="150">
                    <template slot-scope="scope">
                        {{scope.row.holdTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="完成/下架时间" width="150">
                    <template slot-scope="scope">
                        {{scope.row.completeTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单状态" width="140">
                    <template slot-scope="scope">
                        <span v-for="item in status" :key="item.value" v-text="item.key" v-show="item.value == scope.row.status"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="lookOver(scope.row)">编辑</el-button>
                        <el-button type="primary" size="mini" @click="lookOver(scope.row, 1)" v-show="scope.row.status > 10 && scope.row.status < 20 || scope.row.status == 0">下架</el-button>
                        <el-button type="primary" size="mini" @click="lookOver(scope.row, 2)" v-show="scope.row.status ===4||scope.row.status ===41&&scope.row.reCallLimit!=0">上架</el-button>
                        <el-button v-if="scope.row.status === 11" type="primary" size="mini" @click="lookOver(scope.row,3)">延长付款</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination background @size-change="(value)=> handleSizeChange(value, 'params', 'getTable')" @current-change="(value)=> handleCurrentPageChange(value, 'params', 'getTable')" :current-page.sync="params.page" :page-sizes="[10,20,30, 50]" :page-size="params.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="47%">
            <el-form :model="alertFrom" :rules="rules" ref="alertFrom" label-width="155">
                <el-tabs v-model="active" @tab-click="handleClick">
                    <el-tab-pane label="基本信息" name="first">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="订单号">
                                    <el-input v-model="alertFrom.id" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="债权平台" prop="pfName" v-if="title=='编辑债权'">
                                    <el-input v-model="alertFrom.pfName"></el-input>
                                </el-form-item>
                                <el-form-item label="债权平台" prop="" v-else>
                                    <el-input v-model="alertFrom.pfName" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="转让折扣">
                                    <el-input v-model="alertFrom.discountRate" readonly>
                                        <template slot="append">折</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="转让金额">
                                    <el-input v-model="alertFrom.amount" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="历史年化">
                                    <el-input v-model="alertFrom.annualRate" readonly>
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="折扣金额">
                                    <el-input v-model="alertFrom.discountAmount" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="还款方式">
                                    <el-input v-for="item in storage.repaymentType" :key="item.value" :value="item.key" v-show="alertFrom.repaymentType == item.value" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="债权到期日">
                                    <span class="input">{{alertFrom.surplusPeriod | parseTime('{y}-{m}-{d}')}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="添加时间">
                                    <el-input v-model="alertFrom.createTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="转让有效期">
                                    <el-input v-model="alertFrom.effDay" readonly>
                                        <template slot="append">天</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="完成/下架时间">
                                    <el-input v-model="alertFrom.completeTime" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否定向">
                                    <el-input v-show="alertFrom.orientFlag == 1" value="是" readonly></el-input>
                                    <el-input v-show="alertFrom.orientFlag == 0" value="否" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="是否预付">
                                    <el-input v-show="alertFrom.prepayFlag == 1" value="是" readonly></el-input>
                                    <el-input v-show="alertFrom.prepayFlag == 0" value="否" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="订单状态">
                                    <el-input v-for="item in status" :key="item.value" :value="item.key" v-show="alertFrom.status == item.value" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="债转链接">
                                    <el-input v-model="alertFrom.link" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="标的类型" prop="bdType">
                                    <el-input v-for="item in bdType" :key="item.value" :value="item.key" v-show="alertFrom.bdType == item.value" readonly></el-input> 
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="还款状况" prop="repayStatus">
                                    <el-input v-for="item in repayStatusList" :key="item.value" :value="item.key" v-show="alertFrom.repayStatus == item.value" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="节点信息" name="second">
                        <div class="filter-container">
                            <el-table ref="multipleTable" :data="alertFrom.nodes" v-loading="listLoading1" border fit highlight-current-row style="width: 100%">
                                <el-table-column align="center" label="序号" width="70">
                                    <template slot-scope="scope">
                                        {{(params1.page-1)*params1.limit+parseInt(scope.$index) + 1}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="发生时间">
                                    <template slot-scope="scope">
                                        {{scope.row.createTime}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="当前操作超时时间" width="160">
                                    <template slot-scope="scope">
                                        {{scope.row.deadLine}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="订单状态">
                                    <template slot-scope="scope">
                                        <span v-for="item in orderTranStatus" v-text="item.key" v-show="scope.row.status== item.value"></span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="备注">
                                    <template slot-scope="scope">
                                        {{scope.row.msg}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!--分页-->
                        <div v-if="total1" class="pagination-container" style="margin-bottom:40px;">
                            <el-pagination background @size-change="(value)=> handleSizeChange(value, 'params1', 'getNode')" @current-change="(value)=> handleCurrentPageChange(value, 'params1', 'getNode')" :current-page.sync="params1.page" :page-sizes="[10,20,30, 50]" :page-size="params1.limit" layout="total, sizes, prev, pager, next, jumper" :total="total1">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="用户信息" name="third">
                        <h3 style="text-align: center; line-height:40px;">转让人信息</h3>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="用户ID">
                                    <el-input v-model="alertFrom.userId" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="用户姓名">
                                    <el-input v-model="alertFrom.userName" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="手机号码">
                                    <el-input v-model="alertFrom.phone" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="QQ号" prop="qqCode">
                                    <el-input v-model="alertFrom.qqCode" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div v-if="alertFrom.holdUserId">
                            <h3 style="text-align: center; line-height:40px;">承接人信息</h3>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="用户ID">
                                        <el-input v-model="alertFrom.holdData.id" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="用户姓名">
                                        <el-input v-model="alertFrom.holdData.name" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="手机号码">
                                        <el-input v-model="alertFrom.holdData.phone" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="人工介入" name="fourth" v-if="title == '编辑债权'&&artificialIsshow">
                        <div  v-if="artificialData.undercarriage">
                        <h3 style="text-align: center; line-height:40px;">下架</h3>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="操作人员">
                                    <el-input v-model="artificialData.undercarriage.opUserName" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="下架原因">
                                    <el-select v-model="artificialData.undercarriage.msg" placeholder="请选择" disabled>
                                        <el-option v-for="item in cause" :key="item.value" :label="item.value" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col>
                                <el-form-item label="备注">
                                    <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="artificialData.undercarriage.remark" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        </div>
                        <div v-if="artificialData.grounding">
                            <h3 style="text-align: center; line-height:40px;">上架</h3>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="操作人员">
                                        <el-input v-model="artificialData.grounding.opUserName" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="上架原因">
                                        <el-select v-model="artificialData.grounding.msg" placeholder="请选择" disabled>
                                            <el-option v-for="item in undercarriageReason" :key="item.value" :label="item.value" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col>
                                    <el-form-item label="备注">
                                        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="artificialData.grounding.remark" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-if="artificialData.delay">
                            <h3 style="text-align: center; line-height:40px;">延长付款</h3>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="操作人员">
                                        <el-input v-model="artificialData.delay.opUserName" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="延长原因">
                                        <el-select v-model="artificialData.delay.msg" placeholder="请选择" disabled>
                                            <el-option v-for="item in delayReason" :key="item.value" :label="item.value" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col>
                                    <el-form-item label="备注">
                                        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="artificialData.delay.remark" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <!-- 下架债权 -->
                <div v-if="title == '下架债权'">
                    <el-row>
                        <el-form-item label="下架原因" prop="inInformationdData.msg">
                            <el-select v-model="alertFrom.inInformationdData.msg" placeholder="请选择" style="width:100%;">
                                <el-option v-for="item in cause" :key="item.value" :label="item.value" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="备注" prop="inInformationdData.remark">
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="alertFrom.inInformationdData.remark"></el-input>
                        </el-form-item>
                    </el-row>
                </div>
                <!-- 上架债权 -->
                <div v-if="title == '上架债权'">
                    <el-row>
                        <el-form-item label="上架原因" prop="undercarriageData.msg">
                            <el-select v-model="alertFrom.undercarriageData.msg" placeholder="请选择" style="width:100%;">
                                <el-option v-for="item in undercarriageReason" :key="item.value" :label="item.value" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="备注" prop="undercarriageData.remark">
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="alertFrom.undercarriageData.remark"></el-input>
                        </el-form-item>
                    </el-row>
                </div>
                <!-- 延长付款 -->
                <div v-if="title == '延长付款'">
                    <el-row>
                        <el-form-item label="延长原因" prop="delayData.msg">
                            <el-select v-model="alertFrom.delayData.msg" placeholder="请选择" style="width:100%;">
                                <el-option v-for="item in delayReason" :key="item.value" :label="item.value" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="延长时长" prop="delayData.extendTime">
                            <el-select v-model="alertFrom.delayData.extendTime" placeholder="请选择" style="width:100%;">
                                <el-option v-for="(item,index) in 24" :value="item" :key="index">
                                    {{item}}小时
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="备注" prop="delayData.remark">
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="alertFrom.delayData.remark"></el-input>
                        </el-form-item>
                    </el-row>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="active === 'first'||title != '编辑债权'">
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
import { downloadExecl } from '@src/common/downloadExecl';
export default {
    data() {
        return {
            storage: storage,
            listLoading: false, //表格加载
            params: { //搜索条件
                limit: 10,
                page: 1,
                id: '',
                userId: '',
                phone: '',
                status: '',
                date: [],
                beginTime: '',
                endTime: '',
                orderByField: 'createTime',
                isAsc: false

            },
            status: [
                { key: '上架中', value: '0' },
                { key: '预付款未到账', value: '-1' },
                { key: '锁定中', value: '1' },
                { key: '已转让（已承接）', value: '2' },
                { key: '已申诉', value: '3' },
                { key: '已下架', value: '4' },
                { key: '冻结审核 （已转让）', value: '5' },
                { key: '待转让人支付', value: '11' },
                { key: '等待承接人上传凭证', value: '12' },
                { key: '待转让人确认转账至承接人', value: '13' },
                { key: '转让成功', value: '15' },
                { key: '订单转让金到账中', value: '16' },
                { key: '申诉中', value: '20' },
                { key: '申诉成功', value: '21' },
                { key: '申诉失败', value: '22' },
                { key: '冻结审核中', value: '30' },
                { key: '冻结审核通过', value: '31' },
                { key: '冻结审核失败', value: '32' },
                { key: '订单支付时间延长', value: '60' }
            ],
            orderTranStatus: [
                { key: '上架中', value: '0' },
                { key: '预付款未到账', value: '-1' },
                { key: '待转让人支付', value: '11' },
                { key: '等待承接人上传凭证', value: '12' },
                { key: '待转让人确认转账至承接人', value: '13' },
                { key: '转让人延长付款中', value: '14' },
                { key: '转让成功', value: '15' },
                { key: '订单转让金到账中', value: '16' },
                { key: '申诉成功', value: '21' },
                { key: '申诉失败', value: '22' },
                { key: '冻结审核中', value: '30' },
                { key: '冻结审核通过', value: '31' },
                { key: '冻结审核失败', value: '32' },
                { key: '下架成功', value: '41' },
                { key: '订单支付时间延长', value: '60' },
                { key: '申诉中', value: '20' },

            ],
            bdType: [//标的类型:1、个人信用贷 2、企业贷 3、房抵 4、车贷 5、自助投标
                { key: '', value: '0' },
                { key: '个人信用贷', value: '1' },
                { key: '企业贷', value: '2' },
                { key: '房抵', value: '3' },
                { key: '车贷', value: '4' },
                { key: '自助投标', value: '5' },
            ],
            repayStatusList: [//还款状况: 1、正常还款 2、逾期还款
                { key: '', value: '0' },
                { key: '正常还款', value: '1' },
                { key: '逾期还款', value: '2' },
            ],
            dataList: [], //表格list
            total: 0,
            title: '',
            dialogVisible: false,
            active: 'first',
            listLoading1: false,
            params1: {
                limit: 10,
                page: 1,
            },
            soldOut: false,
            total1: 0,
            alertFrom: {
                nodes: [],
                holdData: {},
                inInformationdData: {},
                delayData: {},
                undercarriageData:{
                    msg:'',
                    orderTranId:'',
                    remark:'',
                }
            },
            loading: false,
            rules: {
                pfName: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                'inInformationdData.msg': [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                // 'inInformationdData.remark': [
                //     { required: true, message: '请输入', trigger: 'blur' },
                // ],
                'delayData.msg': [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                'delayData.extendTime': [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                'undercarriageData.msg': [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],

            },
            cause: [ //下架原因
                { value: '链接不符' },
                { value: '内容与实际债权不符' },
                { value: '其他' }
            ],
            delayReason: [//延长支付原因
                { value: '转让人未绑卡'},
                { value: '其他' }
            ],
            undercarriageReason: [//上架原因
                { value: '承接人不违约导致订单下架'},
                { value: '其他' }
            ],
            artificialData: {
            },
            artificialIsshow: false,
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
                url: 'tOrderTransfer/page',
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
            downloadExecl({ url: 'tOrderTransfer/export', input: this.params, method: 'get' })
        },
        lookOver(row, number) {
            if (number===1) {
                this.title = '下架债权';
                this.soldOut = false;
            } else if(number===2) {
                this.title = '上架债权';
                this.soldOut = false;
            } else if(number===3) {
                this.title = '延长付款';
                this.soldOut = false;
            } else {
                this.title = '编辑债权';
                this.soldOut = true;
            }
            this.loading = false;
            this.dialogVisible = true;
            this.alertFrom = JSON.parse(JSON.stringify(row));
            this.$set(this.alertFrom, 'nodes', []);
            this.active = 'first';
            this.params1.orderTranId = this.alertFrom.id;
            this.$set(this.alertFrom, 'holdData', {}) //承接人对象
            this.$set(this.alertFrom, 'inInformationdData', {}) //介入信息
            // this.$set(this.alertFrom.inInformationdData, 'msg', '') //原因
            this.$set(this.alertFrom, 'delayData', {}) //延长支付
            this.$set(this.alertFrom, 'undercarriageData', {}) //上架
            console.log(this.alertFrom)
            this.$nextTick(() => {
                this.$refs['alertFrom'].clearValidate();
            })
            if (this.title == '编辑债权') {
                this.getArtificial();
                // this.getInInformationdData(row)// 介入信息
            }
            if (!row.holdUserId) { //没有承接人
                return false;
            }
            this.getHoldData(row);// 获取承接人

        },
        //获取介入信息
        getInInformationdData(row) {
            ajax({
                url: 'tOrderTransfer/forceView/' + row.id,
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        let data = response.data ? response.data : '';
                        this.alertFrom.inInformationdData = data;
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
        // 获取承接人
        getHoldData(row) {
            ajax({
                url: 'appuser/simpleUserInfo/' + row.holdUserId,
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        let data = response.data ? response.data : {};
                        this.alertFrom.holdData = data;
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
        handleClick(tab, event) {
            if (tab.name == 'second') { //节点获取
                this.getNode(true);

            } else if (tab.name == 'third') { //用户信息承接人

            } else if (tab.name == 'fourth') { //人工介入
                this.getArtificial();
            }
        },
        //人工介入
        getArtificial() {
            ajax({
                url: 'tOrderTransfer/forceView/' + this.alertFrom.id,
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response.data);
                        if(Object.keys(response.data).length === 0) {
                            this.artificialIsshow = false;
                        } else {
                            this.artificialIsshow = true;
                        }
                        this.artificialData = response.data;
                        console.log(this.artificialIsshow);
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
        getNode(first) {
            this.listLoading1 = true; //列表加载状态
            if (first) {
                this.params1.page = 1;
            }
            ajax({
                url: 'tOrderTransfer/findLogs',
                optionParams: this.params1
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.alertFrom.nodes = response.data.records ? response.data.records : [];
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
        //弹框提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                console.log(valid)
                if (valid) {
                    this.loading = true;
                    let url = '';
                    let method = '';
                    let data = {};
                    if (this.title == '编辑债权') {
                        url = 'tOrderTransfer';
                        method = 'put';
                        data = {
                            pfName: this.alertFrom.pfName,
                            id: this.alertFrom.id
                        }
                    } else if(this.title == '上架债权') {
                        url = 'tOrderTransfer/force_recall';
                        method = 'post';
                        data = {
                            msg: this.alertFrom.undercarriageData.msg,
                            remark: this.alertFrom.undercarriageData.remark,
                            orderTranId: this.alertFrom.id
                        }
                    } else if(this.title == '延长付款') {
                        url = 'tOrderTransfer/force_pay_extend';
                        method = 'post';
                        data = {
                            extendTime: this.alertFrom.delayData.extendTime*3600000,
                            msg: this.alertFrom.delayData.msg,
                            remark: this.alertFrom.delayData.remark,
                            orderTranId: this.alertFrom.id
                        }
                    } else {
                        url = 'tOrderTransfer/force_sold_out';
                        method = 'post';
                        data = this.alertFrom.inInformationdData;
                        data.orderTranId = this.alertFrom.id;
                    }
                    ajax({
                        url: url,
                        optionParams: data
                    })[method]()
                        .then(response => {
                            if (response.code === 200) {
                                this.getTable();
                                this.$message({
                                    message: response.message,
                                    type: 'success'
                                });
                                this.dialogVisible = false;
                                
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
        handleSizeChange(val, parameter, method) {
            this[parameter].limit = val;
            this[parameter].page = 1; //从第一页开始
            this[method]();
        },
        // 切换页码
        handleCurrentPageChange(val, parameter, method) {
            this[parameter].page = val;
            this[method]();
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


