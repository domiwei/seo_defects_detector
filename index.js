
// Rule
function Rule(tag) {
	this.tag = tag;
	this.without_tags = [];
	this.without_attrs = [];
	this.num = 1;
}

Rule.prototype.withoutTag = function(tag) {
	this.without_tags.push(tag);
	return this;
};

Rule.prototype.withoutAttribute = function(attr, value) {
    value = (typeof value !== 'undefined') ? value : null;
	this.without_attrs.push([attr, value]);
	return this;
};

Rule.prototype.amount = function(num) {
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

function detecting(prefix, this_data, this_rules, outs) {
		this_rules.forEach(function(rule){
			var pattern = new RegExp('<'+ rule.tag +'[^>]*>', 'g');
			var match;
			var match_list = [];
			while ((match = pattern.exec(this_data))!=null) {
				match_list.push(match[0])
                console.log(match.index)
			}
			
            // Check the number of tag
			if (match_list.length == 0) {
				write_result(prefix+'Tag <'+rule.tag+'> not found', outs);
                return;
			} else if (match_list.length < rule.num) {
				write_result(prefix+'Tag <'+rule.tag+'> appears '+match_list.length+' times', outs);
			}
			
            // Check attribute and value
			match_list.forEach(function(string){
				for (i=0 ; i<rule.without_attrs.length; i++){
					attr_tuple = rule.without_attrs[i];
                    attr = attr_tuple[0]
                    value = attr_tuple[1]
                    if (value != null) {
					    attr_pattern = new RegExp(attr+'\\s*=\\s*\"'+value+'\"');
                        target_string = attr + ' with value \"' + value + '\"';
                    } else {
					    attr_pattern = new RegExp(attr+'\\s*=');
                        target_string = attr;
                    }
					if (attr_pattern.exec(string) == null) {
						write_result(prefix+'Attribute '+ target_string+' not found within tag <'
							    + rule.tag + '>', outs);
					}
				}
			});

            // Check tags in this tag rule.
            //write_result(rule.without_tags);
            if (rule.without_tags.length == 0)
                return;

            pattern = new RegExp('<'+rule.tag+'[^>]*>([\\s\\S]*)<\/'+rule.tag+'>', 'g');
			match_list = [];
			while ((match = pattern.exec(this_data))!=null) {
				match_list.push(match[0]);
			}
            if (match_list.length == 0) {
                write_result(prefix+'HTML tag pair <'+rule.tag+'>...</'+rule.tag+'> not found', outs);
                return;
            }
            //write_result(match_list);
			match_list.forEach(function(matched_string){
                detecting('In section <'+rule.tag+'> : ', matched_string, rule.without_tags, outs);
			});

            return;
		});
	}

SEODefectsDetector.prototype.addRule = function(rule) {
	this.rules.push(rule);
	return this;
}

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
		detecting('', data, rules, outs);
	});
	
	return this;
}


function createSEODefectsDetector() {
	return new SEODefectsDetector()
}

exports.SEODefectsDetector = SEODefectsDetector;
exports.createSEODefectsDetector = createSEODefectsDetector;

