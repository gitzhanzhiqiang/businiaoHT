import Template from '@src/template';
import helpCenter from './helpCenter';
import onlineLendingPlatformManage from './onlineLendingPlatformManage';
import bannerManage from './bannerManage';
import articleManage from './articleManage';
module.exports = {
    path: '/contentManage',
    component: Template,
    meta: {
        title: '内容管理'
    },
    children: [
        helpCenter,
        {
            path: 'onlineLendingPlatformManage',
            name: 'contentManage_onlineLendingPlatformManage',
            component: onlineLendingPlatformManage,
            meta: {
                title: '网贷平台管理'
            }
        },
        {
            path: 'bannerManage',
            name: 'contentManage_bannerManage',
            component: bannerManage,
            meta: {
                title: 'banner管理'
            }
        },
        {
            path: 'articleManage',
            name: 'contentManage_articleManage',
            component: articleManage,
            meta: {
                title: '文章管理'
            }
        }
    ]
}