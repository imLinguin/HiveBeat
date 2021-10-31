import React, {Component} from 'react';
import {Text} from 'react-native';
import scheme from '../assets/scheme';

export default class CustomText extends Component {
  render() {
    return (
      <Text style={{fontFamily: 'Proxima Nova Regular', color:scheme.textColor, ...this.props.style}} {...this.props}>
        {this.props.children}
      </Text>
    );
  }
}
