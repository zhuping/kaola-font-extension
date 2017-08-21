chrome.runtime.onMessage.addListener(function(request, sender, response) {
  if (request.action === 'getUnicode') {
    var node = document.querySelector('#J_cdn_type_unicode');
    if (node) {
      response(node.innerHTML);
    }
  }
});