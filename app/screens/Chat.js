import React, { Component } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import { db, auth } from "../firebase";
import { Card, ListItem, Icon } from "react-native-elements";
import IndiviualChat from "./IndividualChat";

import { faRoad } from "@fortawesome/free-solid-svg-icons";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userChats: [],
      organizedChatHistory: [],
    };
    this.getAllChat = this.getAllChat.bind(this);
  }

  async componentDidMount() {}

  async getAllChat() {
    try {
      let currentUserChat = [];
      const currentUser = auth().currentUser;
      //   console.log("currentUser", currentUser);
      if (currentUser) {
        const msgSendByUser = await db
          .collection("chats")
          .where("sender", "==", currentUser.uid)
          .get();
        if (msgSendByUser) {
          await msgSendByUser.forEach((item) => {
            currentUserChat.push(item.data());
            // console.log("each msg", item.data());
          });
        }

        const msgReceivedByUser = await db
          .collection("chats")
          .where("receiverId", "==", currentUser.uid)
          .get();

        if (msgReceivedByUser) {
          await msgReceivedByUser.forEach((item) => {
            currentUserChat.push(item.data());
            // console.log("each msg received by user", item.data());
          });
        }

        this.setState({ userChats: currentUserChat });
        // console.log("userChats state", this.state.userChats);

        let uniquePair = [];
        let uniquePairChatHistory = [];
        let uniquePairData = [];
        this.state.userChats.forEach((item) => {
          if (
            !uniquePair.includes(item.senderEmail) &&
            item.sender !== currentUser.uid
          ) {
            uniquePair.push(item.senderEmail);
            uniquePairData.push({ email: item.senderEmail, id: item.sender });
          }
          if (
            !uniquePair.includes(item.receiverEmail) &&
            item.receiverId !== currentUser.uid
          ) {
            uniquePair.push(item.receiverEmail);
            uniquePairData.push({
              email: item.receiverEmail,
              id: item.receiverId,
            });
          }
        });
        // console.log("unique pair", uniquePair);
        uniquePairData.forEach((item) => {
          uniquePairChatHistory.push({ partner: item, chatHistory: [] });
        });
        // console.log(uniquePairChatHistory);

        for (let i = 0; i < uniquePairChatHistory.length; i++) {
          let otherParty = uniquePairChatHistory[i].partner.email;
          for (let j = 0; j < this.state.userChats.length; j++) {
            let partnerName = this.state.userChats[j];
            if (
              otherParty === partnerName.senderEmail ||
              otherParty === partnerName.receiverEmail
            ) {
              uniquePairChatHistory[i].chatHistory.push(partnerName);
            }
          }
        }

        this.setState({ organizedChatHistory: uniquePairChatHistory });

        console.log("state", this.state.organizedChatHistory);
      } else {
        alert("please login to chat");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  render() {
    // console.log("props", this.props);
    const chatsWithPartner = this.state.organizedChatHistory;
    chatsWithPartner.sort((a, b) => a.timeStamp - b.timeStamp);

    return (
      <SafeAreaView style={styles.container}>
        {auth().currentUser && (
          <Text
            style={{
              paddingTop: 20,
              textAlign: "center",
              textDecorationLine: "underline",
              fontSize: 22,
            }}
          >
            Logged in as {auth().currentUser.email}
          </Text>
        )}

        <TouchableOpacity style={{ backgroundColor: "#b9fffc" }}>
          <Button title="get all chats" onPress={this.getAllChat} />
        </TouchableOpacity>
        <Text>{"\n"}</Text>
        {chatsWithPartner.length > 0 &&
          chatsWithPartner.map((chats, idx) => {
            return (
              <View key={idx}>
                <Button
                  title={`DM ${chats.partner.email}`}
                  onPress={() =>
                    this.props.navigation.navigate("Individual Chat", chats)
                  }
                />
                {chats.chatHistory.length > 0 && (
                  <Text>Chat number: {chats.chatHistory.length}</Text>
                )}

                <Text>{"\n"}</Text>
              </View>
            );
          })}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#9ab3f5",
    padding: 50,
  },
});

export default Chat;
