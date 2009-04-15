function log(obj){
        if(typeof(obj) == "object"){
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
        }else{
            alert(obj);
        }
}

function showSearchWindows() {
   window.openDialog(
      'chrome://backoffice/content/search.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,height=180,width=400'
   );
}
		
function showSelectOrderWindows(){
	 var selectOrders = window.content.getSelection().toString();
	 //alert(getBrowser().selectedBrowser.contentDocument.getSelection());
	 //var bodyContent = window.document.body.innerHTML;
	 if(selectOrders == ''){
	 	  alert("sorry, can not get orders id");
	 	  return 0;
	 }
	 window.openDialog(
      'chrome://backoffice/content/all-order-list.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',selectOrders
      );
}

function showSelectshipmentWindows(){
	var selectShipments = window.content.getSelection().toString();
	if(selectShipments == ''){
	 	  alert("sorry, can not get shipments id");
	 	  return 0;
	 }
	 //var bodyContent = window.document.body.innerHTML;
	 window.openDialog(
      'chrome://backoffice/content/all-shipment-list.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',selectShipments
      );
}

function showInputEmailWindows(){ 
   $("input[type='text']").each(function(){
      alert($(this).val());
   });
   alert("test");
   window.openDialog(
      'chrome://backoffice/content/add-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',"input"
   );
}

function showSelectEmailWindows(){
   var selectEmails = window.content.getSelection().toString();
   if(selectEmails == ''){
      alert("sorry, can not get email address");
      return 0;
   }
   window.openDialog(
      'chrome://backoffice/content/add-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',selectEmails
   );
}

function checkEmailWindows(){
   var selectEmails = window.content.getSelection().toString();
   if(selectEmails == ''){
      alert("sorry, can not get email address");
      return 0;
   }
   window.openDialog(
      'chrome://backoffice/content/check-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=235,width=280',selectEmails
   );
}

function checkDateBlacklistWindows(){
   //window.openDialog('chrome://backoffice/content/blacklist-date-search.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=200,width=520');
   window.openDialog('chrome://backoffice/content/blacklist-date-search.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=100,width=280');
}

function mangeBlacklistWindows(){
   window.openDialog(
      'chrome://backoffice/content/manage-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500'
   );
}

function generateCleanupWindows(){
   window.openDialog(
      'chrome://backoffice/content/generate-cleanup.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=130,width=330'
   );
}

function reportWindows(){
   window.openDialog(
      'chrome://backoffice/content/report-search.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=125,width=280'
   );
}

function outOfStockWindows(){
   window.openDialog(
      'chrome://backoffice/content/out-of-stock-search.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=100,width=280'
   );
}

function outOfStockEmailManageWindows(){
   window.openDialog(
      'chrome://backoffice/content/out-of-stock-email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500'
   );
}

function emailTemplateManageWindows(){
   window.openDialog(
      'chrome://backoffice/content/email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500'
   );
}

function ssOrderWindows(){
   window.openDialog(
      'chrome://backoffice/content/searchOrder.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable'
   );
}

//setInterval('alert("test")', 1000);
function showCustomerSource(){
   /*
   window.openDialog(
      "chrome://backoffice/content/question-notify.xul", "question-notify",
      "chrome,popup,titlebar=no","chrome://backoffice/skin/status/mail_large.png", "hello world",
                "You are very good", 3000, function(){alert('test');});
   */
   //log(window.content.document.getElementById("a").value);
   //var tables = document.all.tags("table");
   
   //if(window.content.document.documentURI.indexOf("bo.uxcell.com/uxcellBO/orders/maintainOrders.htm") > 0){
         var source = window.content.document.getElementById("source");
         if(source == null || source == "undefined"){
               if(window.content.document.getElementsByName("orders.sellerId")[0].value == "B2C" || window.content.document.getElementsByName("orders.sellerId")[0].value == "B2B"){
                  var ordersId = window.content.document.getElementsByName("orders.ordersId")[0].value;
                  //alert(ordersId);
                  $.getJSON("http://192.168.0.184/service/customers_track.php", {ordersId:ordersId} , function(data, textStatus){
                     var tables = window.content.document.getElementsByTagName("table"); 
                     var x= tables[0].insertRow(3);
                     x.className = 'info';
                     var y= x.insertCell(0);
                     y.className = 'sessionTitle';
                     y.innerHTML="Customer Source";
                     
                     var newCell = x.insertCell(1);
                     var newTable = newCell.ownerDocument.createElement("table");
                     newTable.id = "source";
                     newCell.appendChild(newTable);
                     var newTR = newTable.ownerDocument.createElement("tr");
                     newTR.className = 'info';
                     newTable.appendChild(newTR);
                     
                     var ipName = newTR.insertCell(0);
                     ipName.className = 'sessionTitle';
                     ipName.innerHTML = "IP";
                     
                     var ipValue = newTR.insertCell(1);
                     ipValue.innerHTML = data.ip;
                     
                     var countryName = newTR.insertCell(2);
                     countryName.className = 'sessionTitle';
                     countryName.innerHTML = "Country";
                     
                     var countryValue = newTR.insertCell(3);
                     countryValue.innerHTML = data.country;
                     
                     var refererName = newTR.insertCell(4);
                     refererName.className = 'sessionTitle';
                     refererName.innerHTML = "Referer";
                     
                     
                     var refererValue = newTR.insertCell(5);
                     if(data.referer == ""){
                        refererValue.innerHTML = "Directly";
                     }else{
                        /*
                        var se = z.ownerDocument.createElement("select");
                        se.name = "selectName";
                        se.options[0] = new Option("selection 1","value 1");
                        se.options[1] = new Option("selection 2","value 2");
                        se.options[2] = new Option("selection 3","value 3");
                        se.options[3] = new Option("selection 4","value 4");
                        z.appendChild(se);
                        */
                        var a = refererValue.ownerDocument.createElement("a");
                        a.href = data.referer;
                        a.innerHTML = unescape(data.referer);
                        a.target = "_blank";
                        refererValue.appendChild(a);
                     }
                  })
               }
            
         }
   //}
}

function showStock(){
   var source = window.content.document.getElementById("source");
   if(source == null || source == "undefined"){
      var tableSort = 7;
   }else{
      var tableSort = 8;
   }
   var stock = window.content.document.getElementById("stock");
   if(stock == null || stock == "undefined"){
      var tables = window.content.document.getElementsByTagName("table"); 
      var table = tables[tableSort].rows;
      //console.log(tableLength);
      var skuArray = {};
      var skuQuantityArray = [];
      for(var i=1; i<table.length; i++){
         skuArray['sku['+i+']'] = window.content.document.getElementsByName("ordersDetails["+(i-1)+"].ordersDetail.skuId")[0].value;
         skuQuantityArray[i] = window.content.document.getElementsByName("ordersDetails["+(i-1)+"].ordersDetail.quantity")[0].value;
      }
      skuArray['acceptDataType'] = 'json';
      //log(skuQuantityArray);
      $.getJSON("http://192.168.10.102/salebo/stockLevel.php", skuArray , function(data, textStatus){
         //log(data);
         var herder = table[0].insertCell(4);
         herder.innerHTML = "Stock";
         herder.id = "stock";
         var cellData;
         var j = 0;
         for(var i=1; i<table.length; i++){
            cellData = table[i].insertCell(4);
            if(skuQuantityArray[i] < data[j].a_level){
               cellData.innerHTML = "<font color='green'>"+data[j].a_level+"</font>";
            }else if(skuQuantityArray[i] == data[j].a_level){
               cellData.innerHTML = "<font color='tomato'>"+data[j].a_level+"</font>";
            }else{
               cellData.innerHTML = "<font color='red'>"+data[j].a_level+"</font>";
            }
            j = j + 1;
         }
      
      })
   }
}

function showAttention(){
   var table = window.content.document.getElementById("shipmentPack");
   if(table == null || table == "undefined"){
      var process_bar = window.content.document.getElementById("shipmentPack");
      if(process_bar == null || process_bar == "undefined"){
         var div = window.content.document.createElement("Div");
         div.id = "process_bar";
         div.align = "center";
         div.innerHTML = '<img src="http://192.168.0.184/service/images/process_bar.gif" border="0">';
         window.content.document.body.appendChild(div);
      }
      $.getJSON("http://192.168.0.184/service/BackOffice.php", {type:"shipmentPackAttention"} , function(data, textStatus){
            window.content.document.getElementById("process_bar").style.visibility = "hidden";
            var bfy = data.bfydate;
            var y = data.ydate;
            var t = data.tdate;
            var oTbl = window.content.document.createElement("Table");
            oTbl.id = "shipmentPack";
            oTbl.width = "50%";
            oTbl.cellSpacing = 1;
            oTbl.cellPadding = 2;
            oTbl.border = 1;
            oTbl.align = "center";
            
            var oCap = oTbl.createCaption()
            oCap.innerHTML="Shipments still in the packed status("+data.gtime+")";
            oCap.className="pageTitle";
         
            var oTR= oTbl.insertRow(0);
            oTR.className="info";
            var  oTD = oTR.insertCell(0);
            oTD.width = "80%";
            oTD.innerHTML="<font color='red'><b>pack on three days ago</b></font>";
            var  oTD = oTR.insertCell(1);
            oTD.width = "20%";
            oTD.innerHTML="<a class='navLink' href='javascript:test(\""+bfy+"\")'>"+data.bfy+"</a>";
            
            var oTR= oTbl.insertRow(1);
            oTR.className="info";
            var  oTD = oTR.insertCell(0);
            oTD.width = "80%";
            oTD.innerHTML="<font color='red'><b>pack on the day before yesterday</b></font>";
            var  oTD = oTR.insertCell(1);
            oTD.width = "20%";
            oTD.innerHTML="<a class='navLink' href='javascript:test(\""+y+"\")'>"+data.y+"</a>";
            
            var oTR= oTbl.insertRow(2);
            oTR.className="info";
            var  oTD = oTR.insertCell(0);
            oTD.width = "80%";
            oTD.innerHTML="<font color='red'><b>pack on yesterday</b></font>";
            var  oTD = oTR.insertCell(1);
            oTD.width = "20%";
            oTD.innerHTML="<a class='navLink' href='javascript:test(\""+t+"\")'>"+data.t+"</a>";
            
            var oTR= oTbl.insertRow(3);
            oTR.className="info";
            var  oTD = oTR.insertCell(0);
            oTD.width = "80%";
            oTD.innerHTML="Date Range <input class='borderField' id='ShipmentPackRange' type='text' size='19' value='"+bfy+"--"+t+"' name='ShipmentPackRange'/> (yyyyMMdd or yyyyMMdd--yyyyMMdd)";
            var  oTD = oTR.insertCell(1);
            oTD.width = "20%";
            oTD.innerHTML='<a class="navLink" href="javascript:test(\'\')">Submit</a><form name="ShipmentPackForm" method="post" action="/uxcellBO/shipment/searchShipment.htm">\
                           <input name="shipment.status" type="hidden" value="K"/>\
                           <input name="packedOnCrit" type="hidden" value=""/>\
                           </form>\
                           <script language="javascript">\
                           function test(date){\
                              if(date==""){\
                                 date = document.getElementById("ShipmentPackRange").value;\
                              }\
                              document.ShipmentPackForm.elements["packedOnCrit"].value = date;\
                              document.ShipmentPackForm.submit();\
                           }\
                           </script>';
            
            window.content.document.body.appendChild(oTbl);
      });
      
   }
}

function test1(){
   //$("body").append("<b>Hello</b>");

}

function test2(){
   //$("process_bar").hide();
   
}

function BackOfficeExtendShow(){
   if(window.content.document.documentURI.indexOf("/uxcellBO/orders/maintainOrders.htm") > 0){
      showCustomerSource();
      showStock();
   }
   
   if(window.content.document.documentURI.indexOf("/uxcellBO/system/userAttention.htm") > 0){
      showAttention();
   }
}

setInterval ( "BackOfficeExtendShow()", 2000 );

function customerAccessPageTrack(){
   if(window.content.document.documentURI.indexOf("bo.uxcell.com/uxcellBO/orders/maintainOrders.htm") > 0){
      if(window.content.document.getElementsByName("orders.sellerId")[0].value == "B2C" || window.content.document.getElementsByName("orders.sellerId")[0].value == "B2B"){
         progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
         {
             url: "http://192.168.0.184/service/analyze.php",
             status: "Please wait..."
         }
         );
         progressDialog.focus();
         var ordersId = window.content.document.getElementsByName("orders.ordersId")[0].value;
         $.getJSON("http://192.168.0.184/service/customers_track.php", {ordersId:ordersId} , function(data, textStatus){
               $.getJSON("http://192.168.0.184/service/analyze.php", {ip:data.ip} , function(data, textStatus){
                  progressDialog.close();
                  window.openDialog(
                     'chrome://backoffice/content/customer-access-page-track.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=350,width=800',data
                  );
               })
         })
      }
   }else{
      alert("only BackOffice system use!");
   }
}

function clickTrack(){
   if(window.content.document.documentURI.indexOf("www.uxcell.com") > 0){
      progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
            {
                url: "http://192.168.0.184/service/clickTrack.php",
                status: "Please wait..."
            }
      );
      progressDialog.focus();
           
      $.getJSON("http://192.168.0.184/service/clickTrack.php", {w: (Number(window.innerWidth)-15),url: window.content.document.documentURI} , function(data, textStatus){
            var jg_doc = new jsGraphics();
            jg_doc.setColor("#10FF00"); // green
            for(var i in data){
               jg_doc.fillEllipse(Number(data[i].x), Number(data[i].y), 5, 5);
               if(i > 300)
                  break;
            }
            jg_doc.paint();
            progressDialog.close();
      });
   }else{
      alert("only Uxcell Site use!");
   }
}

function clickTrackSearchWindows(){
   window.openDialog(
      'chrome://backoffice/content/click-track-search.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=100,width=280'
   );
}

//setTimeout("test()",2000);
//alert("test");
function copyFile(sourcefile,destdir)
{
  // get a component for the file to copy
  var aFile = Components.classes["@mozilla.org/file/local;1"]
    .createInstance(Components.interfaces.nsILocalFile);
  if (!aFile) return false;

  // get a component for the directory to copy to
  var aDir = Components.classes["@mozilla.org/file/local;1"]
    .createInstance(Components.interfaces.nsILocalFile);
  if (!aDir) return false;

  // next, assign URLs to the file components
  aFile.initWithPath(sourcefile);
  aDir.initWithPath(destdir);

  // finally, copy the file, without renaming it
  aFile.copyTo(aDir,null);
}

var theConsoleListener =
{
    observe:function( aMessage ){
	dump("Log : " + aMessage.message);
    },
    QueryInterface: function (iid) {
	if (!iid.equals(Components.interfaces.nsIConsoleListener) &&
            !iid.equals(Components.interfaces.nsISupports)) {
		throw Components.results.NS_ERROR_NO_INTERFACE;
	    }
        return this;
    }
};



function showSendEmailWindows(){
	  //copyFile("/root/testfile.txt","/tmp");
	     /*
	   var msgWindow = Components.classes["@mozilla.org/messenger/msgwindow;1"]
	   .createInstance(Components.interfaces.nsIMsgWindow);
	   if (!msgWindow){
				alert("test");
	        }
	   
	   msgWindow.displayHTMLInMessagePane("title", "body");
	   
	     
	   var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].
     getService(Components.interfaces.nsIConsoleService);
             
     
     var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"]
     .getService(Components.interfaces.nsIConsoleService);
     aConsoleService.registerListener(theConsoleListener);
     aConsoleService.logStringMessage("a logging message");
           */
			var observer = {
			  observe: function(subject,topic,data){
			    alert("Topic sent: " + topic);
			      }
		     };

   var observerService = Components.classes["@mozilla.org/observer-service;1"]
   .getService(Components.interfaces.nsIObserverService);
   observerService.addObserver(observer,"my-topic",false);
   observerService.notifyObservers(null,"my-topic","add");
}