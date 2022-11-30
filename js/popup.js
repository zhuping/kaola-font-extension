function updatePopup(response) {
  response = response || '获取失败，请刷新页面重新获取~';

  replaceResponse(response).then(value => {
    document.querySelector('.code-container-extension').querySelector('.code').innerHTML = value;
  });

  // 初始化复制功能
  initClipboard();
}

function replaceResponse(response) {
  return new Promise(resolve => {
    const urls = response && response.match(/\/\/at.alicdn.com\/[^'\?#]*/g) || [];
  
    const promise = urls.map(url => {
      const reg = new RegExp(url, 'g');
  
      if (!~url.indexOf('.css')) {
        return downloadFontFile(url).then(file => {
          return uploadFileToNuwa(file)
        }).then(neoUrl => {
          // 去除协议头
          neoUrl = neoUrl.replace(/^http[s]?:/g, '');
          response = response.replace(reg, neoUrl);
        })
      } else {
        // handle font class file
        return downloadFontFile(url).then(file => {
          return getFileContent(file);
        }).then(content => {
          return replaceResponse(content);
        }).then(newContent => {
          const filename = /[^/]*\.[^\.]+$/.exec(url)[0];
          const file = new File([newContent], filename, {type: 'application/octet-stream'});
          return uploadFileToNuwa(file);
        }).then(newUrl => {
          newUrl = newUrl.replace(/^http[s]?:/g, '');
          resolve(newUrl);
        });
      }
    })
  
    Promise.all(promise).then(() => {
      resolve(response);
    });
  });
}

function getFileContent(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function(e) {
      resolve(e.target.result);
    }
    reader.onerror = function(e) {
      reject(e);
    }
  });
}

function downloadFontFile(url) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http:' + url, true);
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        const filename = /[^/]*\.[^\.]+$/.exec(url)[0];

        // Blob 类型转成 File 类型
        const file = new File([this.response], filename, {type: 'application/octet-stream'})

        resolve(file);
      }
    }
    xhr.send();
  });
}

function uploadFileToNuwa(file) {
  return new Promise(function(resolve, reject) {
    const formData = new FormData();
    formData.append('file', file);

    let xhr = new XMLHttpRequest();
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
  const clipboard = new Clipboard('.copy');

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