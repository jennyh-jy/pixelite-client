/* eslint-disable */
import React from "react";
import { Platform, StatusBar } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";
import { Icon } from 'react-native-elements'

import Home from "./screens/Home";
import NewStory from "./screens/NewStory";
import Profile from "./screens/Profile";
import Login from "./screens/Login";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const Tabs = TabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'HOME',
      tabBarIcon: ({ tintColor }) => <Icon type='simple-line-icon' name='home' color={tintColor} size={21} />
    },
  },
  NewStory: {
    screen: NewStory,
    navigationOptions: {
      tabBarLabel: 'NEW STORY',
      tabBarIcon: ({ tintColor }) => <Icon type='simple-line-icon' name='plus' color={tintColor} size={21} />
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'PROFILE',
      tabBarIcon: ({ tintColor }) => <Icon type='simple-line-icon' name='user' color={tintColor} size={21} />
    },
  },
}, {
  tabBarOptions: {
    activeTintColor: 'black',
    labelStyle: {
      fontSize: 9,
      fontFamily: 'Avenir',
    },
    style: {
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: 'white',
    }
  }
});

// export const SearchPlacesStack = StackNavigator({
//   SearchPlaces: {
//     screen: SearchPlaces,
//   },
// });

export const CreateRootNavigator = StackNavigator({
  LoggedIn: {
    screen: Tabs,
  },
  // SearchPlaces: {
  //   screen: SearchPlacesStack,
  //   navigationOptions: {
  //     title: 'Search Places',
  //   }
  // }
}, {
  headerMode: 'none',
  mode: 'modal',
});


// export const SignedOut = StackNavigator({
//   SignUp: {
//     screen: SignUp,
//     navigationOptions: {
//       title: "Sign Up",
//       headerStyle
//     }
//   },
//   SignIn: {
//     screen: SignIn,
//     navigationOptions: {
//       title: "Sign In",
//       headerStyle
//     }
//   }
// });

// export const SignedIn = TabNavigator(
//   {
//     Home: {
//       screen: Home,
//       navigationOptions: {
//         tabBarLabel: "Home",
//         tabBarIcon: ({ tintColor }) =>
//           <FontAwesome name="home" size={30} color={tintColor} />
//       }
//     },
//     Profile: {
//       screen: Profile,
//       navigationOptions: {
//         tabBarLabel: "Profile",
//         tabBarIcon: ({ tintColor }) =>
//           <FontAwesome name="user" size={30} color={tintColor} />
//       }
//     }
//   },
//   {
//     tabBarOptions: {
//       style: {
//         paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
//       }
//     }
//   }
// );
