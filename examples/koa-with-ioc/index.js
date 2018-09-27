const Iocfy = require('iocfy');

Iocfy.load(require('./application.json'));
Iocfy.getBean('server').run();
