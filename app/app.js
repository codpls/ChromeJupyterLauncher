// Copyright 2018. All rights reserved.

var port = null;

function onNativeMessage(message) {
  var cmd = message.cmd;
  if (cmd === 'status') {
    var ul = document.getElementById('inlist');
    ul.innerHTML = '';
    var ninstance = message.echo.length;
    if (ninstance > 0) {
      var title = ninstance + ' instances running';
      if (ninstance == 1) {
        title = 'running';
      }
      document.getElementById('status-text').style.color = 'green';
      document.getElementById('status-text').innerHTML = title;
      var arr = message.echo.sort((a,b) => {
        var rea = /(?<=http.*?:)(\d+)(?=\/)/.exec(a);
        var reb = /(?<=http.*?:)(\d+)(?=\/)/.exec(b);
        return parseInt(rea) - parseInt(reb);
      });
      for (ins of arr) {
        var li = document.createElement('li');
        var reresult = /(?<=http.*?:)(\d+)(?=\/)/.exec(ins);
        var atext = ins;
        var aport = '';
        if (reresult && reresult.length && reresult.length > 0) {
          atext = 'instance ' + reresult[0];
          aport = reresult[0];
        }
        li.innerHTML = `<img src="stop.png" data-port="${aport}" data-url="${ins}" /><a target='_blank' href="${ins}" title="${ins}">${atext}</a>`
        ul.appendChild(li);
      }
    } else {
      document.getElementById('status-text').style.color = 'darkorange';
      document.getElementById('status-text').innerHTML = 'stopped';
    }
    document.getElementById('status').style.display = 'inherit';
    document.getElementById('add-btn').style.display = 'inline-block';
  } else if (cmd === 'stop') {
    checkStatus();
    return;
  }
  stopLoad();
}

function startLoad() {
  document.getElementById('cover').style.display = 'inherit';
}

function stopLoad() {
  document.getElementById('cover').style.display = 'none';
}

function runCmd(cmd, param='') {
  var hostName = "com.codpls.jupyter.chrome.starter";
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.postMessage({"cmd": cmd, "data": param});
}

function checkStatus() {
  startLoad();
  runCmd('status')
}

function createInstance() {
  startLoad();
  runCmd('start')
}

function stopInstance(p, url) {
  let rer = /^\w+:\/\/.*?(?=\/)/.exec(url);
  if (rer && rer.length > 0) {
    let tarurl = rer[0].toLowerCase();
    chrome.tabs.getAllInWindow(null, function(tabs){
      for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i];
        if (tab && tab.url) {
          let retab = /^\w+:\/\/.*?(?=\/)/.exec(tab.url);
          if (retab && retab.length > 0 && retab[0]) {
            if (retab[0].toLowerCase() === tarurl) {
              if (confirm('This instance is currently using, if force closed you may lose unsaved work, continue?')) {
                startLoad();
                runCmd('stop', p);
                // chrome.tabs.update(tab.id, {'active': true});
                chrome.tabs.remove(tab.id);
              }
              return;
            }
          }
        }
      }
      startLoad();
      runCmd('stop', p);
    });
  }
}

function instanceClick(e) {
  var tag = e.target.tagName;
  if (tag === 'IMG') {
    var p = e.target.dataset.port;
    if (p) {
      stopInstance(p, e.target.dataset.url);
    }
  } else if (tag === 'A') {
    let url = e.target.href;
    let rer = /^\w+:\/\/.*?(?=\/)/.exec(url);
    if (rer && rer.length > 0) {
      let tarurl = rer[0].toLowerCase();
      chrome.tabs.getAllInWindow(null, function(tabs){
        for (let i = 0; i < tabs.length; i++) {
          let tab = tabs[i];
          if (tab && tab.url) {
            let retab = /^\w+:\/\/.*?(?=\/)/.exec(tab.url);
            if (retab && retab.length > 0 && retab[0]) {
              if (retab[0].toLowerCase() === tarurl) {
                chrome.tabs.update(tab.id, {'active': true});
                return;
              }
            }
          }
        }
        // open
        chrome.tabs.create({'url': url});
      });
      e.preventDefault();
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  checkStatus();
  document.getElementById('add-btn').addEventListener('click', createInstance);
  document.getElementById('inlist').addEventListener('click', instanceClick);
});
