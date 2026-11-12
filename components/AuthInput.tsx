import { ReactNode, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { verticalScale } from "react-native-size-matters";

interface AuthInputProps extends TextInputProps {
  label: string;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
}

export default function AuthInput({
  label,
  rightIcon,
  onRightIconPress,
  ...inputProps
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, isFocused && styles.fieldFocused]}>
        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor="#8E8E93"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightIconPress}
            hitSlop={verticalScale(8)}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: verticalScale(260),
    marginTop: verticalScale(16),
  },
  label: {
    fontFamily: "Inter",
    fontSize: verticalScale(13),
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: verticalScale(6),
    marginLeft: verticalScale(4),
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(50),
    backgroundColor: "#FFF",
    borderRadius: verticalScale(14),
    borderWidth: 1,
    borderColor: "#C7C7C7",
    paddingHorizontal: verticalScale(14),
  },
  fieldFocused: {
    borderColor: "#007AFF",
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: "Inter",
    fontSize: verticalScale(16),
    color: "#000",
  },
  iconButton: {
    marginLeft: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
  },
});
