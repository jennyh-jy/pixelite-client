/* eslint-disable */
import React, { Component } from 'react';
import { Alert, Button, View, Image, Dimensions, Modal, TouchableOpacity, Text, ScrollView, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements';
import Gallery from 'react-native-image-gallery';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as _ from 'lodash';

import { GOOGLE_PLACES_API_KEY } from '../../apis';

const windowWidth = Dimensions.get('window').width;

const styles = {
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    width: View.width,
    height: 120,
    resizeMode: 'cover'
  },
  flexCol: {
    flexDirection: 'column',
    flex: 1
  },
  alignCenter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth,
  },
  photoView: {
    height: 120,
    flex: 2,
    backgroundColor: 'white',
    marginHorizontal: 1,
    marginVertical: 1,
    justifyContent: 'center'
  },
  expandedView: {
    height: 249,
    backgroundColor: 'white',
    marginHorizontal: 1,
    marginVertical: 1,
    flex: 2
  },
  expandedImage: {
    height: 249,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
}


export default class PhotoGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoModalVisible: false,
      searchPlacesModalVisible: false,
      currentPhotoUrl: '',
      currentPhotoPlace: null,
      allPhotos: this.changeToSlide(this.props.allPhotos),
      tempPlace: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('되나?')
    this.setState({
      allPhotos: this.changeToSlide(nextProps.allPhotos),
    })
  }

  onPageChange(index) {
    this.setState({
      currentPhotoUrl: this.state.allPhotos[index].source.uri,
      currentPhotoPlace: this.state.allPhotos[index].source.locationName,
    })
  }

  photoPopupToggle(currentPhotoUrl, currentPhotoLocation) {
    this.setState({
      photoModalVisible: !this.state.photoModalVisible,
      currentPhotoUrl,
      currentPhotoPlace: currentPhotoLocation && currentPhotoLocation.placeName,
    });
  }

  searchPlacesPopupToggle() {
    this.setState({ searchPlacesModalVisible: !this.state.searchPlacesModalVisible });
  }

  renderPhotoRow(rowItem, rowIndex) {
    if (rowIndex === 0) {
      return this.renderPhotoRow1(rowItem);
    }
    else if (rowIndex === 1) {
      return this.renderPhotoRow2(rowItem);
    }
    else if (rowIndex === 2) {
      return this.renderPhotoRow3(rowItem);
    }
  }

  renderPhotoRow1(row) {
    return (
      <View key={1} style={styles.alignCenter}>
        {
          row.map(
            (item, index) => {
              return (
                <View key={index} style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
                  <TouchableOpacity onPress={() => { this.photoPopupToggle(item.url, item.location) }}>
                    <Image source={{ uri: item.url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
                  </TouchableOpacity>
                </View>
              )
            }
          )
        }
      </View>
    )
  }

  renderPhotoRow2(row) {
    if (row.length === 1) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={[styles.expandedView, { borderRadius: this.props.borderRadius }]}>
            <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
              <Image source={{ uri: row[0].url }} style={[styles.imageStyle, styles.expandedImage, { borderRadius: this.props.borderRadius }]} />
            </TouchableOpacity>
          </View>
        </View>
      )
    } else if (row.length === 2) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={[styles.expandedView, { borderRadius: this.props.borderRadius }]}>
            <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
              <Image source={{ uri: row[0].url }} style={[styles.imageStyle, styles.expandedImage, { borderRadius: this.props.borderRadius }]} />
            </TouchableOpacity>
          </View>
          <View key={row[1].url} style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[1].url, row[1].location) }}>
                <Image source={{ uri: row[1].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else if (row.length === 3) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={[styles.expandedView, { borderRadius: this.props.borderRadius }]}>
            <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
              <Image source={{ uri: row[0].url }} style={[styles.imageStyle, styles.expandedImage, { borderRadius: this.props.borderRadius }]} />
            </TouchableOpacity>
          </View>
          <View key={row[1].url} style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[1].url, row[1].location) }}>
                <Image source={{ uri: row[1].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[2].url, row[2].location) }}>
                <Image source={{ uri: row[2].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
  }

  renderPhotoRow3(row) {
    if (row.length === 1) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
                <Image source={{ uri: row[0].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else if (row.length === 2) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View key={row[0].url} style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
                <Image source={{ uri: row[0].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
            <View key={row[1].url} style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[1].url, row[1].location) }}>
                <Image source={{ uri: row[1].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else if (row.length === 3) {
      return (
        <View key={row[0].url} style={styles.alignCenter}>
          <View style={styles.flexCol}>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[0].url, row[0].location) }}>
                <Image source={{ uri: row[0].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
            <View style={[styles.photoView, { borderRadius: this.props.borderRadius }]}>
              <TouchableOpacity onPress={() => { this.photoPopupToggle(row[1].url, row[1].location) }}>
                <Image source={{ uri: row[1].url }} style={[styles.imageStyle, { borderRadius: this.props.borderRadius }]} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.expandedView, { borderRadius: this.props.borderRadius }]}>
            <TouchableOpacity onPress={() => { this.photoPopupToggle(row[2].url, row[2].location) }}>
              <Image source={{ uri: row[2].url }} style={[styles.imageStyle, styles.expandedImage, { borderRadius: this.props.borderRadius }]} />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  renderChunk() {
    if (this.props.photosList.length === 1) {
      let width = windowWidth - 2;
      let height = (this.props.photosList[0].height) * (windowWidth - 2) / this.props.photosList[0].width;

      return (
        <View style={{ paddingBottom: 18, marginHorizontal: 1, marginVertical: 1,
          justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => { this.photoPopupToggle(this.props.photosList[0].url, this.props.photosList[0].location) }}>
            <Image
              source={{ uri: this.props.photosList[0].url }}
              style={{
                width,
                height,
                resizeMode: 'cover' }}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      let chunk = _.chunk(this.props.photosList, 9);
      return (
        <View style={[styles.container]}>
        {
          chunk.map((chunkItem, index) => {
            let row = _.chunk(chunkItem, 3);
            return row.map((rowItem, rowIndex) => {
              return this.renderPhotoRow(rowItem, rowIndex);
            })
          })
        }
        </View>
      );
    }
  }

  renderGrid() {
    return (
      <View>
        {this.renderChunk()}
      </View>
    )
  }

  changeToSlide(object) {
    const result = [];
    this.props.compareDates(Object.keys(object)).forEach(date => {
      object[date].forEach(({ url, location }) => {
        result.push({
          source: {
            uri: url,
            locationName: location && location.placeName,
          }
        })
      })
    })
    return result;
  }

  getIndexFromSlide(array) {
    let index;
    array.find((element,i) => {
      if (element.source.uri === this.state.currentPhotoUrl) {
        index = i;
        return true;
      }
    })
    return index;
  }

  render() {
    return (
      <View>
        {this.renderGrid()}
        <View>
          <Modal
            animationType="fade"
            transparent={false}
            onRequestClose={() => { }}
            visible={this.state.photoModalVisible}
          >
            <View style={{ position: 'relative', flex: 1, flexDirection: 'column', backgroundColor: '#2d2d2d' }}>
              <StatusBar
                hidden={true}
              />
              <View style={{ position: 'absolute', alignItems: 'flex-start', top: 9, left: 8, zIndex: 10, width: 38, height: 38 }}>
                <Icon
                  type="material-community"
                  name="close"
                  color="white"
                  size={26}
                  onPress={() => this.photoPopupToggle()}
                />
              </View>
              <View style={{ position: 'absolute', alignItems: 'flex-end', top: 9, right: 8, zIndex: 10, width: 38, height: 38 }}>
                <Icon
                  type="simple-line-icon"
                  name="trash"
                  color="white"
                  size={24}
                  onPress={() => Alert.alert(
                    'Delete photo',
                    'Are you sure you want to delete this photo?',
                    [{
                      text: 'Nah',
                      onPress: () => console.log('Cancel Pressed'), style: 'cancel'
                    }, {
                      text: 'Yes',
                      onPress: () => {
                        const result = this.props.deletePhoto(this.state.currentPhotoUrl);
                        if (this.props.photosList.length && result) {
                          this.photoPopupToggle();
                        }
                      },
                    }]
                  )}
                />
              </View>
                <Gallery
                  style={{ backgroundColor: '#2d2d2d' }}
                  images={this.state.allPhotos}
                  initialPage={this.getIndexFromSlide(this.state.allPhotos)}
                  onPageSelected={(index) => this.onPageChange(index)}
                />
                {!this.state.currentPhotoPlace
                  ?
                  <View
                    style={{
                      position: 'absolute', justifyContent: 'center', alignItems: 'center',
                      bottom: 0, zIndex: 10, width: '100%', height: 40, backgroundColor: '#1d1d1d'
                    }}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: 'row' }}
                      onPress={() => this.searchPlacesPopupToggle()}
                    >
                      <Icon
                        type="simple-line-icon"
                        name="location-pin"
                        color='#8e8c8c'
                        size={20}
                      />
                      <Text style={{ fontFamily: 'Avenir', color: '#8e8c8c', marginLeft: 5 }}>
                        Add Location
                      </Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View
                    style={{
                      position: 'absolute', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                      bottom: 0, zIndex: 10, width: '100%', height: 40, backgroundColor: '#1d1d1d'
                    }}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: 'row' }}
                      onPress={() => this.searchPlacesPopupToggle()}
                    >
                      <Icon
                        type="simple-line-icon"
                        name="location-pin"
                        color='white'
                        size={20}
                      />
                      <Text style={{ fontFamily: 'Avenir', color: 'white', marginLeft: 5 }}>
                        {this.state.currentPhotoPlace}
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
            </View>
            <Modal
              animationType={"fade"}
              transparent={false}
              onRequestClose={() => { }}
              visible={this.state.searchPlacesModalVisible}
            >
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <StatusBar
                  hidden={true}
                />
                <View style={{ flexDirection: 'row', width: '100%', height: 42 }}>
                  <View style={{ position: 'absolute', alignItems: 'flex-start', top: 8, left: 8, width: '50%', height: 34 }}>
                    <Icon
                      type="material-community"
                      name="close"
                      color="#2d2d2d"
                      size={26}
                      onPress={() => {this.setState({ tempPlace: null }); this.searchPlacesPopupToggle()}}
                    />
                  </View>
                  <View style={{ position: 'absolute', alignItems: 'flex-end', top: 8, right: 8, width: '50%', height: 34 }}>
                    <Icon
                      type="material-community"
                      name="check"
                      color="#2d2d2d"
                      size={26}
                      onPress={() =>{
                        this.props.updateLocation(this.state.tempPlace, this.state.currentPhotoUrl);
                        this.setState({
                          tempPlace: null,
                          currentPhotoPlace: this.state.tempPlace.placeName,
                        });
                        this.searchPlacesPopupToggle();
                      }}
                    />
                  </View>
                </View>
                <GooglePlacesAutocomplete
                  placeholder='Search Location'
                  minLength={2} // minimum length of text to search
                  autoFocus={false}
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  listViewDisplayed='auto'    // true/false/undefined
                  fetchDetails={true}
                  renderDescription={(row) => row.description} // custom description render
                  onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    console.log(data);
                    console.log(details);
                    const placeName = data.description;
                    const coordinates = details.geometry.location;
                    this.setState({tempPlace:{placeName, coordinates}});
                  }}
                  getDefaultValue={() => {
                    return ''; // text input default value
                  }}
                  query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'en', // language of the results
                    types: 'establishment|geocode', // default: 'geocode'
                  }}
                  styles={{
                    description: {
                      fontWeight: 'bold',
                      fontFamily: 'Avenir',
                    },
                    textInput: {
                      fontFamily: 'Avenir',
                    }
                  }}
                  nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                  filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                  debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                />
              </View>
            </Modal>
          </Modal>
        </View>
      </View>
    )
  }
}
