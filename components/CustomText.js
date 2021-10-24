import React, {Component} from 'react';
import {Text} from 'react-native';

export default class CustomText extends Component {
  render() {
    return (
      <Text style={{fontFamily: 'Proxima Nova Regular', ...this.props.style}} {...this.props}>
        {this.props.children}
      </Text>
    );
  }
}
