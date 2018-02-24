# seo_defects_detector
The goal of this module is to detect user defined SEO defects in a html text.
Example of how to utilize this module to create rules and detect SEO defects is written in test.js.
Following is classes provide in this module.

1.
Rule:
Used to define a rule with some defects. A rule is defined with a html tag.

*Methods:
withoutAttribute(attr_name, attr_value)
anyThisTag()
withoutTag(tag_rule)
amountMoreThan(number_of_the_tag)

2.
SEODefectsDetector:

*Methods
addRule(rule)
addRules(rule_list)
detectByFile()
detectByStream(file_name)
