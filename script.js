var BPM = 0.0 ;
var heart = document.getElementById("heartSprite") ;
let p = document.getElementById("dataText") ;
if (navigator.bluetooth === undefined) {
    p.textContent = "Web bluetooth is not supported" ;
}
else {
    let button = document.getElementById("connectButton") ;
    button.style.cursor = "pointer" ;
    handleCharacteristicValueChanged = (event) => {
        let value = event.target.value ; // a dataviewer object is provided by the object event
        let heartrate = value.getUint8(1) ; // we select the eight bytes that contain the heartrate informations
        p.textContent = heartrate + " bar" ; // and display it
        BPM = heartrate ;
    }
    onClickEvent = () => {
        navigator.bluetooth.requestDevice({ filters: [{ name: 'XC1004 BLE Server' }] }) // we filter the devices, displaying only those with heartrate services
        .then(device => device.gatt.connect()) // after the user select a device, we return the selected one
        .then(server => server.getPrimaryService('d7b7acd1-6785-4119-b156-c54b498bd873')) // we get the service
        .then(service => service.getCharacteristic('3ef1c3a0-9f97-49B2-b3E4-78cfad8a3763')) // then the characteristics
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => {          
            characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged) ; // then we subscribe to the characteristic notifications
        })                                                                                                    // and set the callback function
        .catch(error => { console.error(error); }) ; // we display the errors on the console
    }
    button.addEventListener('click', onClickEvent ) ;
   
         
}
