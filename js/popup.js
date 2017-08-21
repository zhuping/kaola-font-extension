function updatePopup(response) {
  var urls = response && response.match(/\/\/at.alicdn.com\/[^'\?#]*/g) || '获取失败，请刷新页面重新获取~';

  var promise = urls.map((url) => {
    var reg = new RegExp(url);
    return downloadFontFile(url).then((file) => {
      return uploadFileToNeo(file)
    }).then((neoUrl) => {
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
        resolve(this.response);
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
    xhr.open('POST', 'http://nos.kaolafed.com/upload', true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        resolve(JSON.parse(this.response).url);
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
      action: 'getUnicode'
    }, updatePopup);
  })
})