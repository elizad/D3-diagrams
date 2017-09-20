  // API data response
    var rawData = {
      "LE001": {
        "IT": {
          "Product A": {
            "Client 1" : 10,
            "Client 2" : 60,
          },
          "Product B": {  
            "Client 1" : 10,
            "Client 4" : 20
          }
        },
        "HR": {             
          "Product A": {    
            "Client 3" : 25,
            "Client 4" : 125
          },
          "Product B": {    
            "Client 2" : 30,
            "Client 3" : 20
          }
        }
      },
      "LE002": {            
        "IT": {             
          "Product A": {    
            "Client 1" : 3,
            "Client 3" : 25,
            "Client 4" : 95
          },
          "Product B": {    
            "Client 1" : 10,
            "Client 2" : 25,
            "Client 4" : 15
          }
        },
        "HR": {            
          "Product A": {    
            "Client 2" : 20
          },
          "Product B": {   
            "Client 3" : 30
          }
        }
      }
    }

    // Processed data (ready for forming)
    var testData = [
      { "source": "LE001", "target": "IT", "value": 100},
      { "source": "LE001", "target": "HR", "value": 200},
      { "source": "IT", "target": "Product A", "value": 70},
      { "source": "HR", "target": "Product A", "value": 150},
      { "source": "IT", "target": "Product B", "value": 30},
      { "source": "HR", "target": "Product B", "value": 50},
      { "source": "Product A", "target": "Client 1", "value": 10},
      { "source": "Product A", "target": "Client 2", "value": 60},
      { "source": "Product A", "target": "Client 3", "value": 25},
      { "source": "Product A", "target": "Client 4", "value": 125},
      { "source": "Product B", "target": "Client 1", "value": 10},
      { "source": "Product B", "target": "Client 2", "value": 30},
      { "source": "Product B", "target": "Client 3", "value": 20},
      { "source": "Product B", "target": "Client 4", "value": 20},
      { "source": "LE002", "target": "IT", "value": 200},
      { "source": "LE002", "target": "HR", "value": 50},
      { "source": "IT", "target": "Product A", "value": 150},
      { "source": "HR", "target": "Product A", "value": 20},
      { "source": "IT", "target": "Product B", "value": 50},
      { "source": "HR", "target": "Product B", "value": 30},
      { "source": "Product A", "target": "Client 1", "value": 30},
      { "source": "Product A", "target": "Client 2", "value": 20},
      { "source": "Product A", "target": "Client 3", "value": 25},
      { "source": "Product A", "target": "Client 4", "value": 95},
      { "source": "Product B", "target": "Client 1", "value": 10},
      { "source": "Product B", "target": "Client 2", "value": 25},
      { "source": "Product B", "target": "Client 3", "value": 30},
      { "source": "Product B", "target": "Client 4", "value": 15}
    ];

    /*


            Form data for d3 sankey calculations


    */



function ok()
{
var seeViz = (function()
{
    //d3 init
    var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
      },
      
//if(window.innerWidth > 450){
      width = window.innerWidth - (window.innerWidth / 4) - margin.left - margin.right,
     // } else {width = 450} 

//if(window.innerHeight > 450){
      height = window.innerHeight - ( window.innerHeight / 4) - margin.top - margin.bottom
     // }else {width = 450 }
      
   
         var tooltip = d3.select("body")
              .append("div")
              .style("position", "absolute")
              .style("z-index", "10")
              .style("visibility", "hidden")
              .html("a simple tooltip     ");


              


    var formatNumber = d3.format(",.0f"),
      format = function(d) {
        return formatNumber(d) + " TWh";
      },
      color = d3.scaleOrdinal(d3.schemeCategory20b);

    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("min-width", 200)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height]);

    var path = sankey.link();

  

    //set up graph in same style as original example but empty
    var graph = {"nodes" : [], "links" : []};
      testData.forEach(function (d) {
        graph.nodes.push({ "name": d.source });
        graph.nodes.push({ "name": d.target });
        graph.links.push({ "source": d.source,
                          "target": d.target,
                          "value": +d.value });
      });
      // return only the distinct / unique nodes
      var newNodes = d3.map(graph.nodes, function(d) { return d.name; }).keys();

      graph.nodes = newNodes;

      // loop through each link replacing the text with its index from node
      graph.links.forEach(function (d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
      });
      //now loop through each nodes to make nodes an array of objects
      // rather than an array of strings
      graph.nodes.forEach(function (d, i) {
        graph.nodes[i] = { "name": d };
      });

   


      //create d3 viz
      var render = function()
      {
        //alert('dd222');
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32);

        //ribbons/chords/links

        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter()
              .append("path")
                .attr("class", "link")
                .attr("d", path)
                .style("stroke-width", function(d) {
                return Math.max(1, d.dy);
                })
                .sort(function(a, b) {
                return b.dy - a.dy;
                });


           link.on("mouseover", function(){
                     return tooltip.style("visibility", "visible");
                   })
           link.on("mousemove", function(){
                    return tooltip.style("top", (event.pageY-10)+"px")
                                  .style("left",(event.pageX+10)+"px");
                                })
           link.on("mouseout", function(){
                    return tooltip.style("visibility", "hidden");
                  });
        //possible additions in d3 lib for enrichment
        //.on("click", function()), .on("mouseover"), .on("mouseout")
        

        link.append("title")
            .text(function(d) {
            return d.source.name + " → " + d.target.name + "\n" + format(d.value);
            })

         // link.append("text")
         //  .text (function(d) {
         //    return d.source.name + " → " + d.target.name + "\n" + format(d.value);
         //    });

    
          


        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
            })
            .call(d3.drag()
            .subject(function(d) {
                return d;
            })
            .on("start", function() {
                this.parentNode.appendChild(this);
            })
            .on("drag", dragmove))
        //possible additions in d3 lib for enrichment
        //.on("click", function()), .on("mouseover"), .on("mouseout")
           .on("mouseover", function(){return tooltip.style("visibility", "visible");})
           .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
           .on("mouseout", function(){return tooltip.style("visibility", "hidden");});


                      



        node.append("rect")
            .attr("height", function(d) {
            return d.dy;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) {
            return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function(d) {
            return d3.rgb(d.color).darker(2);
            })
            .append("title")
            .text(function(d) {
            return d.name + "\n" + format(d.value);
            });

        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) {
            return d.dy / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) {
            return d.name;
            })
            .filter(function(d) {
            return d.x < width / 2;
            })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        //drag event (to move node and chords around)
        function dragmove(d) {
            d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
            sankey.relayout();
            link.attr("d", path);
        }
      }


      return {
          render: render
      };
})();

seeViz.render();

}

ok();

d3.select(window).on('resize', resize); 

function resize() {

  d3.selectAll("svg").remove();
  ok();
}


