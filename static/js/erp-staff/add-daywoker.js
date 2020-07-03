/* 写在angular里不支持，可重写gpyhs.js，目前用最原始的写法 */
const origin = location.origin,
  base64 = new Base64(),
  token = localStorage.getItem('erptoken')?base64.decode(localStorage.getItem('erptoken')):'';
  if(!token) location.href = `/login.html?traget=${base64.encode(location.href)}`;
let url, storehouse;
if (origin == 'https://erp.cjdropshipping.cn' || origin == 'https://erp.cjdropshipping.com') {
  url = `${origin}`;
} else {
  url = 'http://192.168.5.197:8020';
    // url = 'http://192.168.5.176:8088';
}

/*----------------------------------------------------
  ---（必须重写该函数）返回获取的设备数目及设备名称  ---
  -----------------------------------------------------*/
function GetDevCountAndNameResultCB(devCount, devNameArr) {
  if (devCount > 0) {
    //获取分辨率
    Cam_GetDevResolution(0);

  } else {
    ShowInfo("没有发现合适的设备,请刷新！");
  }
}

/*---------------------------------------------------
---  （必须重写该函数）返回获取的设备分辨率信息   ---
----------------------------------------------------*/
function GetResolutionResultCB(resCount, resArr) {

  if (resCount > 0) {
    //打开摄像头
    Cam_Close();
    var restr = '2592*1944';
    var pos = restr.lastIndexOf("*");
    var width = parseInt(restr.substring(0, pos));
    var height = parseInt(restr.substring(pos + 1, restr.length));
    Cam_Open(0, width, height);
  } else {
    ShowInfo("获取分辨率信息失败！");
  }
}
function ShowInfo(txt){
  let textInfo = document.getElementById('TextInfo');
  textInfo.value='';
  setTimeout(()=>{
    textInfo.value=txt;
  },500)
  
}

/*---------------------------------------------------
---     （必须重写该函数）返回摄像头开启状态      ---
----------------------------------------------------*/
function GetCameraOnOffStatus(status) {
  if (status == 0) {
    ShowInfo('设备开启成功')
  } else {
    ShowInfo("设备开启失败!");
  }

}


/*---------------------------------------------------
--------     （必须重写该函数）拍照结果     ---------
----------------------------------------------------*/
function GetCaptrueImgResultCB(flag, path, base64Str) {
  if (flag == 0) {
    var obj = document.getElementById("CameraPhoto");
    obj.src = "data:;base64," + base64Str;
    if (path == "") {
      ShowInfo("拍照成功");
    } else {
      ShowInfo("拍照成功，图片保存位置：" + path);
    }
  } else {
    ShowInfo("拍照失败!");
  }

}

function postFun(url, data, fn) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  // 添加http头，发送信息至服务器时内容编码类型
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("token", token);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
      fn.call(this, xhr.responseText);
    }
  };
  xhr.send(data);
}
/* 添加新员工 */
function addWoker(param) {
  let scanDom = document.getElementById("audio-scan");
  let workDom = document.getElementById("audio-work");
  let afterworkDom = document.getElementById("audio-afterwork");
  let timeDom = document.getElementById("audio-time");
  postFun(`${url}/linShiGong/brushCard`, JSON.stringify(param), function(data) {
    const cjdata = JSON.parse(data);
    if (cjdata.code == 9901) { //扫码
      // scanDom.play();
      doTTS('请扫描收款码')
      Cam_RecogQrBarCodeFromCamera(1)
    } else if (cjdata.code == 9902) {
      //设置时间
      // timeDom.play();
      doTTS('请设置时间')
    } else if (cjdata.code == 9903) {
      //上班成功
      doTTS(`${param.name}上班成功`)
      // workDom.play();
      setTimeout(()=>{
        GetIdCardInfo();
      },3000)
    } else if (cjdata.code == 9904) {
      //下班成功
      doTTS(`${param.name}下班成功`)
      // afterworkDom.play();
      setTimeout(()=>{
        GetIdCardInfo();
      },2000)
    } else if (cjdata.code == 601) {
      location.href = `/login.html?traget=${base64.encode(location.href)}`
    }
  })
}

function getStore() {
  const warehouse = document.getElementById("warehouse");
  const warehouseMap = {
    0: 'bc228e33b02a4c03b46b186994eb6eb3',
    1: '522d3c01c75e4b819ebd31e854841e6c',
    2: '08898c4735bf43068d5d677c1d217ab0'
  }
  storehouse = warehouseMap[warehouse.selectedIndex]
}
/* 设置时间 */
function setTime() {
  let time = document.getElementById('c-data-time').value;
  let now = new Date().getTime();
  let setTime = new Date(time).getTime();
  console.log(new Date())
  console.log(now,setTime,(now-setTime)/60000)
  if(!setTime){
    return doTTS('请设置打卡时间');
  }else if((now-setTime)/60000>60 || (now-setTime)/60000<-60 ){
    return doTTS('请重新设置打卡时间');
  }
  getStore();
  let param = {
    jiSuanShiJian: setTime, //选择的时间（时间戳），
    store: storehouse, //仓库id
  }
  postFun(`${url}/linShiGong/setComputingTime`, JSON.stringify(param), function(res) {
    let data = JSON.parse(res);
    if(data.code==200){
      doTTS('已设置打卡时间')
      GetIdCardInfo()
    }else{
      doTTS('设置失败，请重新设置')
    }
  })
}

/* 设置二维码 */
function setQrcode(codeStr) {
  getStore();
  let param = {
    idCardNum: document.getElementById("CardNum").value, //选择的时间（时间戳），
    store: storehouse, //仓库id
    qr: codeStr
  }
  postFun(`${url}/linShiGong/scanQr`, JSON.stringify(param), function(cjdata) {
    GetIdCardInfo();
  })
}
/*---------------------------------------------------
------  （必须重写该函数）身份证信息返回结果   ------
----------------------------------------------------*/
function GetIdCardInfoResultCB(flag, Name, Sex, Nation, Born, Address, CardNum, IssuedAt, EffectedDate, CardImgPath, CardImgBase64) {
  if (flag == 0) {
    ShowInfo('已读取身份证')
    document.getElementById("CardName").value = Name;
    document.getElementById("CardSex").value = Sex;
    document.getElementById("CardNation").value = Nation;
    document.getElementById("CardBorn").value = Born;
    document.getElementById("CardAddress").value = Address;
    document.getElementById("CardNum").value = CardNum;
    document.getElementById("CardIssuedAt").value = IssuedAt;
    document.getElementById("CardEffectDate").value = EffectedDate;
    var obj = document.getElementById("IdCardPhoto");
    obj.src = "data:;base64," + CardImgBase64;
    getStore();
    const data = {
      idCardNum: CardNum,
      name: Name,
      gender: Sex == '男' ? 1 : 2,
      address: Address,
      birthday: Born,
      store: storehouse,
      picBase: CardImgBase64
    }
    addWoker(data)
  } else {
    setTimeout(()=>{
      GetIdCardInfo();
    },2000)
    ShowInfo("读卡失败!");
  }

}
function doTTS(txt) {
  var readText = document.getElementById('readText');
  var ttsAudio = document.getElementById('tts_autio_id');

  // 文字转语音
  if(ttsAudio){
    readText.removeChild(ttsAudio);
  }
  
  var au1 = '<audio id="tts_autio_id" autoplay="autoplay">';
  var sss = '<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&ok spd=5&text=' + txt + '" type="audio/mpeg">';
  var eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
  var au2 = '</audio>';
  readText.innerHTML = au1 + sss + eee + au2;

  ttsAudio = document.getElementById('tts_autio_id');

  ttsAudio.play();
}

/*---------------------------------------------------
------  （必须重写该函数）条码二维码识别返回结果------
----------------------------------------------------*/
function QrBarCodeRecogResultCB(flag, codeStr) {
  let scanDom = document.getElementById("audio-scan");
  if (flag == 0) {
    ShowInfo("条码/二维码 识别结果:" + codeStr);
    doTTS('收款码已识别')
    setTimeout(()=>{
      setQrcode(codeStr);
    },1000)
  } else {
    doTTS('请扫描收款码')
    setTimeout(()=>{
      Cam_RecogQrBarCodeFromCamera(1)
    },3000)
  }
}

function LoadCameraDocument() {

  if (!window.WebSocket) {
    alert("浏览器不支持HTML5,请更新浏览器或者使用其它浏览器");
  }
  //console.log("LoadCameraDocument");
  var obj = document.getElementById("CameraCtl");
  Cam_ControlInit(obj, 0, 0, 600, 400);
}
window.onload = () => {
  LoadCameraDocument();
}

/* 读身份证 */
function GetIdCardInfo() {
  var path = "D:\\IdCard.jpg";
  Cam_ReadIdCard(path);
}
//从摄像头中识别二维码
function RecogQrCodeFromCamera() {
  Cam_RecogQrBarCodeFromCamera(1)
}
//打开设备
function toOpen() {
  Cam_Open(0 ,2592, 1944);
  setTimeout(function(){
    GetIdCardInfo()
  },5000)
}