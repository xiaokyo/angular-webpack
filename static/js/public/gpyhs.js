var socket;
var isSocketConnect = false;
var openFlagA = false;

var isOpenMainCamera = false;

var MainCanvas;
var MainContext;

var pMainShowStartX = 0;
var pMainShowStartY = 0;

var isMouseDown = false;
var pALastX = 0;
var pALastY = 0;
var pACurrentX = 0;
var pACurrentY = 0;

var MainCamCutMode = 0;



//window.onload = function (event) {
//    WebSocketConnect();
//}

//>>>>>>>>>>>>>>>>.�޸ĵĵط�>>>>>>>>>>>>>>>
function releaseSocketPro() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(3);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xFF;
        socket.send(aDataArray.buffer);
    }
}


window.onbeforeunload = function () {

    CloseCamera();  //�ر�����ͷ
    try {
        releaseSocketPro();   //>>>>>>>>>>>>>>>>.�޸ĵĵط�>>>>>>>>>>>>>>>
        socket.close();
        socket = null;
    }
    catch (ex) {
    }
    console.log("onbeforeunload");

};

//function CloseConnect() {
//    isSocketConnect = false;
//    CloseCamera();  //�ر�����ͷ
//    try {
//        releaseSocketPro();   //>>>>>>>>>>>>>>>>.�޸ĵĵط�>>>>>>>>>>>>>>>
//        socket.close();
//        socket = null;
//    }
//    catch (ex) {
//    }
// }


function $(id) {
    return document.getElementById(id);
}


function toSleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

function stringToUint8Array(str) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i));
    }
    arr.push('\0');
    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array
}


function Uint8ArrayToString(fileData) {
    var dataString = "";
    for (var i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i]);
    }
    return dataString
}


function stringToByte(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

function byteToString(arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
            _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}

function addEvent(obj, xEvent, fn) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + xEvent, fn);
    } else {
        obj.addEventListener(xEvent, fn, false);
    }
}


function InitCanvas(DivMainBox, mX, mY, mwidth, mheight) {

    //var DivMainBox = $("CameraCtl");

    if (mwidth != 0 && mheight != 0) {
        MainCanvas = document.createElement("canvas");
        MainCanvas.style.border = "solid 1px #A0A0A0";
        MainCanvas.id = "MainCamCanvas";
        MainCanvas.width = mwidth;
        MainCanvas.height = mheight;
        MainContext = MainCanvas.getContext("2d");
        DivMainBox.appendChild(MainCanvas);      //���ӻ���
        MainCanvas.onmousedown = MainCanvasMouseDown;
        MainCanvas.onmousemove = MainCanvasMouseMove;
        MainCanvas.onmouseup = MainCanvasMouseUp;
        MainCanvas.onmouseout = MainCanvasMouseOut;
        addEvent(MainCanvas, 'mousewheel', onMouseWheel);
        addEvent(MainCanvas, 'DOMMouseScroll', onMouseWheel);

    }

}






//*************����ͷ������ʼ��***************
function Cam_ControlInit(documentObj, mX, mY, mwidth, mheight) {
    WebSocketConnect();
    InitCanvas(documentObj, mX, mY, mwidth, mheight);
    //console.log("Cam_ControlInit");
}


//*************��ȡ�豸��Ŀ***************
function Cam_GetDevCount() {
    GetDevCount();
}

//***************��ȡ�ֱ���***************
function Cam_GetDevResolution(iCamNo) {
    GetResolution(iCamNo);
}

//*************��������ͷ***************
 function Cam_Open(iCamNo, width, height) {
     OpenCamera(iCamNo, width, height);
 }

 //*************�ر�����ͷ***************
 function Cam_Close() {

     CloseCamera();  
     isOpenMainCamera = false;
 }


 //*************����***************
 function Cam_Photo(fileAddr) {
      if (MainCamCutMode == 1) {
          SetCutRect(pALastX, pALastY, (pACurrentX - pALastX), (pACurrentY - pALastY));  //�ֶ��ü�����
      }    
     CaptureImage(fileAddr);
 }

//*************�Ŵ�***************
 function Cam_ZoomIn() {
    ZoomIn();
}

//*************��С***************
function Cam_ZoomOut() {
    ZoomOut();
}

//*************�ʺϴ�С***************
function Cam_BestSize() {
    BestSize();
}

//*************1:1***************
function Cam_TrueSize() {
    TrueSize();
}

//*************��ת***************
function Cam_Rotate(angle) {
    Rotate(angle);
}

//*************����***************
function Cam_RotateLeft() {
    RotateL();
}

//*************����***************
function Cam_RotateRight() {
    RotateR();
}

//*************�Խ�***************
function Cam_Focus() {
    ManualFocus();
}

//*************������Ƶ����***************
function Cam_ShowVideoProp() {
    ShowVideoProp();
}

//*************���òü�ģʽ***************
function Cam_SetCutMode( CutMode) {
    SetCutMode(CutMode);
}


//*************��ȡ����֤��Ϣ*************
function Cam_ReadIdCard(cardImgPath) {
    ReadIdCard(cardImgPath);
}

//*************�ϴ��ļ�*************
function UploadFile(url, filepath) {
    toUploadFile(url, filepath);
}


//*************�����ļ���ʽ*************
function Cam_SetFileType(filetype) {
    SetFileType(filetype);
}

//*************����JPGͼƬ����*************
function Cam_SetJpgQuality(val) {
    SetJpgQuality(val);
}


//*************����ɫ��ģʽ*************
function Cam_SetColorMode(colorMode) {
    SetColorMode(colorMode);
}

//*************����ȥ�ڱ�*************
function Cam_SetDeleteBlackEdge(flag) {
    SetDeleteBlackEdge(flag);
}

//*************����ȥ��ɫ*************
function Cam_SetDeleteBgColor(flag) {
    SetDeleteBgColor(flag);
}

//*************������ͷ��ʶ���ά������*************
function Cam_RecogQrBarCodeFromCamera(type) {
    RecogQrBarCodeFromCamera(type);
}

//*************��ͼƬ�ļ���ʶ���ά������*************
function Cam_RecogQrBarCodeFromFile(type,filePath) {
    RecogQrBarCodeFromFile(type, filePath);
}


//*************����Ҫ�ϲ���ͼƬ��PDF*************
function Cam_AddImgFileToPDF(filePath) {
    AddImgFileToPDF(filePath);
}

//*************�ϲ�PDF*************
function Cam_CombinePDF(filePath) {
    CombinePDF(filePath);
}

//*************��ȡ�����̷�*************
function GetDrives() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(3);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xA6;
        socket.send(aDataArray.buffer);
    }
}

//*************����ˮӡ*************
function SetWaterMark(isAdd, wType, addTime, wTransp, wPos, wSize, wColor, szInfo) {
    if (isSocketConnect) {
        if (szInfo == "")
            return;
        var info = encodeURI(szInfo);
        //console.log(info);
        var infoArray = stringToByte(info);
        var len = infoArray.length;
        var totalLen = len + 10;
        var aDataArray = new Uint8Array(totalLen);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xA7;
        aDataArray[3] = isAdd;
        aDataArray[4] = wType;
        aDataArray[5] = addTime;
        aDataArray[6] = wPos;
        aDataArray[7] = wSize;
        aDataArray[8] = wTransp;
        aDataArray[9] = wColor;
        for (var i = 0; i < len; i++) {
            aDataArray[10 + i] = infoArray[i];
        }
        socket.send(aDataArray.buffer);
    }
}


function ReadCamLicense() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(3);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xA5;
        socket.send(aDataArray.buffer);
    }
}

function SetInchImgType(sizetype) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xB0;
        aDataArray[3] = sizetype;
        socket.send(aDataArray.buffer);
    }
}

function SetInchLineType(linetype) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xB1;
        aDataArray[3] = linetype;
        socket.send(aDataArray.buffer);
    }
}


/****************************************************************************************/


function DeleteFile(filePath) {
    if (isSocketConnect) {
        if (filePath == "") {
            var packageCount = 1;
            var len = 0;
            var pindex = 0;
            var totalLen = 11;
            var aDataArray = new Uint8Array(totalLen);
            aDataArray[0] = 0x77;
            aDataArray[1] = 0x88;
            aDataArray[2] = 0xA8;
            aDataArray[3] = len >> 16 & 0xff;
            aDataArray[4] = len >> 8 & 0xff;
            aDataArray[5] = len & 0xff;
            aDataArray[6] = packageCount >> 8 & 0xff;   //������
            aDataArray[7] = packageCount & 0xff;   //������
            aDataArray[8] = 0;   //�ְ�����
            aDataArray[9] = pindex >> 8 & 0xff;   //�����
            aDataArray[10] = pindex & 0xff;    //�����
            console.log("pindex:" + pindex);
            socket.send(aDataArray.buffer);
        }
        else {
            var path = encodeURI(filePath);
            console.log(path);
            var pathArray = stringToByte(path);
            var len = pathArray.length;

            var packageCount = 0;
            var tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;
                packageCount++;
            }

            console.log("packageCount:" + packageCount);

            var pindex = 0;
            tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;

                if (tmpLen > 0) {
                    var totalLen = 90 + 11;
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0xA8;
                    aDataArray[3] = len >> 16 & 0xff;
                    aDataArray[4] = len >> 8 & 0xff;
                    aDataArray[5] = len & 0xff;
                    aDataArray[6] = packageCount >> 8 & 0xff;   //������
                    aDataArray[7] = packageCount & 0xff;   //������
                    aDataArray[8] = 90;   //�ְ�����
                    aDataArray[9] = pindex >> 8 & 0xff;   //�����
                    aDataArray[10] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < 90; i++) {
                        aDataArray[11 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                else {
                    var totalLen = 90 + tmpLen + 11;  // ��ʱtmpLenΪ���������ӷ�����
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0xA8;
                    aDataArray[3] = len >> 16 & 0xff;
                    aDataArray[4] = len >> 8 & 0xff;
                    aDataArray[5] = len & 0xff;
                    aDataArray[6] = packageCount >> 8 & 0xff;   //������
                    aDataArray[7] = packageCount & 0xff;   //������
                    aDataArray[8] = 90 + tmpLen;   //�ְ�����
                    aDataArray[9] = pindex >> 8 & 0xff;   //�����
                    aDataArray[10] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < (90 + tmpLen); i++) {
                        aDataArray[11 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                pindex++;
                toSleep(80);
            }
        }

    }
}



function CombinePDF(filePath) {
    if (isSocketConnect) {

        if (filePath == "") {
            var packageCount = 1;
            var len = 0;
            var pindex = 0;
            var totalLen = 11;
            var aDataArray = new Uint8Array(totalLen);
            aDataArray[0] = 0x77;
            aDataArray[1] = 0x88;
            aDataArray[2] = 0x32;
            aDataArray[3] = len >> 16 & 0xff;
            aDataArray[4] = len >> 8 & 0xff;
            aDataArray[5] = len & 0xff;
            aDataArray[6] = packageCount >> 8 & 0xff;   //������
            aDataArray[7] = packageCount & 0xff;   //������
            aDataArray[8] = 0;   //�ְ�����
            aDataArray[9] = pindex >> 8 & 0xff;   //�����
            aDataArray[10] = pindex & 0xff;    //�����
            console.log("pindex:" + pindex);
            socket.send(aDataArray.buffer);
        }
        else {
            var path = encodeURI(filePath);
            //console.log(path);
            var pathArray = stringToByte(path);
            var len = pathArray.length;

            var packageCount = 0;
            var tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;
                packageCount++;
            }

            console.log("packageCount:" + packageCount);

            var pindex = 0;
            tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;

                if (tmpLen > 0) {
                    var totalLen = 90 + 11;
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0x32;
                    aDataArray[3] = len >> 16 & 0xff;
                    aDataArray[4] = len >> 8 & 0xff;
                    aDataArray[5] = len & 0xff;
                    aDataArray[6] = packageCount >> 8 & 0xff;   //������
                    aDataArray[7] = packageCount & 0xff;   //������
                    aDataArray[8] = 90;   //�ְ�����
                    aDataArray[9] = pindex >> 8 & 0xff;   //�����
                    aDataArray[10] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < 90; i++) {
                        aDataArray[11 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                else {
                    var totalLen = 90 + tmpLen + 11;  // ��ʱtmpLenΪ���������ӷ�����
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0x32;
                    aDataArray[3] = len >> 16 & 0xff;
                    aDataArray[4] = len >> 8 & 0xff;
                    aDataArray[5] = len & 0xff;
                    aDataArray[6] = packageCount >> 8 & 0xff;   //������
                    aDataArray[7] = packageCount & 0xff;   //������
                    aDataArray[8] = 90 + tmpLen;   //�ְ�����
                    aDataArray[9] = pindex >> 8 & 0xff;   //�����
                    aDataArray[10] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < (90 + tmpLen); i++) {
                        aDataArray[11 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                pindex++;
                toSleep(80);
            }
        }

    }
 }


function AddImgFileToPDF(filePath) {
    if (isSocketConnect) {
        if (filePath == "") {
            var len=0;
            var totalLen = len + 3;
            var aDataArray = new Uint8Array(totalLen);
            aDataArray[0] = 0x77;
            aDataArray[1] = 0x88;
            aDataArray[2] = 0x31;
            for (var i = 0; i < len; i++) {
                aDataArray[3 + i] = pathArray[i];
            }
            socket.send(aDataArray.buffer);
        }
        else {

            var path = encodeURI(filePath);
            var pathArray = stringToByte(path);
            var len = pathArray.length;
            var totalLen = len + 3;
            var aDataArray = new Uint8Array(totalLen);
            aDataArray[0] = 0x77;
            aDataArray[1] = 0x88;
            aDataArray[2] = 0x31;
            for (var i = 0; i < len; i++) {
                aDataArray[3 + i] = pathArray[i];
            }
            socket.send(aDataArray.buffer);

         }        
    }
}


function RecogQrBarCodeFromCamera(type) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xA3;
        aDataArray[3] = type;
        socket.send(aDataArray.buffer);
    }
}

function RecogQrBarCodeFromFile(type, filePath) {
    if (isSocketConnect) {
        console.log(filePath);
        var path = encodeURI(filePath);
        var pathArray = stringToByte(path);
        var len = pathArray.length;
        var totalLen = len + 4;
        var aDataArray = new Uint8Array(totalLen);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xA4;
        aDataArray[3] = type;
        for (var i = 0; i < len; i++) {
            aDataArray[4 + i] = pathArray[i];
        }
        socket.send(aDataArray.buffer);
    }
}


function SetFileType(filetype) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x28;
        aDataArray[3] = filetype;
        if (filetype == 1)  //png��ʽ
            aDataArray[3] = 2;
        if (filetype == 2)  //tif��ʽ
            aDataArray[3] = 3;
        if (filetype == 3)  //pdf��ʽ
            aDataArray[3] = 4;
        socket.send(aDataArray.buffer);
    }
}

function SetJpgQuality(val) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x29;
        aDataArray[3] = val;
        socket.send(aDataArray.buffer);
    }
}

function SetColorMode(colorMode) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xA0;
        aDataArray[3] = colorMode;
        socket.send(aDataArray.buffer);
    }
}


function SetDeleteBlackEdge(flag) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xA1;
        aDataArray[3] = flag;
        socket.send(aDataArray.buffer);
    }
}

function Cam_SetDeleteBgColor(flag) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xA2;
        aDataArray[3] = flag;
        socket.send(aDataArray.buffer);
    }
}


function toUploadFile(url, filepath) {

    if (isSocketConnect) {

        //console.log(url);
        var urlpath = encodeURI(url);
        var urlpathArray = stringToByte(urlpath);
        //console.log(urlpath);

        var imgpath = encodeURI(filepath);
        var imgpathArray = stringToByte(imgpath);

        var len = urlpathArray.length + imgpathArray.length;
        var pathDataArray = new Uint8Array(len);
        for (var i = 0; i < urlpathArray.length; i++) {
            pathDataArray[i] = urlpathArray[i];
        }
        for (var i = 0; i < imgpathArray.length; i++) {
            pathDataArray[urlpathArray.length + i] = imgpathArray[i];
        }

        var packageCount = 0;
        var tmpLen=len;
        while (tmpLen > 0) {
            tmpLen = tmpLen - 90;
            packageCount++;
        }

        console.log("packageCount:" + packageCount);

        var pindex = 0;
        tmpLen = len;
        while (tmpLen > 0) {
            tmpLen = tmpLen - 90;
           
            if (tmpLen > 0) {
                var totalLen = 90 + 17;
                var aDataArray = new Uint8Array(totalLen);
                aDataArray[0] = 0x77;
                aDataArray[1] = 0x88;
                aDataArray[2] = 0x90;
                aDataArray[3] = len >> 16 & 0xff;
                aDataArray[4] = len >> 8 & 0xff;
                aDataArray[5] = len & 0xff;
                aDataArray[6] = urlpathArray.length >> 16 & 0xff;
                aDataArray[7] = urlpathArray.length >> 8 & 0xff;
                aDataArray[8] = urlpathArray.length & 0xff;
                aDataArray[9] = imgpathArray.length >> 16 & 0xff;
                aDataArray[10] = imgpathArray.length >> 8 & 0xff;
                aDataArray[11] = imgpathArray.length & 0xff;
                aDataArray[12] = packageCount >> 8 & 0xff;   //������
                aDataArray[13] = packageCount & 0xff;   //������
                aDataArray[14] = 90;   //�ְ�����
                aDataArray[15] = pindex >> 8 & 0xff;   //�����
                aDataArray[16] = pindex & 0xff;    //�����
                console.log("pindex:" + pindex);
                for (var i = 0; i < 90; i++) {
                    aDataArray[17 + i] = pathDataArray[i + pindex*90];
                }
                socket.send(aDataArray.buffer);
            }
            else {
                var totalLen = 90 + tmpLen + 17;  // ��ʱtmpLenΪ���������ӷ�����
                var aDataArray = new Uint8Array(totalLen);
                aDataArray[0] = 0x77;
                aDataArray[1] = 0x88;
                aDataArray[2] = 0x90;
                aDataArray[3] = len >> 16 & 0xff;
                aDataArray[4] = len >> 8 & 0xff;
                aDataArray[5] = len & 0xff;
                aDataArray[6] = urlpathArray.length >> 16 & 0xff;
                aDataArray[7] = urlpathArray.length >> 8 & 0xff;
                aDataArray[8] = urlpathArray.length & 0xff;
                aDataArray[9] = imgpathArray.length >> 16 & 0xff;
                aDataArray[10] = imgpathArray.length >> 8 & 0xff;
                aDataArray[11] = imgpathArray.length & 0xff;
                aDataArray[12] = packageCount >> 8 & 0xff;   //������
                aDataArray[13] = packageCount & 0xff;   //������
                aDataArray[14] = 90 + tmpLen;   //�ְ�����
                aDataArray[15] = pindex >> 8 & 0xff;   //�����
                aDataArray[16] = pindex & 0xff;    //�����
                console.log("pindex:" + pindex);
                for (var i = 0; i < (90 + tmpLen); i++) {
                    aDataArray[17 + i] = pathDataArray[i + pindex * 90];
                }
                socket.send(aDataArray.buffer);
            }
            pindex++;
            toSleep(80);
        }

    }

 }


function ReadIdCard(cardImgPath) {
    if (isSocketConnect) {

        if (cardImgPath == "") {
            var len = 0;
            var totalLen = len + 3;
            var aDataArray = new Uint8Array(totalLen);
            aDataArray[0] = 0x77;
            aDataArray[1] = 0x88;
            aDataArray[2] = 0x80;
            for (var i = 0; i < len; i++) {
                aDataArray[3 + i] = pathArray[i];
            }
            socket.send(aDataArray.buffer);

        }
        else {
            var path = encodeURI(cardImgPath);
            var pathArray = stringToByte(path);
            var len = pathArray.length;
            var totalLen = len + 3;
            var aDataArray = new Uint8Array(totalLen);
            aDataArray[0] = 0x77;
            aDataArray[1] = 0x88;
            aDataArray[2] = 0x80;
            for (var i = 0; i < len; i++) {
                aDataArray[3 + i] = pathArray[i];
            }
            socket.send(aDataArray.buffer);
        }       
    }
}

function GetDevCount() {
    var aDataArray = new Uint8Array(3);
    aDataArray[0] = 0x77;
    aDataArray[1] = 0x88;
    aDataArray[2] = 0x50;  
    socket.send(aDataArray.buffer);
}

function GetResolution(iCamNo) {
    var aDataArray = new Uint8Array(4);
    aDataArray[0] = 0x77;
    aDataArray[1] = 0x88;
    aDataArray[2] = 0x51;
    aDataArray[3] = iCamNo;
    socket.send(aDataArray.buffer);
}

function OpenCamera(iCamNo, width, height) {

    pALastX = 0;
    pALastY = 0;
    pACurrentX = 0;
    pACurrentY = 0;

    if (isSocketConnect) {
        var aDataArray = new Uint8Array(12);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x01;   //������ͷ
        aDataArray[3] = iCamNo;
        aDataArray[4] = MainCanvas.width >> 8 & 0xff;
        aDataArray[5] = MainCanvas.width & 0xff;
        aDataArray[6] = MainCanvas.height >> 8 & 0xff;
        aDataArray[7] = MainCanvas.height & 0xff;
        aDataArray[8] = width >> 8 & 0xff;
        aDataArray[9] = width & 0xff;
        aDataArray[10] = height >> 8 & 0xff;
        aDataArray[11] = height & 0xff;

        socket.send(aDataArray.buffer);
    }
}

function CloseCamera() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x02;  //�ر�����ͷ
        aDataArray[3] = 0x00;
        socket.send(aDataArray.buffer);
    }
}


function CaptureImage(fileAddr) {

    if (isSocketConnect) {

        // var pathArray = stringToUint8Array(fileAddr);
        if (fileAddr == "") {
            var packageCount = 1;
            var len = 0;
            var pindex = 0;
            var totalLen =  12;  
            var aDataArray = new Uint8Array(totalLen);
            aDataArray[0] = 0x77;
            aDataArray[1] = 0x88;
            aDataArray[2] = 0x10;
            aDataArray[3] = 0x00;
            aDataArray[4] = len >> 16 & 0xff;
            aDataArray[5] = len >> 8 & 0xff;
            aDataArray[6] = len & 0xff;
            aDataArray[7] = packageCount >> 8 & 0xff;   //������
            aDataArray[8] = packageCount & 0xff;   //������
            aDataArray[9] = 0;   //�ְ�����
            aDataArray[10] = pindex >> 8 & 0xff;   //�����
            aDataArray[11] = pindex & 0xff;    //�����
            console.log("pindex:" + pindex);
            socket.send(aDataArray.buffer);
        }
        else {
            var path = encodeURI(fileAddr);
            //console.log(path);
            var pathArray = stringToByte(path);
            var len = pathArray.length;

            var packageCount = 0;
            var tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;
                packageCount++;
            }

            console.log("packageCount:" + packageCount);

            var pindex = 0;
            tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;

                if (tmpLen > 0) {
                    var totalLen = 90 + 12;
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0x10;
                    aDataArray[3] = 0x00;
                    aDataArray[4] = len >> 16 & 0xff;
                    aDataArray[5] = len >> 8 & 0xff;
                    aDataArray[6] = len & 0xff;
                    aDataArray[7] = packageCount >> 8 & 0xff;   //������
                    aDataArray[8] = packageCount & 0xff;   //������
                    aDataArray[9] = 90;   //�ְ�����
                    aDataArray[10] = pindex >> 8 & 0xff;   //�����
                    aDataArray[11] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < 90; i++) {
                        aDataArray[12 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                else {
                    var totalLen = 90 + tmpLen + 12;  // ��ʱtmpLenΪ���������ӷ�����
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0x10;
                    aDataArray[3] = 0x00;
                    aDataArray[4] = len >> 16 & 0xff;
                    aDataArray[5] = len >> 8 & 0xff;
                    aDataArray[6] = len & 0xff;
                    aDataArray[7] = packageCount >> 8 & 0xff;   //������
                    aDataArray[8] = packageCount & 0xff;   //������
                    aDataArray[9] = 90 + tmpLen;   //�ְ�����
                    aDataArray[10] = pindex >> 8 & 0xff;   //�����
                    aDataArray[11] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < (90 + tmpLen); i++) {
                        aDataArray[12 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                pindex++;
                toSleep(80);
            }
         }

    }
 }


function ZoomIn() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x03;  //�Ŵ�
        aDataArray[3] = 0x00;
        socket.send(aDataArray.buffer);
    }
}

function ZoomOut() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x04;  //��С
        aDataArray[3] = 0x00;
        socket.send(aDataArray.buffer);
    }
}

function BestSize() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x05;  //�ʺϴ�С
        aDataArray[3] = 0x00;
        socket.send(aDataArray.buffer);
    }
}

function TrueSize() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x06;  //1:1
        aDataArray[3] = 0x00;
        socket.send(aDataArray.buffer);
    }
}


function Rotate(angle) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(5);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x78;
        aDataArray[3] = 0x00;
        if (angle > 3 || angle<0)
            angle=0;
        aDataArray[4] = angle;
        socket.send(aDataArray.buffer);
    }
 }

function RotateL() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x07;  //����
        aDataArray[3] = 0x00;
        socket.send(aDataArray.buffer);
    }
}

function RotateR() {
    if (isSocketConnect ) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x08;  //����
        aDataArray[3] = 0x00;
        socket.send(aDataArray.buffer);
    }
}


function ManualFocus() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x30;
        aDataArray[3] = 0x00; 
        socket.send(aDataArray.buffer);
    }
 }


function SetCutMode(cutMode) {
    if (isSocketConnect) {

        MainCamCutMode = cutMode; 
        var aDataArray = new Uint8Array(5);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x11;  //���òü�ģʽ
        aDataArray[3] = 0x00;
        aDataArray[4] = cutMode;
        socket.send(aDataArray.buffer);     
    }
}



function SetCutRect(rectX,rectY,rectW,rectH) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(12);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x13;  //���òü�ģʽ
        aDataArray[3] = 0x00;
        aDataArray[4] = rectX >> 8 & 0xff;
        aDataArray[5] = rectX & 0xff;
        aDataArray[6] = rectY >> 8 & 0xff;
        aDataArray[7] = rectY & 0xff;
        aDataArray[8] = rectW >> 8 & 0xff;
        aDataArray[9] = rectW & 0xff;
        aDataArray[10] = rectH >> 8 & 0xff;
        aDataArray[11] = rectH & 0xff;
        socket.send(aDataArray.buffer);
    }
}


/////////////////////////////////////////////////////////////����ʶ��ȶ�///////////////////////////////////////////////////////////////
function OpenFaceCamera() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(8);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xB0;   //����������ͷ
        aDataArray[3] = 0x00;   //�����ֽ�
        aDataArray[4] = MainCanvas.width >> 8 & 0xff;
        aDataArray[5] = MainCanvas.width & 0xff;
        aDataArray[6] = MainCanvas.height >> 8 & 0xff;
        aDataArray[7] = MainCanvas.height & 0xff;
        socket.send(aDataArray.buffer);
    }
}

function CloseFaceCamera() {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0xB3;   //�ر���������ͷ
        aDataArray[3] = 0x00;   //�����ֽ�
        socket.send(aDataArray.buffer);
    }
}

function CaptureFacePhoto(fileAddr) {
    if (isSocketConnect) {
        if (fileAddr == "") {
            var packageCount = 1;
            var len = 0;
            var pindex = 0;
            var totalLen = 11;
            var aDataArray = new Uint8Array(totalLen);
            aDataArray[0] = 0x77;
            aDataArray[1] = 0x88;
            aDataArray[2] = 0xB1;
            aDataArray[3] = len >> 16 & 0xff;
            aDataArray[4] = len >> 8 & 0xff;
            aDataArray[5] = len & 0xff;
            aDataArray[6] = packageCount >> 8 & 0xff;   //������
            aDataArray[7] = packageCount & 0xff;   //������
            aDataArray[8] = 0;   //�ְ�����
            aDataArray[9] = pindex >> 8 & 0xff;   //�����
            aDataArray[10] = pindex & 0xff;    //�����
            console.log("pindex:" + pindex);
            socket.send(aDataArray.buffer);
        }
        else {
            var path = encodeURI(fileAddr);
            console.log(path);
            var pathArray = stringToByte(path);
            var len = pathArray.length;

            var packageCount = 0;
            var tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;
                packageCount++;
            }

            console.log("packageCount:" + packageCount);

            var pindex = 0;
            tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;

                if (tmpLen > 0) {
                    var totalLen = 90 + 11;
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0xB1;
                    aDataArray[3] = len >> 16 & 0xff;
                    aDataArray[4] = len >> 8 & 0xff;
                    aDataArray[5] = len & 0xff;
                    aDataArray[6] = packageCount >> 8 & 0xff;   //������
                    aDataArray[7] = packageCount & 0xff;   //������
                    aDataArray[8] = 90;   //�ְ�����
                    aDataArray[9] = pindex >> 8 & 0xff;   //�����
                    aDataArray[10] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < 90; i++) {
                        aDataArray[11 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                else {
                    var totalLen = 90 + tmpLen + 11;  // ��ʱtmpLenΪ���������ӷ�����
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0xB1;
                    aDataArray[3] = len >> 16 & 0xff;
                    aDataArray[4] = len >> 8 & 0xff;
                    aDataArray[5] = len & 0xff;
                    aDataArray[6] = packageCount >> 8 & 0xff;   //������
                    aDataArray[7] = packageCount & 0xff;   //������
                    aDataArray[8] = 90 + tmpLen;   //�ְ�����
                    aDataArray[9] = pindex >> 8 & 0xff;   //�����
                    aDataArray[10] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < (90 + tmpLen); i++) {
                        aDataArray[11 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                pindex++;
                toSleep(80);
            }
        }
    }
}


function CompareFace(fileAddr) {
    if (isSocketConnect) {
        if (fileAddr == "") {
            return;
        }
        else {
            var path = encodeURI(fileAddr);
            //console.log(path);
            var pathArray = stringToByte(path);
            var len = pathArray.length;

            var packageCount = 0;
            var tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;
                packageCount++;
            }

            console.log("packageCount:" + packageCount);

            var pindex = 0;
            tmpLen = len;
            while (tmpLen > 0) {
                tmpLen = tmpLen - 90;

                if (tmpLen > 0) {
                    var totalLen = 90 + 11;
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0xB2;
                    aDataArray[3] = len >> 16 & 0xff;
                    aDataArray[4] = len >> 8 & 0xff;
                    aDataArray[5] = len & 0xff;
                    aDataArray[6] = packageCount >> 8 & 0xff;   //������
                    aDataArray[7] = packageCount & 0xff;   //������
                    aDataArray[8] = 90;   //�ְ�����
                    aDataArray[9] = pindex >> 8 & 0xff;   //�����
                    aDataArray[10] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < 90; i++) {
                        aDataArray[11 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                else {
                    var totalLen = 90 + tmpLen + 11;  // ��ʱtmpLenΪ���������ӷ�����
                    var aDataArray = new Uint8Array(totalLen);
                    aDataArray[0] = 0x77;
                    aDataArray[1] = 0x88;
                    aDataArray[2] = 0xB2;
                    aDataArray[3] = len >> 16 & 0xff;
                    aDataArray[4] = len >> 8 & 0xff;
                    aDataArray[5] = len & 0xff;
                    aDataArray[6] = packageCount >> 8 & 0xff;   //������
                    aDataArray[7] = packageCount & 0xff;   //������
                    aDataArray[8] = 90 + tmpLen;   //�ְ�����
                    aDataArray[9] = pindex >> 8 & 0xff;   //�����
                    aDataArray[10] = pindex & 0xff;    //�����
                    console.log("pindex:" + pindex);
                    for (var i = 0; i < (90 + tmpLen); i++) {
                        aDataArray[11 + i] = pathArray[i + pindex * 90];
                    }
                    socket.send(aDataArray.buffer);
                }
                pindex++;
                toSleep(80);
            }
        }
    }
 }



//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^����ʶ��ȶ�^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//

function ShowVideoProp() {
     if (isSocketConnect ) {
        var aDataArray = new Uint8Array(4);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x12;  //������Ƶ����
        aDataArray[3] = 0x00;
        socket.send(aDataArray.buffer);
    }
 }


function MoveOffsetXY(px,py,xdir,ydir) {
    if (isSocketConnect) {
        var aDataArray = new Uint8Array(10);
        aDataArray[0] = 0x77;
        aDataArray[1] = 0x88;
        aDataArray[2] = 0x09;  //�ƶ�
        aDataArray[3] = 0x00;
        aDataArray[4] = px >> 8 & 0xff;
        aDataArray[5] = px & 0xff;
        aDataArray[6] = py >> 8 & 0xff;
        aDataArray[7] = py & 0xff;
        aDataArray[8] = xdir ;
        aDataArray[9] = ydir ;
        socket.send(aDataArray.buffer);
    }
}

function onMouseWheel(ev) { /*���������¼�����ʱ��ִ��һЩ����*/
    var ev = ev || window.event;
    var down = true;
    per = 1;
    down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
    if (down) {
        ZoomOut();
        //per += 0.05;
        //console.log("onMouseWheel down");
    } else {
        ZoomIn();
        //per -= 0.05;
        //console.log("onMouseWheel up");
    }
    //    if (ev.preventDefault) { /*FF �� Chrome*/
    //        ev.preventDefault(); // ��ֹĬ���¼�
    //    }
    return false;
}

function MainCanvasMouseDown(e) {
    isMouseDown = true;
    pALastX = e.pageX - MainCanvas.offsetLeft;
    pALastY = e.pageY - MainCanvas.offsetTop;
    if (MainCamCutMode == 1) {
        pACurrentX = pALastX;
        pACurrentY = pALastY;
    }
}

function MainCanvasMouseUp(e) {
    isMouseDown = false;
}

function MainCanvasMouseOut(e) {
    isMouseDown = false;
}

function MainCanvasMouseMove(e) {
    if (isMouseDown) {

        if (MainCamCutMode == 1) {
            pACurrentX = e.pageX - MainCanvas.offsetLeft;
            pACurrentY = e.pageY - MainCanvas.offsetTop;
            SetCutRect(pALastX, pALastY, (pACurrentX - pALastX), (pACurrentY - pALastY));  //�ֶ��ü�����
        }
        else {
            pACurrentX = e.pageX - MainCanvas.offsetLeft;
            pACurrentY = e.pageY - MainCanvas.offsetTop;
            var dx = pACurrentX - pALastX;
            var dy = pACurrentY - pALastY;
            var xdir = 0;
            var ydir = 0;
            if (dx < 0)
                xdir = 0;
            else
                xdir = 1;
            if (dy < 0)
                ydir = 0;
            else
                ydir = 1;
            pALastX = pACurrentX;
            pALastY = pACurrentY;
            MoveOffsetXY(Math.abs(dx), Math.abs(dy), xdir, ydir);            
         }      
     }
}

/************************************************************************************************************************************************/


//>>>>>>>>>>>>>>>>.�޸ĵĵط�>>>>>>>>>>>>>>>
var lockReconnect = false;
var connectCount = 0;
var heartTimerId = -1;

//�������
function heartCheck() {

    clearInterval(heartTimerId);
    heartTimerId = setInterval(function () {
        if (isSocketConnect) {
            var aDataArray = new Uint8Array(3);
            aDataArray[0] = 0x11;
            aDataArray[1] = 0x11;
            aDataArray[2] = 0x11;
            socket.send(aDataArray.buffer);
            console.log("heartCheck...........");
        }
    }, 6000);
}



//var heartCheck = {   
//    timeout: 4000,    //4�뷢һ������
//    timeoutObj: null,
//    serverTimeoutObj: null,
//    reset: function () {
//        //console.log("clearTimeout");
//        clearTimeout(this.timeoutObj);
//        clearTimeout(this.serverTimeoutObj);
//        return this;
//    },

//    start: function () {
//        var self = this;
//        console.log(self.timeout);
//        this.timeoutObj = setTimeout(function(){
//            //���﷢��һ������������յ��󣬷���һ��������Ϣ��
//            console.log("websocket ping 01");
//            var aDataArray = new Uint8Array(3);
//            aDataArray[0] = 0x11;
//            aDataArray[1] = 0x11;
//            aDataArray[2] = 0x11;
//            socket.send(aDataArray.buffer);
//            console.log("websocket ping 02");
//            self.serverTimeoutObj = setTimeout(function () {//�������һ��ʱ�仹û���ã�˵����������Ͽ���
//                console.log("websocket ping 03");
//                socket.close();     //���onclose��ִ��reconnect������ִ��ws.close()������.���ֱ��ִ��reconnect �ᴥ��onclose������������
//            }, self.timeout)
//        }, this.timeout)
//    }
//}


//��������
var intervalId = -1;
function reconnect() {

        clearInterval(intervalId);
        intervalId = setInterval(function () {
            if (isSocketConnect == false) {
                WebSocketConnect();
                console.log("reconnect...")
            }
            console.log("reconnectTimer.........!")
        }, 3000);
}


function WebSocketConnect() {
    socket = new WebSocket("ws://localhost:22225");
    socket.binaryType = "arraybuffer";
    try {

        socket.onopen = function (event) {

            //heartCheck.reset().start(); 
            heartCheck();
            isSocketConnect = true;
            clearInterval(intervalId);
            //if (isOpenMainCamera == false)         
            Cam_GetDevCount();
            console.log("socket.onopen");
            $("TextInfo").value = "设备已打开"

        };

        socket.onclose = function (event) {

            console.log("socket.onclose");
            isSocketConnect = false;
            reconnect();                           
            $("TextInfo").value = "设备已关闭，正在重新打开"
        };

        socket.onerror = function (event) {
            isSocketConnect = false;
            reconnect();                        
            $("TextInfo").value = "设备已报错，正在重新打开"
        };


        socket.onmessage = function (event) {

            //heartCheck.reset().start();      

            var rDataArr = new Uint8Array(event.data);
            if (rDataArr.length > 0) {


                if (rDataArr[0] == 0x11 && rDataArr[1] == 0x11 && rDataArr[2] == 0x11) {
                    console.log("heart socket!!!!");
                }

                if (rDataArr[0] == 0x55 && rDataArr[1] == 0x66) {

                    //����ͷ��Ŀ����
                    if (rDataArr[2] == 0x50) {

                        var devCount = rDataArr[3];
                        var devNameBufLen = rDataArr.length - 4;
                        var devNameData = new Uint8Array(devNameBufLen);
                        for (var i = 0; i < devNameBufLen; i++) {
                            devNameData[i] = rDataArr[4 + i];
                        }
                        //var AllCamName = Uint8ArrayToString(devNameData);
                        var str = byteToString(devNameData);
                        var AllCamName = decodeURIComponent(str);
                        var camName = new Array();
                        camName = AllCamName.split('|');
                        GetDevCountAndNameResultCB(devCount, camName);
                    }

                    //����ͷ�ֱ��ʷ���
                    if (rDataArr[2] == 0x51) {

                        var resCount = rDataArr[3];
                        var resArr = new Array();
                        for (var i = 0; i < resCount; i++) {
                            var width = rDataArr[4 + i * 4 + 0] * 256 + rDataArr[4 + i * 4 + 1];
                            var height = rDataArr[4 + i * 4 + 2] * 256 + rDataArr[4 + i * 4 + 3];
                            var resStr = "" + width + "*" + height;
                            resArr.push(resStr);
                        }
                        GetResolutionResultCB(resCount, resArr);
                    }

                    //����ͷ����״̬����
                    if (rDataArr[2] == 0x01) {

                        if (rDataArr[3] == 0x01) {
                            isOpenMainCamera = true;
                            GetCameraOnOffStatus(0);
                        }
                        if (rDataArr[3] == 0x03) {
                            isOpenMainCamera = false;
                            GetCameraOnOffStatus(1);
                        }
                    }

                    //��������ͷ����״̬����
                    if (rDataArr[2] == 0xB0) {

                        if (rDataArr[3] == 0x01) {
                            GetFaceCameraStatus(0);
                        }
                        if (rDataArr[3] == 0x03) {
                            GetFaceCameraStatus(1);
                        }
                    }

                    if (rDataArr[2] == 0xA5) {
                        var flag;
                        if (rDataArr[3] == 0x00) {
                            flag = 2;
                        }
                        if (rDataArr[3] == 0x01) {
                            flag = 0;
                        }
                        if (flag == 0) {
                            var ResultStr = "";
                            var pDataLen = rDataArr.length - 4;
                            if (pDataLen > 0) {
                                var pData = new Uint8Array(pDataLen);
                                for (var i = 0; i < pDataLen; i++) {
                                    pData[i] = rDataArr[4 + i];
                                }
                                var str = byteToString(pData);
                                console.log(str);
                                ResultStr = decodeURIComponent(str);
                            }
                            console.log(ResultStr);
                        }
                    }


                    //��ǰ����״̬����
                    if (rDataArr[2] == 0x10) {
                        //console.log(rDataArr[3]);
                        //GetCaptrueStatusResultCB(rDataArr[3]);
                    }



                    //���ս������
                    if (rDataArr[2] == 0x10) {

                        var flag;
                        if (rDataArr[3] == 0x01) {
                            flag = 0;
                        }
                        if (rDataArr[3] == 0x02) {
                            flag = 2;
                        }
                        var imgpathLen = rDataArr[4] * 256 + rDataArr[5];
                        if (imgpathLen == 0) {
                            var base64Len = rDataArr[6] * 65536 + rDataArr[7] * 256 + rDataArr[8];
                            var imgPathStr = "";
                            var base64Data = new Uint8Array(base64Len);
                            for (var i = 0; i < base64Len; i++) {
                                base64Data[i] = rDataArr[9 + imgpathLen + i];
                            }
                            var base64Str = Uint8ArrayToString(base64Data);
                            GetCaptrueImgResultCB(flag, imgPathStr, base64Str);
                        }
                        else {
                            var base64Len = rDataArr[6] * 65536 + rDataArr[7] * 256 + rDataArr[8];
                            var pData = new Uint8Array(imgpathLen);
                            for (var i = 0; i < imgpathLen; i++) {
                                pData[i] = rDataArr[9 + i];
                            }
                            var str = byteToString(pData);
                            var imgPathStr = decodeURIComponent(str);

                            var base64Data = new Uint8Array(base64Len);
                            for (var i = 0; i < base64Len; i++) {
                                base64Data[i] = rDataArr[9 + imgpathLen + i];
                            }
                            var base64Str = Uint8ArrayToString(base64Data);

                            GetCaptrueImgResultCB(flag, imgPathStr, base64Str);
                        }

                    }


                    //�ɼ�������Ƭ�������
                    if (rDataArr[2] == 0xB1) {

                        var flag;
                        if (rDataArr[3] == 0x01) {
                            flag = 0;
                        }
                        if (rDataArr[3] == 0x02) {
                            flag = 2;
                        }
                        var imgpathLen = rDataArr[4] * 256 + rDataArr[5];
                        if (imgpathLen == 0) {
                            var base64Len = rDataArr[6] * 65536 + rDataArr[7] * 256 + rDataArr[8];
                            if (base64Len == 0) {
                                GetFacePhotoResultCB(flag, "", "");
                            }
                            else {
                                var imgPathStr = "";
                                var base64Data = new Uint8Array(base64Len);
                                for (var i = 0; i < base64Len; i++) {
                                    base64Data[i] = rDataArr[9 + imgpathLen + i];
                                }
                                var base64Str = Uint8ArrayToString(base64Data);
                                GetFacePhotoResultCB(flag, imgPathStr, base64Str);
                            }
                        }
                        else {
                            var base64Len = rDataArr[6] * 65536 + rDataArr[7] * 256 + rDataArr[8];
                            var pData = new Uint8Array(imgpathLen);
                            for (var i = 0; i < imgpathLen; i++) {
                                pData[i] = rDataArr[9 + i];
                            }
                            var str = byteToString(pData);
                            var imgPathStr = decodeURIComponent(str);

                            var base64Data = new Uint8Array(base64Len);
                            for (var i = 0; i < base64Len; i++) {
                                base64Data[i] = rDataArr[9 + imgpathLen + i];
                            }
                            var base64Str = Uint8ArrayToString(base64Data);

                            GetFacePhotoResultCB(flag, imgPathStr, base64Str);
                        }

                    }


                    //��֤�ȶԽ��
                    if (rDataArr[2] == 0xB2) {
                        var flag;
                        if (rDataArr[3] == 0x01) {
                            flag = 0;
                        }
                        if (rDataArr[3] == 0x02) {
                            flag = 2;
                        }
                        GetFaceCompareResultCB(flag);
                    }

                    //����֤��Ϣ����
                    if (rDataArr[2] == 0x80) {
                        var flag;
                        if (rDataArr[3] == 0x01) {
                            flag = 0;
                        }
                        if (rDataArr[3] == 0x02) {
                            flag = 2;
                        }
                        var pDataLen = rDataArr.length - 4;
                        var pData = new Uint8Array(pDataLen);
                        for (var i = 0; i < pDataLen; i++) {
                            pData[i] = rDataArr[4 + i];
                        }
                        var str = byteToString(pData);
                        var AllInfoStr = decodeURIComponent(str);
                        var resultStr = new Array();
                        resultStr = AllInfoStr.split(';');
                        //console.log(resultStr);
                        GetIdCardInfoResultCB(flag, resultStr[0], resultStr[1], resultStr[2], resultStr[3], resultStr[4], resultStr[5], resultStr[6], resultStr[7], resultStr[8], resultStr[9]);
                    }

                    //�ϴ��������
                    if (rDataArr[2] == 0x90) {
                        var flag;
                        if (rDataArr[3] == 0x01) {
                            flag = 0;
                        }
                        if (rDataArr[3] == 0x02) {
                            flag = 2;
                        }
                        var pDataLen = rDataArr.length - 6;
                        if (pDataLen <= 0) {
                            HttpResultCB(flag, ResultStr);
                        }
                        var pData = new Uint8Array(pDataLen);
                        for (var i = 0; i < pDataLen; i++) {
                            pData[i] = rDataArr[6 + i];
                        }
                        var str = byteToString(pData);
                        var ResultStr = decodeURIComponent(str);
                        //console.log(ResultStr);
                        HttpResultCB(flag, ResultStr);

                    }

                    //�����ά��ʶ��������
                    if (rDataArr[2] == 0x91) {
                        var flag;
                        if (rDataArr[3] == 0x00) {
                            flag = 2;    //δʶ������
                        }
                        if (rDataArr[3] == 0x01) {
                            flag = 0;    //ʶ������
                        }
                        var ResultStr = "";
                        var pDataLen = rDataArr.length - 4;
                        if (flag == 0 && pDataLen > 0) {
                            var pData = new Uint8Array(pDataLen);
                            for (var i = 0; i < pDataLen; i++) {
                                pData[i] = rDataArr[4 + i];
                            }
                            var str = byteToString(pData);
                            console.log(str);
                            ResultStr = decodeURIComponent(str);
                        }
                        console.log(ResultStr);
                        QrBarCodeRecogResultCB(flag, ResultStr);

                    }


                    //���Ӻϲ�PDF�ļ��������
                    if (rDataArr[2] == 0x31) {
                        var flag;
                        var base64Len = rDataArr.length - 4;
                        var base64Str = "";
                        if (base64Len > 0) {
                            var base64Data = new Uint8Array(base64Len);
                            for (var i = 0; i < base64Len; i++) {
                                base64Data[i] = rDataArr[4 + i];
                            }
                            base64Str = Uint8ArrayToString(base64Data);
                        }
                        if (rDataArr[3] == 0x01) {
                            flag = 0;
                        }
                        if (rDataArr[3] == 0x02) {
                            flag = 2;
                        }
                        AddImgFileToPDFResultCB(flag, base64Str);
                    }


                    //�ϲ�PDF�������
                    if (rDataArr[2] == 0x32) {
                        var flag;
                        var base64Len = rDataArr.length - 4;
                        var base64Str = "";
                        if (base64Len > 0) {
                            var base64Data = new Uint8Array(base64Len);
                            for (var i = 0; i < base64Len; i++) {
                                base64Data[i] = rDataArr[4 + i];
                            }
                            base64Str = Uint8ArrayToString(base64Data);
                        }
                        if (rDataArr[3] == 0x01) {
                            flag = 0;
                        }
                        if (rDataArr[3] == 0x02) {
                            flag = 2;
                        }
                        PdfCombineResultCB(flag, base64Str);
                    }


                    if (rDataArr[2] == 0xA5) {
                        var flag;
                        if (rDataArr[3] == 0x00) {
                            flag = 2;
                        }
                        if (rDataArr[3] == 0x01) {
                            flag = 0;
                        }
                        var ResultStr = "";
                        if (flag == 0) {
                            var pDataLen = rDataArr.length - 4;
                            if (pDataLen > 0) {
                                var pData = new Uint8Array(pDataLen);
                                for (var i = 0; i < pDataLen; i++) {
                                    pData[i] = rDataArr[4 + i];
                                }
                                var str = byteToString(pData);
                                ResultStr = decodeURIComponent(str);
                            }
                            // console.log(ResultStr);
                        }
                        GetLicenseResultCB(ResultStr);
                    }


                    //��ȡ�����̷�
                    if (rDataArr[2] == 0xA6) {
                        var strLen = rDataArr.length - 3;
                        if (strLen > 0) {
                            var driveData = new Uint8Array(strLen);
                            for (var i = 0; i < strLen; i++) {
                                driveData[i] = rDataArr[3 + i];
                            }
                            var driveStr = Uint8ArrayToString(driveData);
                            GetDriveResultCB(driveStr);
                        }
                        else {
                            GetDriveResultCB("");
                        }
                    }


                    //ɾ���ļ����
                    if (rDataArr[2] == 0xA8) {
                        var flag;
                        if (rDataArr[3] == 0) {
                            flag = 0;
                        }
                        else {
                            flag = 2;
                        }
                        GetDeleteFileResultCB(flag);
                    }



                    //����ͷ����
                    if (rDataArr[2] == 0xcc) {

                        var ww = rDataArr[3] * 256 + rDataArr[4];
                        var hh = rDataArr[5] * 256 + rDataArr[6];
                        pMainShowStartX = rDataArr[7] * 256 + rDataArr[8];
                        pMainShowStartY = rDataArr[9] * 256 + rDataArr[10];
                        MainContext.clearRect(0, 0, MainCanvas.width, MainCanvas.height);
                        var imgData = MainContext.createImageData(ww, hh);
                        var dataNum = 0;
                        dataNum = dataNum + 11;
                        for (var i = 0; i < imgData.data.length; i += 4) {
                            imgData.data[i + 0] = rDataArr[dataNum];
                            imgData.data[i + 1] = rDataArr[dataNum + 1];
                            imgData.data[i + 2] = rDataArr[dataNum + 2];
                            imgData.data[i + 3] = 255;
                            dataNum = dataNum + 3;
                        }

                        MainContext.putImageData(imgData, pMainShowStartX, pMainShowStartY);

                        if (MainCamCutMode == 1) {
                            MainContext.strokeStyle = 'red'; // ������������ɫ
                            MainContext.lineWidth = 2; // ���������Ŀ���
                            MainContext.beginPath(); // ����ֱ��
                            MainContext.rect(pALastX, pALastY, (pACurrentX - pALastX), (pACurrentY - pALastY));
                            MainContext.closePath();
                            MainContext.stroke();
                        }
                    }

                    rDataArr = null;

                }
            }



        };    
    }
    catch (ex) {
        alert("�쳣����!") 
    }
}


