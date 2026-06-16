import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function NewProductScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 10,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()}>
          <Feather
            name="arrow-left"
            size={22}
            color={colors.foreground}
          />
        </Pressable>

        <Text
          style={[
            styles.title,
            { color: colors.foreground },
          ]}
        >
          Novo Produto
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 14,
        }}
      >
        <View>
          <Text
            style={[
              styles.label,
              { color: colors.foreground },
            ]}
          >
            Nome
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: Pizza Calabresa"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        <View>
          <Text
            style={[
              styles.label,
              { color: colors.foreground },
            ]}
          >
            Descrição
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            style={[
              styles.textArea,
              {
                backgroundColor: colors.card,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        <View>
          <Text
            style={[
              styles.label,
              { color: colors.foreground },
            ]}
          >
            Preço
          </Text>

          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        <Pressable
          style={[
            styles.saveBtn,
            { backgroundColor: colors.primary },
          ]}
          onPress={() =>
            console.log({
              name,
              description,
              price,
            })
          }
        >
          <Text style={styles.saveText}>
            Salvar Produto
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },
  saveBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
});