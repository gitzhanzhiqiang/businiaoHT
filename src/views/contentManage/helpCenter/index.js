import App from '@src/index.vue';
import answersManage from './answersManage';
import classifyManage from './classifyManage';
module.exports = {
    path: 'helpCenter',
    component: App,
    meta: {
        title: '帮助中心'
    },
    children: [{
            path: 'answersManage',
            name: 'helpCenter_answersManage',
            component: answersManage,
            meta: {
                title: '问答管理'
            }
        },
        {
            path: 'classifyManage',
            name: 'helpCenter_classifyManage',
            component: classifyManage,
            meta: {
                title: '分类管理'
            }
        }
    ]
}