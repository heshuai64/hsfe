var clickTrack = {
    url: "http://220.246.17.184/service/clickTrack.php",
    
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
    
    search: function(start_time, end_time){
        var currentApp = this;
        currentApp.progressDialog = window.openDialog('chrome://backoffice/content/wait.xul','progress'+(new Date()).getTime(),'centerscreen,chrome,resizable',
                {
                    url: currentApp.url,
                    status: "Please wait..."
                }
        );
        currentApp.progressDialog.focus();
        $.getJSON(currentApp.url, {w: (Number(window.innerWidth)-15),url: window.content.document.documentURI, start_time: start_time, end_time: end_time} , function(data, textStatus){
            currentApp.progressDialog.close();
            window.close();
            currentApp.log(data);
            var jg_doc = new jsGraphics();
            jg_doc.setColor("#00ff00"); // green
            for(var i in data){
               jg_doc.fillEllipse(Number(data[i].x), Number(data[i].y), 5, 5);
               if(i > 300)
                  break;
            }
            jg_doc.paint(); 
        });
    }
}