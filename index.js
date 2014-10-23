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
        nightmare.evaluate(function(_selector) {
            var _element = document.querySelector(_selector);
            if (_element) {
                return _element.getBoundingClientRect();
            }
        }, function(rect) {
            if (!rect) {
                throw new Error('invalid selector' + selector);
            }
            nightmare.use(screenshotRect(path, rect));
        }, selector);
    };
};
