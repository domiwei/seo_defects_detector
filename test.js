var fn = require("./index.js");
var a = fn.createTagRule('head');
a.amount(1).withoutAttribute('qwe', 'this value').withoutAttribute('test_attr').withoutTag(fn.createTagRule('asdsa'));

var detector = fn.createSEODefectsDetector().addRule(a);
detector.addRule(fn.createTagRule('img').withoutTag(fn.createTagRule('kewei')).withoutTag(fn.createTagRule('gg')))
//detector.addRule(fn.createTagRule('aloha').withoutTag('kewei').withoutTag('gg'))
detector.detectByFile('./test.html');
//console.log(detector);
