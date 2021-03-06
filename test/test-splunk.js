var expect = require('chai').expect;
var helper = require('../helper');

describe('Basic searching', function() {
		
	var template = "search index=_internal sourcetype={{sourcetype}} | head {{limit}}";
	var searchParams = {
		exec_mode: "normal",
		output_mode:"json",
		earliest_time: "@m-10m",
		latest_time: "@m"
	};

	it('should return 1 result quickly', function() {

		// create a query from template
		var options = {
			sourcetype: "splunkd",
			limit: 1
		}
		var query = helper.apply(template, options);

		// run search
		return helper.search(query,searchParams)
		.then(function(output){

			// on success
			var properties = output.job.properties();
			var results = output.results;

			// map results
			results = helper.toJson(results);

			// assert
			expect(properties.runDuration).to.be.below(5);
			expect(properties.resultCount).to.equal(options.limit);
			expect(results).to.have.length(options.limit);
			expect(results[0]._sourcetype).to.equal(options.sourcetype);
		})
		.catch(function(err){
			
			// if failure
			expect(err.error).to.be.undefined;
			expect(err).to.be.undefined;
		});
	});
	
});