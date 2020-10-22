//imr import react
//slc functional component
//cccs class component
//rnss styleSheet
import React, { Component } from "react";
import { render } from "react-dom";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  SafeAreaView,
} from "react-native";
import { auth, db } from "../firebase";

//change IndiviualChat to class component
//add this.state to store new message (on change, this.setState)
//add new chat to db
//see if the page would refresh with new chat

class IndividualChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newChat: "",
      allChat: [],
    };

    this.addMessage = this.addMessage.bind(this);
  }

  async addMessage(receiverEmail, receiverId) {
    try {
      const addedMsg = await db.collection("chats").add({
        message: this.state.newChat,
        receiverEmail: receiverEmail,
        receiverId: receiverId,
        sendDate: new Date().toDateString(),
        sendTime: new Date().toLocaleTimeString(),
        sender: auth().currentUser.uid,
        senderEmail: auth().currentUser.email,
        timeStamp: Date.now(),
      });
      console.log("add to db", addedMsg);
      console.log("this.state", this.state.newChat);
      this.setState({ newChat: "" });
      return addedMsg;
    } catch (err) {
      console.log(err);
    }
  }

  // getAllChat(arr){
  //   let sortedALlCHat = [];
  //   for(let item of )
  // }

  render() {
    //props.route.params = chatHistory
    // console.log(auth().currentUser.uid);
    const currentUser = auth().currentUser;
    //   console.log("props", props.route.params);
    const chats = this.props.route.params.chatHistory;
    chats.sort((a, b) => a.timeStamp - b.timeStamp);
    console.log(chats);
    return (
      <View style={styles.background}>
        {auth().currentUser && (
          <Text
            style={{
              paddingTop: 20,
              textAlign: "center",
              textDecorationLine: "underline",
            }}
          >
            Logged in as {auth().currentUser.email}
            {"\n"}
          </Text>
        )}
        {chats.length > 0 &&
          chats.map((chat, idx) => {
            return (
              <View key={idx}>
                <Text
                  style={
                    currentUser.uid === chat.sender
                      ? styles.senderStyle
                      : styles.receiverStyle
                  }
                >
                  {chat.message} by {chat.senderEmail}
                  {"\n"}
                </Text>
              </View>
            );
          })}
        <Text>{"\n"}</Text>
        <TextInput
          placeholder="your message"
          style={styles.newMessage}
          onChangeText={(item) => this.setState({ newChat: item })}
        />
        <Button
          disabled={this.state.newChat === ""}
          title="send"
          onPress={() =>
            this.addMessage(
              this.props.route.params.partner.email,
              this.props.route.params.partner.id
            )
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1, //take up the whole screen
    // justifyContent: "center", //at the bottom incase (first direction (vertical))
    // alignItems: "center", //in the middle incase (secondary direction (horizontal))
    backgroundColor: "#9ab3f5",
  },
  senderStyle: {
    color: "green",
    textAlign: "right",
  },
  receiverStyle: {
    color: "#150485",
    textAlign: "left",
  },
  newMessage: {
    width: 200,
    height: 80,
  },
});

export default IndividualChat;
