import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { Palette } from '../../environment/theming';

export const Input: React.FunctionComponent<TextInputProps> = ({
  style,
  ...rest
}) => (
  <TextInput
    placeholderTextColor={Palette.dark.inputSecondaryColor}
    selectionColor={Palette.dark.inputSecondaryColor}
    style={style}
    {...rest}
  />
  )