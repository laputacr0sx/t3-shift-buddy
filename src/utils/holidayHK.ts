export type Holiday = {
    dtstart: (string | { value: string })[];
    dtend: (string | { value: string })[];
    transp: string;
    uid: string;
    summary: string;
};

type HolidayJson = {
    vcalendar: Vcalendar[];
};

type Vcalendar = Record<string, unknown> & {
    prodid: string;
    version: string;
    calscale: string;
    vevent: Holiday[];
};

const holidayJson: HolidayJson = {
    vcalendar: [
        {
            prodid: '-//1823 Call Centre, Efficiency Office, HKSAR Government//Hong Kong Public Holidays//EN',
            version: '2.0',
            calscale: 'GREGORIAN',
            'x-wr-timezone': 'Asia/Hong_Kong',
            'x-wr-calname': '香港公眾假期',
            'x-wr-caldesc': '香港公眾假期',
            vevent: [
                {
                    dtstart: [
                        '20220101',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220102',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220101@1823.gov.hk',
                    summary: '一月一日'
                },
                {
                    dtstart: [
                        '20220201',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220202',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220201@1823.gov.hk',
                    summary: '年初一'
                },
                {
                    dtstart: [
                        '20220202',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220203',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220202@1823.gov.hk',
                    summary: '年初二'
                },
                {
                    dtstart: [
                        '20220203',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220204',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220203@1823.gov.hk',
                    summary: '年初三'
                },
                {
                    dtstart: [
                        '20220405',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220406',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220405@1823.gov.hk',
                    summary: '清明節'
                },
                {
                    dtstart: [
                        '20220415',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220416',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220415@1823.gov.hk',
                    summary: '耶穌受難節'
                },
                {
                    dtstart: [
                        '20220416',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220417',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220416@1823.gov.hk',
                    summary: '耶穌受難節翌日'
                },
                {
                    dtstart: [
                        '20220418',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220419',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220418@1823.gov.hk',
                    summary: '復活節星期一'
                },
                {
                    dtstart: [
                        '20220502',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220503',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220502@1823.gov.hk',
                    summary: '勞動節翌日'
                },
                {
                    dtstart: [
                        '20220509',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220510',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220509@1823.gov.hk',
                    summary: '佛誕翌日'
                },
                {
                    dtstart: [
                        '20220603',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220604',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220603@1823.gov.hk',
                    summary: '端午節'
                },
                {
                    dtstart: [
                        '20220701',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220702',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220701@1823.gov.hk',
                    summary: '香港特別行政區成立紀念日'
                },
                {
                    dtstart: [
                        '20220912',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20220913',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20220912@1823.gov.hk',
                    summary: '中秋節後第二日'
                },
                {
                    dtstart: [
                        '20221001',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20221002',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20221001@1823.gov.hk',
                    summary: '國慶日'
                },
                {
                    dtstart: [
                        '20221004',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20221005',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20221004@1823.gov.hk',
                    summary: '重陽節'
                },
                {
                    dtstart: [
                        '20221226',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20221227',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20221226@1823.gov.hk',
                    summary: '聖誕節後第一個周日'
                },
                {
                    dtstart: [
                        '20221227',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20221228',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20221227@1823.gov.hk',
                    summary: '聖誕節後第二個周日'
                },
                {
                    dtstart: [
                        '20230102',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230103',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230102@1823.gov.hk',
                    summary: '一月一日翌日'
                },
                {
                    dtstart: [
                        '20230123',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230124',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230123@1823.gov.hk',
                    summary: '年初二'
                },
                {
                    dtstart: [
                        '20230124',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230125',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230124@1823.gov.hk',
                    summary: '年初三'
                },
                {
                    dtstart: [
                        '20230125',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230126',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230125@1823.gov.hk',
                    summary: '年初四'
                },
                {
                    dtstart: [
                        '20230405',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230406',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230405@1823.gov.hk',
                    summary: '清明節'
                },
                {
                    dtstart: [
                        '20230407',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230408',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230407@1823.gov.hk',
                    summary: '耶穌受難節'
                },
                {
                    dtstart: [
                        '20230408',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230409',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230408@1823.gov.hk',
                    summary: '耶穌受難節翌日'
                },
                {
                    dtstart: [
                        '20230410',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230411',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230410@1823.gov.hk',
                    summary: '復活節星期一'
                },
                {
                    dtstart: [
                        '20230501',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230502',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230501@1823.gov.hk',
                    summary: '勞動節'
                },
                {
                    dtstart: [
                        '20230526',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230527',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230526@1823.gov.hk',
                    summary: '佛誕'
                },
                {
                    dtstart: [
                        '20230622',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230623',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230622@1823.gov.hk',
                    summary: '端午節'
                },
                {
                    dtstart: [
                        '20230701',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20230702',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230701@1823.gov.hk',
                    summary: '香港特別行政區成立紀念日'
                },
                {
                    dtstart: [
                        '20230930',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20231001',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20230930@1823.gov.hk',
                    summary: '中秋節翌日'
                },
                {
                    dtstart: [
                        '20231002',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20231003',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20231002@1823.gov.hk',
                    summary: '國慶日翌日'
                },
                {
                    dtstart: [
                        '20231023',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20231024',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20231023@1823.gov.hk',
                    summary: '重陽節'
                },
                {
                    dtstart: [
                        '20231225',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20231226',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20231225@1823.gov.hk',
                    summary: '聖誕節'
                },
                {
                    dtstart: [
                        '20231226',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20231227',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20231226@1823.gov.hk',
                    summary: '聖誕節後第一個周日'
                },
                {
                    dtstart: [
                        '20240101',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240102',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240101@1823.gov.hk',
                    summary: '一月一日'
                },
                {
                    dtstart: [
                        '20240210',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240211',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240210@1823.gov.hk',
                    summary: '年初一'
                },
                {
                    dtstart: [
                        '20240212',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240213',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240212@1823.gov.hk',
                    summary: '年初三'
                },
                {
                    dtstart: [
                        '20240213',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240214',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240213@1823.gov.hk',
                    summary: '年初四'
                },
                {
                    dtstart: [
                        '20240329',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240330',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240329@1823.gov.hk',
                    // summary: "耶穌受難節",
                    summary: '復活節'
                },
                {
                    dtstart: [
                        '20240330',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240331',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240330@1823.gov.hk',
                    summary: '復活節翌日'
                },
                {
                    dtstart: [
                        '20240401',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240402',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240401@1823.gov.hk',
                    summary: '復活節星期一'
                },
                {
                    dtstart: [
                        '20240404',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240405',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240404@1823.gov.hk',
                    summary: '清明節'
                },
                {
                    dtstart: [
                        '20240501',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240502',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240501@1823.gov.hk',
                    summary: '勞動節'
                },
                {
                    dtstart: [
                        '20240515',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240516',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240515@1823.gov.hk',
                    summary: '佛誕'
                },
                {
                    dtstart: [
                        '20240610',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240611',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240610@1823.gov.hk',
                    summary: '端午節'
                },
                {
                    dtstart: [
                        '20240701',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240702',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240701@1823.gov.hk',
                    // summary: "香港特別行政區成立紀念日",
                    summary: '七一'
                },
                {
                    dtstart: [
                        '20240918',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20240919',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20240918@1823.gov.hk',
                    summary: '中秋節翌日'
                },
                {
                    dtstart: [
                        '20241001',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20241002',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20241001@1823.gov.hk',
                    summary: '國慶日'
                },
                {
                    dtstart: [
                        '20241011',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20241012',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20241011@1823.gov.hk',
                    summary: '重陽節'
                },
                {
                    dtstart: [
                        '20241225',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20241226',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20241225@1823.gov.hk',
                    summary: '聖誕節'
                },
                {
                    dtstart: [
                        '20241226',
                        {
                            value: 'DATE'
                        }
                    ],
                    dtend: [
                        '20241227',
                        {
                            value: 'DATE'
                        }
                    ],
                    transp: 'TRANSPARENT',
                    uid: '20241226@1823.gov.hk',
                    // summary: "聖誕節後第一個周日",
                    summary: '聖誕節翌日'
                }
            ]
        }
    ]
};

export default holidayJson;
