import React from "react";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { LogOut } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const Profile = () => {
  const { handleSignOut } = useAuthFunctions();
  const navigation = useNavigation<NavigationProps>();

  const { mutate: SignOutMutator, isPending: isSignOutPending } = useMutation({
    mutationFn: async () => handleSignOut(),
    onSuccess: () => {
      navigation.navigate("index");
    },
  });
  return (
    <View className="flex flex-col pt-10">
      <Avatar alt="Zach Nugent's Avatar" className="w-52 h-52 mx-auto border-2">
        <AvatarImage source={require("~/assets/images/adaptive-icon.png")} />
        <AvatarFallback>
          <Text>ZN</Text>
        </AvatarFallback>
      </Avatar>
      <Text className="mx-auto my-5 text-xl">Nayssem's Profile</Text>
      <Button
        variant="outline"
        onPress={() => SignOutMutator()}
        className="flex flex-row gap-2 mx-10"
      >
        <IconWithTheme icon={LogOut} size={20} />
        <Text>Disconnect</Text>
      </Button>
    </View>
  );
};
