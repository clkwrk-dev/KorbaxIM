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
        kbxServer.connection = new Strophe.Connection(kbxServer.websocket_url);
        kbxServer.connection.connect(
            "steve@localhost",
            "steve",
            onConnect
        )
    }
}

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
        kbxServer.log('Connecting...');
    } else if (status == Strophe.Status.CONNFAIL || status == Strophe.Status.AUTHFAIL) {
        kbxServer.log('Failed to connect.');
    } else if (status == Strophe.Status.DISCONNECTING) {
        kbxServer.log('Disconnecting...');
    } else if (status == Strophe.Status.DISCONNECTED) {
        kbxServer.log('Disconnected.');
    } else if (status == Strophe.Status.CONNECTED || status == Strophe.Status.ATTACHED) {
        kbxServer.log('Connected.');
        kbxServer.connection.send($pres());
        kbxServer.connection.addHandler(onMessage, null, 'message', null, null, null);
        //connection.addHandler(onSubscriptionRequest, null, "presence", "subscribe");
        //connection.addHandler(onPresence, null, "presence");
        loginSuccess();

    }
}

function loginSuccess() {
    getRoster();
}

function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
  
    if (type == "chat" && elems.length > 0) {
      var body = elems[0];
      kbxServer.log('CHAT: I got a message from ' + from + ': ' + Strophe.getText(body));
    }
    // we must return true to keep the handler alive.  
    // returning false would remove it after it finishes.
    return true;
  }

  function getRoster() {
    kbxServer.log('getRoster');
    var iq = $iq({
      type: 'get'
    }).c('query', {
      xmlns: 'jabber:iq:roster'
    });
    kbxServer.connection.sendIQ(iq, rosterCallback);
  }

  function rosterCallback(iq) {
    kbxServer.log("Roster");
    $(iq).find('item').each(function() {
      var jid = $(this).attr('jid'); // The jabber_id of your contact
      // You can probably put them in a unordered list and and use their jids as ids.
      kbxServer.log('	>' + jid);
    });
  }
