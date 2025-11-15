import { useAppTheme } from "@/hooks/useAppTheme";
import { ButtonProps, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import AppText from "../texts/app-text";

export type AppButtonProps = ButtonProps & {
  leftIcon?: React.ReactNode;
  leftIconMargin?: number;
  disabled?: boolean;
  fitContent?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton(props: AppButtonProps) {
  const { theme } = useAppTheme();

  const styles = StyleSheet.create({
    button: {
      justifyContent: "center",
      flexDirection: "row",
      paddingVertical: 10,
      paddingHorizontal: 10,
      alignSelf: props.fitContent ? "flex-start" : "auto",

      backgroundColor: theme.colors.primary,
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
      color: theme.colors.primaryContrastTex,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <Pressable
      disabled={props.disabled}
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        props.style
      ]}
    >
      {!!props.leftIcon &&
        <View
          style={{
            justifyContent: "center",
            padding: 0,
            marginRight:
              props.leftIconMargin
          }}
        >
          {props.leftIcon}
        </View>
      }
      <AppText
        wrapperStyle={{ justifyContent: "center" }}
        style={styles.buttonText}
      >
        {props.title}
      </AppText>
    </Pressable>
  );
}

