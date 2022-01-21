// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { twFirstNames } from './twFirstNames';
import { twLastNames } from './twLastNames';
import { enFirstNames } from './enFirstName';
import { enLastNames } from './enLastName';
import * as turf from '@turf/turf';
import { taiwan } from './taiwan';
import { feature } from '@turf/turf';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    try {
        const langs = ['html', 'javascript', 'typescript', 'plaintext']
        const providers = [];
        langs.forEach(lang => {

            const provider = vscode.languages.registerCompletionItemProvider(lang, {

                provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

                    const chineseNameCompletion = genChineseName('fcname');
                    const englishNameCompletion = genEnglishName('fename');
                    const phoneNumberCompletion = genPhoneNumber('fphone');
                    const twIdCompletion = genTaiwanIdentity('ftwid');
                    const twPointInTaiwanCompletion = genPointInTaiwan('ftwpoint');

                    // return all completion items as array
                    return [
                        chineseNameCompletion,
                        englishNameCompletion,
                        phoneNumberCompletion,
                        twIdCompletion,
                        twPointInTaiwanCompletion
                    ];
                }
            });

            context.subscriptions.push(provider);
        })
    } catch (error) {
        console.log(`extension error:${error}`)
    }
}

//cache 隨機
const randomPoints = [
    [121.00436589, 24.79154627],
    [120.13103043, 23.53697654],
    [121.54937144, 25.01192865],
    [119.53517226, 23.63377960],
    [121.22751441, 24.87712223],
    [119.49799318, 23.36169844],
    [120.64884655, 24.16558713],
    [120.97152463, 24.78390492],
    [120.10630156, 23.07201543],
    [120.43189791, 23.96623840],
    [119.42118192, 23.21044580],
    [119.67568588, 23.25989869],
    [119.53855965, 23.36892421],
    [120.95425944, 24.52147024],
    [120.62124349, 24.41012728],
    [120.37288491, 23.64267176],
    [119.95276834, 25.97743479],
    [120.91410591, 23.79409139],
    [120.60888739, 24.07544345],
    [120.72718687, 24.37666307]
]
function randomPoint() {
    try {
        //亂數取得某個縣市
        let randomFeature = taiwan.features[Math.floor(Math.random() * taiwan.features.length)];

        //取得該縣市的 bbox , 不曉得為啥直接呼叫 bbox 產出來是錯的
        var bbox = turf.bbox(randomFeature);

        //產生一個亂數點
        var positions = turf.randomPoint(1, { bbox: bbox })

        //判斷該點是否在亂數縣市的 geomerty 範圍裡面
        let flag = turf.booleanContains(randomFeature, positions.features[0]);

        if (flag) {
            return positions.features[0].geometry.coordinates;
        }

        //萬一點跳海的話遞迴重新執行一次
        // randomPoint();

        //改成直接回傳已經 cache 的點
        return randomPoints[Math.floor(Math.random() * randomPoints.length)];

    } catch (error) {
        console.log(error);
    }
}

function genPointInTaiwan(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    // var pointOnPolygon = turf.pointOnFeature({ "type": "Feature", "geometry": { "type": "Polygon", "coordinates": [[[120.13192239511876, 23.530054831049934], [120.13656853666322, 23.543391487989133], [120.12631498290993, 23.544516266285207], [120.1272762535743, 23.530054831049934], [120.13192239511876, 23.530054831049934]]] }, "properties": { "COUNTYSN": "10009003", "COUNTYNAME": "雲林縣" } });
    var point = randomPoint();
    var lonlat = point as number[];
    var lon = lonlat[0].toFixed(8);
    var lat = lonlat[1].toFixed(8);
    completion.insertText = `${lon} ${lat}`;
    completion.documentation = '產生在台灣範圍內的經緯度點位'
    completion.detail = '產生在台灣範圍內的經緯度點位'
    return completion;
}

function genTaiwanIdentity(label: string): vscode.CompletionItem {
    // 　　　A=10 台北市　　　J=18 新竹縣　　　S=26 高雄縣
    // 　　　B=11 台中市　　　K=19 苗栗縣　　　T=27 屏東縣
    // 　　　C=12 基隆市　　　L=20 台中縣　　　U=28 花蓮縣
    // 　　　D=13 台南市　　　M=21 南投縣　　　V=29 台東縣
    // 　　　E=14 高雄市　　　N=22 彰化縣　　 W=32 金門縣
    // 　　　F=15 台北縣　 O=35 新竹市　　　X=30 澎湖縣
    // 　　　G=16 宜蘭縣　　　P=23 雲林縣　　　Y=31 陽明山
    // 　　　H=17 桃園縣　　　Q=24 嘉義縣　　 Z=33 連江縣
    // 　　 I=34 嘉義市　 R=25 台南縣　

    const dict = {
        'A': 10,
        'B': 11,
        'C': 12,
        'D': 13,
        'E': 14,
        'F': 15,
        'G': 16,
        'H': 17,
        'I': 34,
        'J': 18,
        'K': 19,
        'L': 20,
        'M': 21,
        'N': 22,
        'O': 35,
        'P': 23,
        'Q': 24,
        'R': 25,
        'S': 26,
        'T': 27,
        'U': 28,
        'V': 29,
        'W': 32,
        'X': 30,
        'Y': 31,
        'Z': 33
    };

    //亂數 key value
    //https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    var key = Object.keys(dict)[Math.floor(Math.random() * Object.keys(dict).length)];

    //男 = 1
    //女 = 2
    const genders = [1, 2];
    let gender = genders[Math.floor(Math.random() * genders.length)].toString();

    //亂數生 0 - 9
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let n1 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n2 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n3 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n4 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n5 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n6 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n7 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n8 = numbers[Math.floor(Math.random() * numbers.length)].toString();

    const completion = new vscode.CompletionItem(label);
    completion.insertText = `${key}${gender}${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}`;
    completion.documentation = '產生台灣身分證字號'
    completion.detail = '產生台灣身分證字號'
    return completion;
}


function genPhoneNumber(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let n1 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n2 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n3 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n4 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n5 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n6 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n7 = numbers[Math.floor(Math.random() * numbers.length)].toString();
    let n8 = numbers[Math.floor(Math.random() * numbers.length)].toString();

    completion.insertText = `09${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}`;
    completion.documentation = '產生手機號碼';
    completion.detail = '產生手機號碼';

    return completion;
}


function genChineseName(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    var lname = twLastNames[Math.floor(Math.random() * twLastNames.length)];
    var fname = twFirstNames[Math.floor(Math.random() * twFirstNames.length)];
    completion.insertText = lname + fname;
    completion.documentation = '產生中文名字';
    completion.detail = '產生中文名字';
    return completion;
}


function genEnglishName(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    var lname = enLastNames[Math.floor(Math.random() * enLastNames.length)];
    var fname = enFirstNames[Math.floor(Math.random() * enFirstNames.length)];
    completion.insertText = lname + ' ' + fname;
    completion.documentation = '產生英文名字';
    completion.detail = '產生英文名字';
    return completion;
}