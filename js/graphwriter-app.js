var JEM = {};

JEM.zip = function() {
	var arrays = arguments;
	return Array.map(arrays[0], function(_,idx) {
		return Array.map(arrays, function(a) { return a[idx]; });
	});
}

JEM.pixelStrToInt = function(str) {
	return parseInt(str.substr(str.length - 2));
}

JEM.intToPixelStr = function(i) {
	return i + 'px';
}

JEM.nodeToCircle = function(node) {
	var r = JEM.intToPixelStr(node.r);
	return {cx:node.x, cy:node.y, r:r, fill:node.color};
}

JEM.circleToNode = function(circle) {
	var r = JEM.pixelStrToInt(circle.r);
	return {x:circle.cx, y:circle.cy, r:r, color:circle.fill};
}

JEM.createView = function(selection,model,renderer) {
	return { 
		model: model,
		selection: selection,
		render: renderer,
		update: function() {
			var model = this.model;
			this.selection = this.selection.data(
				model,
				function(item) { return model.indexOf(item); }
			);
			this.render(this.selection);
			this.selection.exit().remove();
		}	
	};
}
/*
 * scale a value by its maximum magnitude
 * thereby reducing a domain of values to
 * the range -1 to 1
 */
JEM.scaleToUnit = function(value,max) {
	// two boundary conditions where the 
	// absolute value is greater than max 
	if (value > max) { return 1; }
	if (-1*value > max) { return -1; };

	return value / max;
}

/*
 * return the absolute degree from an
 * unprocessed degree thereby reducing
 * its range to [0,360)
 */
JEM.absDegree = function(degree) {
	degree = degree % 360;
	if (degree >= 0) {
		return degree;
	} else {
		return 360 + degree;
	}
}

/*
 * find the difference between 2 degrees
 * the value is a magnitude of difference
 * the max difference between any 2
 * degrees should be 180
 */
JEM.degreeDifference = function(d1,d2) {
	d1 = JEM.absDegree(d1);
	d2 = JEM.absDegree(d2);
	var diff = Math.abs(d1 - d2);
	// if on the other end of the circle
	// take the conjugate angle 
	// (smaller angle)
	if (diff > 180) { 
		return 360 - diff;
	} else {
		return diff;
	}
}
/*
 * find the degree from
 * an x and y value the
 * range is [0, 360);
 */
JEM.findDegree = function(x,y) {
	var degree = Math.atan(y/x) * 180 / Math.PI;
	if (x < 0) {
		degree += 180;
	} else if (y < 0) {
		degree += 360;
	}
	return Math.round(degree);
}

JEM.scaledDegDiff = function(actual,expected,spread) {
	var zero_cutoff = spread / 2;
	var scaled_cutoff = spread / 4;
	var diff = JEM.degreeDifference(actual,expected);
	if (diff > zero_cutoff) {
		return 0;
	} else if (diff > scaled_cutoff){
		diff = diff - scaled_cutoff;
		return 255 - Math.round(diff * 255 / scaled_cutoff);
	} else {
		return 255;
	}
}


JEM.getRedValue = function(deg,radius) {
	return JEM.scaledDegDiff(deg,0,240);
}

JEM.getGreenValue = function(deg,radius) {
	return JEM.scaledDegDiff(deg,120,240);
}

JEM.getBlueValue = function(deg,radius) {
	return JEM.scaledDegDiff(deg,240,240);
}

JEM.colorTransform = function(x,y,mx,my) {
	var x_length = (mx / 2);
	var y_length = (my / 2);
	var max_length = Math.min(x_length,y_length);
	var limit_x = Math.min(max_length,x - x_length);
	var limit_y = Math.min(max_length,y_length - y);
	var x = JEM.scaleToUnit(limit_x,x_length);
	var y = JEM.scaleToUnit(limit_y,x_length);
	var radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
	var deg = JEM.findDegree(x,y);
	var red = JEM.getRedValue(deg,radius);
	var green = JEM.getGreenValue(deg,radius); 
	var blue = JEM.getBlueValue(deg,radius);
	var alpha = radius;
	var value = "rgba("+red+","+green+","+blue+","+alpha+")";
	return value;
}

var height = 900;
var width = 900;

JEM.renderCircle = function(selection) {
	selection
	.enter()
	.append('g')
	.attr('class','node')
	.append('circle')
	.attr('cx',function(d) { return d.cx; })
	.attr('cy',function(d) { return d.cy; })
	.attr('r', function(d) { return d.r; })
	.attr('fill', function(d) { return JEM.colorTransform(d.cx,d.cy,width,height); });
}

d3.select('#graph-view').append('svg').attr('class','well');

var svg = d3.select('svg');

svg.attr('width',width)
     .attr('height',height);

var svg_nodes = svg.selectAll('g');

var nodes = [];
var circleView = JEM.createView(svg_nodes,nodes,JEM.renderCircle);

svg.on('click', function(e) {
	var mouse = d3.mouse(this);
	var circle = {cx:mouse[0], cy:mouse[1], r:'30px', fill:'red'};
	nodes.push(circle);
	circleView.update();
});
