import { TextInputAndroidProps, TextInputProps, TextInput as RNTextInput } from "react-native";
import { Palette } from "../../environment/theming";

type Props = TextInputProps & TextInputAndroidProps;

export const Input: React.FunctionComponent<Props> = ({
  style,
  ...rest
}) => (
  <RNTextInput
    style={style} // TODO add default style
    placeholderTextColor={Palette.dark.inputSecondaryColor}
    selectionColor={Palette.dark.inputSecondaryColor}
    underlineColorAndroid={Palette.dark.text}
    {...rest}
  />
)