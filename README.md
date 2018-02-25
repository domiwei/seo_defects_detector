# seo_defects_detector
This module is developed and maintained by Kewei Chen.
The goal of this module is to detect user defined SEO defects in a html text.
Example of how to utilize this module to create rules and detect SEO defects is written in test.js.
Following is classes provide in this module.

<h3>Rule</h3>
For a html tag, define a rule with some defects to be detected.

Methods:
- withoutAttribute(attr_name, attr_value)
- anyThisTag()
- withoutTag(tag_rule)
- amountMoreThan(number_of_the_tag)

e.g.

Create a rule to detect any <img> without alt attribute: 

`rule = createTagRule('img').anyThisTag().withoutAttribute('alt')`

In <head>, check if <meta name='description> cannot be found: 

`rule = createTagRule('head').withoutTag(createTagRule(meta).withoutAttribute('name', 'description'))`

<h3>SEODefectsDetector</h3>

Methods:
- addRule(rule)
- addRules(rule_list)
- detectByFile(file_name, output_stream)
- detectByStream(input_stream, outputstream)
