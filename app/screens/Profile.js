import React from "react";
import { StyleSheet, View, ScrollView, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { SimpleLineIcons, MaterialIcons } from "react-native-vector-icons";
import MapView from 'react-native-maps';
import { ImagePicker } from 'expo';
// import * as _ from 'lodash';
// import { PhotoGrid } from 'react-native-photo-grid-frame';

// import {styles} from '../styles/styles';
// import { onSignOut } from "../auth";

const IMAGE_URLS = [
  {uri: "https://s3.us-east-2.amazonaws.com/coderaising-cs/38824_1.jpg"},
  // {uri: "https://forums.imore.com/attachments/photography-videography/66363d1411762006t-show-us-some-photos-taken-iphone-6-imageuploadedbyimore-forums1411762005.474797.jpg"},
  // {uri: "https://forums.imore.com/attachments/iphone-6/66677d1411955559t-post-pictures-video-taken-your-iphone-6-imageuploadedbyimore-forums1411955558.906521.jpg"},
  {uri: "http://lorempixel.com/400/400/nature"},
  // {uri: "http://lorempixel.com/400/400/business"},
  {uri: "http://lorempixel.com/400/400/food"},
  {uri: "http://lorempixel.com/400/400/nightlife"},
  {uri: "http://lorempixel.com/400/400/people"},
  // {uri: "http://lorempixel.com/400/400/technics"},
  // {uri: "http://lorempixel.com/400/400/transport"},
  // {uri: "http://lorempixel.com/400/400/sports"},
  {uri: "http://lorempixel.com/400/400/fashion"},
  {uri: "http://lorempixel.com/400/400/city"},
];

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 126.9780;
const LATITUDE_DELTA = 120;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const windowWidth = Dimensions.get('window').width - 36;
var IMAGES_PER_ROW = 4;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
      image: null
    };
  }

  calculatedSize(length) {
    return {width: windowWidth / length, height: windowWidth / 5}
  }

  renderRandomChunk(imagesArr) {
    const array = imagesArr.slice(0);
    const length = array.length;
    const result = [];
    let sum = 0;

    while (sum < length) {
      const willAdd = Math.floor(Math.random() * 3) + 2;
      const tuple = [];
      for (let i = 0; i < willAdd; i++) {
        if (array[i]) { tuple.push(array[i]) }
      }
      if (tuple.length > 0) { result.push(tuple) }
      array.splice(0, willAdd);
      sum += willAdd;
    }
   return result;
  }

  renderRow(images) {
    return images.map((uri, i) =>{
      return(
        <Image key={i} style={[{margin: 0}, this.calculatedSize(images.length)]} source={uri} />
      );
    })
  }

  renderImagesInGroups() {
    return this.renderRandomChunk(IMAGE_URLS).map((imagesForRow, i) => {
      return (
        <View style={{margin: 0, flexDirection: "row"}} key={i}>
          {this.renderRow(imagesForRow)}
        </View>
      )
    })
  }

  onMapPress(e) {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
          color: randomColor(),
        },
      ],
    });
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  render() {
    let { image } = this.state;
    return (
      <View style={{ flex: 1, paddingTop: 25, backgroundColor: "white" }}>
        <View style={{ margin: 8, alignSelf: "flex-end", flexDirection: "row" }}>
          <SimpleLineIcons name="map" size={23} color="grey" style={{ marginRight: 14 }}/>
          <SimpleLineIcons name="settings" size={23} color="grey" style={{ marginRight: 7 }}/>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: 20
          }}
        >
          <Image
            style={{
              margin: 10,
              height: 120,
              width: 120,
              borderRadius: 60
            }}
            source={{uri:'https://s3.us-east-2.amazonaws.com/coderaising-cs/KakaoTalk_Photo_2017-03-27-14-38-15.jpeg'}}
            resizeMode="cover"
          />
          <Text style={{ color: '#565656', fontFamily: 'Avenir', fontSize: 17, fontWeight: 'bold' }}>Jenny Hong</Text>
        </View>

        <ScrollView style={{ marginLeft: 18, marginRight: 18}}>

        <MaterialIcons name="add-a-photo" size={40} color="grey" style={{ marginTop: 8 }} onPress={this._pickImage}/>
        {image &&
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

          <View style={styles.container}>
            <MapView
              provider={this.props.provider}
              style={styles.map}
              initialRegion={this.state.region}
              onPress={(e) => this.onMapPress(e)}
            >
              {this.state.markers.map((marker, i) => (
                <MapView.Marker
                  key={marker.key}
                  coordinate={marker.coordinate}
                  pinColor={marker.color}
                  key={i}
                />
              ))}
            </MapView>
          </View>

          <View style={{ marginBottom: 25 }}>
            <View style={{ marginBottom: 6, borderRadius: 10, overflow: 'hidden' }}>
              {this.renderImagesInGroups()}
            </View>
            <Text style={{ color: '#565656', fontFamily: 'Avenir', fontSize: 15, fontWeight: 'bold'}}>Backpacking in Australia</Text>
            <View style={{marginTop: 4, flexDirection: "row"}}>
              <SimpleLineIcons name="calendar" size={15} color="grey" style={{ marginRight: 5 }}/>
              <Text style={{ color: 'grey', fontFamily: 'Avenir', fontSize: 10, marginRight: 10}}>July 16-21</Text>
              <SimpleLineIcons name="location-pin" size={15} color="grey" style={{ marginRight: 5}}/>
              <Text style={{ color: 'grey', fontFamily: 'Avenir', fontSize: 10}}>Sydney, Australia</Text>
            </View>
          </View>

          <View style={{ marginBottom: 25 }}>
            <View style={{ marginBottom: 6, borderRadius: 10, overflow: 'hidden' }}>
              {this.renderImagesInGroups()}
            </View>
            <Text style={{ color: '#565656', fontFamily: 'Avenir', fontSize: 15, fontWeight: 'bold'}}>Jeju with besties</Text>
            <View style={{marginTop: 4, flexDirection: "row"}}>
              <SimpleLineIcons name="calendar" size={15} color="grey" style={{ marginRight: 5 }}/>
              <Text style={{ color: 'grey', fontFamily: 'Avenir', fontSize: 10, marginRight: 10}}>Aug 5-8</Text>
              <SimpleLineIcons name="location-pin" size={15} color="grey" style={{ marginRight: 5}}/>
              <Text style={{ color: 'grey', fontFamily: 'Avenir', fontSize: 10}}>Jeju, South Korea</Text>
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <View style={{ marginBottom: 6, borderRadius: 10, overflow: 'hidden' }}>
              {this.renderImagesInGroups()}
            </View>
            <Text style={{ color: '#565656', fontFamily: 'Avenir', fontSize: 15, fontWeight: 'bold'}}>All of the foods in Japan</Text>
            <View style={{marginTop: 4, flexDirection: "row"}}>
              <SimpleLineIcons name="calendar" size={15} color="grey" style={{ marginRight: 5 }}/>
              <Text style={{ color: 'grey', fontFamily: 'Avenir', fontSize: 10, marginRight: 10}}>Mar 21-28</Text>
              <SimpleLineIcons name="location-pin" size={15} color="grey" style={{ marginRight: 5}}/>
              <Text style={{ color: 'grey', fontFamily: 'Avenir', fontSize: 10}}>Tokyo, Japan</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});


// <Card title="John Doe">
//   <View
//     style={{
//       backgroundColor: "#bcbec1",
//       alignItems: "center",
//       justifyContent: "center",
//       width: 80,
//       height: 80,
//       borderRadius: 40,
//       alignSelf: "center",
//       marginBottom: 20
//     }}
//   >
//     <Text style={{ color: "white", fontSize: 28 }}>JD</Text>
//   </View>
//   <Button
//     backgroundColor="#03A9F4"
//     title="SIGN OUT"
//   />
// </Card>

// onPress={() => onSignOut()}
