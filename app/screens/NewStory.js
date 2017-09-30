/* global alert, fetch */
/* eslint-disable */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Image, ImageBackground, TouchableOpacity, NativeModules, CameraRoll, Modal, StatusBar, Dimensions, Alert } from 'react-native';
import { Icon, Button, FormLabel, FormInput, Divider } from 'react-native-elements';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { GOOGLE_GEOCODING_API_KEY, GOOGLE_PLACES_API_KEY } from '../../apis';
import PhotoGrid from '../components/PhotoGrid';
import StoryMapModal from '../components/StoryMapModal';
import FloatingLabelInput from '../components/FloatingLabelInput';

const ImagePicker = NativeModules.ImageCropPicker;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black'
//   },
//   background: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: windowWidth,
//     height: 350
//   },
//   stickySection: {
//     height: 70,
//     width: 300,
//     justifyContent: 'flex-end'
//   },
//   stickySectionText: {
//     color: 'white',
//     fontSize: 20,
//     margin: 10
//   },
//   fixedSection: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10
//   },
//   fixedSectionText: {
//     color: '#999',
//     fontSize: 20
//   },
//   parallaxHeader: {
//     alignItems: 'center',
//     flex: 1,
//     flexDirection: 'column',
//     paddingTop: 100
//   },
//   sectionSpeakerText: {
//     color: 'white',
//     fontSize: 24,
//     paddingVertical: 5,
//     fontFamily: 'Avenir'
//   },
//   sectionTitleText: {
//     color: 'white',
//     fontSize: 18,
//     paddingVertical: 5,
//     fontFamily: 'Avenir'
//   },
//   row: {
//     overflow: 'hidden',
//     paddingHorizontal: 10,
//     height: 60,
//     backgroundColor: 'white',
//     borderColor: '#ccc',
//     borderBottomWidth: 1,
//     justifyContent: 'center'
//   },
//   rowText: {
//     fontSize: 20
//   }
// });

const windowWidth = Dimensions.get('window').width;

export default class NewStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTextEditable: false,
      arePhotosSelected: false,
      isStoryMapClicked: false,
      titleValue: '',
      textValue: '',
      selectedPhotos: {},
      selectedCity: null,
      selectedCountry: null,
      selectedCoordinates: null,
      locations: [],
      travelPeriod: null,
      coverPhotoUrl: 'http://travel.home.sndimg.com/content/dam/images/travel/fullset/2014/12/3/top-10-caribbean-beaches-eagle-beach-aruba.jpg.rend.hgtvcom.966.725.suffix/1491584555480.jpeg',
    };
  }

  formattedDate(timestamp) {
    const day = timestamp.getDate().toString();
    const month = timestamp.toString().split(' ')[1];
    const year = timestamp.getFullYear().toString();
    return `${day} ${month} ${year}`;
  };

  compareDates(dates) {
    return dates.sort((a, b) => new Date(a) > new Date(b));
  }

  getTravelPeriod(dates) {
    if (dates.length === 1) {
      return dates[0];
    } else {
      const early = dates[0].split(' ').map((element, i) => { if (i === 0 || i === 2) return Number(element); return element; });
      const late = dates[dates.length - 1].split(' ').map((element, i) => { if (i === 0 || i === 2) return Number(element); return element; });

      if (early[2] === late[2] && early[1] === late[1]) {
        return `${early[0]} - ${late[0]} ${late[1]} ${late[2]}`;
      } else if( early[2] === late[2]) {
        return `${early[0]} ${early[1]} - ${late[0]} ${late[1]} ${late[2]}`;
      } else {
        return `${early.join(' ')} - ${late.join(' ')}`;
      }
    }
  }

  updateLocation(place, photoUrl) {
    const {placeName, coordinates} = place;
    const selectedPhotos = {...this.state.selectedPhotos};
    const newSelectedPhotos = {};
    const newLocation = {
      placeName: placeName,
      coordinates: {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      }
    }

    for (let date in selectedPhotos) {
      const updates =
        selectedPhotos[date].map(photo => {
        return photo.url === photoUrl
          ? {
            ...photo,
            location: newLocation,
          } : photo;
      })
      newSelectedPhotos[date] = updates;
    }

    const newLocations = [...this.state.locations, newLocation];

    this.setState({
      selectedPhotos: newSelectedPhotos,
      locations: newLocations,
    });
  }

  deletePhoto(photoUrl) {
    const updatedSelectedPhotos = Object.assign({}, this.state.selectedPhotos);
    const dates = Object.keys(updatedSelectedPhotos);
    const allEachPhotos = Object.values(updatedSelectedPhotos);
    if (dates.length === 1 && allEachPhotos[0].length === 1) {
      Alert.alert(
        'Cannot delete photo',
        'You should have at least one photo in your story',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed')}
        ]
      );
      return false;
    } else {
      let deleteLocation = null;
      const newLocations = [...this.state.locations];
      allEachPhotos.forEach((eachPhotos, index) => {
        const foundPhotoIndex = eachPhotos.findIndex((photo) => photo.url === photoUrl);
        if (foundPhotoIndex !== -1) {
          if(eachPhotos[foundPhotoIndex].location) deleteLocation = eachPhotos[foundPhotoIndex].location;
          eachPhotos.splice(foundPhotoIndex, 1);
          if (!eachPhotos.length) {
            delete updatedSelectedPhotos[dates[index]];
            console.log('date deleted!');
          }
        }
      });

      if (deleteLocation) {
        this.state.locations.forEach((location, i) => {
          if (location.placeName === deleteLocation.placeName) {
            newLocations.splice(i, 1);
          }
        })
      }

      this.setState({
        selectedPhotos: updatedSelectedPhotos,
        travelPeriod: this.getTravelPeriod(this.compareDates(Object.keys(updatedSelectedPhotos))),
        locations: newLocations,
      });
      return true;
    }
  }

  toggleStoryMap() {
    this.setState({ isStoryMapClicked: !this.state.isStoryMapClicked });
  }

  toggleStory() {
    this.setState({ arePhotosSelected: !this.state.arePhotosSelected });
  }

  toggleEditable() {
    this.setState({ isTextEditable: !this.state.isTextEditable });
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
        const { timestamp } = allPhotos.find(item => item.node.image.filename === photo.filename).node;
        return {
          filename: photo.filename,
          url: photo.path,
          width: photo.width,
          height: photo.height,
          date: this.formattedDate(new Date(timestamp * 1000)),
          location: null,
        };
      });

      const nextSelectedPhotos = Object.assign({}, this.state.selectedPhotos);
      redefinedPhotos.forEach((photo) => {
        if (!Object.prototype.hasOwnProperty.call(nextSelectedPhotos, photo.date)) {
          nextSelectedPhotos[photo.date] = [];
        }
        if (!nextSelectedPhotos[photo.date].find(element =>
          element.filename === photo.filename
        )) {
          nextSelectedPhotos[photo.date].push(photo);
        }
      });

      if (Object.keys(this.state.selectedPhotos).length === 0) {
        this.setState({
          selectedPhotos: nextSelectedPhotos,
          travelPeriod: this.getTravelPeriod(this.compareDates(Object.keys(nextSelectedPhotos))),
          arePhotosSelected: !this.state.arePhotosSelected,
        });
      } else {
        this.setState({
          selectedPhotos: nextSelectedPhotos,
          travelPeriod: this.getTravelPeriod(this.compareDates(Object.keys(nextSelectedPhotos))),
        });
      }
    }).then(() => this.getInitialCoverPhoto())
    .catch(err => console.log(err));
  }

  getInitialCoverPhoto() {
    const dates = Object.keys(this.state.selectedPhotos);
    const randomDateIndex = Math.floor(Math.random() * dates.length);
    const randomPhoto = this.state.selectedPhotos[dates[randomDateIndex]][Math.floor(Math.random() * this.state.selectedPhotos[dates[randomDateIndex]].length)];
    this.setState({ coverPhotoUrl: randomPhoto.url });
  }

  changeCoverPhoto(photoUrl) {
    this.setState({ coverPhotoUrl: photoUrl })
  }

  render() {
    const { isStoryMapClicked, arePhotosSelected, isTextEditable, selectedPhotos, coverPhotoUrl, selectedCity, selectedCountry, travelPeriod } = this.state;
    console.log(this.state.selectedPhotos);

    return (
      <View style={{ flex: 1, paddingTop: 25, backgroundColor: 'white' }}>
        <View style={{ position: 'relative', width: windowWidth, height: 40 }}>
          <View style={{ position: 'absolute', left: 8, justifyContent: 'center', alignItems: 'flex-start', width: 38, height: 38 }}>
            <Icon
              type="material-community"
              name="close"
              color="grey"
              size={23}
            />
          </View>
          <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', width: windowWidth, height: 40 }}>
            <Text style={{ fontFamily: 'Avenir', fontSize: 20, color: '#2d2d2d' }}>
              Create Story
            </Text>
          </View>
        </View>
        <View style={{ position: 'relative', width: windowWidth }}>
          <FormLabel
            fontFamily='Avenir'
            labelStyle={{ fontSize: 15, color: '#373535', fontWeight: 'normal' }}
          >
            Story Title
          </FormLabel>
          <FormInput
            containerStyle={{ borderBottomWidth: 0.83, borderBottomColor: '#b5b5b5', width: windowWidth - 40, height: 33 }}
            inputStyle={{ fontFamily: 'Avenir', fontSize: 15, color: 'black', paddingLeft: 5, paddingRight: 5, paddingTop: 4.5, paddingBottom: 4.5 }}
            placeholder='e.g. Summer escapades in Australia'
            placeholderTextColor='#A8A8A8'
            value={this.state.titleValue}
            onChangeText={(titleValue) => this.setState({titleValue})}
            maxLength={35}
            selectionColor={'#4286f4'}
          />
          <Text style={{
            fontFamily: 'Avenir', fontSize: 15, color: '#373535', marginTop: 15,
            marginLeft: 20, marginRight: 20
          }}>
            Where did you travel to?
          </Text>

          <GooglePlacesAutocomplete
            placeholder='Search cities'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed='auto'    // true/false/undefined
            fetchDetails={true}
            renderDescription={(row) => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log(data);
              console.log(details);
              this.setState({
                selectedCity: data.description.split(', ')[0],
                selectedCountry: data.description.split(', ')[data.description.split(', ').length - 1],
                selectedCoordinates: {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                }
              });
            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: GOOGLE_PLACES_API_KEY,
              language: 'en', // language of the results
              types: '(cities)', // default: 'geocode'
            }}
            styles={{
              container: {
                flex: 0,
                marginTop: 10,
                marginLeft: 20,
                marginRight: 20,
                zIndex: 2,
                backgroundColor: 'white'
              },
              description: {
                fontWeight: 'bold',
                fontFamily: 'Avenir',
              },
              textInputContainer: {
                height: 28.8,
                borderTopWidth: 0,
                borderBottomWidth: 0.8,
              },
              textInput: {
                fontFamily: 'Avenir',
                borderRadius: 0,
                paddingLeft: 5,
                paddingRight: 5,
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
              },
            }}
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
          <View style={{ position: 'absolute', top: 200, alignSelf: 'center' }}>
            <Button
              icon={{ name: 'ios-images-outline', size: 45, color: '#5b5959', type: 'ionicon', style: { marginRight: 0 } }}
              buttonStyle={{ alignItems: 'center', width: 300, height: 75, flexDirection: 'column', padding: 0, margin: 0, zIndex: -1 }}
              color='#5b5959'
              backgroundColor="white"
              fontFamily="Avenir"
              fontSize={15}
              title="Add photos, and you'll see magic!"
              onPress={() => this.pickMultiple()}
            />
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={false}
          onRequestClose={() => { }}
          visible={arePhotosSelected}
        >
          <ParallaxScrollView
            headerBackgroundColor="#333"
            stickyHeaderHeight={63}
            parallaxHeaderHeight={350}
            backgroundSpeed={3}
            renderBackground={() => (
              <View key="background">
                <ImageBackground
                  source={{ uri: coverPhotoUrl }}
                  style={{ width: windowWidth, height: 350, zIndex: -1}}
                >
                  <View style={{position: 'absolute',
                                top: 0,
                                width: windowWidth,
                                backgroundColor: 'rgba(0,0,0,.4)',
                                height: 350,
                                zIndex: 1}}/>

                  <View key="parallax-header" style={{
                    alignItems: 'center',
                    flex: 1,
                    flexDirection: 'column',
                    paddingTop: 110,
                    zIndex: 10
                  }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 'bold',
                    paddingBottom: 7,
                    fontFamily: 'Avenir',
                    backgroundColor: 'transparent',
                  }}>
                    {selectedCity === selectedCountry
                      ? selectedCity.toUpperCase()
                      : selectedCity.toUpperCase().concat(', ').concat(selectedCountry.toUpperCase())}
                  </Text>
                  <View style={{ justifyContent: 'center', paddingVertical: 7 }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 23,
                      fontWeight: 'bold',
                      paddingVertical: 5,
                      fontFamily: 'Avenir',
                      backgroundColor: 'transparent',
                      textAlign: 'center',
                      width: 300, flexWrap: 'wrap'
                    }}>
                      {this.state.titleValue.toUpperCase()}
                    </Text>
                  </View>
                    <Text style={{
                      color: 'white',
                      fontSize: 12,
                      paddingTop: 5,
                      fontFamily: 'Avenir',
                      backgroundColor: 'transparent',
                    }}>
                      {travelPeriod}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            )}

            renderForeground={() => (
              <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', top: 295, width: '100%' }}>
                <View style={{ alignItems: 'center', marginHorizontal: 7,
                  backgroundColor: 'transparent' }}>
                  <Icon
                    type="simple-line-icon"
                    name="map"
                    size={18}
                    color="white"
                    iconStyle={{ textAlign: 'center', paddingTop: 11, paddingBottom: 8, paddingHorizontal: 11, borderRadius: 20.5, borderWidth: 1, borderColor: '#b3adad' }}
                    onPress={() => this.toggleStoryMap()}
                  />
                </View>
                <View style={{ alignItems: 'center', marginHorizontal: 7,
                  backgroundColor: 'transparent' }}>
                  <Icon
                    type="simple-line-icon"
                    name="picture"
                    size={18}
                    color="white"
                    iconStyle={{ textAlign: 'center', paddingTop: 11, paddingBottom: 8, paddingHorizontal: 11, borderRadius: 20.5, borderWidth: 1, borderColor: '#b3adad' }}
                    onPress={() => this.pickMultiple()}
                  />
                </View>
                <View style={{ alignItems: 'center', marginHorizontal: 7,
                  backgroundColor: 'transparent' }}>
                  <Icon
                    type="material-community"
                    name="format-text"
                    size={18}
                    color="white"
                    iconStyle={{ textAlign: 'center', paddingTop: 11, paddingBottom: 8, paddingHorizontal: 11, borderRadius: 20.5, borderWidth: 1, borderColor: '#b3adad' }}
                    onPress={() => this.toggleEditable()}
                  />
                </View>
              </View>
            )}

            renderStickyHeader={() => (
              <View key="sticky-header" style={{
                width: windowWidth - 70,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                paddingTop: 27
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'Avenir'
                }}>{this.state.titleValue}</Text>
              </View>
            )}

            renderFixedHeader={() => (
              <View style={{ position: 'absolute', top: 0, flexDirection: 'row' }}>
                <View style={{ flex: 1, alignItems: 'flex-start', top: 25, left: 8 }}>
                  <Icon
                    type="material-community"
                    name="arrow-left"
                    color="white"
                    size={26}
                    onPress={() => {this.toggleStory(); this.setState({ selectedPhotos: {}, textValue: '', locations: [] })}}
                  />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', top: 25, right: 12 }}>
                  <Icon
                    type="material-community"
                    name="check"
                    color="white"
                    size={28}
                    onPress={() => Alert.alert(
                      'Upload story',
                      'Are you sure you want to upload this story?',
                      [
                        { text: 'Nah', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'Yes', onPress: () => console.log('uploaded!') }
                      ]
                    )}
                  />
                </View>
              </View>
            )}>
            <View style={{ marginVertical: 20 }}>
              <Modal
                animationType="fade"
                transparent={false}
                onRequestClose={() => { }}
                visible={isStoryMapClicked}
              >
                <StoryMapModal
                  toggleStoryMap={this.toggleStoryMap.bind(this)}
                  locations={this.state.locations}
                  regionCoordinates={this.state.selectedCoordinates}
                />
              </Modal>
              <StatusBar
                barStyle='light-content'
              />
              {!isTextEditable
                ? <View style={{ alignItems: 'center', alignSelf: 'center', width: windowWidth - 50 }}>
                    <Text style={{ color: '#707070', fontFamily: 'AvenirNext-Italic', fontSize: 14, textAlign: 'center' }}>
                      {this.state.textValue}
                    </Text>
                    {this.state.textValue === ''
                      ? null
                      : <Divider style={{ width: 20, height: 4, backgroundColor: '#f7d074', marginTop: 15, marginBottom: 25 }} />
                    }
                  </View>
                : <View style={{ justifyContent: 'flex-start', alignSelf: 'center', width: windowWidth - 30, height: 120, marginTop: 5, marginLeft: 20 }}>
                    <TextInput
                      style={{ width: windowWidth - 50, height: 100, borderColor: '#b5b5b5', borderWidth: 1, fontSize: 14,
                              fontFamily: 'AvenirNext-Italic', padding: 10 }}
                      placeholder='Add text...'
                      onChangeText={(textValue) => this.setState({textValue})}
                      value={this.state.textValue}
                      editable={isTextEditable}
                      multiline={true}
                      maxLength={300}
                    />
                    <View style={{ justifyContent: 'center', position: 'absolute', backgroundColor: 'white', top: 85, right: 10, width: 30, height: 30 }}>
                      <Icon
                        type="material-community"
                        name="check"
                        color="#53bc78"
                        size={23}
                        onPress={() => this.toggleEditable()}
                      />
                    </View>
                  </View>
                }
              {
                this.compareDates(Object.keys(selectedPhotos)).map(date => (
                  <View key={`entireView-${date}`} style={{ marginBottom: 18 }}>
                    <View key={`dateTextView-${date}`} style={{ flexDirection: 'column' }}>
                      <Text style={{ color: '#282626', fontWeight: 'bold', fontFamily: 'Avenir', fontSize: 14, marginLeft: 20, marginBottom: 8 }}>{date}</Text>
                      <Divider style={{ width: 15, height: 3, backgroundColor: '#282626', marginLeft: 20, marginBottom: 20 }} />
                    </View>
                    <PhotoGrid
                      compareDates={this.compareDates.bind(this)}
                      updateLocation={this.updateLocation.bind(this)}
                      deletePhoto={this.deletePhoto.bind(this)}
                      changeCoverPhoto={this.changeCoverPhoto.bind(this)}
                      allPhotos={selectedPhotos}
                      photosList={selectedPhotos[date]}
                    />
                  </View>
                ))
              }
            </View>
          </ParallaxScrollView>
        </Modal>
      </View>
    );
  }
}
