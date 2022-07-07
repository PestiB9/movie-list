import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

export const Text: React.FunctionComponent<TextProps> = ({
  ...rest
}) => (
  <RNText {...rest} />
)