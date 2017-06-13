
$('#buttonYear').click(	function(){
	d3.select("svg").remove();
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	  width = 960 - margin.left - margin.right,
	  height = 500 - margin.top - margin.bottom;

	var hover = function(d){
    var div = document.getElementById('tooltip');
    div.style.left = event.pageX +'px';
    div.style.top = event.pageY + 'px';
    div.innerHTML = d.month+"\n"+d.rain;
	};
	// set the ranges
	var x = d3.scaleBand()
	          .range([0, width])
	          .padding(0.1);
	var y = d3.scaleLinear()
	          .range([height, 0]);		

	var svg = d3.select("#rainBarGraph").append("svg")
	    		.attr("width", width + margin.left + margin.right)
	    		.attr("height", height + margin.top + margin.bottom)
	  			.append("g")
	    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	d3.json('data.json',function(error,data){
		if (error) throw error;
		var year=document.getElementById('year').value;
		var fullData=data.data;
		var row=fullData[_.findIndex(fullData, function(o) { return o[1] == year; })];
		
		row=_.drop(row,2);
		row=_.dropRight(row,5);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var ans = [];
		for (var i=0;i<12;i++){
			var jsonData = new Object();
			jsonData.month=months[i];
			jsonData.rain=Number(row[i]);
			ans.push(jsonData);	
		}
		var colorscale = d3.scaleLinear()
						 .domain([0,d3.max(ans, function(d) { return d.rain; })])
						 .range(["yellow","blue"]);
		//data=ans;
		x.domain(ans.map(function(d) { return d.month; }));
		y.domain([0, d3.max(ans, function(d) { return d.rain; })]);
		svg.selectAll(".bar")
	    .data(ans)
	  	.enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d) { return x(d.month); })
	    .attr("width", x.bandwidth())
	    .attr("y", function(d) { return y(d.rain); })
	    .attr("height", function(d) { return height - y(d.rain); })
	    .attr("fill",function(d){return colorscale(height - y(d.rain))})
	    .on("mouseover", hover);

	  // add the x Axis
	  svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

	  // add the y Axis
	  svg.append("g")
	      .call(d3.axisLeft(y));
	});
});