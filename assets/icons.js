import React from 'react';
import {
  Svg,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  Filter,
} from 'react-native-svg';

export default {
  Home: (
    <>
      <Path
        d="M46.2914 28.198V60.5715H35.4669V49.999H13.8244V60.5715H3V28.198L25.2194 5.04797L46.2914 28.198Z"
        stroke="#E3AF34"
        strokeWidth="5.73058"
        strokeMiterlimit="10"
      />
      <G style="mix-blend-mode:color-dodge" opacity="0.51">
        <Path
          d="M46.3804 28.1978V60.5713H35.556V49.9988H13.9135V60.5713H3.08905V28.1978L25.219 5.04773L46.3804 28.1978Z"
          stroke="url(#paint0_linear)"
          strokeWidth="3.18427"
          strokeMiterlimit="10"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="24.7347"
          y1="4.49354"
          x2="24.7347"
          y2="60.5713"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#E3AF34" />
          <Stop offset="1" stopColor="#949146" stopOpacity="0" />
        </LinearGradient>
      </Defs>
    </>
  ),
  Search: (
    <>
      <Path
        d="M39.4457 41.5031L18.4508 46.3112L3.97516 29.6656L10.5005 8.21049L31.4954 3.40241L45.971 20.048L39.4457 41.5031ZM39.4457 41.5031L50.5 55.6657"
        stroke="#E3AF34"
        strokeWidth="5.69037"
        strokeMiterlimit="10"
      />
      <Path
        style="mix-blend-mode:color-dodge"
        opacity="0.51"
        d="M39.8524 41.4179L18.8575 46.226L4.38184 29.5804L10.9072 8.12528L31.902 3.31721L46.3777 19.9628L39.8524 41.4179ZM39.8524 41.4179L48.999 54.0939"
        stroke="url(#paint0_linear)"
        strokeWidth="3.16132"
        strokeMiterlimit="10"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="33.3994"
          y1="-1.54367"
          x2="16.094"
          y2="49.6415"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#E3AF34" />
          <Stop offset="1" stopColor="#949146" stopOpacity="0" />
        </LinearGradient>
      </Defs>
    </>
  ),
  Playlists: (
    <Svg width="47" height="38">
      <Path
        d="M47 3.5719H0M47 18.9183H0M0 34.3767H47"
        stroke="#E3AF34"
        strokeWidth="6.26366"
        strokeMiterlimit="10"
      />
      <G style="mix-blend-mode:color-dodge" opacity="0.51">
        <Path
          d="M45.3605 3.57153H1.63953M45.3605 18.9182H1.63953M1.63953 34.3767H45.3605"
          stroke="url(#paint0_linear)"
          strokeWidth="3.48048"
          strokeMiterlimit="10"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="23.7566"
          y1="-22.3337"
          x2="23.7566"
          y2="38.9605"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#E3AF34" />
          <Stop offset="1" stopColor="#949146" stopOpacity="0" />
        </LinearGradient>
      </Defs>
    </Svg>
  ),
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
