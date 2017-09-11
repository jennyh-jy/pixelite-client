import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

import {styles} from '../styles/styles';


export default class Login extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Pixelite!!!
        </Text>
        <View style={{margin: 50}}>
          <View style={{margin: 7}}>
            <Icon.Button name="facebook" backgroundColor="#3b5998"
              style={{width: 200, justifyContent: 'center'}}
              onPress={this.loginWithFacebook}>
              Continue with Facebook
            </Icon.Button>
          </View>
          <View style={{margin: 7}}>
            <Icon.Button name="google" backgroundColor="#d34836"
              style={{width: 200, justifyContent: 'center'}}
              onPress={this.loginWithGoogle}>
              Continue with Google
            </Icon.Button>
          </View>
          <View style={{margin: 7}}>
            <Icon2.Button name="account" backgroundColor="#757474"
              style={{width: 200, justifyContent: 'center'}}>
              Create an Account
            </Icon2.Button>
          </View>
        </View>
      </View>
    );
  }
}

// <View style={styles.container}>
//   <View style={styles.nav}>
//     <Link
//       to="/"
//       underlayColor='#f0f4f7'
//       style={styles.navItem}>
//         <Text>Home</Text>
//     </Link>
//     <Link
//       to="/about"
//       underlayColor='#f0f4f7'
//       style={styles.navItem}>
//         <Text>About</Text>
//     </Link>
//     <Link
//       to="/topics"
//       underlayColor='#f0f4f7'
//       style={styles.navItem} >
//         <Text>Topics</Text>
//     </Link>
//   </View>
