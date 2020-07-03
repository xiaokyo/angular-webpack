/**
 * 通用常量变量
 */
(function () {

  // 通用仓库列表
  window.warehouseList = [
    { store: '0', name: '义乌仓', id: 'bc228e33b02a4c03b46b186994eb6eb3' },
    { store: '1', name: '深圳仓', id: '08898c4735bf43068d5d677c1d217ab0' },
    { store: '2', name: '美西奇诺仓', id: 'd3749885b80444baadf8a55277de1c09' },// d3749885b80444baadf8a55277de1c09
    { store: '3', name: '美东新泽西仓', id: '201e67f6ba4644c0a36d63bf4989dd70' },
    { store: '4', name: '泰国仓', id: 'f87a1c014e6c4bebbe13359467886e99' },
    { store: '5', name: '金华仓', id: '522d3c01c75e4b819ebd31e854841e6c' },
    { store: '6', name: '印尼雅加达仓', id: 'e18668c0-0b6b-4d07-837e-fe2150d9d9c9' },
    { store: '7', name: '德国法兰克福仓', id: '55cbb9d2-8dcc-469e-aea2-40890c26cf7c' },
  ]

  // 采购所需要仓库列表
  window.warehousePurList = [//仓库列表   统一采购列表
    { value: '0', label: '义乌仓', id: ['{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}'] },
    { value: '1', label: '深圳仓', id: ['85742FBC-38D7-4DC4-9496-296186FFEED8'] },
    { value: '2', label: '美东仓', id: ['201e67f6ba4644c0a36d63bf4989dd70'] },
    { value: '3', label: '美西仓', id: ['738A09F1-2834-43CC-85A8-2FE5610C2599'] },
		{ value: '4', label: '泰国仓', id: ['f87a1c014e6c4bebbe13359467886e99', '7779ff66a0474bbdadcf1bf4924f228b'] },
    { value: '5', label: '金华仓', id: ['83hrf88jd3f38yf8ue8j8u3jhd3ruerj'] },
    { value: '6', label: '印尼雅加达仓', id: ['c51421ab-667f-4c9f-9d09-37a8307388ff'] },
    { value: '7', label: '德国法兰克福仓', id: ['082d5c71-59c7-4bdb-87d8-28f30d8c179f'] },
    // 7779ff66a0474bbdadcf1bf4924f228b -->> 接口请求 虚拟泰国仓  f87a1c014e6c4bebbe13359467886e99  -->> 手动添加泰国仓 实际使用 
    // { value: '6', label: '印尼仓', id: 'f87a1c014e6c4bebbe13359467886e99' },
  ];

  // 采购组长人员
  window.purchaseGroupLeaders = ['龙香昀','骆婷','张微','方淑月','吴晗','李金华','谢鲁','admin', '曹佳群']
  
})()