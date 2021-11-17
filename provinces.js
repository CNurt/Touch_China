class Provinces {

    // will be a dictionary with keys like in CSV
    // var provinces = {}

    constructor() {
        this.#createDict(this.#provincesCSV);
    }

    #createDict(csvtext) {
        var lines = csvtext.split(/\r\n|\n/)
        lines.forEach(line => {
            var el = line.split(';');
            this[el[0]] = {
                'ProvinceEN': el[1],
                'ProvinceSIM': el[2],
                'ProvincePIN': el[3],
                'CapitalEN': el[4],
                'CapitalSIM': el[5],
                'CapitalPIN': el[6],
                'Abbreviation': el[7]
            }
        });
    }

    #provincesCSV = `8;Anhui;安徽省;Ānhuī Shěng;Hefei;合肥;;皖
33;Fujian;福建省;Fújiàn Shěng;Fuzhou;福州;;闽
12;Gansu;甘肃省;Gānsù Shěng;Lanzhou;兰州;;甘(陇)
37;Guangdong;广东省;Guǎngdōng Shěng;Guangzhou;广州;;粤
18;Guizhou;贵州省;Guìzhōu Shěng;Guiyang;贵阳;;贵(黔)
22;Hainan;海南省;Hǎinán Shěng;Haikou;海口;;琼
4;Hebei;河北省;Héběi Shěng;Shijiazhuang;石家庄;;冀
1;Heilongjiang;黑龙江省;Hēilóngjiāng Shěng;Harbin;哈尔滨;;黑
9;Henan;河南省;Hénán Shěng;Zhengzhou;郑州;;豫
13;Hubei;湖北省;Húběi Shěng;Wuhan;武汉;;鄂
17;Hunan;湖南省;Húnán Shěng;Changsha;长沙;;湘
6;Jiangsu;江苏省;Jiāngsū Shěng;Nanjing;南京;;苏
14;Jiangxi;江西省;Jiāngxī Shěng;Nanchang;南昌;;赣
2;Jilin;吉林省;Jílín Shěng;Changchun;长春;;吉
3;Liaoning;辽宁省;Liáoníng Shěng;Shenyang;沈阳;;辽
21;Qinghai;青海省;Qīnghǎi Shěng;Xining;西宁;;青
11;Shaanxi;陕西省;Shǎnxī Shěng;Xi''an;西安;;陕(秦)
5;Shandong;山东省;Shāndōng Shěng;Jinan;济南;;鲁
10;Shanxi;山西省;Shānxī Shěng;Taiyuan;太原;;晋
19;Sichuan;四川省;Sìchuān Shěng;Chengdu;成都;;川(蜀)
20;Yunnan;云南省;Yúnnán Shěng;Kunming;昆明;;云(滇)
7;Zhejiang;浙江省;Zhèjiāng Shěng;Hangzhou;杭州;;浙
28;Guangxi Zhuang;广西壮族自治区;Guǎngxī Zhuàngzú Zìzhìqū;Nanning;南宁;;桂
27;Inner Mongolia;内蒙古自治区;Nèi Měnggǔ Zìzhìqū;Hohhot;呼和浩特;;內蒙古
26;Ningxia Hui;宁夏回族自治区;Níngxià Huízú Zìzhìqū;Yinchuan;银川;;宁
29;Xinjiang Uighur;新疆维吾尔自治区;Xīnjiāng Wéiwú'ěr Zìzhìqū;Urumqi;乌鲁木齐;;新
30;Tibet;西藏自治区;Xīzàng Zìzhìqū;Lhasa;拉萨;;藏
25;Beijing Municipality;北京市;Běijīng Shì;Beijing;北京;;京
23;Chongqing Municipality;重庆市;Chóngqìng Shì;Chongqing;重庆;;渝
g29951;Shanghai Municipality;上海市;Shànghǎi Shì;Shanghai;上海;;沪
24;Tianjin Municipality;天津市;Tiānjīn Shì;Tianjin;天津;;津
g29933;Hong Kong;香港特别行政区;Xiānggǎng Tèbié Xíngzhèngqū;Hong Kong;香港;;港
39;Macau;澳门特别行政区;Àomén Tèbié Xíngzhèngqū;Macau;澳门;;澳
AreaTaiwan;Taiwan;台湾;;Taipei;台北;;`;

}