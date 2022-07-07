import React from 'react';
import {StatusBar, StatusBarPropsIOS} from 'react-native';

export const AppStatusBar: React.FunctionComponent<StatusBarPropsIOS> = (props) => (
  <StatusBar {...props} barStyle={'light-content'} />
)