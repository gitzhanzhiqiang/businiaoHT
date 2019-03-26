import Template from '@src/template';
import dataStatistics from './dataStatistics';
import greetPage from './greetPage';
module.exports = {
    path: '/indexData',
    component: Template,
    meta: {
        title: '权限'
    },
    children: [
        {
            path: 'dataStatistics',
            name: 'indexData_dataStatistics',
            component: dataStatistics,
            meta: {
                title: '数据统计'
            }
        },
        {
            path: 'greetPage',
            name: 'indexData_greetPage',
            component: greetPage,
            meta: {
                title: '欢迎进入'
            },
        }
    ]
}