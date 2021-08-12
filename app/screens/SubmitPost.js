import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { db, auth } from "../firebase";
import { connect, useStore } from "react-redux";

class SubmitPost extends Component {
  constructor() {
    super();
    this.state = {
      latitude: "",
      longitude: "",
      address: "",
      item: "",
      isVisible: false,
      dateTimePicked: "",
    };

    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.reverseGeocode = this.reverseGeocode.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.storeLocation = this.storeLocation.bind(this);
    this.handlePicker = this.handlePicker.bind(this);
    this.hidePicker = this.hidePicker.bind(this);
    this.showPicker = this.showPicker.bind(this);
    this.addPostToDB = this.addPostToDB.bind(this);
  }

  componentDidMount() {
    console.log("user in submit post page", this.props.user);
  }

  getLocation() {
    console.log("in getLocation function");
    if (navigator.geolocation) {
      console.log("coords:", navigator.geolocation);
      window.navigator.geolocation.getCurrentPosition(
        this.getCoordinates,
        this.handleLocationError
      );
    } else {
      alert("Get Location is not supported by your browser");
    }
  }

  getCoordinates(position) {
    console.log(position.coords);
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    console.log(this.state);
    this.reverseGeocode();
  }

  async reverseGeocode() {
    try {
      console.log("in reverseGeoCOde");
      let res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          this.state.latitude
        },${
          this.state.longitude
        }&key=${process.env.REACT_APP_GOOGLE_FIREBASE_KEY}`
      );
      // console.log("res", res);
      // res = JSON.parse(res);
      console.log("reverseGeocode", res.data.results[0].formatted_address);
      console.log("reverseGeocode", res.data.results[0].place_id);
      this.setState({
        address: res.data.results[0].formatted_address,
      });
      console.log("address", this.state);
    } catch (error) {
      console.log(error);
    }
  }
  handleLocationError(error) {
    console.log("error", error.code);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred.";
        break;
    }
  }

  storeLocation(data, details = null) {
    console.log("places I chose", data.description);
    this.setState({
      address: data.description,
    });
  }

  handlePicker(datetime) {
    this.setState({
      isVisible: false,
      dateTimePicked: moment(datetime).format("MMMM, Do YYYY HH:mm"),
    });
  }

  hidePicker() {
    this.setState({
      isVisible: false,
    });
  }
  showPicker() {
    this.setState({
      isVisible: true,
    });
  }

  async addPostToDB() {
    // console.log("current user info", auth().currentUser.email);
    // console.log("firebase get current user:", auth().currentUser.uid);
    try {
      if (auth().currentUser) {
        const docRef = await db.collection("posts").add({
          address: this.state.address,
          item: this.state.item,
          datetime: this.state.dateTimePicked,
          creatorUid: auth().currentUser.uid,
          creatorEmail: auth().currentUser.email,
          timeStamp: Date.now(),
        });
        console.log("post id in firebase ", docRef.id);
        alert("your post has been added, please go to all post page to review");
        this.setState({
          address: "",
          item: "",
          dateTimePicked: "",
        });
      } else {
        alert("please log in to submit post");
      }
    } catch (error) {
      alert("Please log in to submit post");
      console.error("Error adding document: ", error);
    }
  }

  render() {
    // console.log("user in store", this.props.user);
    return (
      <View style={styles.container}>
        <SafeAreaView>
          {auth().currentUser ? (
            <Text style={{ paddingTop: 20, textDecorationLine: "underline" }}>
              Logged in as {auth().currentUser.email}
              {"\n"}
            </Text>
          ) : (
            <Text>Please login to create post{"\n"}</Text>
          )}
          <Text>
            Please enter the item you would like to share and pick a store{"\n"}
          </Text>
        </SafeAreaView>
        <Button
          style={{ flex: 1 }}
          title="Show Date Picker"
          onPress={this.showPicker}
        />

        <DateTimePickerModal
          isVisible={this.state.isVisible}
          mode="datetime"
          onConfirm={this.handlePicker}
          onCancel={this.hidePicker}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginTop: 10,
          }}
          onChangeText={(item) => this.setState({ item })}
          placeholder="Item to share"
        />
        <GooglePlacesAutocomplete
          query={{
            key: process.env.REACT_APP_GOOGLE_FIREBASE_KEY,
            language: "en", // language of the results
          }}
          onPress={this.storeLocation}
          onFail={(error) => console.error(error)}
          requestUrl={{
            url:
              "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api",
            useOnPlatform: "web",
          }} // this in only required for use on the web. See https://git.io/JflFv more for details.
          styles={{
            flex: 1,
            textInputContainer: {
              backgroundColor: "rgba(0,0,0,0)",
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: "#5d5d5d",
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: "#1faadb",
            },
          }}
          placeholder="Search Store"
        />

        <Text style={{ flex: 0, fontSize: 22 }}>
          store: {this.state.address}
        </Text>
        <Text style={{ flex: 0, fontSize: 22 }}>
          item to share: {this.state.item}
        </Text>
        <Text style={{ flex: 0, fontSize: 22 }}>
          Time: {this.state.dateTimePicked}
        </Text>
        <Button
          style={{ flex: 6 }}
          title="Post"
          onPress={this.addPostToDB}
          disabled={
            this.state.address === "" ||
            this.state.item === "" ||
            this.state.dateTimePicked === ""
          }
        />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 50,
  },
});

const mapState = (state) => {
  return {
    isLoggedIn: !!state.uid,
    user: state.user,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getUser(user) {
      dispatch(me(user));
    },
  };
};

export default connect(mapState, mapDispatch)(SubmitPost);
