import { useAppTheme } from "@/hooks/useAppTheme";
import { ButtonProps, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

export type AppButtonProps = ButtonProps & {
  fitContent?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton(props: AppButtonProps) {
  const { theme } = useAppTheme();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonPressed: {
      backgroundColor: theme.colors.primary,
      opacity: 0.7,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.button,
        {
          alignSelf: props.fitContent ? "flex-start" : "auto"
        },
        pressed && styles.buttonPressed, // style when pressed
        props.style
      ]}
    >
      <Text
        style={styles.buttonText}
      >
        {props.title}
      </Text>
    </Pressable>
  );
}

