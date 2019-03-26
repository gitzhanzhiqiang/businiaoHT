var storage = {};
//来源和客户端（用户管理>用户列表， 资金管理> 充值管理，提现管理>提现记录）
storage.source = [{
        key: 'PC',
        value: '1'
    },
    {
        key: 'H5',
        value: '2'
    },
    {
        key: 'Android',
        value: '3'
    },
    {
        key: 'IOS',
        value: '4'
    },
    {
        key: '其他',
        value: '5'
    },
    {
        key: '债权追讨h5',
        value: '6'
    }
];
//用户状态(（用户管理>用户列表,银行卡列表)
storage.userStatus = [{
        key: '正常',
        value: '1'
    },
    {
        key: '禁用',
        value: '2'
    }
];
//审核状态（资金管理》提现管理）
storage.verifyFlag = [{
            key: '未审核',
            value: '0'
        },
        {
            key: '审核通过',
            value: '1'
        },
        {
            key: '审核不通过',
            value: '2'
        }
    ]
    //交易类型（资金管理>资金记录）
storage.tradeType = [{
        key: '充值',
        value: '1'
    },
    {
        key: '提现',
        value: '2'
    },
    {
        key: '折扣金入账',
        value: '3'
    },
    {
        key: '折扣金出账',
        value: '4'
    },
    {
        key: '折扣金退回',
        value: '5'
    },
    {
        key: '提现失败',
        value: '6'
    },
    {
        key: '提现成功',
        value: '7'
    }
];
//还款方式（债权管理）
storage.repaymentType = [{
        key: '一次性还本付息',
        value: '0'
    },
    {
        key: '先息后本',
        value: '1'
    },
    {
        key: '等额本息',
        value: '2'
    },
    {
        key: '等额本金',
        value: '3'
    },
]
storage.orderStatus = []
    //所属分类(内容管理> 帮助中心)
storage.theCategory = [{
        key: 'IOS',
        value: '1'
    },
    {
        key: 'Android',
        value: '2'
    },
    {
        key: 'H5',
        value: '3'
    }
]
export {
    storage
}