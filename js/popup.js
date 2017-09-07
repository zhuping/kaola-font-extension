function updatePopup(response) {
  response = response || '获取失败，请刷新页面重新获取~';
  var urls = response && response.match(/\/\/at.alicdn.com\/[^'\?#]*/g) || [];

  var promise = urls.map((url) => {
    var reg = new RegExp(url, 'g');
    return downloadFontFile(url).then((file) => {
      return uploadFileToNeo(file)
    }).then((neoUrl) => {
      // 去除协议头
      neoUrl = neoUrl.replace(/^http[s]?:/g, '');
      response = response.replace(reg, neoUrl);
    })
  })

  Promise.all(promise).then(() => {
    document.querySelector('.code-container-extension').querySelector('.code').innerHTML = response;
  })

  // 初始化复制功能
  initClipboard();
}

function downloadFontFile(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http:' + url, true);
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var filename = /[^/]*\.[^\.]+$/.exec(url)[0];

        // Blob 类型转成 File 类型
        var file = new File([this.response], filename, {type: 'application/octet-stream'})

        resolve(file);
      }
    }
    xhr.send();
  });
}

function uploadFileToNeo(file) {
  return new Promise(function(resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://nos.kaolafed.com/upload', true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        try {
          resolve(JSON.parse(this.response).url);
        } catch (e) {
          alert('文件上传nos出错');
        }
      }
    }
    xhr.send(formData);
  });
}

function initClipboard() {
  var clipboard = new Clipboard('.copy');

  clipboard.on('success', function(e) {
    document.querySelector('.clipboard-tips').innerHTML = '复制成功';
    e.clearSelection();
  })
}

window.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'getCode'
    }, updatePopup);
    
    // var port = chrome.tabs.connect(tabs[0].id, {
    //   name: 'uploadFont'
    // })

    // port.postMessage({
    //   action: 'getCode'
    // });

    // port.onMessage.addListener(function(response) {
    //   updatePopup(response.code)
    // });
  })
})