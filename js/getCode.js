chrome.runtime.onMessage.addListener(function(request, sender, response) {
  if (request.action === 'getCode') {
    var codeNode = null;
    var curType = null;
    var types = document.querySelector('.type-select').querySelectorAll('li');
    for (var i = 0; i < types.length; i++) {
      if (trim(types[i].getAttribute('class')) === 'current') {
        curType = types[i];
        break;
      }
    }

    function trim(string) {
      return string && string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }

    switch (curType.innerHTML) {
      case 'Unicode':
        codeNode = document.querySelector('#J_cdn_type_unicode');
        break;
      case 'Font class':
        codeNode = document.querySelector('#J_cdn_type_fontclass');
        break;
      case 'Symbol':
        codeNode = document.querySelector('#J_cdn_type_svgsymbol');
        break;
    }

    if (codeNode) {
      response(codeNode.innerHTML);
    }
  }
});