
var Search = {
	parameters: {externalRequest: 'Toolbox', start:0, limit: 20},
	getInput: function(){
		var searchId = $('#searchId').val();
		switch($('#searchType').val()){
			case "order":
				re = /ORD([A-Z0-9])+/ig;
				var searchStr = searchId.match(re);
				if(searchStr == null){
					alert("ID or Type error, please input again!");
					return 0;
				}else{
					this.parameters['ordersId'] = searchStr.join(',');
				}
				this.parameters['searchType'] = "order";
				break;
			
			case "shipment":
				re = /SHI([A-Z0-9])+/ig;
				var searchStr = searchId.match(re);
				if(searchStr == null){
					alert("ID or Type error, please input again!");
					return 0;
				}else{
					this.parameters['shipmentId'] = searchStr.join(',');
				}
				this.parameters['searchType'] = "shipment";
				break;
		}
		//this.log(this.parameters);
	},
		
	log: function(obj){
		var x, y, temp;
		for (x in obj){
			if(typeof(x) == "object"){
				for (y in x){
					temp += y + ": " + x[y] + "\n";
				}
			}else{
				temp += x + ": " + obj[x] + "\n";
			}
		}
		alert (temp);
	},
	
		
	search: function(id, type){
		var currentApp = this;
		if((id !== null && type !== null) || this.getInput() != 0){
			if(id !== null && type !== null){
				  currentApp.parameters['searchType'] = type;
				  switch(currentApp.parameters['searchType']){
					case "order":
					    currentApp.parameters['ordersId'] = id;
					break;
					
					case "shipment":
					    currentApp.parameters['shipmentId'] = id;
					break;
				     }
			}
			 switch(currentApp.parameters['searchType']){
				case "order":
					var searchUrl = "http://192.168.0.184:91/backOffice/orders/search";
					break;
					
				case "shipment":
					var searchUrl = "http://192.168.0.184:91/backOffice/shipments/search";
					break;
			 }
			//this.log(currentApp.parameters);
			currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
				{
				       url: searchUrl,
				       status: "Please wait..."
				}
			);
			currentApp.progressDialog.focus();
				 
			$.getJSON(searchUrl, currentApp.parameters , function(data, textStatus){
			//currentApp.log(data);
			//alert(textStatus);
			switch(currentApp.parameters['searchType']){
				case "order":
					window.openDialog(
						'chrome://backoffice/content/order-list.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=240,width=600',data
					);
				break;
							
				case "shipment":
					window.openDialog(
						'chrome://backoffice/content/shipment-list.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=240,width=950',data
					);
				break;
			    }
			window.close();
			currentApp.progressDialog.close();
			});
		}
	},
	
	orderList: function(result){
		var orderListTreechildren = document.getElementById("order-list-treechildren");		    
		for(var x in result.results){
		    var treeitem = orderListTreechildren.ownerDocument.createElement("treeitem");
		    orderListTreechildren.appendChild(treeitem);
		    
		    var treerow = treeitem.ownerDocument.createElement("treerow");     
		    treeitem.appendChild(treerow);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");
		    treecell.setAttribute("id",result.results[x].ordersId);
		    treecell.setAttribute("label",result.results[x].ordersId);
		    treerow.appendChild(treecell);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");
		    treecell.setAttribute("label",result.results[x].sellerId);
		    treerow.appendChild(treecell);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",result.results[x].buyerId);
		    treerow.appendChild(treecell);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",result.results[x].grandTotalCurrency+" "+result.results[x].grandTotalValue);
		    treerow.appendChild(treecell);
		    
		   switch(result.results[x].status){
			case "N":
				var status = "Quoting";
			break;
			
			case "Q":
				var status = "Quoted";
			break;
			
			case "M":
				 var status = "Incomplete Checkout";
			break;
			
			case "W":
				var status = "Waiting Payment";
			break;
			
			case "E":
				var status = "Pending for Payment Confirmation";
			break;
			
			case "C":
				var status = "Excess Payment";
			break;
			
			case "V":
				var status = "Investigate";
			break;
			
			case "L":
				var status = "Followed up";
			break;
			
			case "S":
			  var status = "Insufficient Payment";
			break;
			
			case "P":
				var status = "Completed Payment";
			break;
			
			case "X":
				var status = "Canceled";
			break;
		    }
		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",status);
		    treerow.appendChild(treecell);
		}
	},
	
	openOrderDetailPage: function(){
		var currentApp = this;
		var tree = document.getElementById("order-list-tree");
	
		var detailUrl = "http://bo.uxcell.com/uxcellBO/orders/maintainOrders.htm";
		var searchType = "order";
		var parameters = "ordersId="+tree.view.getCellText(tree.currentIndex,tree.columns.getColumnAt(0));
		
		currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
			{
				url: detailUrl,
				status: "Please wait..."
			}
		);
		currentApp.progressDialog.focus();
		$.ajax({
		       type: "GET",
		       url: detailUrl,
		       data: parameters,
		       success: function(msg){
			       currentApp.progressDialog.close();
			       window.open(detailUrl + '?' + parameters,'mywindow');
		       },
		       error: function(msg){
			       window.openDialog(
				       'chrome://backoffice/content/login.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=110,width=350',{
				       detailUrl: detailUrl,
				       parameters: parameters
			       }
			       );
			       currentApp.progressDialog.close();
		       }
	       });
	},
	
	shipmentList: function(result){
		var shipmentListTreechildren = document.getElementById("shipment-list-treechildren");		    
		for(var x in result.results){
		    var treeitem = shipmentListTreechildren.ownerDocument.createElement("treeitem");
		    shipmentListTreechildren.appendChild(treeitem);
		    
		    var treerow = treeitem.ownerDocument.createElement("treerow");     
		    treeitem.appendChild(treerow);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");
		    treecell.setAttribute("id",result.results[x].shipmentId);
		    treecell.setAttribute("label",result.results[x].shipmentId);
		    treerow.appendChild(treecell);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");
		    treecell.setAttribute("label",result.results[x].dcId);
		    treerow.appendChild(treecell);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",result.results[x].shipToAttn);
		    treerow.appendChild(treecell);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",result.results[x].ordersId);
		    treerow.appendChild(treecell);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",result.results[x].sellerId);
		    treerow.appendChild(treecell);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",result.results[x].createdOn);
		    treerow.appendChild(treecell);

		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",result.results[x].deliverOn);
		    treerow.appendChild(treecell);
		    
		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",result.results[x].shippedOn);
		    treerow.appendChild(treecell);
		    
		    switch(result.results[x].status){
				case "N":
					var status = "Ready";
				break;
				
				case "H":
					var status = "Hold";
				break;
				
				case "W":
					var status = "Await";
				break;
				
				case "K":
					var status = "Packed";
				break;
				
				case "S":
					var status = "Shipped";
				break;
				
				case "X":
					var status = "Cancel";
				break;
		    }
		    var treecell = treerow.ownerDocument.createElement("treecell");     
		    treecell.setAttribute("label",status);
		    treerow.appendChild(treecell);
		}
	},
	
	openShipmentDetailWindow: function(){
		var currentApp = this;
		var tree = document.getElementById("shipment-list-tree");
		var detailUrl = "http://bo.uxcell.com/uxcellBO/shipment/maintainShipment.htm";
		var searchType = "shipment";
		var parameters = "shipmentId="+tree.view.getCellText(tree.currentIndex,tree.columns.getColumnAt(0));

		currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
			{
				url: detailUrl,
				status: "Please wait..."
			}
		);
		currentApp.progressDialog.focus();
		$.ajax({
		       type: "GET",
		       url: detailUrl,
		       data: parameters,
		       success: function(msg){
			       currentApp.progressDialog.close();
			       window.open(detailUrl + '?' + parameters,'mywindow');
		       },
		       error: function(msg){
			       window.openDialog(
				       'chrome://backoffice/content/login.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=110,width=400',{
				       detailUrl: detailUrl,
				       parameters: parameters
			       }
			       );
			       currentApp.progressDialog.close();
		       }
	       });
	},
	
	login: function(){
		var currentApp = this;
		var user = $('#user').val();
		var password = $('#password').val();
		currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
						{
							url: "http://bo.uxcell.com/uxcellBO/logon.htm",
							status: "Please wait..."
						}
					);
		currentApp.progressDialog.focus();
		$.post('http://bo.uxcell.com/uxcellBO/logon.htm', { id: user, password: password },
			function(data){
				if(data.indexOf("logonForm") > 0){
					currentApp.progressDialog.close();
		        		alert("user or password error, please input again!");
				}else{
					window.close();
					var detailUrl = $('#detailUrl').val();
					var parameters = $('#parameters').val();
					window.open(detailUrl + '?' + parameters,'mywindow');
					currentApp.progressDialog.close();
					}
				});
	}
}