import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import MapView from 'react-native-maps';


const Images = [
  { uri: "https://i.imgur.com/sNam9iJ.jpg" },
  { uri: "https://i.imgur.com/N7rlQYt.jpg" },
  { uri: "https://i.imgur.com/UDrH0wm.jpg" },
  { uri: "https://i.imgur.com/Ka8kNST.jpg" }
]

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class screens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [
        {
          coordinate: {
            latitude: 37.50094666666666,
            longitude: 127.0288778333333,
          },
          title: "Best Place",
          description: "This is the best place in Portland",
          image: Images[0],
        },
        {
          coordinate: {
            latitude: 45.524698,
            longitude: -122.6655507,
          },
          title: "Second Best Place",
          description: "This is the second best place in Portland",
          image: Images[1],
        },
        {
          coordinate: {
            latitude: 45.5230786,
            longitude: -122.6701034,
          },
          title: "Third Best Place",
          description: "This is the third best place in Portland",
          image: Images[2],
        },
        {
          coordinate: {
            latitude: 45.521016,
            longitude: -122.6561917,
          },
          title: "Fourth Best Place",
          description: "This is the fourth best place in Portland",
          image: Images[3],
        },
      ],
      region: {
        // latitude: 45.52220671242907,
        // longitude: -122.6653281029795,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068,
      },
    };
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          // initialRegion={this.state.region}
          style={styles.container}
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={styles.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});


// import React from "react";
// import { ScrollView, Text, Linking, View, TouchableOpacity } from "react-native";
// import { Button } from "react-native-elements";
// import {
//   Image,
//   ListView,
//   Tile,
//   Title,
//   Subtitle,
//   Overlay,
//   Screen,
//   Divider,
//   Card,
//   Caption,
//   GridRow
// } from '@shoutem/ui';
//
//
// // const stories = [
// //   {
// //     key: 1,
// //     name: "Spain trip in summer '16",
// //     image: require("../images/1.jpg"),
// //     url: "https://unsplash.com/photos/C9t94JC4_L8"
// //   },
// //   {
// //     key: 2,
// //     name: "Jeju with besties",
// //     image: require("../images/2.jpg"),
// //     url: "https://unsplash.com/photos/waZEHLRP98s"
// //   },
// //   {
// //     key: 3,
// //     name: "All of the foods in Japan",
// //     image: require("../images/3.jpg"),
// //     url: "https://unsplash.com/photos/cFplR9ZGnAk"
// //   },
// //   {
// //     key: 4,
// //     name: "Backpacking in Australia",
// //     image: require("../images/4.jpg"),
// //     url: "https://unsplash.com/photos/89PFnHKg8HE"
// //   }
// // ];
//
// export default class Home extends React.Component {
//   constructor(props) {
//     super(props);
//     this.renderRow = this.renderRow.bind(this);
//     this.state = {
//       restaurants: [{
//         "name": "Gaspar Brasserie",
//         "address": "185 Sutter St, San Francisco, CA 94109",
//         "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-1.jpg" },
//       }, {
//         "name": "Chalk Point Kitchen",
//         "address": "527 Broome St, New York, NY 10013",
//         "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-2.jpg" },
//       }],
//     }
//   }
//
//   renderRow(restaurant) {
//     return (
//       <View>
//         <Image
//           styleName="large-banner"
//           source={{ uri: restaurant.image.url }}
//         >
//           <Tile>
//             <Title styleName="md-gutter-bottom">{restaurant.name}</Title>
//             <Subtitle styleName="sm-gutter-horizontal">{restaurant.address}</Subtitle>
//           </Tile>
//         </Image>
//         <Divider styleName="line" />
//       </View>
//     );
//   }
//
//   render() {
//     return (
//       <Screen>
//         <ListView
//           data={this.state.restaurants}
//           renderRow={this.renderRow}
//         />
//       </Screen>
//     );
//   }
// }
