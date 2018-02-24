var detector = require("./seo_defects_detector.js");
var tagRule = detector.createTagRule;
var rules = []
// Rule 1: Any <img> without attr alt
rules.push(tagRule('img').anyThisTag().withoutAttribute('alt'));

// Rule 2: Any <a> without attr rel
rules.push(tagRule('a').anyThisTag().withoutAttribute('rel'));

// Rule 3: In <head>:
// a. <title> cannot be found
// b. <meta name="description"> cannot be found
// c. <meta name="keywords"> cannot be found
head_rule = tagRule('head').
	withoutTag(tagRule('title')).
	withoutTag(tagRule('meta').withoutAttribute('name', 'description')).
	withoutTag(tagRule('meta').withoutAttribute('name', 'keywords'));
rules.push(head_rule);

// Rule 4: Number of <strong> more than 15
rules.push(tagRule('strong').amountMoreThan(15));

// Rule 5: Number of <H1> more than 1
rules.push(tagRule('H1').amountMoreThan(1));

// Add these rules and detect.
this_detector = detector.createSEODefectsDetector().addRules(rules);
// Add new rule. Actually need not to add, because it refers the object.
head_rule.withoutTag(tagRule('meta').withoutAttribute('name', 'robots'));
this_detector.addRule(head_rule);
this_detector.detectByFile('./test.html');
