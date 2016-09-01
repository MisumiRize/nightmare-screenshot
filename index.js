var clipRect = exports.clipRect = function(rect) {
    return function(nightmare) {
        nightmare.page.set('clipRect', rect);
    };
};

var screenshotRect = exports.screenshotRect = function (path, rect) {
    return function(nightmare) {
        nightmare.use(clipRect(rect))
            .screenshot(path);
    };
};

var screenshotSelector = exports.screenshotSelector = function(path, selector, cb) {
    if (typeof cb != 'function') {
        cb = () => { };
    }

    return function(nightmare) {
        function _screenshot(url, rect) {
            nightmare.goto(url)
                .screenshot(path, rect)
                .run(cb);
        }

        function _evaluate(url) {
            nightmare.goto(url)
               .evaluate(function(_selector) {
                    var _element = document.querySelector(_selector);
                    if (_element) {
                        var rect = _element.getBoundingClientRect();
                        return {
                            x: Math.round(rect.left),
                            y: Math.round(rect.top),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        };
                    }
                }, selector)
                .run((err, rect) => {
                    if (err) {
                        cb(err);
                    } else if (!rect) {
                        cb(new Error('invalid selector' + selector));
                    } else {
                        _screenshot(url, rect);
                    }
                });
        }

        nightmare.url()
            .run(function(err, url) {
                if (err) {
                    cb(err);
                } else {
                    _evaluate(url);
                }
            });
    };
};
