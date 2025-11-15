import { Image, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  text?: string;
  containerStyles: object;
  textStyles?: object;
  iconSource?: any;
  iconStyles?: object;
  onPress: any;
}

export default function BasicButton(props: ButtonProps) {
  return (
    <TouchableOpacity style={props.containerStyles} onPress={props.onPress}>
      {props.text && <Text style={props.textStyles}>{props.text}</Text>}
      {props.iconSource && (
        <Image source={props.iconSource} style={props.iconStyles} />
      )}
    </TouchableOpacity>
  );
}
