import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { CATEGORIES } from "@/data/restaurant";

export default function EditCategoryScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { id } = useLocalSearchParams();

  const category = CATEGORIES.find((c) => c.id === id);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
    }
  }, [category]);

  const handleSave = () => {
    console.log("EDIT CATEGORY:", {
      id,
      name,
      icon,
    });

    router.back();
  };

  if (!category) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.foreground }}>
          Categoria não encontrada
        </Text>
      </View>
    );
  }

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
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>

        <Text style={[styles.title, { color: colors.foreground }]}>
          Editar Categoria
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Nome
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
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
          <Text style={[styles.label, { color: colors.foreground }]}>
            Ícone
          </Text>

          <TextInput
            value={icon}
            onChangeText={setIcon}
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
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Salvar Alterações</Text>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});