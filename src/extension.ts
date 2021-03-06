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
                    const twDateCompletion = genTwDate('ftwdate');
                    const enDateCompletion = genEnDate('fendate');
                    const colorCompletion = genColor('fcolor');
                    const ageCompletion = genAge('fage');
                    const emailCompletion = genEmail('femail');

                    // return all completion items as array
                    return [
                        chineseNameCompletion,
                        englishNameCompletion,
                        phoneNumberCompletion,
                        twIdCompletion,
                        twPointInTaiwanCompletion,
                        twDateCompletion,
                        enDateCompletion,
                        colorCompletion,
                        ageCompletion,
                        emailCompletion
                    ];
                }
            });

            context.subscriptions.push(provider);
        })
    } catch (error) {
        console.log(`extension error:${error}`)
    }
}




function genEmail(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    let result = Math.random().toString(36).substring(2,11) + '@gmail.com';
    completion.insertText = `${result}`;
    completion.documentation = '?????? email'
    completion.detail = '?????? email'
    return completion;
}


function genAge(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    let result = Math.floor(Math.random() * 100) + 1;
    completion.insertText = `${result}`;
    completion.documentation = '????????????'
    completion.detail = '????????????'
    return completion;
}


function genColor(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    //https://stackoverflow.com/questions/1484506/random-color-generator
    let result = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    completion.insertText = `${result}`;
    completion.documentation = '????????????'
    completion.detail = '????????????'
    return completion;
}


//https://www.codegrepper.com/code-examples/javascript/javascript+random+date+time
function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function genRandomEnDate() {
    //???????????? 10 ???????????????
    let today = new Date();
    let fullYear = today.getFullYear() - Math.floor(Math.random() * 10) + 1
    let result = randomDate(new Date(fullYear, 0, 1), today).toISOString().substring(0, 10);
    return result;
}
function genRandomTwDate() {
    //???????????? 10 ???????????????
    let today = new Date();
    let fullYear = today.getFullYear() - Math.floor(Math.random() * 10) + 1
    let enDate = randomDate(new Date(fullYear, 0, 1), today).toISOString().substring(0, 10);
    let twYear = Number(enDate.substring(0, 4)) - 1911;
    return twYear.toString() + enDate.substring(4, 10);

}

function genEnDate(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    let result = genRandomEnDate();
    completion.insertText = `${result}`;
    completion.documentation = '????????????????????????'
    completion.detail = '????????????????????????'
    return completion;
}

function genTwDate(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    let result = genRandomTwDate();
    completion.insertText = `${result}`;
    completion.documentation = '????????????????????????'
    completion.detail = '????????????????????????'
    return completion;
}


//cache ??????
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
        //????????????????????????
        let randomFeature = taiwan.features[Math.floor(Math.random() * taiwan.features.length)];

        //?????????????????? bbox , ??????????????????????????? bbox ??????????????????
        var bbox = turf.bbox(randomFeature);

        //?????????????????????
        var positions = turf.randomPoint(1, { bbox: bbox })

        //???????????????????????????????????? geomerty ????????????
        let flag = turf.booleanContains(randomFeature, positions.features[0]);

        if (flag) {
            return positions.features[0].geometry.coordinates;
        }

        //?????????????????????????????????????????????
        // randomPoint();

        //???????????????????????? cache ??????
        return randomPoints[Math.floor(Math.random() * randomPoints.length)];

    } catch (error) {
        console.log(error);
    }
}

function genPointInTaiwan(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    // var pointOnPolygon = turf.pointOnFeature({ "type": "Feature", "geometry": { "type": "Polygon", "coordinates": [[[120.13192239511876, 23.530054831049934], [120.13656853666322, 23.543391487989133], [120.12631498290993, 23.544516266285207], [120.1272762535743, 23.530054831049934], [120.13192239511876, 23.530054831049934]]] }, "properties": { "COUNTYSN": "10009003", "COUNTYNAME": "?????????" } });
    var point = randomPoint();
    var lonlat = point as number[];
    var lon = lonlat[0].toFixed(8);
    var lat = lonlat[1].toFixed(8);
    completion.insertText = `${lon} ${lat}`;
    completion.documentation = '??????????????????????????????????????????'
    completion.detail = '??????????????????????????????????????????'
    return completion;
}

function genTaiwanIdentity(label: string): vscode.CompletionItem {
    // ?????????A=10 ??????????????????J=18 ??????????????????S=26 ?????????
    // ?????????B=11 ??????????????????K=19 ??????????????????T=27 ?????????
    // ?????????C=12 ??????????????????L=20 ??????????????????U=28 ?????????
    // ?????????D=13 ??????????????????M=21 ??????????????????V=29 ?????????
    // ?????????E=14 ??????????????????N=22 ??????????????? W=32 ?????????
    // ?????????F=15 ???????????? O=35 ??????????????????X=30 ?????????
    // ?????????G=16 ??????????????????P=23 ??????????????????Y=31 ?????????
    // ?????????H=17 ??????????????????Q=24 ??????????????? Z=33 ?????????
    // ?????? I=34 ???????????? R=25 ????????????

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

    //?????? key value
    //https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    var key = Object.keys(dict)[Math.floor(Math.random() * Object.keys(dict).length)];

    //??? = 1
    //??? = 2
    const genders = [1, 2];
    let gender = genders[Math.floor(Math.random() * genders.length)].toString();

    //????????? 0 - 9
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
    completion.documentation = '???????????????????????????'
    completion.detail = '???????????????????????????'
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
    completion.documentation = '??????????????????';
    completion.detail = '??????????????????';

    return completion;
}


function genChineseName(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    var lname = twLastNames[Math.floor(Math.random() * twLastNames.length)];
    var fname = twFirstNames[Math.floor(Math.random() * twFirstNames.length)];
    completion.insertText = lname + fname;
    completion.documentation = '??????????????????';
    completion.detail = '??????????????????';
    return completion;
}


function genEnglishName(label: string): vscode.CompletionItem {
    const completion = new vscode.CompletionItem(label);
    var lname = enLastNames[Math.floor(Math.random() * enLastNames.length)];
    var fname = enFirstNames[Math.floor(Math.random() * enFirstNames.length)];
    completion.insertText = lname + ' ' + fname;
    completion.documentation = '??????????????????';
    completion.detail = '??????????????????';
    return completion;
}

export function deactivate() {}
