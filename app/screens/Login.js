/* eslint-disable */
import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements'

import {styles} from '../styles/styles';


export default class Login extends React.Component {

  render() {
    return (
      <View>
        <Text>
          Welcome to Pixelite!
        </Text>
        <View style={{margin: 50}}>
          <View style={{margin: 7}}>
            <Icon type='font-awesome' name="facebook" backgroundColor="#3b5998"
              style={{width: 200, justifyContent: 'center'}}
              onPress={this.loginWithFacebook}>
              <Text style={{ color: 'white' }}>Continue with Facebook</Text>
            </Icon>
          </View>
          <View style={{margin: 7}}>
            <Icon type='font-awesome' name="google" backgroundColor="#d34836"
              style={{width: 200, justifyContent: 'center'}}
              onPress={this.loginWithGoogle}>
              Continue with Google
            </Icon>
          </View>
          <View style={{margin: 7}}>
            <Icon type="material-community" name="account" backgroundColor="#757474"
              style={{width: 200, justifyContent: 'center'}}>
              Create an Account
            </Icon>
          </View>
        </View>
      </View>
    );
  }
}
