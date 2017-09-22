import React from "react";
import { ScrollView, Text, Linking, View, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";
import {
  Image,
  ListView,
  Tile,
  Title,
  Subtitle,
  Overlay,
  Screen,
  Divider,
  Card,
  Caption,
  GridRow
} from '@shoutem/ui';


// const stories = [
//   {
//     key: 1,
//     name: "Spain trip in summer '16",
//     image: require("../images/1.jpg"),
//     url: "https://unsplash.com/photos/C9t94JC4_L8"
//   },
//   {
//     key: 2,
//     name: "Jeju with besties",
//     image: require("../images/2.jpg"),
//     url: "https://unsplash.com/photos/waZEHLRP98s"
//   },
//   {
//     key: 3,
//     name: "All of the foods in Japan",
//     image: require("../images/3.jpg"),
//     url: "https://unsplash.com/photos/cFplR9ZGnAk"
//   },
//   {
//     key: 4,
//     name: "Backpacking in Australia",
//     image: require("../images/4.jpg"),
//     url: "https://unsplash.com/photos/89PFnHKg8HE"
//   }
// ];

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      restaurants: [{
        "name": "Gaspar Brasserie",
        "address": "185 Sutter St, San Francisco, CA 94109",
        "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-1.jpg" },
      }, {
        "name": "Chalk Point Kitchen",
        "address": "527 Broome St, New York, NY 10013",
        "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-2.jpg" },
      }],
    }
  }

  renderRow(restaurant) {
    return (
      <View>
        <Image
          styleName="large-banner"
          source={{ uri: restaurant.image.url }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">{restaurant.name}</Title>
            <Subtitle styleName="sm-gutter-horizontal">{restaurant.address}</Subtitle>
          </Tile>
        </Image>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    return (
      <Screen>
        <ListView
          data={this.state.restaurants}
          renderRow={this.renderRow}
        />
      </Screen>
    );
  }
}

// export default () => (
//   <View style={{ flex: 1 }}>
//     <ScrollView contentContainerStyle={{ paddingVertical: 20, backgroundColor: 'white' }}>
//       {stories.map(({ name, image, url, key }) => (
//         <Card title={`CARD ${key}`} image={image} key={key}>
//           <Text style={{ marginBottom: 10 }}>
//             {name}
//           </Text>
//           <Button
//             backgroundColor="#03A9F4"
//             title="VIEW NOW"
//             onPress={() => Linking.openURL(url)}
//           />
//         </Card>
//       ))}
//     </ScrollView>
//   </View>
// );
