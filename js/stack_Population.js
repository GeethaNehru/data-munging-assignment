var margin={top:40, bottom:200, left:150, right:150},
    width=1500-margin.left-margin.right,
    height=700-margin.top-margin.bottom;

  var horizontal=d3.scale.ordinal().rangeRoundBands([0,width],0.10),
    vertical=d3.scale.linear().rangeRound([height,0]);

  var color = d3.scale.ordinal().range(["#383535","#575050","#B0A9A9"]);

  var xAxis=d3.svg.axis()
    .scale(horizontal)
    .orient("bottom");

  var yAxis=d3.svg.axis()
    .scale(vertical)
    .orient("left");

  var svg=d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  d3.json("../output/population-purchase.json",function(data){
  data.forEach(function(d){
    d.Quarters=d.Quarters;
    d.Value1=d.Value1;
    d.Value2=d.Value2;
    d.Value3=d.Value3;    
    

  });
  var xData=["Value1","Value2","Value3"];
  var dataIntermediate = xData.map(function (c) {
        return data.map(function (d) {
            return {x: d.Quarters, y: d[c]};
        });
    });
  var dataStackLayout = d3.layout.stack()(dataIntermediate);

  horizontal.domain(dataStackLayout[0].map(function (d) {
        return d.x;
    }));
  vertical.domain([0,
        d3.max(dataStackLayout[dataStackLayout.length - 1],
                  function (d) { return d.y0 + d.y;})
      ])
      .nice();
  var layer = svg.selectAll(".stack")
          .data(dataStackLayout)
          .enter().append("g")
          .attr("class", "stack")
          .style("fill", function (d, i) {
                return color(i);
    });

  layer.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")

        .attr("x", function (d) {
            return horizontal(d.x);
          })
          .attr("y", function (d) {
              return vertical(d.y + d.y0);
          })
          .attr("height", function (d) {
              return vertical(d.y0) - vertical(d.y + d.y0);
        })
          .transition().duration(800)
    .delay( function(d,i) { return i * 50; })



        
      .attr("width", horizontal.rangeBand());

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .attr("font-size", "10px");
        //.text("Country")



      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("dy", "-5em")
        .style("text-anchor", "middle")
        .style("fill","white")
        .text("In Millions");
       
         var legend = svg.selectAll(".legend")
         .data(color.domain().slice())
       .enter().append("g")
         .attr("class", "legend")
         .attr("transform", function(d, i) { return "translate(0," + i * 30 +  ")"; });
    
     legend.append("rect")
         .attr("x", width - 18)
         .attr("width", 18)
         .attr("height", 18)
         .style("fill", color);

     legend.append("text")
     .attr("x", width - 24)
         .attr("y", 9)
         .attr("dy", ".35em")
         .style("text-anchor", "end")
         .style("fill","white")
         .text(function(d,i) { return xData[i]; });

  });
