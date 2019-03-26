﻿<template>
    <div class='leftNav2' :style="leftBackground">
        <!-- <div class="leftNav-img"></div> -->
        <div class="left_login" :class="{Collapse2:isCollapse}">
            <div class="left_logo">
                <img :src="loginUrl" alt="">
            </div>
            <div class="collapseImg" @click="Collapse();" :class="{Collapse3:isCollapse}" v-show="false">
                <img :src="collapseUrl" alt="">
            </div>
        </div>
        <ul class='listBox' :class="{Collapse:isCollapse}">
            <el-menu background-color="#1e282c" text-color="#b8c7ce" :collapse-transition="true" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :unique-opened="true">
                <el-submenu :index="item.id + ''" v-for="(item, index) in listInfo1" :key="item.id">
                    <!--<el-submenu :index="item.id + ''" v-for="(item, index) in listInfo" :key="item.id">-->
                    <template slot="title">
                        <!--<i class="el-icon-menu"></i>-->
                        <i class="nav_img" v-for="logo in nav_logo" v-show="item.label == logo.label"><img :src="logo.url" /></i>
                        <i class="el-icon-message" v-show="item.label == '通知栏目'"></i>
                        <span v-text="item.label"></span>
                    </template>
                    <el-menu-item-group>
                        <template v-for="itm in item.children">
                            <el-menu-item :index="itm.id + ''" v-text="itm.label" v-if="itm.children.length == 0" @click="$router.push(itm.path)"></el-menu-item>
                            <el-submenu :index="itm.id + ''" v-else>
                                <span slot="title" v-text="itm.label"></span>
                                <el-menu-item :index="list.id + ''" v-for="list in itm.children" :key="list.id" v-text="list.label" @click="$router.push(list.path)"> </el-menu-item>
                            </el-submenu>
                        </template>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </ul>
    </div>
</template>

<script>
import _ from "underscore";
import { authInfo } from "./common/auth.js";
import { mapGetters } from 'vuex';
import ajax from '@utils/config';
export default {
    data() {
        return {
            leftBackground: {
                background: 'url(' + require("@res/img/zuo.png") + ') no-repeat'
            },
            activeIndex: '0',
            collapseUrl: require("@res/img/icon-liebiao.png"),
            // collapseUrl: "../config/res/img/icon-liebiao.png",
            arrow: require("@res/img/arrow.png"),
            arrowTop: require("@res/img/arrow2.png"),
            loginUrl: require("@res/img/logo123.png"),
            // loginUrl: "../config/res/img/logo123.png",
            listInfo1: [],
            nav_logo: [
                { label: '首页', url: require('@res/img/pingtaishuju.png') },
                { label: '用户管理', url: require('@res/img/icon-yonghu.png') },
                { label: '资金管理', url: require('@res/img/caiwu.png') },
                { label: '债权管理', url: require('@res/img/hetong.png') },
                { label: '债权信息管理', url: require('@res/img/icon-message.png') },
                { label: '内容管理', url: require('@res/img/icon-cailiao.png') },
                { label: '系统管理', url: require('@res/img/icon-xitong.png') }
            ],
            // nav_logo: [
            //     { label: '首页', url: '../config/res/img/pingtaishuju.png'},
            //     { label: '用户管理', url: '../config/res/img/icon-yonghu.png'},
            //     { label: '资金管理', url: '../config/res/img/caiwu.png'},
            //     { label: '债权管理', url: '../config/res/img/hetong.png' },
            //     { label: '债权信息管理', url: '../config/res/img/icon-message.png'},
            //     { label: '内容管理', url: '../config/res/img/icon-cailiao.png'},
            //     { label: '系统管理', url: '../config/res/img/icon-xitong.png'}
            // ],
            listInfo: [
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "首页",
                    path: "/indexData",
                    id: 110000,
                    children: [
                        {
                            path: '/indexData/dataStatistics',
                            label: '数据统计',
                            id: 110001,
                            children: []
                        }
                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "用户管理",
                    path: "/userManage",
                    id: 120000,
                    children: [
                        {
                            path: '/userManage/userList',
                            label: '用户列表',
                            id: 120001,
                            children: []
                        },
                        {
                            path: '/userManage/bankManage',
                            label: '银行卡来管理',
                            id: 120002,
                            children: []
                        }
                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "资金管理",
                    path: "/fundsManage",
                    id: 130000,
                    children: [
                        {
                            path: '/fundsManage/cashManage',
                            label: '提现管理',
                            id: 130001,
                            children: [
                                {
                                    path: '/fundsManage/cashManage/withdrawalAudit',
                                    label: '提现审核',
                                    id: 130010
                                },
                                {
                                    path: '/fundsManage/cashManage/withdrawalRecord',
                                    label: '提现记录',
                                    id: 130011
                                }
                            ]
                        },
                        {
                            path: '/fundsManage/userAccount',
                            label: '用户账户',
                            id: 130002,
                            children: []
                        },
                        {
                            path: '/fundsManage/moneyRecord',
                            label: '资金记录',
                            id: 130003,
                            children: []
                        },
                        {
                            path: '/fundsManage/topUpManage',
                            label: '充值管理',
                            id: 130004,
                            children: []
                        },
                        {
                            path: '/fundsManage/moneyStatistics',
                            label: '资金统计',
                            id: 130005,
                            children: []
                        }
                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "债权管理",
                    path: "/debtManage",
                    id: 140000,
                    children: [
                        {
                            path: '/debtManage/debtList',
                            label: '债权列表',
                            id: 14001,
                            children: []
                        },
                        {
                            path: '/debtManage/appealManage',
                            label: '申诉管理',
                            id: 140002,
                            children: []
                        },
                        {
                            path: '/debtManage/auditManage',
                            label: '审核管理',
                            id: 140003,
                            children: []
                        }
                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "内容管理",
                    path: "/contentManage",
                    id: 150000,
                    children: [
                        {
                            path: '/contentManage/helpCenter',
                            label: '帮助中心',
                            id: 150001,
                            children: [
                                {
                                    path: '/contentManage/helpCenter/answersManage',
                                    label: '问答管理',
                                    id: 150010
                                },
                                {
                                    path: '/contentManage/helpCenter/classifyManage',
                                    label: '分类管理',
                                    id: 150011
                                }
                            ]
                        },
                        {
                            path: '/contentManage/onlineLendingPlatformManage',
                            label: '网贷平台管理',
                            id: 15002,
                            children: []
                        },
                        {
                            path: '/contentManage/bannerManage',
                            label: 'banner管理',
                            id: 150003,
                            children: []
                        },
                        {
                            path: '/contentManage/articleManage',
                            label: '文章管理',
                            id: 150004,
                            children: []
                        }
                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    label: "系统管理",
                    path: "/systemManage",
                    id: 160000,
                    children: [
                        {
                            path: '/systemManage/push',
                            label: '推送',
                            id: 160001,
                            children: [
                                {
                                    path: '/systemManage/push/smsPush',
                                    label: '短信推送',
                                    id: 160010
                                },
                                {
                                    path: '/systemManage/push/systemPush',
                                    label: '系统推送',
                                    id: 160011
                                }
                            ]
                        },
                        {
                            path: '/systemManage/permissionsManage',
                            label: '权限管理',
                            id: 160101,
                            children: [
                                {
                                    path: '/systemManage/permissionsManage/roleManage',
                                    label: '角色管理',
                                    id: 160110
                                },
                                {
                                    path: '/systemManage/permissionsManage/adminManage',
                                    label: '管理员管理',
                                    id: 160111
                                }
                            ]
                        },
                        {
                            path: '/systemManage/messageTemplate',
                            label: '消息模板',
                            id: 160201,
                            children: []
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        ...mapGetters([
            'isCollapse'
        ])
    },
    created() {
        this.getMenuList(); //获取菜单
    },
    mounted() {
    },
    methods: {
        statusFlag: function(item, listInfo) {
            let status = !item.status;
            for (let list in listInfo) {
                listInfo[list].status = false;
            }
            item.status = status;
        },
        setActiveIndex(index) {
            this.activeIndex = index + '';
        },
        //获取菜单
        getMenuList() {
            ajax({
                url: 'auth/menuTree',
            }).fetch()
                .then(res => {
                    // console.log(res)
                    this.listInfo1 = res.data ? res.data : [];
                    // console.log(res.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        Collapse() {
            // console.log(this.$store.getters.isCollapse);
            this.$store.dispatch('SETISCOLLAPSE', { isCollapse: this.$store.getters.isCollapse });
        },
        go_url(childrenList) {
            if (childrenList.childrenList.length == 0) {
                this.$router.push(childrenList.hash)
            }
        }
    }
    //.el-menu-item-group__title
};
</script>
<style rel="stylesheet/less" lang="less">
//左新的
.leftNav2 {
    transition: width .28s;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 11;
    height: 100%;
    background: #ffffff; // 头logo
    .left_login {
        width: 228px;
        height: 50px;
        background: #000;
        position: relative;
        &.Collapse2 {
            width: 64px;
            height: 50px;
            background: #000;
            .left_logo {
                img {
                    // transition: all .28s;
                    width: 64px;
                    height: 50px;
                }
            }
        }
        .collapseImg {
            position: absolute;
            right: 10px;
            top: 16px;
            img {
                width: 15px;
                height: 15px;
            }
            &.Collapse3 {
                position: absolute; // right: -155px;
                top: 16px;
            }
        }
    } // 导航
    .listBox {
        margin: 0 15px;
        padding-top: 15px;
        max-height: 100%;
        overflow-y: auto;
        /*三角箭头的颜色*/
        scrollbar-arrow-color: transparent;
        /*滚动条滑块按钮的颜色*/
        scrollbar-face-color: transparent;
        /*滚动条整体颜色*/
        scrollbar-highlight-color: transparent;
        /*滚动条阴影*/
        scrollbar-shadow-color: transparent;
        /*滚动条轨道颜色*/
        scrollbar-track-color: transparent;
        /*滚动条整体部分,必须要设置*/
        &::-webkit-scrollbar {
            width: 2px;
            height: 2px;
            background-color: transparent;
        }
        /*滚动条的轨道*/
        &::-webkit-scrollbar-track {
            box-shadow: none;
            background-color: transparent;
        }
        .el-menu {
            border: 0;
        }
        >.el-menu {
            >.el-submenu {
                position: relative; // title颜色
                >.el-submenu__title {
                    background: #1e282c;
                    color: #fff!important;
                    font-size: 12px!important;
                } //title加遮罩
                >.el-submenu__title::before {
                    content: "";
                    display: block;
                    width: 100%;
                    height: 100%;
                    background: rgba(80, 99, 119, 0.5);
                    position: absolute;
                    z-index: 1;
                    left: 0;
                    top: 0;
                } //导航打开遮罩消失
                &.is-opened {
                    >.el-submenu__title::before {
                        display: none;
                    }
                    >.el-submenu__title {
                        border-left: 3px solid #3c8dbc;
                    }
                } //二级背景和鼠标滑过颜色和字体颜色
                >.el-menu {
                    background: #2c3b41;
                    border-radius: 0;
                    >.el-menu-item-group {
                        background: #2c3b41!important;
                        >ul {
                            >.el-menu-item {
                                color: #b8c7ce;
                                background: #2c3b41!important;
                                font-size: 12px!important;
                            }
                            >.el-menu-item:hover {
                                color: #fff!important;
                                background: #2c3b41;
                            } //2级头
                            >.el-submenu {
                                >.el-submenu__title {
                                    color: #b8c7ce;
                                    font-size: 12px!important;
                                    background: #2c3b41!important;
                                }
                                >.el-submenu__title:hover {
                                    color: #fff!important;
                                    background: #2c3b41;
                                } // 三级
                                >.el-menu {
                                    background: #2c3b41;
                                    >.el-menu-item {
                                        color: #b8c7ce;
                                        background: #2c3b41!important;
                                        font-size: 12px!important;
                                    }
                                    >.el-menu-item:hover {
                                        color: #fff!important;
                                        background: #2c3b41;
                                    }
                                }
                            }
                        }
                    }
                }
            } //鼠标滑过title
            >.el-submenu:hover {
                >.el-submenu__title::before {
                    display: none;
                }
                >.el-submenu__title {
                    border-left: 3px solid #3c8dbc;
                }
            }
        }
        &.Collapse {
            height: 100%;
            border: none;
            overflow: auto;
            position: absolute;
            width: 64px;
            margin: 0;
            /*三角箭头的颜色*/
            scrollbar-arrow-color: transparent;
            /*滚动条滑块按钮的颜色*/
            scrollbar-face-color: transparent;
            /*滚动条整体颜色*/
            scrollbar-highlight-color: transparent;
            /*滚动条阴影*/
            scrollbar-shadow-color: transparent;
            /*滚动条轨道颜色*/
            scrollbar-track-color: transparent;
            /*滚动条整体部分,必须要设置*/
            &::-webkit-scrollbar {
                width: 2px;
                height: 2px;
                background-color: transparent;
            }
            /*滚动条的轨道*/
            &::-webkit-scrollbar-track {
                box-shadow: none;
                background-color: transparent;
            }
            /*滚动条的滑块按钮*/
            &::-webkit-scrollbar-thumb {
                border-radius: 0;
                background-color: transparent;
                box-shadow: none;
            }
            /*滚动条的上下两端的按钮*/
            &::-webkit-scrollbar-button {
                height: 0;
                background-color: transparent;
            }
        }
    }
    .nav_img {
        width: 24px;
        text-align: center;
        margin-right: 10px;
        display: inline-block;
    }
}
</style>

