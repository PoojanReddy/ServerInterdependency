function visualization(myResults){

var treeData = [
  {  
   "name":"CONBOT",
   "parent":"CONBOT",
   "hoststatus":"UP",
   "parentstatus":"UP",
   "parenttype":null,
   "parentcapacity":"FULL",
   "hostcapacity":"FULL",
   "children":[  
      {  
         "name":"LoadBalancer",
         "parent":"CONBOT",
         "hoststatus":"UP",
         "parentstatus":"UP",
         "parenttype":null,
         "parentcapacity":"FULL",
         "hostcapacity":"LOW",
         "children":[  
            {  
               "name":"AppServer2",
               "parent":"LoadBalancer",
               "hoststatus":"UP",
               "parentstatus":"UP",
               "parenttype":"LB",
               "parentcapacity":"FULL",
               "hostcapacity":"FULL",
               "children":[  

               ]
            },
            {  
               "name":"AppServer1",
               "parent":"LoadBalancer",
               "hoststatus":"DOWN",
               "parentstatus":"UP",
               "parenttype":"LB",
               "parentcapacity":"LOW",
               "hostcapacity":"FULL",
               "children":[  

               ]
            }
         ]
      },
      {  
         "name":"APP_VM",
         "parent":"CONBOT",
         "hoststatus":"UP",
         "parentstatus":"UP",
         "parenttype":null,
         "parentcapacity":"FULL",
         "hostcapacity":"FULL",
         "children":[  
            {  
               "name":"Splunk_Server",
               "parent":"APP_VM",
               "hoststatus":"UP",
               "parentstatus":"UP",
               "parenttype":null,
               "parentcapacity":"FULL",
               "hostcapacity":"FULL",
               "children":[  

               ]
            }
         ]
      },
      {  
         "name":"Monitoring_VM",
         "parent":"CONBOT",
         "hoststatus":"DOWN",
         "parentstatus":"UP",
         "parenttype":null,
         "parentcapacity":"FULL",
         "hostcapacity":"FULL",
         "children":[  
            {  
               "name":"Reporting_VM",
               "parent":"Monitoring_VM",
               "hoststatus":"UNREACHABLE",
               "parentstatus":"DOWN",
               "parenttype":null,
               "parentcapacity":"FULL",
               "hostcapacity":"FULL",
               "children":[  

               ]
            },
            {  
               "name":"OMD_ELK",
               "parent":"Monitoring_VM",
               "hoststatus":"UP",
               "parentstatus":"DOWN",
               "parenttype":null,
               "parentcapacity":"FULL",
               "hostcapacity":"FULL",
               "children":[  

               ]
            },
            {  
               "name":"DB_VM",
               "parent":"Monitoring_VM",
               "hoststatus":"UP",
               "parentstatus":"DOWN",
               "parenttype":null,
               "parentcapacity":"FULL",
               "hostcapacity":"FULL",
               "children":[  

               ]
            }
         ]
      }
   ]
}

];


		// ************** Generate the tree diagram	 *****************
			var margin = {top: 20, right: 120, bottom: 20, left: 120},
				width = 960 - margin.right - margin.left,
				height = 500 - margin.top - margin.bottom;
				
			var i = 0,
				duration = 750,
				root;

			var tree = d3.layout.tree()
				.size([height, width]);

			var diagonal = d3.svg.diagonal()
				.projection(function(d) { return [d.y, d.x]; });

			var svg = d3.select("#chart").append("svg")
				.attr("width", width + margin.right + margin.left)
				.attr("height", height + margin.top + margin.bottom)
			  .append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
			var grad = svg.append("defs").append("linearGradient").attr("id", "grad")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
				grad.append("stop").attr("offset", "50%").style("stop-color", "green");
				grad.append("stop").attr("offset", "50%").style("stop-color", "white");

			root = treeData[0];
			root.x0 = height / 2;
			root.y0 = 0;
			
			//modified for setting the color of the node based on the status of the node
		//	var myResults_temp = myResults.data().rows; 
			
			update(root); 

			d3.select(self.frameElement).style("height", "500px");

			function update(source) {
			
			  // Compute the new tree layout.
			  var nodes = tree.nodes(root).reverse(),
				  links = tree.links(nodes);

			  // Normalize for fixed-depth.
			  nodes.forEach(function(d) { d.y = d.depth * 180; });

			  // Update the nodes…
			  var node = svg.selectAll("g.node")
				  .data(nodes, function(d) { return d.id || (d.id = ++i); });
				  

			  // Enter any new nodes at the parent's previous position.
			  var nodeEnter = node.enter().append("g")
				  .attr("class", "node")
				  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
				  .on("click", click);

			//modified for setting the color of the node based on the status of the node
			 //console.log ("my results temp: "+ myResults_temp); 
			  
			//nodeEnter.append("circle")
			//		  .attr("r", 1e-6)
			//		  .style("fill", function(d) { return d._children ? "green" : "#008000"; });
			 
			  nodeEnter.append("circle")
				  .attr("r", 1e-6)
				  .style("fill", function(d) { 
						if(d.hoststatus === "UP"){
							  //for load balancer with low capacity fill with light green else green
							  if(d.hostcapacity === "LOW") {
									console.log("d.name " + d.name  + " status:" + d.hoststatus + " hostcapacity: " + d.hostcapacity + " color: black"  );
									return d._children ? "gradient" : "url(#grad)";  
							  }
							  else if (d.hostcapacity === "FULL"){
									console.log("d.name " + d.name  + " status:" + d.hoststatus + " hostcapacity: " + d.hostcapacity + " color: green" ); 
									return d._children ? "green" : "#008000"; 
							  }
							   else {
									console.log("d.name " + d.name  + " status:" + d.hoststatus + " hostcapacity: " + d.hostcapacity + " color: white" ); 
									return d._children ? "white" : "#FFFFFF"; 
									//for NIL host capacity
							  };

							}
							else if (d.hoststatus === "DOWN"){
						     //console.log("d.name " + d.name  + " status:" + d.hoststatus); 
							    return d._children ? "red" : "#FF0000"; 
							} 
							else if (d.hoststatus === "UNREACHABLE"){
								//console.log("d.name " + d.name  + " status:" + d.hoststatus); 
								return d._children ? "orange" : "#FFA500"; 
							}
						  else {
						     //console.log("d.name " + d.name  + " status:" + d.hoststatus); 
							  return d._children ? "blue" : "#0000FF"; 
						  };
				  })
				  .style("stroke", function(d) { 
						if(d.hoststatus === "UP"){
							  //console.log("d.name " + d.name  + " status:" + d.hoststatus + " hostcapacity: " + d.hostcapacity + " color: black"  );
							  return d._children ? "green" : "#008000";

							}
							else if (d.hoststatus === "DOWN"){
						     //console.log("d.name " + d.name  + " status:" + d.hoststatus); 
							    return d._children ? "red" : "#FF0000"; 
							} 
							else if (d.hoststatus === "UNREACHABLE"){
								//console.log("d.name " + d.name  + " status:" + d.hoststatus); 
								return d._children ? "orange" : "#FFA500"; 
							}
						  else {
						     //console.log("d.name " + d.name  + " status:" + d.hoststatus); 
							  return d._children ? "blue" : "#0000FF"; 
						  };
				  }) ;

			  nodeEnter.append("text")
				  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
				  .attr("dy", ".35em")
				  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
				  .text(function(d) { return d.name; })
				  .style("fill-opacity", 1e-6);

			  // Transition nodes to their new position.
			  var nodeUpdate = node.transition()
				  .duration(duration)
				  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

			
			
			//modified for setting the color of the node based on the status of the node
			//  nodeUpdate.select("circle")
			//	  .attr("r", 10)
			//	  .style("fill", function(d) { return d._children ? "green" : "#008000"; });
        
       		// for setting the color same as parent node
			  nodeUpdate.select("circle")
				  .attr("r", 10)
				  .style("fill", function(d) { 
						if(d.hoststatus === "UP"){
						      //for load balancer with low capacity fill with light green else green
							  if(d.hostcapacity === "LOW") {
									//console.log("d.name " + d.name  + " status:" + d.hoststatus + " hostcapacity: " + d.hostcapacity + " color: black"  );
									return d._children ? "gradient" : "url(#grad)";  
							  }
							  else if (d.hostcapacity === "FULL"){
									//console.log("d.name " + d.name  + " status:" + d.hoststatus + " hostcapacity: " + d.hostcapacity + " color: green" ); 
									return d._children ? "green" : "#008000"; 
							  }
							   else {
									//console.log("d.name " + d.name  + " status:" + d.hoststatus + " hostcapacity: " + d.hostcapacity + " color: white" ); 
									return d._children ? "white" : "#FFFFFF"; 
									//for NIL host capacity
							  };

							}
							else if (d.hoststatus === "DOWN"){
						     //console.log("d.name " + d.name  + " status:" + d.hoststatus); 
							    return d._children ? "red" : "#FF0000"; 
							} 
							else if (d.hoststatus === "UNREACHABLE"){
								//console.log("d.name " + d.name  + " status:" + d.hoststatus); 
								return d._children ? "orange" : "#FFA500"; 
							}
						  else {
						     //console.log("d.name " + d.name  + " status:" + d.hoststatus); 
							  return d._children ? "blue" : "#0000FF"; 
						  };
				  })				  
					.style("stroke", function(d) { 
						if(d.hoststatus === "UP"){
						      //console.log("d.name " + d.name  + " status:" + d.hoststatus + " hostcapacity: " + d.hostcapacity + " color: green" ); 
							  return d._children ? "green" : "#008000";

							}
							else if (d.hoststatus === "DOWN"){
						     //console.log("d.name " + d.name  + " status:" + d.hoststatus); 
							    return d._children ? "red" : "#FF0000"; 
							} 
							else if (d.hoststatus === "UNREACHABLE"){
								//console.log("d.name " + d.name  + " status:" + d.hoststatus); 
								return d._children ? "orange" : "#FFA500"; 
							}
						  else {
						     ////console.log("d.name " + d.name  + " status:" + d.hoststatus); 
							  return d._children ? "blue" : "#0000FF"; 
						  };
				  }) ;

			  nodeUpdate.select("text")
				  .style("fill-opacity", 1);

			  // Transition exiting nodes to the parent's new position.
			  var nodeExit = node.exit().transition()
				  .duration(duration)
				  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
				  .remove();

			  nodeExit.select("circle")
				  .attr("r", 1e-6);

			  nodeExit.select("text")
				  .style("fill-opacity", 1e-6);

			  // Update the links…
			  			  
			  var link = svg.selectAll("path.link")
				  .data(links, function(d) { 
				  return d.target.id; 
					});
				  
			  // Enter any new links at the parent's previous position.
			  link.enter().insert("path", "g")
				  .attr("class", "link")
				  .attr("d", function(d) {
				    var o = {x: source.x0, y: source.y0};
					return diagonal({source: o, target: o});
				  })
				  .style("stroke", function(d) {
							  if(d.target.parentstatus === "UP" ){ //parent status
								  if (d.target.hoststatus === "UP"){ //child status
									//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus);
								    return d.target.color ? "green" : "#008000";
								  
								  } else if(d.target.hoststatus === "DOWN")
								  {
									//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus); 
								    return d.target.color ? "red" : "#FF0000"; 
								  } else {
								  	//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus);
								      return d.target.color ? "orange" : "#FFA500"; 
								  } ;
							  }
							  else {
							  	//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus);
							      return d.target.color ? "orange" : "#FFA500";
							  } ;
				  
				  } ) 
				  ;

			  // Transition links to their new position.
			  link.transition()
				  .duration(duration)
				  .attr("d", diagonal)
				  .style("stroke", function(d) {
							  if(d.target.parentstatus === "UP" ){ //parent status
								  if (d.target.hoststatus === "UP"){ //child status
									//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus);
								    return d.target.color ? "green" : "#008000";
								  
								  } else if(d.target.hoststatus === "DOWN")
								  {
									//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus); 
								    return d.target.color ? "red" : "#FF0000"; 
								  } else {
								  	//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus);
								      return d.target.color ? "orange" : "#FFA500"; 
								  } ;
							  }
							  else {
							  	//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus);
							      return d.target.color ? "orange" : "#FFA500";
							  } ;
				  
				  } ) ;

			  // Transition exiting nodes to the parent's new position.
			  link.exit().transition()
				  .duration(duration)
				  .attr("d", function(d) {
					var o = {x: source.x, y: source.y};
					return diagonal({source: o, target: o});
				  })
				  .style("stroke", function(d) {
							  if(d.target.parentstatus === "UP" ){ //parent status
								  if (d.target.hoststatus === "UP"){ //child status
									//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus);
								    return d.target.color ? "green" : "#008000";
								  
								  } else if(d.target.hoststatus === "DOWN")
								  {
									//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus); 
								    return d.target.color ? "red" : "#FF0000"; 
								  } else {
								  	//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus);
								      return d.target.color ? "orange" : "#FFA500"; 
								  } ;
							  }
							  else {
							  	//console.log("d.target.name " + d.target.name  + " hoststatus: " + d.target.hoststatus + " parent status:" + d.target.parentstatus);
							      return d.target.color ? "orange" : "#FFA500";
							  } ;
				  
				  } )  
				  .remove();

			  // Stash the old positions for transition.
			  nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			  });
			}

			// Toggle children on click.
			function click(d) {
			  if (d.children) {
				d._children = d.children;
				d.children = null;
			  } else {
				d.children = d._children;
				d._children = null;
			  }
			  update(d);
			}

}
