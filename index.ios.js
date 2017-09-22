import React from 'react';
import { AppRegistry, View } from 'react-native';

import { CreateRootNavigator } from "./app/router";


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false
    });
  }

  render() {
    if (this.state.isLoading) {
      return (<View></View>);
    }
    return <CreateRootNavigator />; // login 기능 구현한 다음에 수정
  }
}

AppRegistry.registerComponent('PixeliteCli', () => App);



// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   Image
// } from 'react-native';
// import { TabNavigator } from 'react-navigation';
// import { Icon } from 'react-native-elements'
//
// import HomeScreen from './src/screen/home';
//
// const PixeliteCli = TabNavigator({
//   Tab1: {
//     screen: HomeScreen,
//     navigationOptions: {
//       tabBarLabel: 'Profile',
//       tabBarIcon: ({ tintColor }) =>
//       <Icon type='simple-line-icon' name='home' color={tintColor} size={21} />
//     }
//   }
// }, {
//   tabBarPosition: 'bottom',
//   swipeEnabled: false,
//   showIcon: true,
//   tabBarOptions: {
//     activeTintColor: 'black',
//     labelStyle: {
//       fontSize: 9,
//       fontFamily: 'Avenir',
//     },
//     style: {
//       backgroundColor: 'white'
//     }
//   }
// });
// AppRegistry.registerComponent('PixeliteCli', () => PixeliteCli);
// export default PixeliteCli;

// <Image
//  source={require('./src/screen/45982132-mosaic-world-map.jpg')}
//  style={[{width: 30, height: 30}, {tintColor}]} />
//
// <SimpleLineIcons name="home" size={21} color={tintColor} />


// import { AppRegistry } from 'react-native';

// import App from "./app/index";
// export default PixeliteCli;

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';
//
// export default class PixeliteCli extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.ios.js
//         </Text>
//         <Text style={styles.instructions}>
//           Press Cmd+R to reload,{'\n'}
//           Cmd+D or shake for dev menu
//         </Text>
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

// AppRegistry.registerComponent('PixeliteCli', () => App);
