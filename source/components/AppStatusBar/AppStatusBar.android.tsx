import React from 'react';
import {StatusBar, StatusBarPropsAndroid} from 'react-native';

export const AppStatusBar: React.FunctionComponent<StatusBarPropsAndroid> = (props) => (
  <StatusBar {...props} translucent backgroundColor={'transparent'} />
)