var fn = require("./index.js");

//import {helloTest, hiTest} from './index.js';
//fn.helloTest('kewei');
//fn.hiTest('kewei');

/*function Rule(tag) {
	this.tag = tag;
	this.without_tag = [];
	this.num = 1;
	console.log(tag);
	this.without = function(tag) {
		this.without_tag += tag;
		return this;
	}
}


Rule.prototype.amount = function (num) {
	this.num = num;
	return this;
};


var a = new Rule('gg').without('aa').without('cc')
a.amount(123)*/
//console.log(a);
//a.without('hh')
//console.log(a);
//a.without('gg')
var a = fn.createTagRule('head');
a.amount(1).withoutAttribute('qwe', 'this value').withoutAttribute('test_attr').withoutTag(fn.createTagRule('asdsa'));
//console.log(a);

var detector = fn.createSEODefectsDetector().addRule(a);
detector.addRule(fn.createTagRule('img').withoutTag(fn.createTagRule('kewei')).withoutTag(fn.createTagRule('gg')))
//detector.addRule(fn.createTagRule('aloha').withoutTag('kewei').withoutTag('gg'))
detector.detectByFile('./gg.html');
//console.log(detector);
