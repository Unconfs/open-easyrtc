

var maxCALLERS = 3;
var numVideoOBJS = maxCALLERS+1;

easyrtc.dontAddCloseButtons(true);

var connectCount = 0;


function callEverybodyElse(roomName, otherPeople) {

    easyrtc.setRoomOccupantListener(null); // so we're only called once.

    var list = [];
    var connectCount = 0;
    for(var easyrtcid in otherPeople ) {
        list.push(easyrtcid);
    }
    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
    function establishConnection(position) {
        function callSuccess() {
            connectCount++;
            if( connectCount < maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        function callFailure(errorCode, errorText) {
            easyrtc.showError(errorCode, errorText);
            if( connectCount < maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        easyrtc.call(list[position], callSuccess, callFailure);
        // easyrtc.joinRoom("test");
        // console.log(easyrtc.getRoomField());

    }
    if( list.length > 0) {
        establishConnection(list.length-1);
    }
}


function loginSuccess() {
}

function appInit() {

// useThisSocketConnection(alreadyAllocatedSocketIo)
easyrtc.setVideoDims(120,120,10); //width, height, frameRate
    easyrtc.setRoomOccupantListener(callEverybodyElse);
    easyrtc.easyApp("easyrtc.multiparty", "box0", ["box1", "box2", "box3"], loginSuccess);
    // easyrtc.setPeerListener(messageListener); // datachannel messaging
    // easyrtc.setDisconnectListener( function() {
    //     easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    // });
    easyrtc.setOnCall( function(easyrtcid, slot) {
        console.log("myeasyrtcid", easyrtc.myEasyrtcid);
        console.log("connected to", easyrtcid, slot);
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
    });


    easyrtc.setOnHangup(function(easyrtcid, slot) {
      console.log(easyrtcid, slot);
    });
}
