const request = require('request');


module.exports.tiny = function (theFile, cb) {
    request({
        url: 'https://tinypng.com/web/shrink',
        method: "post",
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Connection": "keep-alive",
            "Host": "tinypng.com",
            "DNT": 1,
            "Referer": "https://tinypng.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:42.0) Gecko/20100101 Firefox/42.0"
        },
        body: theFile.contents
    }, function (error, response, body) {
        if (error) {
            return cb(error, theFile);
        }
        let results
        try {
            results = JSON.parse(body);
        } catch (error) {
            console.log(body);
            return cb(error, theFile);
        }


        // console.log(results);
        if (results.output && results.output.url) {
            request.get({ url: results.output.url, encoding: null }, function (err, res, body) {
                if (err) {
                    return cb(err, theFile);
                } else {
                    var output = results.output;

                    theFile.result = {
                        type: output.type,
                        fromSize: results.input.size,
                        toSize: output.size,
                        width: output.width,
                        height: output.height,
                        body: body
                    };
                    // console.log(compressInfos);
                    cb(false, theFile);
                    // fs.writeFileSync(path.join(__dirname, './blocks1.png'), new Buffer(body))
                }


            });
        } else {
            return cb(results.message || 'no out put', theFile);
        }
    });
};
