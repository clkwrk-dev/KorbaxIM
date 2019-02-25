var kbxClient = {

}

var kbxServer = {
    websocket_url: "ws://127.0.0.1:5443/ws",
    connection: null,
    log: function(msg) {
        console.log(msg);
    },
    jid: null,
    sid: null,
    rid: null
}

window.onload = function(){
    // Initialize server connection
    if(kbxServer.websocket_url != null)
    {
        kbxServer.connection = new Strophe.Connection(kbxServer.websocket_url);
    }
}

// Begin connection
$("#btnLogin").click(function() {
    // TODO - Wrong username/password alert.
    if($("#inputJID").val() === "" || $("#inputJID").val() === "")
    {
        console.log("Empty username/password.");
    }
    else
    {
        kbxServer.connection = new Strophe.Connection(kbxServer.websocket_url);
        rebindOrConnect(kbxServer.websocket_url, $("#inputJID").val(), $("#inputPassword").val(), null, onConnect)
        //console.log(kbxServer.connection);
        //e.preventDefault();
    }
    
});

function rebindOrConnect(url, jid, pass, sid, callback, onlyRebind) {
    kbxServer.connection.rebind._rebind(jid, pass, sid, callback, onlyRebind);
}

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
        kbxServer.log('Connecting..');
    } else if (status == Strophe.Status.CONNFAIL) {
        kbxServer.log('Failed to connect.');
    } else if (status == Strophe.Status.DISCONNECTING) {
        kbxServer.log('Disconnecting..');
    } else if (status == Strophe.Status.DISCONNECTED) {
        kbxServer.log('Disconnected.');
    } else if (status == Strophe.Status.CONNECTED) {
        kbxServer.log('Connected.');
        $.jStorage.set("sData", kbxServer.connection.jid, kbxServer.connection.rebind.sid);
        
    }
}

function redirectToHome() {
    window.location.replace("http://127.0.0.1:8000/kbx_app/");
    var sData = $.jStorage.get("sData");
    console.log("Sdata", sData);
    if (sData && sData[1]) {
        //createConnection();
        try {
            rebindOrConnect(kbxServer.websocket_url, sData[0], "", sData[1], onConnect, true);
        }
        catch(ex) {
            console.log(ex);
        }
        $.jStorage.deleteKey("sData");
    }
}
