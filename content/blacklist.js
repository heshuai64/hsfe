var BlackList = {
    //serverUrl:"http://192.168.5.193/wwwuxcell",
    serverUrl:"http://192.168.0.184",
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
    
    addBlacklist: function(){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
            {
                url: currentApp.serverUrl + "/service/black_list.php",
                status: "Please wait..."
            }
        );
        
        var totalNum = document.getElementById('totalNum').value;
        var emailString = "[";
        for(var i=0;i<=totalNum;i++){
            emailString = emailString + '{"email":"' + document.getElementById("blacklist-" + i.toString()).value + '"}';
            if(i<totalNum){
                emailString = emailString + ",";
            }
        }
        emailString = emailString + "]";
        //alert(emailString);
        //this.log(emailArray[0].email);
        
        $.post(currentApp.serverUrl + "/service/black_list.php", { action: "C", data: emailString },
             function(data){
                //alert(data);
                currentApp.progressDialog.close();
                if(data == 'success'){
                    window.close();
                    alert('add blacklist email success!');
                    window.openDialog('chrome://backoffice/content/manage-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500');
                }else{
                    alert('add blacklist email failure! please notice author');
                }
            }
        );
    },
    
    checkBlacklist: function(email_arry){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
            {
                url: currentApp.serverUrl + "/service/black_list.php",
                status: "Please wait..."
            }
        );
        
        var emailString = "[";
        var i = 0;
        for (var x in email_arry)
        {
            emailString = emailString + '{"email":"' + email_arry[x] + '"}';
            if(i < (email_arry.length-1)){
                emailString = emailString + ",";
            }
            i = i + 1;
        }
        emailString = emailString + "]";
        
        //alert(emailString);
        $.post(currentApp.serverUrl + "/service/black_list.php", { action: "E", data: emailString },
             function(data){
                currentApp.progressDialog.close();
                //alert(data);
                var result_array = eval(data);
                var blacklistTreechildren = document.getElementById("email-list-treechildren");
                for(var x in email_arry){
                    
                    var treeitem = blacklistTreechildren.ownerDocument.createElement("treeitem");
                    blacklistTreechildren.appendChild(treeitem);
                    
                    var treerow = treeitem.ownerDocument.createElement("treerow");     
                    treeitem.appendChild(treerow);
                    
                    var treecell = treerow.ownerDocument.createElement("treecell");
                    treecell.setAttribute("label",email_arry[x]);
                    treerow.appendChild(treecell);
                    
                    if(result_array[x] > 0){
                        var result = "YES";
                    }else{
                        var result = "NO";
                    }
                    
                    var treecell = treerow.ownerDocument.createElement("treecell");
                    treecell.setAttribute("label",result);
                    treerow.appendChild(treecell);
                }
            }
        ); 
    },
    
    readBlacklist : function(){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
            {
                url: currentApp.serverUrl + "/service/black_list.php",
                status: "Please wait..."
            }
        );
        
        $.ajax({
            type: "GET",
            url: currentApp.serverUrl + "/service/black_list.php",
            data: {action:"R"},
            success: function(msg){
                    currentApp.progressDialog.close();
                    //alert(msg);
                    var data = eval(msg);
                    var blacklistTreechildren = document.getElementById("balcklist-treechildren");
                    for(var x in data){
                        
			var treeitem = blacklistTreechildren.ownerDocument.createElement("treeitem");
			blacklistTreechildren.appendChild(treeitem);
			
                        var treerow = treeitem.ownerDocument.createElement("treerow");     
                        treeitem.appendChild(treerow);
                        
                        var treecell = treerow.ownerDocument.createElement("treecell");
                        treecell.setAttribute("id","id");
                        treecell.setAttribute("label",data[x].id);
                        treerow.appendChild(treecell);
                        
                        var treecell = treerow.ownerDocument.createElement("treecell");
                        treecell.setAttribute("id","email");
                        treecell.setAttribute("label",data[x].email);
                        treerow.appendChild(treecell);
                        
                        var treecell = treerow.ownerDocument.createElement("treecell");     
                        treecell.setAttribute("label",data[x].created);
                        treerow.appendChild(treecell);
                        
                        var treecell = treerow.ownerDocument.createElement("treecell");     
                        treecell.setAttribute("label",data[x].modified);
                        treerow.appendChild(treecell);
                    }
            }
        });
    },
    
    operateRow : function(type){
        var currentApp = this;
        var tree = document.getElementById("balcklist-tree");
        var start = new Object();
        var end = new Object();
        var numRanges = tree.view.selection.getRangeCount();
        var idArray = [];
        var emailArray = [];
        //alert(numRanges);
        for (var t = 0; t < numRanges; t++) {
            tree.view.selection.getRangeAt(t,start,end);
            for (var v = start.value; v <= end.value; v++) {
                id = tree.view.getCellText(v,tree.columns.getColumnAt(0));
                email = tree.view.getCellText(v,tree.columns.getColumnAt(1));
                idArray.push(id);
                emailArray.push(email);
            }
        }
        //alert(idArray);
        //alert(emailArray);
        switch(type){
            case "add":
                window.openDialog('chrome://backoffice/content/add-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable','add');
                break;
            case "edit":
                window.openDialog('chrome://backoffice/content/edit-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',idArray,emailArray);
                break;
            case "delete":
                window.openDialog('chrome://backoffice/content/delete-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',idArray,emailArray);
                break;
        }
    },
    
    update : function(){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
            {
                url: currentApp.serverUrl + "/service/black_list.php",
                status: "Please wait..."
            }
        );
        
        var totalNum = document.getElementById('totalNum').value;
        var emailString = "[";
        for(var i=0;i<=totalNum;i++){
            emailString = emailString + '{"id":"' + document.getElementById("blacklistI-" + i.toString()).value + '","email":"' + document.getElementById("blacklistV-" + i.toString()).value + '"}';
            if(i<totalNum){
                emailString = emailString + ",";
            }
        }
        emailString = emailString + "]";
        //alert(emailString);
        //this.log(emailArray[0].email);
        
        $.post(currentApp.serverUrl + "/service/black_list.php", { action: "U", data: emailString },
             function(data){
                currentApp.progressDialog.close();
                if(data == 'success'){
                    window.close();
                    //alert('edit blacklist success!');
                    window.openDialog(
                        'chrome://backoffice/content/manage-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500'
                    );
                }else{
                    alert('edit blacklist failure! please notice author');
                }
            }
        );
    },
    
    delete : function(){
        var currentApp = this;
        var totalNum = document.getElementById('totalNum').value;
        var idString = "[";
        for(var i=0;i<=totalNum;i++){
            idString = idString + '{"id":"' + document.getElementById("blacklistI-" + i.toString()).value + '"}';
            if(i<totalNum){
                idString = idString + ",";
            }
        }
        idString = idString + "]";
    
        $.post(currentApp.serverUrl + "/service/black_list.php", { action: "D", data: idString },
            function(data){
               if(data == 'success'){
                   window.close();
                   window.openDialog(
                       'chrome://backoffice/content/manage-blacklist.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500'
                   );
               }else{
                   alert('edit blacklist email failure! please notice author');
               }
           }
        );
    },
    
    dataCheckSearch : function(){
        //alert($("#start_time").val());
        //alert($("#end_time").val());
        
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
            {
                url: "http://192.168.0.207:91/backOffice/orders/blacklistCheck",
                status: "Please wait..."
            }
        );
        
        $.ajax({
            type: "GET",
            url: "http://192.168.0.207:91/backOffice/orders/blacklistCheck",
            data: {externalRequest:"Toolbox", startTime:$("#start_time").val(), endTime: $("#end_time").val()},
            success: function(msg){
                    currentApp.progressDialog.close();
                    //alert(msg);
                    var data = eval(msg);
                    window.close();
                    window.openDialog(
                       'chrome://backoffice/content/blacklist-date.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=700',data
                    );
            }
        });
    },
    
}