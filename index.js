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

var screenshotSelector = exports.screenshotSelector = function(path, selector) {
    return function(nightmare) {
        nightmare.url()
            .then(function(url) {
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
                    .then(function(rect) {
                        if (!rect) {
                            throw new Error('invalid selector' + selector);
                        } else {
                            return nightmare.goto(url)
                                .screenshot(path, rect)
                                .end();
                        }
                    });
            });
    };
};
