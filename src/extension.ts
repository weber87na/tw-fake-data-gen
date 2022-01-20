// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { twFirstNames } from './twFirstNames';
import { twLastNames } from './twLastNames';
import { enFirstNames } from './enFirstName';
import { enLastNames } from './enLastName';
import * as turf from '@turf/turf';
import { taiwan } from './taiwan';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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
}

function randomPoint() {
    try {

        var position = turf.randomPoint(1 , { bbox : [120.106188593, 21.9705713974, 121.951243931, 25.2954588893]})
        return position.features[0].geometry.coordinates;

        //這裡有點搞不起來不曉得問題在哪 , 有空再解
        // let randomFeature = taiwan.features[Math.floor(Math.random() * taiwan.features.length)];
        // var position = turf.randomPoint(1, { bbox: randomFeature.bbox })
        // return position.features[0].geometry.coordinates;
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

    return completion;
}


function genChineseName(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    var lname = twLastNames[Math.floor(Math.random() * twLastNames.length)];
    var fname = twFirstNames[Math.floor(Math.random() * twFirstNames.length)];
    completion.insertText = lname + fname;
    completion.documentation = '產生中文名字';
    return completion;
}


function genEnglishName(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    var lname = enLastNames[Math.floor(Math.random() * enLastNames.length)];
    var fname = enFirstNames[Math.floor(Math.random() * enFirstNames.length)];
    completion.insertText = lname + ' ' + fname;
    completion.documentation = '產生英文名字';
    return completion;
}