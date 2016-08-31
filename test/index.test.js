const fs = require('fs');
const path = require('path');
const Nightmare = require('nightmare');
const plugin = require('../');

const screenshotPath = path.join(process.cwd(), 'test.png');

beforeEach(() => {
    try {
        fs.unlinkSync(screenshotPath);
    } catch(e) { }
});

it('generates screenshot', (done) => {
    new Nightmare()
        .goto('http://example.com')
        .use(plugin.screenshotSelector('test.png', 'h1', (err) => {
            if (err) {
                throw err;
            }

            const stats = fs.statSync(screenshotPath);
            if (stats.isFile()) {
                done();
            }
        }));
});
