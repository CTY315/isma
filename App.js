import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import Login from "./app/screens/Login";
import SignUp from "./app/screens/SignUp";
import SubmitPost from "./app/screens/SubmitPost";
import AllPosts from "./app/screens/AllPosts";
import { Provider } from "react-redux";
import store from "./app/ReduxStore/index";
import Chat from "./app/screens/Chat";
import IndividualChat from "./app/screens/IndividualChat";
import { Button, View } from "react-native";
import { auth } from "./app/firebase";

const Stack = createStackNavigator();
const StackNavigator = () => (
  <Stack.Navigator initialRouteName="Chats">
    <Stack.Screen name="Chats" component={Chat} />
    <Stack.Screen name="Individual Chat" component={IndividualChat} />
  </Stack.Navigator>
);

export default function App() {
  const Drawer = createDrawerNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={WelcomeScreen} />
          <Drawer.Screen name="Login" component={Login} />
          <Drawer.Screen name="Sign Up" component={SignUp} />
          <Drawer.Screen name="All posts" component={AllPosts} />
          <Drawer.Screen name="Create new post" component={SubmitPost} />
          <Drawer.Screen name="Chat" component={StackNavigator} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
