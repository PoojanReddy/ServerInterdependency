Overview: 
==========
“Server Inter-dependency For Splunk” App integrates Nagios with Splunk and uses D3 for visualization of dependency between servers, determines capacity of servers and displays point in time status of various servers

Features:
===========
•	Real time server status from Nagios
•	Visual Representation of Infrastructure Hierarchy
•	Determine System Resiliency
•	Ensures System Availability
•	D3 Tree Interactive Integration with Splunk
•	Point in time status of servers
•	Portable Application

Server Inter-dependency for Splunk is hosted at Splunkbase:

-------------------------------------------

Once the application is uploaded on the user’s Splunk server,
1)	A sample Static dashboard (Server_Interdependency_Sample) is created  which provides a visual representation of how the Tree D3 diagram will look like (Refer doc: Server_Monitoring_App.docx).
2) To set up the actual dashboard, do the following steps (Refer doc: Server_Monitoring_App.docx)
•	Set up Nagios Hosts for Parent Child Relationship
•	Set up Nagios Performance Data
•	Set up a splunk universal forwarder (with inputs.conf and outputs.conf), to read the Nagios performance data 
•	On the splunk server, set up the required Index and Port 
•	Once the data events are received in splunk, set up the required extract fields

The Server Interdependency Dashboard should now be ready to use.
Documents for Reference
1) Server_Monitoring_App.docx

