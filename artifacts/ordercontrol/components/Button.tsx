import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  style,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const colors = useColors();

  const bgColor = {
    primary: colors.primary,
    secondary: colors.secondary,
    outline: "transparent",
    ghost: "transparent",
    destructive: colors.destructive,
  }[variant];

  const textColor = {
    primary: "#000",
    secondary: "#fff",
    outline: colors.primary,
    ghost: colors.foreground,
    destructive: "#fff",
  }[variant];

  const borderColor = {
    primary: "transparent",
    secondary: "transparent",
    outline: colors.primary,
    ghost: "transparent",
    destructive: "transparent",
  }[variant];

  const paddingV = { sm: 8, md: 12, lg: 16 }[size];
  const paddingH = { sm: 12, md: 20, lg: 28 }[size];
  const fontSize = { sm: 13, md: 15, lg: 17 }[size];

  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bgColor,
          borderColor,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
          borderWidth: variant === "outline" ? 1.5 : 0,
          opacity: pressed || disabled ? 0.75 : 1,
          alignSelf: fullWidth ? "stretch" : "auto",
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor, fontSize, fontFamily: "Inter_600SemiBold" }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  text: {
    textAlign: "center",
  },
});
