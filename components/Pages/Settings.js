import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowSize = Dimensions.get('window');
var UserPrefs;

async function writeUserPrefs (type, item, command) { // write updated user prefs to local storage
  try {

    switch (type) { // type of changed pref
      case "direction":
        UserPrefs["directionButtons"][item] = command;
        break;
      case "press":
        UserPrefs["extraButtons"][item]["pressCommand"] = command;
        break;
      case "isPressAndHold":
        UserPrefs["extraButtons"][item]["pressAndHold"] = command;
        break;
      case "release":
        UserPrefs["extraButtons"][item]["releaseCommand"] = command;
        break;
    }

    var pref = JSON.stringify(UserPrefs);
    await AsyncStorage.setItem('@usr_prefs', pref).then(() => {
      console.log("Local Settings Write.");
    });
  } catch (e) {
    console.error(e);
  }
}

function directionKeyMaper() { // render all direction buttons
  return Object.keys(UserPrefs["directionButtons"]).map((item) => {
    return (
      <View style={styles.directionSettingsRow} key={item}>
        <View style={[styles.settingsCol, { flex: 4 }]}>
          <Text>{item.toString()}</Text>
        </View>

        <View style={[styles.settingsCol, { padding: 5, flex: 6 }]}>
          <TextInput
            style={styles.txtInput}
            placeholder={UserPrefs["directionButtons"][item]}
            onChangeText={txt => writeUserPrefs("direction", item, txt)}
          />
        </View>
      </View>
    );
  })
}

function extraButtonKeyMaper() { // render all extra buttons
  return Object.keys(UserPrefs["extraButtons"]).map((item) => {

    const [IsPressAndHold, setIsPressAndHold] = useState(false);

    useEffect(() => {
      setIsPressAndHold(UserPrefs["extraButtons"][item]["pressAndHold"]);
    }, []);

    return (
      <View style={{ borderBottomWidth: 2 }} key={item}>
        <View style={[styles.settingsCol, { flex: 4 }]}>
          <Text>{item.toString()}</Text>
        </View>

        <View style={styles.extraButtonSettingsRow}>
          <View style={[styles.settingsCol, { flex: 4 }]}>
            <Text>Press Command</Text>
          </View>
          <View style={[styles.settingsCol, { padding: 5, flex: 6 }]}>
            <TextInput
              style={styles.txtInput}
              placeholder={UserPrefs["extraButtons"][item]["pressCommand"]}
              onChangeText={txt => writeUserPrefs("press", item, txt)}
            />
          </View>
        </View>

        <View style={styles.extraButtonSettingsRow}>
          <View style={[styles.settingsCol, { flex: 4 }]}>
            <Text>Is Press And Hold?</Text>
          </View>
          <View style={[styles.settingsCol, { padding: 5, flex: 6 }]}>
            <Switch
              value={IsPressAndHold}
              onValueChange={val => {
                writeUserPrefs("isPressAndHold", item, val);
                setIsPressAndHold(!IsPressAndHold);
              }}
            />
          </View>
        </View>

        {
          IsPressAndHold && // show release command input, if its a press and hold button
          <View style={styles.extraButtonSettingsRow}>
            <View style={[styles.settingsCol, { flex: 4 }]}>
              <Text>Release Command</Text>
            </View>
            <View style={[styles.settingsCol, { padding: 5, flex: 6 }]}>
              <TextInput
                style={styles.txtInput}
                placeholder={UserPrefs["extraButtons"][item]["releaseCommand"]}
                onChangeText={txt => writeUserPrefs("release", item, txt)}
              />
            </View>
          </View>
        }

      </View>
    );
  })
}

export default function Settings({ route, navigation }) {

  UserPrefs = route.params["prefs"]; // get user prefs from route

  return (
    <View style={styles.mainScreenView}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.headerView}/>
        <View style={styles.headerView}>

          <Text style={styles.headerText}>Settings</Text>

        </View>

        <View style={[styles.headerView, {alignItems: "flex-end"}]}>

          <TouchableOpacity style={styles.buton} onPress={() => navigation.navigate("Controller")}>
            <Text style={styles.butontext}>Ok</Text>
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.menu}>

        <View style={{ flex: 8 }}>
          <View style={styles.menuTitle}>

            <Text style={styles.menuTitleText}>Direction Buttons</Text>

          </View>

          <ScrollView>
            {directionKeyMaper()}
          </ScrollView>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ flex: 8 }}>
          <View style={styles.menuTitle}>

            <Text style={styles.menuTitleText}>Extra Buttons</Text>

          </View>
          <ScrollView>
            {extraButtonKeyMaper()}
          </ScrollView>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainScreenView: {
    backgroundColor: "#bbbbbb",
    flex: 1,
    alignItems: "center",
  },
  headerView: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },
  menu: {
    flexDirection: "row",
    flex: 1,
  },
  menuTitle: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
  },
  menuTitleText: {
    color: "black",
    fontSize: 20,
  },
  directionSettingsRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
  },
  extraButtonSettingsRow: {
    flexDirection: "row",
  },
  settingsCol: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  txtInput: {
    borderRadius: 20,
    backgroundColor: "#aaaaaa",
    width: "25%",
    textAlign: "center",
  },
  buton: {
    borderColor: "#2c455a",
    borderWidth: 1,
    backgroundColor: "#a6c0d7",
    borderRadius: 5,
    width: ((windowSize.width * 10) / 100),
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    marginRight: 15,
  },
  butontext: {
    textAlign: "center",
    color: "#2c455a",
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
  },
});