var svg ;
//this function is for D3 tree visualization called by Splunk App (Server Inter-dependency for Splunk app). 
function visualization(myResults,chart){

		//When data arrives:
		// format the output in required json format to be used by D3
		var tgt = [];


        myResults.on("data", function() 
		{
		  
			var len = Object.keys(myResults.data().rows).length;
			//console.log ("length of myresult " + len);	
						
			var temp_tgt = [];
			
			//for target formation
			temp_tgt = form_json(myResults.data().rows,len);
			//console.log ("temp tgt result :"  + JSON.stringify(temp_tgt));	
			
			
			//function to form dynamic nested json object
			function form_json(obj){
			    var parent = []; 
				parent = getRootObject(obj);
				//console.log("After getting root object:");
				//console.log(obj);
				parent.children = getChildren(parent, obj);
				//console.log ("root :" + JSON.stringify(root));
				return parent;
			};
			
			//get root
			function getRootObject(rows) {
				var parent = [];
				for (var i = 0; i < len ; i++) {
					//identify root (level0)
					//hostname = parentname but not localhost
					if ((rows[i][0] === rows[i][2])  && rows[i][0] !== "localhost")  {
						var hostcap = "FULL";
						var child_count = 0;
						var cap_count = 0;
						
						//calculating host capacity

						for (var k = 0; k < len ; k++) {
					    
							if ((rows[i][0] === rows[k][2]))  {
									child_count = child_count + 1;							
							
									if ( rows[k][5] === "LOW") {
										cap_count = cap_count + 1; 
									};
							};
							
						};
						
						//if number of children is same as the parent capacity count (low), host capacity is set to NIL
						//if number of children is more than the parent capacity count (low), host capacity is set to LOW
						//for host which are not of type LB, the host capacity will default to FULL
						
						if(cap_count === child_count  && cap_count != 0){
							hostcap = "NIL";
						}
						else if (cap_count < child_count && cap_count != 0) {
							hostcap = "LOW";
						}
						else {
							hostcap = "FULL";
						};
						
						parent = { 
						 "name": rows[i][0], 
						 "parent": rows[i][2],
						 "hoststatus": 	rows[i][1],
						 "parentstatus": rows[i][3],
						 "parenttype": 	rows[i][4],
						 "parentcapacity": rows[i][5],
						 "hostcapacity": hostcap
						 
					   };
						//console.log("Setting true for: " + rows[i][0]);
						rows[i][7] = true;
						break;
					}
				}
				return parent;
			}
			
			
			//get children
			function getChildren(node, rows) {
			var childObj = [];
				for (var r = 0; r < len ; r++) {
					if(node.name === rows[r][2] && !rows[r][7]) {
						var hostcap = "FULL";
						var child_count = 0;
						var cap_count = 0;
						//calculating host capacity
						for (var k = 0; k < len ; k++) {
					    
							if ((rows[r][0] === rows[k][2]))  {
									child_count = child_count + 1;							
							
									if ( rows[k][5] === "LOW") {
										cap_count = cap_count + 1; 
										
									};
							};
							
						};
						
						//if number of children is same as the parent capacity count (low), host capacity is set to NIL
						//if number of children is more than the parent capacity count (low), host capacity is set to LOW
						//for host which are not of type LB, the host capacity will default to FULL
						
						if(cap_count === child_count  && cap_count != 0){
							hostcap = "NIL";
						}
						else if (cap_count < child_count && cap_count != 0) {
							hostcap = "LOW";
						}
						else {
							hostcap = "FULL";
						};
						
						//console.log("Finding childs for: " + node.name);
						var child = { 
						 "name": rows[r][0], 
						 "parent": rows[r][2],
						 "hoststatus": 	rows[r][1],
						 "parentstatus": rows[r][3],
						 "parenttype": 	rows[r][4],
						 "parentcapacity": rows[r][5],
						 "hostcapacity": hostcap
						 						 
					   };
					   rows[r][7] = true;
					   child.children = getChildren(child, rows);
					   childObj.push(child);
					   //console.log("Pushing children: " + child.name + " to: " + node.name);
					}
				}
				//console.log("Returning childObj for: " + node.name);
				//console.log(childObj);
				return childObj;
			}

			tgt = [];
			//push the object into final target
			tgt.push(temp_tgt);
			
			
			//console.log ("final result :"  + JSON.stringify(tgt));		
				   
			//
			//d3 tree visualization start
			//
			
			var link_color ="#000000" ;	
			var treeData = [];
			
			treeData = tgt;
			console.log ("final treeData result :"  + JSON.stringify(treeData));				

			// ************** Generate the tree diagram	 *****************
			var margin = {top: 20, right: 120, bottom: 20, left: 120},
				width = 960 - margin.right - margin.left,
				height = 500 - margin.top - margin.bottom;
				
			var i = 0,
				duration = 750;

			var tree = d3.layout.tree()
				.size([height, width]);

			var diagonal = d3.svg.diagonal()
				.projection(function(d) { return [d.y, d.x]; });

			//configure only once 
			if(!svg) { 
		         svg = d3.select(chart).append("svg")
				.attr("width", width + margin.right + margin.left)
				.attr("height", height + margin.top + margin.bottom)
			  	.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			}
			
			//gradient used for color of nodes
			var grad = svg.append("defs").append("linearGradient").attr("id", "grad")
             			 .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
				grad.append("stop").attr("offset", "50%").style("stop-color", "green");
				grad.append("stop").attr("offset", "50%").style("stop-color", "white");
			
			root = []; //flush out existing root value
			
			root = treeData[0];
			root.x0 = height / 2;
			root.y0 = 0;
			
			//modified for setting the color of the node based on the status of the node
			
			update(root); 
			
			
			d3.select(self.frameElement).style("height", "500px");

			function update(source) {
									
				  // Compute the new tree layout.
				 // var nodes = tree.nodes(root).reverse();
				  var nodes = [];
				  
				  nodes = tree.nodes(root).reverse(),  links = tree.links(nodes);
				 
				  // Normalize for fixed-depth.
				  nodes.forEach(function(d) { d.y = d.depth * 180; });

				  // Update the nodesâ€¦
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
				  var nodeUpdate  = node.transition()
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

				// nodeUpdate.select("text")
				//	   .style("fill-opacity", 1)
				//	   .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
				//	  .attr("dy", ".35em")
				//	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
				//	  .text(function(d) { return d.name; });
				
					   nodeUpdate.select("text")
					   .style("fill-opacity", 1)
					   .text(function(d) { return d.name; });
					  

				  // Transition exiting nodes to the parent's new position.
				  var nodeExit = node.exit().transition()
					  .duration(duration)
					  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
					  .remove();

				  nodeExit.select("circle")
					  .attr("r", 1e-6);

				  nodeExit.select("text")
					  .style("fill-opacity", 1e-6);
					  
				  //additional
				  //node.exit().remove();
									
				  // Update the links¦
							  
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
					  
					//additional
					//link.exit().remove();
				

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
					
			// d3 tree visualization ends

         });
}



