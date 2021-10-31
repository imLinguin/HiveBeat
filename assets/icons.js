import React from 'react';
import {
  Svg,
  Path,
} from 'react-native-svg';

export default {
  Pause: (
    <Svg viewBox="0 0 51 61">
      <Path
        d="M8.00012 61V0M43.0001 0V61"
        stroke="#E3AF34"
        strokeWidth="10"
        strokeMiterlimit="10"
      />
    </Svg>
  ),
  Play: (
    <Svg viewBox="0 0 46 60" fill="none">
      <Path
        d="M4 6.49988V53.3051L39.5 29.9999L4 6.49988Z"
        stroke="#E3AF34"
        strokeWidth="6.26366"
        fill="none"
        strokeMiterlimit="10"
      />
    </Svg>
  ),
  Back: (
    <Svg viewBox="0 0 52 74" fill="none">
      <Path
        d="M4.00003 37.1271L48 8.00037V66.0124L4.00003 37.1271ZM4.00003 37.1271V8.00037V66.0124"
        stroke="#E3AF34"
        strokeWidth="7.76341"
        fill="none"
        strokeMiterlimit="10"
      />
    </Svg>
  ),
  Skip: (
    <Svg viewBox="0 0 52 74" fill="none">
      <Path
        d="M48.0001 37.1268L4.00012 8V66.012L48.0001 37.1268ZM48.0001 37.1268V8V66.012"
        stroke="#E3AF34"
        strokeWidth="7.76341"
        strokeMiterlimit="10"
        fill="none"
      />
    </Svg>
  ),
  PlayBorder: (
    <Svg viewBox="0 0 245 219" fill="none">
      <Path
        d="M68.0898 204.962H174.237L228.752 109.981L177.088 15L70.9408 15L16.4262 109.981L68.0898 204.962Z"
        fill="none"
        stroke="#E3AF34"
        strokeWidth="28.0584"
        strokeMiterlimit="10"
      />
    </Svg>
  ),
};
