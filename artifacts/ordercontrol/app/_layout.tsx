import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ChatProvider } from "@/context/ChatContext";
import { LangProvider } from "@/context/LangContext";
import { OrderProvider } from "@/context/OrderContext";
import { RestaurantProvider } from "@/context/RestaurantContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ConsentBanner } from "@/components/ConsentBanner";
import { OrderNotificationBridge } from "@/components/OrderNotificationBridge";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <KeyboardProvider>
            <LangProvider>
              <AuthProvider>
                <RestaurantProvider>
                  <OrderProvider>
                    <CartProvider>
                      <ChatProvider>
                        <NotificationProvider>
                          <OrderNotificationBridge />
                          <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="auth/login" options={{ headerShown: false, presentation: "modal" }} />
                            <Stack.Screen name="auth/register" options={{ headerShown: false, presentation: "modal" }} />
                            <Stack.Screen name="auth/register-restaurant" options={{ headerShown: false, presentation: "modal" }} />
                            <Stack.Screen name="product/[id]" options={{ headerShown: false, presentation: "modal" }} />
                            <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
                            <Stack.Screen name="checkout" options={{ headerShown: false }} />
                            <Stack.Screen name="notifications" options={{ headerShown: false, presentation: "modal" }} />
                            <Stack.Screen name="chat" options={{ headerShown: false }} />
                            <Stack.Screen name="admin/index" options={{ headerShown: false }} />
                            <Stack.Screen name="admin/orders" options={{ headerShown: false }} />
                            <Stack.Screen name="admin/products" options={{ headerShown: false }} />
                            <Stack.Screen name="admin/categories" options={{ headerShown: false }} />
                            <Stack.Screen name="admin/promotions" options={{ headerShown: false }} />
                            <Stack.Screen name="admin/reports" options={{ headerShown: false }} />
                            <Stack.Screen name="admin/settings" options={{ headerShown: false }} />
                            <Stack.Screen name="admin/chat" options={{ headerShown: false }} />
                            <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
                            <Stack.Screen name="terms-of-service" options={{ headerShown: false }} />
                          </Stack>
                          <ConsentBanner />
                        </NotificationProvider>
                      </ChatProvider>
                    </CartProvider>
                  </OrderProvider>
                </RestaurantProvider>
              </AuthProvider>
            </LangProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
