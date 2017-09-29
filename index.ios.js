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


// import React from "react";
// import { createRootNavigator } from "./router";
// import { isSignedIn } from "./auth";
//
// export default class App extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       signedIn: false,
//       checkedSignIn: false
//     };
//   }
//
//   componentWillMount() {
//     isSignedIn()
//       .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
//       .catch(err => alert("An error occurred"));
//   }
//
//   render() {
//     const { checkedSignIn, signedIn } = this.state;
//
//     If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
//     if (!checkedSignIn) {
//       return null;
//     }
//
//     const Layout = createRootNavigator(signedIn);
//     return <Layout />;
//   }
// }
