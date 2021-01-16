import React, { createContext, useState, useEffect } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import BluetoothSerial from "react-native-bluetooth-serial-next";

const BtContext = createContext();
const BtConsumer = BtContext.Consumer;

export function BtProvider(props) {

    const [BtList, setBtList] = useState([]); // paired devices list
    const [Device, setDevice] = useState(); // connected device
    const [LoadScreenVisibility, setLoadScreenVisibility] = useState(false);
    const [GoToController, setGoToController] = useState(false);

    useEffect(() => { 
        async function init() { // enable bluetooth and get paired devices
            const eneable = await BluetoothSerial.requestEnable();
            const list = await BluetoothSerial.list();
            setBtList(list);
        }
        init();

        return () => { // remove on componentDidUnmount
            async function remove() {
                await BluetoothSerial.stopScanning();
                await BluetoothSerial.disconnectAll().then(() => {
                    setDevice(null);
                    setGoToController(false);
                });
            }
            remove();
        }
    }, []);

    async function connectToDevice(id) {
        if (await BluetoothSerial.isConnected(id)) {
            console.log("Already Connected!");
            ToastAndroid.show("Already Connected!", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
        else if (Device) { // if user trying to connect another device
            await BluetoothSerial.disconnect(Device["id"]).then(async () => { // disconnect already connected device
                setLoadScreenVisibility(true); // show loading logo
                setDevice(null);
                console.log("Connecting...");
                try {
                    const device = await BluetoothSerial.connect(id);
                    if (await BluetoothSerial.isConnected()) {
                        console.log("Successfully Connected To " + device.name.toString());
                        ToastAndroid.show("Successfully Connected To " + device.name.toString(), ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        setDevice(device);
                        setGoToController(true);
                    }
                }
                catch (error) {
                    console.log("Error! Connection Failed.");
                    Alert.alert("Error!", "Connection Failed.");
                }
                finally {
                    setLoadScreenVisibility(false);
                }
            });
        }
        else {
            setLoadScreenVisibility(true); // show loading logo
            console.log("Connecting...");
            try {
                const device = await BluetoothSerial.connect(id);
                if (await BluetoothSerial.isConnected()) {
                    console.log("Successfully Connected To " + device.name.toString());
                    ToastAndroid.show("Successfully Connected To " + device.name.toString(), ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    setDevice(device);
                    setGoToController(true);
                }
            }
            catch (error) {
                setDevice(null);
                console.log("Error! Connection Failed.");
                Alert.alert("Error!", "Connection Failed.");
            }
            finally {
                setLoadScreenVisibility(false); // remove loading logo
            }
        }
    }

    async function disconnectAllDevices() {
        if(await BluetoothSerial.isConnected()){
            await BluetoothSerial.disconnectAll().then(() => {
                console.log("Disconnected from " + Device.name.toString());
                ToastAndroid.show("Disconnected from " + Device.name.toString(), ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                setDevice(null);
            });
        }
        else {
            setDevice(null);
            console.log("Not Connected!");
            ToastAndroid.show("Not Connected!", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
    }

    async function writeData(data) {
        if (Device) {
            if (await BluetoothSerial.isConnected(Device["id"])) {
                console.log("Data Sent: " + data.toString());
                await BluetoothSerial.write(data);
            }
            else {
                console.log("Error! Connection Lost.");
                Alert.alert("Error!", "Connection Lost.")
                setDevice(null);
            }
        }
        else {
            console.log("Not Connected!");
            ToastAndroid.show("Not Connected!", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
    }

    async function goToMain() {
        await BluetoothSerial.isConnected().then(() => { setGoToController(false) });
    }

    return (
        <BtContext.Provider value={{
            BtList,
            Device,
            LoadScreenVisibility,
            GoToController,
            setGoTo: goToMain,
            connect: connectToDevice,
            sendData: writeData,
            disconnect: disconnectAllDevices,
        }}>
            {props.children}
        </BtContext.Provider>
    );
}

export default BtConsumer;