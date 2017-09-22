/* global alert, fetch */
import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Image, TouchableOpacity, NativeModules, CameraRoll } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import PhotoGrid from 'react-native-thumbnail-grid';

import { GOOGLE_GEOCODING_API_KEY } from '../../apis';
import FloatingLabelInput from '../components/FloatingLabelInput';

const ImagePicker = NativeModules.ImageCropPicker;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   button: {
//     backgroundColor: 'blue',
//     marginBottom: 10
//   },
//   text: {
//     color: 'white',
//     fontSize: 20,
//     textAlign: 'center'
//   }
// });

const images = [
  'https://s3.us-east-2.amazonaws.com/coderaising-cs/38824_1.jpg',
  'https://forums.imore.com/attachments/photography-videography/66363d1411762006t-show-us-some-photos-taken-iphone-6-imageuploadedbyimore-forums1411762005.474797.jpg',
  'https://forums.imore.com/attachments/iphone-6/66677d1411955559t-post-pictures-video-taken-your-iphone-6-imageuploadedbyimore-forums1411955558.906521.jpg',
  'https://forums.imore.com/attachments/photography-videography/66363d1411762006t-show-us-some-photos-taken-iphone-6-imageuploadedbyimore-forums1411762005.474797.jpg',
  'https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029_960_720.jpg',
  // 'https://cdn.pixabay.com/photo/2016/08/12/22/34/apple-1589869_960_720.jpg',
  // 'https://cdn.pixabay.com/photo/2017/06/09/09/39/adler-2386314_960_720.jpg'
]

export default class NewStory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      selectedPhotos: {},
      countryName: null,
      cityName: null,
      place: null
    };
  }

  handleTextChange(newText) {
    this.setState({ value: newText });
  }

  pickMultiple() {
    Promise.all([
      CameraRoll.getPhotos({
        first: 1000,
      }),
      ImagePicker.openPicker({
        multiple: true,
        maxFiles: 20,
        waitAnimationEnd: false,
      }),
    ]).then((res) => {
      const allPhotos = res[0].edges;
      const selectedPhotos = res[1];
      console.log(allPhotos);

      const redefinedPhotos = selectedPhotos.map((photo) => {
        const {
          timestamp,
          location: {
            latitude,
            longitude,
          },
        } = allPhotos.find(item => item.node.image.filename === photo.filename).node;
        const formattedDate = (d) => {
          const day = d.getDate().toString();
          const month = d.toString().split(' ')[1];
          const year = d.getFullYear().toString();
          return `${day} ${month} ${year}`;
        };

        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=country|locality|premise&key=${GOOGLE_GEOCODING_API_KEY}`)
          .then(geoRes => geoRes.json())
          .then(resJson =>
            console.log(resJson))
//             this.setState({
//               countryName: resJson.results.0.address_components.
// country_name,
//               cityName: resJson.region_name,
//               place:
//             });
          .catch(err => console.error(err));

        return {
          uri: photo.path,
          width: photo.width,
          height: photo.height,
          date: formattedDate(new Date(timestamp * 1000)),
          latitude,
          longitude,
          country: this.state.countryName,
          city: this.state.cityName,
          place: this.state.place
        };
      }).sort((a, b) => new Date(a.date) - new Date(b.date) > 0);

      const nextSelectedPhotos = {};
      redefinedPhotos.forEach((photo) => {
        if (!Object.prototype.hasOwnProperty.call(nextSelectedPhotos, photo.date)) {
          nextSelectedPhotos[photo.date] = [];
        }
        nextSelectedPhotos[photo.date].push(photo);
      });

      console.log(nextSelectedPhotos);
      this.setState({
        selectedPhotos: nextSelectedPhotos,
      });
    }).catch(err => console.log(err));
  }

  render() {
    const { value, selectedPhotos } = this.state;
    return (
      <View style={{ flex: 1, paddingTop: 25, backgroundColor: 'white' }}>
        <View style={{ marginLeft: 8, marginRight: 8, alignSelf: 'flex-start', flexDirection: 'row' }}>
          <Icon
            type="material-community"
            name="close"
            color="grey"
            size={23}
            style={{ marginLeft: 0 }}
          />
        </View>
        <ScrollView style={{ marginLeft: 18, marginRight: 18 }}>
          <FloatingLabelInput
            label="Story Title"
            value={value}
            onChangeText={() => this.handleTextChange()}
          />

          <View style={{ marginTop: 4 }}>
            {
              Object.keys(selectedPhotos).map(date => (
                <View key={`view-${date}`}>
                  <View key={date} style={{ marginTop: 4, flexDirection: 'row' }}>
                    <Icon
                      type="simple-line-icon"
                      name="calendar"
                      size={17}
                      color="grey"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={{ color: 'grey', fontFamily: 'Avenir', fontSize: 12, marginRight: 10 }}>{date}</Text>
                  </View>
                  {
                    selectedPhotos[date].map((image, index) => (
                      <View key={`view-${index * 10}`} style={{ marginTop: 4 }}>
                        <Image
                          key={`${date}-${index * 10}`}
                          style={{ width: 200, height: 200, resizeMode: 'contain' }}
                          source={image}
                        />
                      </View>
                    ))
                  }
                </View>
              ))
            }
          </View>
          <Button
            icon={{ name: 'ios-images-outline', size: 45, color: 'grey', type: 'ionicon', style: { marginRight: 0 } }}
            buttonStyle={{ position: 'absolute', top: 8, right: 234, width: 90, height: 75, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0 }}
            color="grey"
            backgroundColor="white"
            fontFamily="Avenir"
            fontSize={15}
            title="Add Photos"
            onPress={() => this.pickMultiple()}
          />
          {/* <PhotoGrid source={images} width={330} /> */}

        </ScrollView>
      </View>
    );
  }
}
//
// import React, {Component} from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, Alert,
//   Image, TouchableOpacity, NativeModules, Dimensions
// } from 'react-native';
//
// var ImagePicker = NativeModules.ImageCropPicker;
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   button: {
//     backgroundColor: 'blue',
//     marginBottom: 10
//   },
//   text: {
//     color: 'white',
//     fontSize: 20,
//     textAlign: 'center'
//   }
// });
//
// export default class NewStory extends Component {
//
//   constructor() {
//     super();
//     this.state = {
//       image: null,
//       images: null
//     };
//   }
//
//   pickSingleWithCamera(cropping) {
//     ImagePicker.openCamera({
//       cropping: cropping,
//       width: 500,
//       height: 500,
//     }).then(image => {
//       console.log('received image', image);
//       this.setState({
//         image: {uri: image.path, width: image.width, height: image.height},
//         images: null
//       });
//     }).catch(e => alert(e));
//   }
//
//   pickSingleBase64(cropit) {
//     ImagePicker.openPicker({
//       width: 300,
//       height: 300,
//       cropping: cropit,
//       includeBase64: true
//     }).then(image => {
//       console.log('received base64 image');
//       this.setState({
//         image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},
//         images: null
//       });
//     }).catch(e => alert(e));
//   }
//
//   cleanupImages() {
//     ImagePicker.clean().then(() => {
//       console.log('removed tmp images from tmp directory');
//     }).catch(e => {
//       alert(e);
//     });
//   }
//
//   cleanupSingleImage() {
//     let image = this.state.image || (this.state.images && this.state.images.length ? this.state.images[0] : null);
//     console.log('will cleanup image', image);
//
//     ImagePicker.cleanSingle(image ? image.uri : null).then(() => {
//       console.log(`removed tmp image ${image.uri} from tmp directory`);
//     }).catch(e => {
//       alert(e);
//     })
//   }
//
//   cropLast() {
//     if (!this.state.image) {
//       return Alert.alert('No image', 'Before open cropping only, please select image');
//     }
//
//     ImagePicker.openCropper({
//       path: this.state.image.uri,
//       width: 200,
//       height: 200
//     }).then(image => {
//       console.log('received cropped image', image);
//       this.setState({
//         image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
//         images: null
//       });
//     }).catch(e => {
//       console.log(e);
//       Alert.alert(e.message ? e.message : e);
//     });
//   }
//
//   pickSingle(cropit, circular=false) {
//     ImagePicker.openPicker({
//       width: 300,
//       height: 300,
//       cropping: cropit,
//       cropperCircleOverlay: circular,
//       compressImageMaxWidth: 640,
//       compressImageMaxHeight: 480,
//       compressImageQuality: 0.5,
//       compressVideoPreset: 'MediumQuality',
//     }).then(image => {
//       console.log('received image', image);
//       this.setState({
//         image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
//         images: null
//       });
//     }).catch(e => {
//       console.log(e);
//       Alert.alert(e.message ? e.message : e);
//     });
//   }
//
//   pickMultiple() {
//     ImagePicker.openPicker({
//       multiple: true,
//       waitAnimationEnd: false
//     }).then(images => {
//       console.log(images)
//       this.setState({
//         image: null,
//         images: images.map(i => {
//           console.log('received image', i);
//           return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
//         })
//       });
//     }).catch(e => alert(e));
//   }
//
//   scaledHeight(oldW, oldH, newW) {
//     return (oldH / oldW) * newW;
//   }
//
//   // renderVideo(video) {
//   //   return (<View style={{height: 300, width: 300}}>
//   //     <Video source={{uri: video.uri, type: video.mime}}
//   //        style={{position: 'absolute',
//   //           top: 0,
//   //           left: 0,
//   //           bottom: 0,
//   //           right: 0
//   //         }}
//   //        rate={1}
//   //        paused={false}
//   //        volume={1}
//   //        muted={false}
//   //        resizeMode={'cover'}
//   //        onError={e => console.log(e)}
//   //        onLoad={load => console.log(load)}
//   //        repeat={true} />
//   //    </View>);
//   // }
//
//   renderImage(image) {
//     return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
//   }
//
//   renderAsset(image) {
//     // if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
//     //   return this.renderVideo(image);
//     // }
//
//     return this.renderImage(image);
//   }
//
//   render() {
//     return (<View style={styles.container}>
//       <ScrollView>
//         {this.state.image ? this.renderAsset(this.state.image) : null}
//         {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
//       </ScrollView>
//
//       <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} style={styles.button}>
//         <Text style={styles.text}>Select Single With Camera</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingleWithCamera(true)} style={styles.button}>
//         <Text style={styles.text}>Select Single With Camera With Cropping</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingle(false)} style={styles.button}>
//         <Text style={styles.text}>Select Single</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.cropLast()} style={styles.button}>
//         <Text style={styles.text}>Crop Last Selected Image</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingleBase64(false)} style={styles.button}>
//         <Text style={styles.text}>Select Single Returning Base64</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingle(true)} style={styles.button}>
//         <Text style={styles.text}>Select Single With Cropping</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => this.pickSingle(true, true)} style={styles.button}>
//         <Text style={styles.text}>Select Single With Circular Cropping</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={this.pickMultiple.bind(this)} style={styles.button}>
//         <Text style={styles.text}>Select Multiple</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={this.cleanupImages.bind(this)} style={styles.button}>
//         <Text style={styles.text}>Cleanup All Images</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={this.cleanupSingleImage.bind(this)} style={styles.button}>
//         <Text style={styles.text}>Cleanup Single Image</Text>
//       </TouchableOpacity>
//     </View>);
//   }
// }
