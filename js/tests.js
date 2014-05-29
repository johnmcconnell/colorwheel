
test('returns a list of a list of values at the index of their orignal array', function() {
	var zip_list = JEM.zip([1,2],[3,4]);
	var zip_json = JSON.stringify(zip_list);
	var expected_json = JSON.stringify([[1,3],[2,4]]);
	
	equal(zip_json,expected_json, 'small nums');
	
	zip_list = JEM.zip([1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15]);
	zip_json = JSON.stringify(zip_list);
	expected_json = JSON.stringify([[1,6,11],[2,7,12],[3,8,13],[4,9,14],[5,10,15]]);
	
	equal(expected_json, zip_json, 'larger three lists');

	zip_list = JEM.zip([ 'a','b','c']);
	zip_json = JSON.stringify(zip_list);
	expected_json = JSON.stringify([['a'],['b'],['c']]);
	
	equal(expected_json, zip_json, 'single values');

	zip_list = JEM.zip(['a','b','c'],[1,2,3],[[],[],[]]);
	zip_json = JSON.stringify(zip_list);
	expected_json = JSON.stringify([['a',1,[]],['b',2,[]],['c',3,[]]]);

	equal(expected_json, zip_json, 'different value types');

	zip_list = JEM.zip([1,2,3],[{x:1,y:2},{x:3,y:4},{x:5,y:6}]);
	zip_json = JSON.stringify(zip_list);
	expected_json = JSON.stringify([[1,{x:1,y:2}],[2,{x:3,y:4}],[3,{x:5,y:6}]]);

	equal(expected_json, zip_json, 'with objects');

});

test('given values and a max maginitude scale them to the unit magnitude', function() {
	var max = 100;
	var values = [ 0, -50, 50, 100, -100, 200, -200, 75, -75 ];
	var expected = [ 0, -1/2, 1/2, 1, -1, 1, -1, 3/4, -3/4 ];
	var zipped_results = JEM.zip(values,expected);
	
	zipped_results.map(function(values) {
		var result = JEM.scaleToUnit(values[0],max);
		equal(result,values[1]);
	});
});

test('find the degree given an x and y value', function() {
	var values = [
		{x:0,y:1},{x:1,y:0},{x:-1,y:0},{x:0,y:-1},
		{x:1,y:1},{x:-1,y:1},{x:1,y:-1},{x:-1,y:-1}
	];
	var expected = [ 
		90,0,180,270,
		45,135,315,225
	];
	var messages = [
		'90 rotation','90 rotation','90 rotation','90 rotation',
		'45 rotation','45 rotation','45 rotation','45 rotation'
	];
	var zipped_results = JEM.zip(values,expected,messages);

	zipped_results.map(function(values) {
		var result = JEM.findDegree(values[0].x,values[0].y);
		equal(result,values[1],values[2]);
	});
});

test('find the equivalent degree in the [0,360) range', function() {
	var values = [
		45,135,225,315,
		-90,-180,-270,-360,
		360, 180 + 360, -360 + 90, -720 + 135
	];
	var expected = [
		45,135,225,315,
		270,180,90,0,
		0,180,90,135
	];
	var zipped = JEM.zip(values,expected);
	
	zipped.map(function(values) {
		var result = JEM.absDegree(values[0]);
		equal(result,values[1],'test degree value');
	});
});

test('find the difference in 2 degrees', function() {
	var d1_values = [ 
		0,0,90,-90,
		180,-180,270,-270,
		360,-360
	];
	var d2_values = [
		-45,45,-45,45,
		90,90,260,-260,
		-45,135
	];
	var expected = [
		45,45,135,135,
		90,90,10,10,
		45,135
	];
	var zipped = JEM.zip(d1_values,d2_values,expected);
	
	zipped.map(function(vals) {
		var re = JEM.degreeDifference(vals[0],vals[1]);
		equal(re,vals[2],'test the difference in degree');
	});
});
