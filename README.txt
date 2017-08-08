Overview: 
==========
“Server Inter-dependency For Splunk” App integrates Nagios with Splunk and uses D3 for visualization of dependency between servers, provides continuous server monitoring for better situational awareness of the system, determines capacity of load balancer and displays real-time and point in time status of the system.

Features:
===========
•	Real time server status from Nagios
•	Visual Representation of Infrastructure Hierarchy
•	Determine System Resiliency
•	D3 Tree Interactive Integration with Splunk
•	Point in time status of servers
•	Portable Application

Brief:
==============
1) 	Upload the application user’s Splunk server (Refer doc: Server_Monitoring_App.docx)

2)	A sample Static dashboard (Server_Interdependency_Sample) is created  which provides a visual representation of how the Tree D3 diagram will look like (Refer doc: Server_Monitoring_App.docx).

3) 	To set up the actual dashboard, do the following steps (Refer doc: Server_Monitoring_App.docx)
•	Set up Nagios Hosts for Parent Child Relationship
•	Set up Nagios Performance Data
•	Set up a splunk universal forwarder (with inputs.conf and outputs.conf), to read the Nagios performance data 
•	On the splunk server, set up the required Index and Port 
•	Once the data events are received in splunk, set up the required extract fields

The Server Interdependency Dashboard should now be ready to use.

Documents for Reference:
==========================
1) Server_Monitoring_App.docx

Queries/Feedback:
===================
1. Arindam Chatterjee <Arindam.Chatterjee@mastek.com>
2. Poojan Reddy <poojan.reddy@mastek.com>
3. Prachi Dongre <prachi.dongre@mastek.com>

Web: 
======
MASTEK LTD <https://www.mastek.com/>