import React from 'react';
import {ScrollView, ScrollViewProps, View, ViewProps} from 'react-native';
import {SafeAreaProvider, SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context';

import {AppStatusBar} from './';

type Props = ScrollViewProps & {
  backgroundColor?: string;
  safeAreaViewProps?: SafeAreaViewProps
}

export const Page: React.FunctionComponent<Props> = ({
  children,
  backgroundColor,
  safeAreaViewProps,
  ...rest
}) => {
  return (
    <SafeAreaProvider>
      <AppStatusBar />
      <SafeAreaView {...safeAreaViewProps} style={{backgroundColor, flex: 1}}>
        <ScrollView style={{marginHorizontal: 16}} {...rest}>{children}</ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}