import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';

import arrow from "../Images/arrow.png";
import bt_logo from "../Images/bt_logo.png";

import { TouchableOpacity } from "react-native-gesture-handler";
import BluetoothSerial from "react-native-bluetooth-serial-next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BtConsumer from '../BtContext';

const windowSize = Dimensions.get('window');

export default function Controller({ navigation }) {

  const [UserPrefs, setUserPrefs] = useState(); 
  const [Consum, setConsum] = useState(); // bluetooth context's consumer
  const [PressTime, SetPressTime] = useState(); // for press and hold's time out
  const [Direction, setDirection] = useState({
    f: false, // forward
    b: false, // backward
    r: false, // right
    l: false, // left
  });

  useEffect(() => {

    StatusBar.setHidden(true); // makes app fullscreen

    const readUserPrefs = async () => { // for get user prefs from local storage
      try {
        const prefs = await AsyncStorage.getItem('@usr_prefs');
        if (prefs) {
          console.log("Local Settings Read.");
          setUserPrefs(JSON.parse(prefs));
        }
        else { // if local user prefs doesn't exist, create new
          setUserPrefs(require("../Preferences.json"));
          writeUserPrefs(require("../Preferences.json"));
        }
      } catch (e) {
        console.error(e);
      }
    }

    const writeUserPrefs = async (prefs) => { // for write new created user prefs to local storage
      try {
        prefs = JSON.stringify(prefs);
        await AsyncStorage.setItem('@usr_prefs', prefs).then(() => console.log("Local Settings Write."));
      } catch (e) {
        console.error(e);
      }
    }
    readUserPrefs();

  }, []);

  useEffect(() => { // handle steering commands
    if (UserPrefs) {
      var cmd = "";

      if (Direction.f && Direction.b) {
        cmd = UserPrefs["directionButtons"]["Stop"];
      }
      else if (Direction.r && Direction.l) {
        cmd = UserPrefs["directionButtons"]["Stop"];
      }
      else if (Direction.f) {
        if (Direction.r) {
          cmd = UserPrefs["directionButtons"]["Forward Right"];
        }
        else if (Direction.l) {
          cmd = UserPrefs["directionButtons"]["Forward Left"];
        }
        else {
          cmd = UserPrefs["directionButtons"]["Forward"];
        }
      }
      else if (Direction.b) {
        if (Direction.r) {
          cmd = UserPrefs["directionButtons"]["Backward Right"];
        }
        else if (Direction.l) {
          cmd = UserPrefs["directionButtons"]["Backward Left"];
        }
        else {
          cmd = UserPrefs["directionButtons"]["Backward"];
        }
      }
      else if (Direction.r) {
        cmd = UserPrefs["directionButtons"]["Right"];
      }
      else if (Direction.l) {
        cmd = UserPrefs["directionButtons"]["Left"];
      }
      else {
        cmd = UserPrefs["directionButtons"]["Stop"];
      }

      Consum.sendData(cmd);
    }

  }, [Direction]);

  function extraButtons (buttonId) {

    const _onPressextraButtons = (buttonId) => { // handle extra button commands.

      Consum.sendData(UserPrefs["extraButtons"]["Button " + buttonId.toString()]["pressCommand"]);
      if ((UserPrefs["extraButtons"]["Button " + buttonId.toString()]["pressAndHold"])) { // if the button is set to press and hold...
        clearTimeout(PressTime);
        SetPressTime(setTimeout(() => _onPressextraButtons(buttonId), 100)); // keep sending command while press holding (1 send in 100ms)
      }
    }

    return (
      <TouchableOpacity
        style={styles.extraButon}
        onPressIn={() => _onPressextraButtons(buttonId)}
        onPressOut={() => {
          if (UserPrefs["extraButtons"]["Button " + buttonId.toString()]["pressAndHold"]) {  // if the button is set to press and hold...
            clearTimeout(PressTime);
            Consum.sendData(UserPrefs["extraButtons"]["Button " + buttonId.toString()]["releaseCommand"]); // send release command when button released
          }
        }}
      >
        <Text style={styles.butontext}>{buttonId.toString()}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <BtConsumer>
      {
        consum => { // handle bluetooth processes via bluetooth context
          const setConsumer = async () => {
            await BluetoothSerial.isConnected().then(() => setConsum(consum));
          }
          setConsumer();

          var connectionBg = { backgroundColor: null }
          // if bluetooth connected, set bluetooth logo color green, else set it red
          consum["Device"] ? connectionBg.backgroundColor = "green" : connectionBg.backgroundColor = "red";

          if (UserPrefs) return ( // if user prefs are read successfully, render the controller
            <View style={styles.mainScreenView}>
              <View style={styles.buttonBar}>

                <TouchableOpacity style={[styles.buton, connectionBg]} onPress={() => navigation.navigate("BtConnection")}>
                  <Image source={bt_logo} style={styles.btlogo} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.buton} onPress={() => navigation.navigate("Settings", { prefs: UserPrefs })}>
                  <Text style={styles.butontext}>Settings</Text>
                </TouchableOpacity>

                {extraButtons(1)}
                {extraButtons(2)}
                {extraButtons(3)}
                {extraButtons(4)}
                {extraButtons(5)}

              </View>

              <View style={styles.joystickView}>
                <View style={{ flexDirection: "column", marginRight: ((windowSize.width * 5) / 100) }}>
                  
                  <TouchableOpacity style={styles.joystick}
                    onPressIn={() => setDirection({
                      ...Direction,
                      f: true,
                    })}
                    onPressOut={() => setDirection({
                      ...Direction,
                      f: false,
                    })}
                  >
                    <Image
                      source={arrow}
                      style={[styles.arrowStyle, { transform: [{ rotate: "-90deg" }] }]}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.joystick}
                    onPressIn={() => setDirection({
                      ...Direction,
                      b: true,
                    })}
                    onPressOut={() => setDirection({
                      ...Direction,
                      b: false,
                    })}
                  >
                    <Image
                      source={arrow}
                      style={[styles.arrowStyle, { transform: [{ rotate: "90deg" }] }]}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", marginLeft: ((windowSize.width * 5) / 100) }}>

                  <TouchableOpacity style={styles.joystick}
                    onPressIn={() => setDirection({
                      ...Direction,
                      l: true,
                    })}
                    onPressOut={() => setDirection({
                      ...Direction,
                      l: false,
                    })}
                  >
                    <Image
                      source={arrow}
                      style={[styles.arrowStyle, { transform: [{ rotate: "180deg" }] }]}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.joystick}
                    onPressIn={() => setDirection({
                      ...Direction,
                      r: true,
                    })}
                    onPressOut={() => setDirection({
                      ...Direction,
                      r: false,
                    })}
                  >
                    <Image
                      source={arrow}
                      style={styles.arrowStyle}
                    />
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          );
          else return (
            <View style={styles.mainScreenView}>
              <Text>Loading...</Text>
            </View>
          );
        }
      }
    </BtConsumer>
  );
};

const styles = StyleSheet.create({
  mainScreenView: {
    backgroundColor: "#ccc",
    flex: 1,
    alignItems: "center",
  },
  joystickView: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  joystick: {
    width: ((windowSize.width * 15) / 100),
    height: ((windowSize.width * 15) / 100),
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  buttonBar: {
    flexDirection: "row",
  },
  buton: {
    borderColor: "#2c455a",
    borderWidth: 1,
    backgroundColor: "#a6c0d7",
    borderRadius: 5,
    height: ((windowSize.width * 8) / 100),
    width: ((windowSize.width * 15) / 100),
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  extraButon: {
    borderColor: "#2c455a",
    borderWidth: 1,
    backgroundColor: "#a6c0d7",
    borderWidth: 1,
    borderRadius: 50,
    width: ((windowSize.width * 8) / 100),
    height: ((windowSize.width * 8) / 100),
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 0,
  },
  butontext: {
    textAlign: "center",
    color: "#2c455a",
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
  },
  arrowStyle: {
    flex: 1,
    resizeMode: 'contain'
  },
  btlogo: {
    flex: 1,
    resizeMode: 'contain'
  }
});
