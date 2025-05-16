/**
 * 中国省市数据
 * 简化版，仅包含常用省市
 */

export interface City {
  code: string;
  name: string;
}

export interface Province {
  code: string;
  name: string;
  cities: City[];
}

const chinaRegions: Province[] = [
  {
    code: "110000",
    name: "北京市",
    cities: [
      {
        code: "110100",
        name: "北京市"
      }
    ]
  },
  {
    code: "120000",
    name: "天津市",
    cities: [
      {
        code: "120100",
        name: "天津市"
      }
    ]
  },
  {
    code: "130000",
    name: "河北省",
    cities: [
      {
        code: "130100",
        name: "石家庄市"
      },
      {
        code: "130200",
        name: "唐山市"
      },
      {
        code: "130300",
        name: "秦皇岛市"
      },
      {
        code: "130400",
        name: "邯郸市"
      },
      {
        code: "130500",
        name: "邢台市"
      }
    ]
  },
  {
    code: "140000",
    name: "山西省",
    cities: [
      {
        code: "140100",
        name: "太原市"
      },
      {
        code: "140200",
        name: "大同市"
      },
      {
        code: "140300",
        name: "阳泉市"
      }
    ]
  },
  {
    code: "310000",
    name: "上海市",
    cities: [
      {
        code: "310100",
        name: "上海市"
      }
    ]
  },
  {
    code: "320000",
    name: "江苏省",
    cities: [
      {
        code: "320100",
        name: "南京市"
      },
      {
        code: "320200",
        name: "无锡市"
      },
      {
        code: "320300",
        name: "徐州市"
      },
      {
        code: "320400",
        name: "常州市"
      },
      {
        code: "320500",
        name: "苏州市"
      }
    ]
  },
  {
    code: "330000",
    name: "浙江省",
    cities: [
      {
        code: "330100",
        name: "杭州市"
      },
      {
        code: "330200",
        name: "宁波市"
      },
      {
        code: "330300",
        name: "温州市"
      },
      {
        code: "330400",
        name: "嘉兴市"
      },
      {
        code: "330500",
        name: "湖州市"
      }
    ]
  },
  {
    code: "340000",
    name: "安徽省",
    cities: [
      {
        code: "340100",
        name: "合肥市"
      },
      {
        code: "340200",
        name: "芜湖市"
      },
      {
        code: "340300",
        name: "蚌埠市"
      }
    ]
  },
  {
    code: "350000",
    name: "福建省",
    cities: [
      {
        code: "350100",
        name: "福州市"
      },
      {
        code: "350200",
        name: "厦门市"
      },
      {
        code: "350300",
        name: "莆田市"
      }
    ]
  },
  {
    code: "440000",
    name: "广东省",
    cities: [
      {
        code: "440100",
        name: "广州市"
      },
      {
        code: "440300",
        name: "深圳市"
      },
      {
        code: "440400",
        name: "珠海市"
      },
      {
        code: "440500",
        name: "汕头市"
      },
      {
        code: "440600",
        name: "佛山市"
      }
    ]
  },
  {
    code: "500000",
    name: "重庆市",
    cities: [
      {
        code: "500100",
        name: "重庆市"
      }
    ]
  },
  {
    code: "510000",
    name: "四川省",
    cities: [
      {
        code: "510100",
        name: "成都市"
      },
      {
        code: "510300",
        name: "自贡市"
      },
      {
        code: "510400",
        name: "攀枝花市"
      }
    ]
  }
];

export default chinaRegions;
