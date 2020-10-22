//imr import react
//slc functional component
//cccs class component
//rnss styleSheet

import React, { Component } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { db, auth } from "../firebase";
import { Card, ListItem, Icon } from "react-native-elements";

class AllPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      privateMsg: "",
    };
    this.showPosts = this.showPosts.bind(this);
    this.messageToPostCreator = this.messageToPostCreator.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  async showPosts() {
    this.setState({ privateMsg: "" });
    let allPostArr = [];
    const posts = await db.collection("posts").get();
    // console.log("posts from db", posts);
    posts.forEach((doc) => {
      // console.log("id?", doc.id);
      allPostArr.push({ post: doc.data(), id: doc.id });
    });
    this.setState({ posts: allPostArr });
    console.log("state", this.state);
  }

  async messageToPostCreator(postCreatorUid, postCreatorEmail) {
    const currentUser = await auth().currentUser;
    const postCreatorId = postCreatorUid;
    const docRef = await db.collection("chats").add({
      sender: currentUser.uid,
      senderEmail: currentUser.email,
      message: this.state.privateMsg,
      receiverId: postCreatorId,
      receiverEmail: postCreatorEmail,
      timeStamp: Date.now(),
      sendDate: new Date().toDateString(),
      sendTime: new Date().toLocaleTimeString(),
    });
    alert(
      "Your message has been send to post creator, please go to chat to review."
    );
    console.log(docRef.data());
    console.log("Chat id in firebase ", docRef.id);
    this.setState({ privateMsg: "" });
  }

  async deletePost(id) {
    try {
      await db.collection("posts").doc(`${id}`).delete();
    } catch (error) {
      console.log(err);
    }
  }

  render() {
    const posts = this.state.posts;
    posts.sort((a, b) => a - b);
    const currentUser = auth().currentUser;
    if (currentUser) {
      return (
        <SafeAreaView style={styles.container}>
          <Text style={{ paddingTop: 100, fontSize: 22 }}>
            This is all posts page{"\n"}
          </Text>
          {auth().currentUser && (
            <Text style={{ textDecorationLine: "underline" }}>
              Logged in as {auth().currentUser.email}
              {"\n"}
            </Text>
          )}
          <Button title="show posts" onPress={this.showPosts} />

          <Card title="All posts">
            <ScrollView style={styles.scrollView}>
              {posts.length > 0 &&
                posts.map((post, idx) => {
                  return (
                    <View key={idx}>
                      <Text>store: {post.post.address}</Text>
                      <Text>share item: {post.post.item}</Text>
                      <Text>
                        Date & Time: {post.post.datetime}
                        {"\n"}
                      </Text>

                      {currentUser ? (
                        <>
                          <TextInput
                            placeholder="Message the post creator"
                            onChangeText={(item) =>
                              this.setState({ privateMsg: item })
                            }
                          />
                          <Button
                            title="Message post creator"
                            onPress={() =>
                              this.messageToPostCreator(
                                post.post.creatorUid,
                                post.post.creatorEmail
                              )
                            }
                            disabled={this.state.privateMsg === ""}
                          />
                        </>
                      ) : (
                        <Text style={{ color: "red" }}>
                          Please logged in to send message to post creator
                        </Text>
                      )}

                      <Button
                        title="Complete"
                        disabled={
                          auth().currentUser.uid !== post.post.creatorUid
                        }
                        onPress={() => this.deletePost(post.id)}
                      />

                      <Text>{"\n"}</Text>
                    </View>
                  );
                })}
            </ScrollView>
          </Card>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <Text>Please log in to use the app</Text>
        </SafeAreaView>
      );
    }
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
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
});

export default AllPosts;
