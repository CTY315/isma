//imr import react
//slc functional component
//cccs class component
//rnss styleSheet

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../firebase";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      error: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      await auth().createUserWithEmailAndPassword(
        this.state.email,
        this.state.password
      );

      const docRef = await db.collection("users").add({
        email: this.state.email,
        password: this.state.password,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      this.setState({ error: err.message });
      console.log("error", err);
      alert(err);
    }
  }

  render() {
    return (
      <View style={styles.background}>
        <SafeAreaView>
          <FontAwesomeIcon icon={faEnvelope} />
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            style={styles.inputStyle}
            placeholder="Email"
            style={{
              width: 300,
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
            }}
          />
          <FontAwesomeIcon icon={faLock} />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            style={styles.inputStyle}
            placeholder="password"
            style={{
              width: 300,
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
            }}
          />

          <Button title="Sign Up" color="#841584" onPress={this.handleSubmit} />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1, //take up the whole screen
    justifyContent: "center", //at the bottom incase (first direction (vertical))
    alignItems: "center", //in the middle incase (secondary direction (horizontal))
    backgroundColor: "#9ab3f5",
  },
});

export default SignUp;
