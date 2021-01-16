import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import BtConsumer from '../BtContext';

const windowSize = Dimensions.get('window');

function CreateList(consum) { // list paired devices
  return consum["BtList"].map((item) => {
    return (
      <View key={item["id"]} style={styles.listView}>
        <TouchableOpacity onPress={() => consum.connect(item["id"])}>
          <Text style={styles.listText}>{item["name"]}</Text>
        </TouchableOpacity>
      </View>
    );
  });
}

export default function BtConnection({ navigation }) {

  return (
    <BtConsumer>
      {
        consum => { // handle bluetooth processes via bluetooth context
          if (consum["GoToController"]) { // if it connects to a device, navigate to controller
            consum.setGoTo().then(() => {
              navigation.navigate("Controller");
            });
          }

          return (
            <View style={styles.mainScreenView}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.headerView} />
                <View style={styles.headerView}>
                  <Text style={styles.headerText}>{"Select A Device\nTo Connect"}</Text>
                </View>

                <View style={[styles.headerView, { alignItems: "flex-end" }]}>
                  <TouchableOpacity style={styles.buton} onPress={() => consum.disconnect()}>
                    <Text style={styles.butontext}>Disconnect</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {consum["LoadScreenVisibility"] && // render connecting logo, if connecting
                <>
                  <TouchableOpacity disabled={true} style={styles.backgroundBlur} />
                  <View style={styles.connectingScreen}>
                    <Text style={styles.connectingScreenText}>Connecting...</Text>
                  </View>
                </>
              }
              <ScrollView style={styles.scrollView}>
                {CreateList(consum)}
              </ScrollView>
            </View>
          );
        }
      }
    </BtConsumer>
  );
};

const styles = StyleSheet.create({
  mainScreenView: {
    backgroundColor: "#bbbbbb",
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerView: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    fontSize: 25,
    paddingTop: 10,
  },
  buton: {
    borderColor: "#2c455a",
    borderWidth: 1,
    backgroundColor: "#a6c0d7",
    borderRadius: 5,
    width: ((windowSize.width * 15) / 100),
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    marginRight: 15,
  },
  butontext: {
    textAlign: "center",
    color: "#2c455a",
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  scrollView: {
    width: "100%",
  },
  listView: {
    borderBottomWidth: 1,
    borderRadius: 5,
    //width: ((windowSize.width * 75) / 100),
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 5,
    paddingLeft: 10,
  },
  listText: {
    color: "black",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backgroundBlur: {
    backgroundColor: "#0009",
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
  },
  connectingScreen: {
    borderRadius: 360,
    backgroundColor: "black",
    position: "absolute",
    zIndex: 2,
    marginLeft: ((windowSize.width * 40) / 100),
    width: ((windowSize.width * 20) / 100),
    height: ((windowSize.width * 20) / 100),
    justifyContent: "center",
    alignItems: "center",
  },
  connectingScreenText: {
    color: "white",
    fontSize: 20,
  },
});
