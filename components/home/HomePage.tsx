import React from "react";
import { Text } from "../ui/text";
import { Separator } from "../ui/separator";
import { Pressable, TextInput, View } from "react-native";
import { UserBubble } from "../chat/UserBubble";
import { ScrollView } from "react-native";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import Select from "~/components/common/Select";
import { tunisianGovernorates } from "~/constants/cities";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Bell, CircleCheck, Search } from "lucide-react-native";
import StatusProfileMenu from "../common/StatusProfileMenu";
import { Input } from "../ui/input";

export const HomePage = () => {
  const { currentUser } = useCurrentUser();
  return (
    <View className="flex-1 px-5 mb-2">
      <View className="flex flex-row justify-between items-center py-2">
        <Text className="text-4xl font-bold pb-1">Home</Text>
        <Select
          title="Select Region"
          options={tunisianGovernorates.map((region) => ({
            label: region,
            value: region,
          }))}
        />
      </View>
      <Separator className="rounded-full" />
      <View className="flex flex-row items-center py-4">
        <View className="relative">
          <UserBubble
            className="w-16 h-16"
            gender={currentUser?.isMale}
            uid={currentUser?.uid}
          />
          <View className="absolute bottom-0 right-0 bg-white dark:bg-black rounded-full p-0.5">
            <IconWithTheme icon={CircleCheck} size={16} color="green" />
          </View>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-lg font-semibold ml-1">Welcome Back 👋</Text>
          <StatusProfileMenu className="ml-8" />
        </View>
      </View>
      <View className="flex flex-row items-center w-full border-hidden rounded px-2 gap-2">
        {/* Search Icon */}
        {/* <IconWithTheme icon={Search} size={24} className="mr-2" /> */}
        {/* Search Input */}
        <Input
          placeholder="Search..."
          placeholderTextColor="#9ca3af"
          className="flex-auto border-hidden"
        />
        {/* Notification Icon */}
        <Pressable className="ml-2">
          <IconWithTheme icon={Bell} size={24} color="white" />
        </Pressable>
        <Separator className="rounded-full w-full" />
      </View>
      <ScrollView></ScrollView>
    </View>
  );
};
