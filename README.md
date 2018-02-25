# seo_defects_detector
This module is developed and maintained by Kewei Chen.
The goal of this module is to detect user defined SEO defects in a html text.
Example of how to utilize this module to create rules and detect SEO defects is written in test.js.
Following is classes provide in this module.

<h3>Class Rule</h3>
For a html tag, define a rule with some defects to be detected.

Methods:
- withoutAttribute(attr_name, attr_value)
- anyThisTag()
- withoutTag(tag_rule)
- amountMoreThan(number_of_the_tag)

All the methods above provide fluent interface. That is, the returned value of any these methods
is the object reference itself. Hence you can chain these methods in a more readable way.

e.g.

Create a rule to detect any <img> without alt attribute: 

`rule = createTagRule('img').anyThisTag().withoutAttribute('alt')`

In <head>, check if <meta name='description> cannot be found: 

`rule = createTagRule('head').withoutTag(createTagRule(meta).withoutAttribute('name', 'description'))`

<h3>Class SEODefectsDetector</h3>

Methods:
- addRule(rule)
- addRules(rule_list)
- detectByFile(file_name, output_stream)
- detectByStream(input_stream, outputstream)

<h3>Functions</h3>
In this module, it provides function to create instance of Rule and SEODefectsDetector.
- createTagRule(tag_name)
- createSEODefectsDetector()

Both of above functions do nothing but wrap the behavior of creating an object of the corresponding class.
It just makes the code more readable.
