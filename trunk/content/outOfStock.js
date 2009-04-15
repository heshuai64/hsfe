var outOfStock = {
    url : "http://192.168.0.184/service/out_of_stock_list.php",
    email_template_url : "http://192.168.0.184/service/out_of_stock_template.php",
    email_send_url : "http://192.168.0.184/service/out_of_stock_notice.php",
    
    log: function(obj){
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
    },
    
    search : function(){
   
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
                {
                    url: currentApp.url,
                    status: "Please wait..."
                }
        );
        currentApp.progressDialog.focus();
       
        
        $.getJSON(currentApp.url, {startDate:$('#start_time').val(),endDate:$('#end_time').val()} , function(data, textStatus){
            currentApp.progressDialog.close();
            window.close();
            window.openDialog(
                 'chrome://backoffice/content/out-of-stock-list.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=320,width=650',data
                 );
                        
	});
    },
    
    test : function(t){
        this.log(t.document.getElementById("src-SHI20080912903").value);
    },
    
    sendEmailConfirm : function(){
        var currentApp = this;
        var tree = document.getElementById("out-of-stock-tree");
        var start = new Object();
        var end = new Object();
        var numRanges = tree.view.selection.getRangeCount();
        var shipmentIdArray = [];
        var emailArray = [];
        var statusArray = [];
        
        for (var t = 0; t < numRanges; t++) {
            tree.view.selection.getRangeAt(t,start,end);
            for (var v = start.value; v <= end.value; v++) {
                var shipmentId = tree.view.getCellText(v,tree.columns.getColumnAt(0));
                var email = tree.view.getCellText(v,tree.columns.getColumnAt(1));
                var status = tree.view.getCellText(v,tree.columns.getColumnAt(3));
                shipmentIdArray.push(shipmentId);
                emailArray.push(email);
                statusArray.push(status);    
            }
        }
        
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
            {
                url: currentApp.email_template_url,
                status: "Please wait..."
            }
        );
        currentApp.progressDialog.focus();
        
        $.getJSON(currentApp.email_template_url, {action:"R"} , function(data, textStatus){
            currentApp.progressDialog.close();
            window.openDialog(
                 'chrome://backoffice/content/out-of-stock-email-confirm.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,scrollbars',shipmentIdArray,emailArray,statusArray,data
                 );
        });
        
        
    },
    
    lookEmailContent : function(my){
        var currentApp = this;
        var shipmentId = document.getElementById('shipmentId-'+my.id).value;
        var templateName = document.getElementById('template-'+my.id).value;
        
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
            {
                url: currentApp.email_template_url,
                status: "Please wait..."
            }
        );
        currentApp.progressDialog.focus();
        
        $.getJSON(currentApp.email_template_url, {action:"OR", name:templateName, shipmentId:shipmentId} , function(data, textStatus){
            currentApp.progressDialog.close();
            //currentApp.log(data);
            window.openDialog(
                     'chrome://backoffice/content/out-of-stock-look-email.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',data.shipToAttn,data.content,data.skuId,data.itemId
                     );
        });
        
    },
    
    sendEmail : function(){
        var currentApp = this;
        var totalNum = document.getElementById("totalNum").value;
        var shipmentArray = [];
        var templateArray = [];
        //var resultArray = [];
        var j = 0;        

        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
            {
                url: currentApp.email_send_url,
                status: "Please wait..."
            }
        );
        currentApp.progressDialog.focus();
            
        for(var i=0;i<=totalNum;i++){
            shipmentArray[i] = document.getElementById("shipmentId-"+i.toString()).value;
            templateArray[i] = document.getElementById("template-"+i.toString()).value;
            
            $.post(currentApp.email_send_url, { shipmentId: shipmentArray[i], template: templateArray[i] },
                        function(data){
                           //resultArray[j] = data;
                           //currentApp.log(resultArray);
                           if(data == "success"){
                               document.getElementById("image-"+j.toString()).src="chrome://backoffice/skin/mail.png";
                           }else{
                                alert(data);
                           }
                           j = j + 1;
                       }
                    );
        }
        currentApp.progressDialog.close();
    },
    
    templateManage : function(opreate){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
                {
                    url: currentApp.email_template_url,
                    status: "Please wait..."
                }
        );
        currentApp.progressDialog.focus();
       
        switch(opreate){
            case "add":
                 window.openDialog(
                 'chrome://backoffice/content/out-of-stock-email-template-add.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',nameArray,templateArray
                 );
            break;
            
            case "read":
                        $.getJSON(currentApp.email_template_url, {action:"R"} , function(data, textStatus){
                            currentApp.progressDialog.close();
                            var templateTreechildren = document.getElementById("template-treechildren");
                            for(var x in data){
                               var treeitem = templateTreechildren.ownerDocument.createElement("treeitem");
                               templateTreechildren.appendChild(treeitem);
                               
                               var treerow = treeitem.ownerDocument.createElement("treerow");     
                               treeitem.appendChild(treerow);
                               
                               var treecell = treerow.ownerDocument.createElement("treecell");
                               treecell.setAttribute("label",data[x].name);
                               treerow.appendChild(treecell);
                               
                               var treecell = treerow.ownerDocument.createElement("treecell");
                               treecell.setAttribute("label",data[x].content);
                               treerow.appendChild(treecell);
                               
                               var treecell = treerow.ownerDocument.createElement("treecell");
                               treecell.setAttribute("label",data[x].created);
                               treerow.appendChild(treecell);
                               
                               var treecell = treerow.ownerDocument.createElement("treecell");
                               treecell.setAttribute("label",data[x].modified);
                               treerow.appendChild(treecell);
                           }
                            
                        });
            break;
        
            case "edit":
                var tree = document.getElementById("template-tree");
                var start = new Object();
                var end = new Object();
                var numRanges = tree.view.selection.getRangeCount();
                if(numRanges > 0){
                    var nameArray = [];
                    var templateArray = [];
                    for (var t = 0; t < numRanges; t++) {
                        tree.view.selection.getRangeAt(t,start,end);
                        for (var v = start.value; v <= end.value; v++) {
                            name = tree.view.getCellText(v,tree.columns.getColumnAt(0));
                            template = tree.view.getCellText(v,tree.columns.getColumnAt(1));
                            nameArray.push(name);
                            templateArray.push(template);
                        }
                    }
                    //this.log(nameArray);
                    //this.log(templateArray);
                    window.openDialog(
                     'chrome://backoffice/content/out-of-stock-email-template-edit.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',nameArray,templateArray
                     );
                }else{
                    alert("please select email.");
                    window.openDialog('chrome://backoffice/content/out-of-stock-email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500');
                }
            break
            
            case "delete":
                var tree = document.getElementById("template-tree");
                var start = new Object();
                var end = new Object();
                var numRanges = tree.view.selection.getRangeCount();
                if(numRanges > 0){
                    var nameString = "[";
                    for (var t = 0; t < numRanges; t++) {
                        tree.view.selection.getRangeAt(t,start,end);
                        for (var v = start.value; v <= end.value; v++) {
                            name = tree.view.getCellText(v,tree.columns.getColumnAt(0));
                            nameString = nameString + '{"name":"'+name+'"}';
                            if(v<end.value){
                                nameString =nameString + ",";
                            }
                        }
                    }
                    var nameString = nameString + "]";
                    //alert(nameString);
                    $.post(currentApp.email_template_url, { action: "D", data: nameString },
                        function(data){
                           //alert(data);
                           if(data == 'success'){
                               window.close();
                               window.openDialog(
                                'chrome://backoffice/content/out-of-stock-email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500'
                                );
                           }else{
                               alert('delete email template failure! please notice author');
                           }
                       }
                    );
                }else{
                    alert("please select email.");
                    window.openDialog('chrome://backoffice/content/out-of-stock-email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500');
                }
            break;
        }
        currentApp.progressDialog.close();
    },
    
    templateAdd : function(){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
                {
                    url: currentApp.email_template_url,
                    status: "Please wait..."
                }
        );
        currentApp.progressDialog.focus();
        
        var name = $('#name').val();
        var content = $('#content').val();
        var dataArray = [{"name":name,"content":content}];
        //var dataString = '[{"name":"'+name+'","content":"'+content+'"}]';
        $.post(currentApp.email_template_url, { action: "C", data: escape(JSON.encode(dataArray)) },
            function(data){
               alert(data);
               if(data == 'success'){
                    window.openDialog(
                        'chrome://backoffice/content/out-of-stock-email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500');
               }else{
                   alert('add email template failure! please notice author');
               }
           }
        );
        currentApp.progressDialog.close();
        //window.close();
    },
    
    templateEdit : function(){
        
    }
}