//imr
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  Button,
} from "react-native";
import { auth } from "../firebase";

//slc
const WelcomeScreen = () => {
  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri:
          "https://www.junglescout.com/wp-content/uploads/2020/04/costco-aisle.png",
      }}
    >
      <View style={styles.logoContainer}>
        <Text style={{ fontSize: 60, fontWeight: "900", textAlign: "center" }}>
          Share Anything
        </Text>
        {auth().currentUser && (
          <Text style={{ paddingTop: 20, textDecorationLine: "underline" }}>
            Logged in as {auth().currentUser.email}
            {"\n"}
          </Text>
        )}
      </View>
    </ImageBackground>
  );
};

//rnss
const styles = StyleSheet.create({
  background: {
    flex: 1, //take up the whole screen
    justifyContent: "flex-end", //at the bottom incase (first direction (vertical))
    alignItems: "center", //in the middle incase (secondary direction (horizontal))
  },
  loginButton: {
    //red button?
    width: "100%",
    height: 300,
    backgroundColor: "#fc5c65",
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    position: "absolute",
    top: 350,
    alignItems: "center",
  },
  registerButton: {
    //green button?
    width: "100%",
    height: 70,
    backgroundColor: "#4ecdc4",
  },
});

export default WelcomeScreen;
