var Email = {
    ServiceUrl: "http://192.168.5.193/wwwuxcell/service/firefox_email.php",
    
    dumpObject: function (obj,indent) {
	if (!indent) { indent="";}
	if (indent.length>20) { return ; } // don't go too far...
	var s="{\n";
		for (var p in obj) {
			s+=indent+p+":";
			var type=typeof(obj[p]);
			type=type.toLowerCase();
			if (type=='object') {
				s+= this.dumpObject(obj[p],indent+"----");
			} else {
				s+= obj[p];
			}
			s+="\n";
		}
		s+=indent+"}";
		//return s;
        },

    createTemplate: function(){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
                {
                    url: currentApp.ServiceUrl,
                    status: "Please wait..."
                }
        );
        currentApp.progressDialog.focus();
        
        var name = $('#name').val();
        var content = $('#content').val();
        var dataArray = [{"name":name,"content":content}];
        //var dataString = '[{"name":"'+name+'","content":"'+content+'"}]';
        $.post(currentApp.ServiceUrl, { action: "createTemplate", data: escape(JSON.encode(dataArray)) },
            function(data){
               //alert(data);
               if(data == 'success'){
                    window.close();
                    window.openDialog(
                        'chrome://backoffice/content/email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500');
               }else{
                   alert('add email template failure! please notice admin');
               }
           }
        );
        currentApp.progressDialog.close();
    },
    
    readTemplate : function(){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
                {
                    url: currentApp.ServiceUrl,
                    status: "Please wait..."
                }
        );
        currentApp.progressDialog.focus();
        $.getJSON(currentApp.ServiceUrl, {action:"readTemplate"} , function(data, textStatus){
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
        })
    },
    
    editTemplate: function(){
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
             'chrome://backoffice/content/email-template-edit.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable',nameArray,templateArray
             );
        }else{
            alert("please select email template.");
            window.openDialog('chrome://backoffice/content/email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500');
        }
    },
    
    updateTemplate: function(){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
                {
                    url: currentApp.ServiceUrl,
                    status: "Please wait..."
                }
        );
        currentApp.progressDialog.focus();
        
        var nameArray = [];
        var templateArray = [];
        var totalNum = $('#totalNum').val();
        for(i=0; i<=totalNum; i++){
            nameArray.push($('#templateName'+i).val());
            templateArray.push($('#templateValue'+i).val());
        }

        $.post(currentApp.ServiceUrl, { action: "updateTemplate", name: escape(JSON.encode(nameArray)), template:escape(JSON.encode(templateArray))},
            function(data){
               //alert(data);
               if(data == 'success'){
                    window.close();
                    window.openDialog(
                        'chrome://backoffice/content/email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500');
               }else{
                   alert('add email template failure! please notice admin');
               }
           }
        );
        currentApp.progressDialog.close();
    },
    
    deleteTemplate: function(){
        var currentApp = this;
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
            $.post(currentApp.ServiceUrl, { action: "deleteTemplate", data: nameString },
                function(data){
                   //alert(data);
                   if(data == 'success'){
                       window.close();
                       window.openDialog(
                        'chrome://backoffice/content/email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500'
                        );
                   }else{
                       alert('delete email template failure! please notice admin');
                   }
               }
            );
        }else{
            alert("please select email template.");
            window.openDialog('chrome://backoffice/content/email-template-manage.xul','backoffice-'+(new Date()).getTime(),'centerscreen,chrome,resizable,height=250,width=500');
        }
    },
    
    
    searchOrder: function(){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
                {
                    url: currentApp.ServiceUrl,
                    status: "Please wait..."
                }
        );
        currentApp.progressDialog.focus();
        $.getJSON(currentApp.ServiceUrl, {action:"searchOrder"} , function(data, textStatus){
            currentApp.progressDialog.close();
            var templateTreechildren = document.getElementById("");
            for(var x in data){
               
            }
        })
    }
    
}