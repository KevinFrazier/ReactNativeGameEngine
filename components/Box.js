
import React, { Component } from "react";
import { View,Image } from "react-native";
import { array, object, string } from 'prop-types';

export default class Box extends Component {
  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    var x = this.props.body.position.x - width / 2;
    var y = this.props.body.position.y - height / 2;

    return (
      <View
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: width,
          height: height,
          borderWidth: 2,
          borderColor: 'black'
        }}>
        <Image style = {{flex:1}} source={require('../assets/images/megaman.png')} />

        </View>
    );
  }
}

Box.propTypes = {
  size: array,
  body: object,
  color: string
}