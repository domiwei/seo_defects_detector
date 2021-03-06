const assert = require('assert');

// Rule
function Rule(tag) {
	this.tag = tag;
	this.without_tags = [];
	this.without_attrs = [];
	this.num = null;
	this.any = false;
}

// Add tag into list. Check if the tag cannot be
// found in this tag section.
Rule.prototype.withoutTag = function(tag) {
	assert(tag instanceof Rule, 'Object should be instance of Rule');
	this.without_tags.push(tag);
	return this;
};

// Check if any this tag has no given attributes.
// Default value is false. That is, it passed the rule
// if there is at least one tag with given attribute.
Rule.prototype.anyThisTag = function() {
	this.any = true;
	return this;
};

// Attribute list
Rule.prototype.withoutAttribute = function(attr, value) {
	value = (typeof value !== 'undefined') ? value : null;
	this.without_attrs.push([attr, value]);
	return this;
};

Rule.prototype.amountMoreThan = function(num) {
	this.num = num;
	return this;
};

function createTagRule(tag) {
	return new Rule(tag);
}

exports.createTagRule = createTagRule;


// SEO defects detector
function SEODefectsDetector() {
	this.rules = [];
}

function write_result(result, outs) {
	if (outs)
		outs.write(result);
	else
		console.log(result);
}

function lineNumberByIndex(index,string){
	var line = 0, match, re = /(^)[\S\s]/gm;
	while (match = re.exec(string)) {
		if(match.index > index)
			break;
		line++;
	}
	return line;
}

// Core function. Takes advantage of regular expression to detect:
// 1. Number of a tag less than expected value.
// 2. Some attributes are not in a tag.
// 3. Rules defined in a tag.
function detecting(start_line_num, prefix, text, this_rules, outs) {
	this_rules.forEach(function(rule){
		var pattern = new RegExp('<'+ rule.tag +'[^>]*>', 'g');
		var match;
		var match_list = [];
		while ((match = pattern.exec(text))!=null) {
			match_list.push({'string':match[0], 'line':lineNumberByIndex(match.index, text)});
			//console.log(match.index);
		}

		// Check the number of tag
		if (match_list.length == 0) {
			write_result(prefix+'Tag <'+rule.tag+'> not found', outs);
			return;
		} else {
			if (rule.num != null && match_list.length >= rule.num)
				write_result(prefix+'Tag <'+rule.tag+'> appears '+
						match_list.length+' times', outs);
		}

		// For each attribute, check whether it exists in each matched string.
		// If any flag is triggered, then detect any tag without the given attrs.
		for (i=0 ; i<rule.without_attrs.length; i++){
			attr_tuple = rule.without_attrs[i];
			attr = attr_tuple[0];
			value = attr_tuple[1];
			if (value != null) {
				attr_pattern = new RegExp(attr+'\\s*=\\s*\"'+value+'\"');
				target_string = '\"' + attr + '\" with value \"' + value + '\"';
			} else {
				attr_pattern = new RegExp(attr+'\\s*=');
				target_string = '\"' + attr + '\"';
			}
			// Begin to find
			var found = false;
			match_list.forEach(function(matched_obj){
				string = matched_obj.string;
				line = start_line_num + matched_obj.line;
				if (attr_pattern.exec(string) == null) {
					if (rule.any)
						write_result('Line '+ line +': '+ prefix + 'Within tag <' +
								rule.tag + '>, attribute '+ target_string+' not found', outs);
				} else {
					found = true;
				}
			});
			if (!rule.any && !found)
				write_result('Line '+ start_line_num + ': ' + prefix + 'Within tag <' +
						rule.tag + '>, attribute ' + target_string+' not found', outs);
		}


		// Check tags in this tag rule. Here find the <tag> ... </tag> pair and
		// recursively check rules defined in Rule.without_tags.
		if (rule.without_tags.length == 0)
			return;

		pattern = new RegExp('<'+rule.tag+'[^>]*>([\\s\\S]*)<\/'+rule.tag+'>', 'g');
		match_list = [];
		while ((match = pattern.exec(text))!=null) {
			match_list.push({'string':match[0], 'line':lineNumberByIndex(match.index, text)});
		}
		if (match_list.length == 0) {
			write_result(prefix+'HTML tag pair <'+rule.tag+'>...</'+rule.tag+'> not found', outs);
			return;
		}

		// Run recursion to detect rules in this tag section.
		match_list.forEach(function(matched_obj){
			detecting(matched_obj.line, 'In section <'+rule.tag+'> : ',
							matched_obj.string, rule.without_tags, outs);
		});

		return;
	});
}

SEODefectsDetector.prototype.addRule = function(new_rule) {
	assert(new_rule instanceof Rule, 'Object should be instance of Rule');
	index = this.rules.indexOf(new_rule);
	if (index >= 0) {
		this.rules.splice(index, 1);
	}
	this.rules.push(new_rule)
		return this;
}

SEODefectsDetector.prototype.addRules = function(new_rules) {
	for (i=0; i<new_rules.length;i++)
		this.addRule(new_rules[i]);
	return this;
}

// If the output stream is not defined, result will be written in console.
var fs = require('fs');
SEODefectsDetector.prototype.detectByFile = function(path, outs) {
	var rs = fs.createReadStream(path);
	return this.detectByStream(rs, outs);
}

SEODefectsDetector.prototype.detectByStream = function(rs, outs) {
	var chunk;
	var data = '';
	var rules = this.rules;
	outs = (typeof outs !== 'undefined') ? outs : null;
	rs.on('readable', function() {
		while ((chunk = rs.read()) != null)
			data += chunk.toString();
	});
	rs.on('end', function(){
		detecting(0, '', data, rules, outs);
	});

	return this;
}

function createSEODefectsDetector() {
	return new SEODefectsDetector()
}

exports.SEODefectsDetector = SEODefectsDetector;
exports.createSEODefectsDetector = createSEODefectsDetector;

