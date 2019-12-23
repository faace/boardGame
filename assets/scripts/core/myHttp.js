
let sendHttp = function (url, cb, responseType, times, data) {   // data表示参数
    // let xhr = cc.loader.getXMLHttpRequest();
    try {
        let xhr = new XMLHttpRequest();
        url += ((url.indexOf('?') > 0) ? '&' : '?') + '_t=' + (new Date() - 0);
        let tm = setTimeout(() => {
            ge.log('sendHttpPost timeout', url, data);
            cb && cb('sendHttpPost timeout')
            cb = undefined;
        }, 12000);
        if (data) {
            xhr.responseType = responseType || 'text';
            xhr.open('POST', url, true);
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(typeof data == 'string' ? data : JSON.stringify(data));
        } else {
            xhr.responseType = responseType || "arraybuffer";
            xhr.open('GET', url, true);
            xhr.send(null);
        }
        xhr.onreadystatechange = function () { // 下载结束
            if (this.readyState === 4) {
                if (tm) tm = clearTimeout(tm);
                if (this.status === 200 || (CC_TEST && this.status === 0)) {
                    // ge.log(this.response);
                    // ge.log(this.responseText);
                    if (this.responseType == "arraybuffer") cb && cb(null, new Uint8Array(this.response || [' ']), this.response);
                    else if (this.responseType == "json") {
                        let resp = '';
                        if (typeof (this.response) == 'string') {
                            resp = this.response;
                        } else if (typeof (this.response) == 'object') {
                            resp = JSON.stringify(this.response);
                        }
                        cb && cb(null, resp || this.responseText || '');
                    }
                    else cb && cb(null, this.responseText || ' ');
                } else {
                    cb && cb('Load. ' + url + ' failed!');
                }
            }
        };
        xhr.onerror = function (err) { // 出现下载错误
            ge.log('aaaa', err)
            if (tm) tm = clearTimeout(tm);
            if (times-- < 0) cb && cb(err || true);
            else sendHttp(url, cb, responseType, times);
        };
        return xhr;
    } catch (error) {
        ge.log('dddd', error);
        if (tm) tm = clearTimeout(tm);
        if (times-- < 0) cb && cb(err || true);
        else sendHttp(url, cb, responseType, times);
    }
};

module.exports = {
    sendHttp: sendHttp
}