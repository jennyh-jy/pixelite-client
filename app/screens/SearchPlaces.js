/* eslint-disable */
import React from 'react';
import { Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


export default class SearchPlaces extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search'
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
            selectedPlace: data.description
          });
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyC4bMJQrp9Bsjii2tbOgYGpj7vyb6rM7-M',
          language: 'en', // language of the results
          types: 'establishment|geocode', // default: 'geocode'
        }}
        styles={{
          container: {
            marginTop: 10,
            width: 280,
          },
          description: {
            fontWeight: 'bold',
            fontFamily: 'Avenir',
          },
          textInputContainer: {
            borderTopColor: '#aaa',
            borderTopWidth: 1,
          },
          textInput: {
            fontFamily: 'Avenir',
            borderRadius: 0,
            color: '#555',
          }
        }}
        // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        // currentLocationLabel="Current location"
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        // GoogleReverseGeocodingQuery={{
        //   // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        // }}
        // GooglePlacesSearchQuery={{
        //   // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        //   rankby: 'distance',
        //   types: 'food'
        // }}

        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        // predefinedPlaces={[homePlace, workPlace]}

        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        // renderLeftButton={() => <Text>hi</Text>}
        // renderRightButton={() => <Text>harro</Text>}
      />
    );
  }
}
