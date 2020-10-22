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
import { auth } from "../firebase";
import { connect } from "react-redux";
import { me, logout } from "../ReduxStore/user";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      error: "",
      uid: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await auth().signInWithEmailAndPassword(
        this.state.email,
        this.state.password
      );
      // console.log("sign in successful?", res.user);
      this.setState({ uid: res.user.uid });
      this.props.getUser(res.user);
    } catch (err) {
      this.setState({ error: err.message });
      alert(err);
    }
  }

  logout() {
    //console.log("this.props", this.props);
    //this.props.userLogout from redux store
    this.props.userLogout();
    console.log("logged out");
    this.setState({ uid: null });
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

          <Button title="Login" color="#841584" onPress={this.handleSubmit} />
          <Button title="Sign out" color="#841584" onPress={this.logout} />
          {this.state.uid ? <Text>Hello, {this.state.email}</Text> : null}
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

const mapState = (state) => {
  return {
    isLoggedIn: !!state.uid,
    user: state.uid,
  };
};

const mapDispatch = (dispatch) => {
  return {
    userLogout() {
      dispatch(logout());
    },
    getUser(user) {
      dispatch(me(user));
    },
  };
};

export default connect(mapState, mapDispatch)(Login);
