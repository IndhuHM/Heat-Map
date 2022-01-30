d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(el){
  var dataset= el.monthlyVariance;
  Drawbar(dataset);
})


function Drawbar(dataset){
  const w= 500;
  const h=500;
  padding = 60;
  
  const baseTemperature= 8.66;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
   const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
  
  const xScale=d3.scaleLinear()               .domain([d3.min(dataset, (d)=> d.year), d3.max(dataset, (d)=> d.year)])
                 .range([padding,w-padding]);
                          
   const yScale=d3.scaleBand()              .domain(months)
   .range([padding,h-padding]);
  
const colorScale = d3.scaleQuantile()                  .domain([d3.min(dataset, (d)=> d.variance) + baseTemperature ,d3.max(dataset, (d)=> d.variance) + baseTemperature])
                     .range(colors);  
  
  const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
  
   var tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip")
                  .attr("id", "tooltip")
                  .style("opacity", 100)
  
  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("x",  (d) => xScale(d.year))
       .attr("y", (d)=> yScale(months[d.month-1]))
       .attr("width", (w-padding*2)/dataset.length*12)
       .attr("height", (d) => (h-padding*2)/12)
  .attr("fill", (d) => {
        return colorScale(d.variance + baseTemperature);
      })
  .attr("data-year",(d)=>d.year)
  .attr("data-month",(d)=>d.month-1)
  .attr("data-temp",(d)=>d.variance +baseTemperature)
  .attr("class","cell")
  .on("mouseover",function(d){
    tooltip.transition()
           .duration(200)
           .style("opacity", 0.9);
     tooltip.html("Year: " + d.year + "," + " Month: "+ months[d.month-1])
   tooltip.attr("data-year", d.year)
  })
   .on("mouseout", function(d){
        tooltip.transition()
               .duration(50)
               .style("opacity", 0);
      });
  
   
    const xAxis =d3.axisBottom(xScale)
        .tickFormat(d3.format(".0f"));
  svg.append("g")
     .attr("id","x-axis")
     .attr("transform", "translate(0," + (h - padding) + ")")
   .call(xAxis);
  
   const yAxis = d3.axisLeft(yScale);
  svg.append("g")
       .attr("id","y-axis") 
      .attr("transform", "translate(" + padding + ",0)")
  .call(yAxis);
  
  
  
   var legend = svg.selectAll("legend")
            .data([0].concat(colorScale.quantiles()), (d) => d)
            .enter()
            .append("g")
            .attr("id","legend")
    legend.append('rect')          
            .attr('x', (d, i) => w - padding - 35*colors.length + (i *35))
            .attr('y', h - padding/2 - 10)
            .attr('width', 30)
            .attr('height', 15)
            .attr('fill', (d, i) => colors[i]);

    legend.append("text")        
            .text((d) => Math.floor(d * 10) / 10)
            .attr("x", (d, i) => w - padding - 35*colors.length + (i *35))
            .attr("y", h - padding/4); 

    
  
  
  
}