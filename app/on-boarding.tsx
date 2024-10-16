import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function Screen() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View className="flex justify-center items-center gap-3 p-6 px-12 bg-secondary/30">
       <Avatar alt="Reborn" className="self-center w-36 h-36">
          <AvatarImage />
          <AvatarFallback>
            <Text>RX</Text>
          </AvatarFallback>
        </Avatar>
      <Button className="w-full " onPress={() => navigation.navigate("auth/sign-up-screen")}>
        <Text className="text-lg font-normal">SIGN UP</Text>
      </Button>

      <Button className="w-full " onPress={() => navigation.navigate("auth/sign-in-screen")}>
        <Text className="text-lg font-normal">SIGN IN</Text>
      </Button>
    </View>
  );
}
