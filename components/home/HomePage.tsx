import React from "react";
import { Text } from "../ui/text";
import { Separator } from "../ui/separator";
import { View } from "react-native";
import { UserBubble } from "../chat/UserBubble";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import Select from "~/components/common/Select";
import { tunisianGovernorates } from "~/constants/cities";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Bell, CircleCheck, Search } from "lucide-react-native";
import { Input } from "../ui/input";

export const HomePage = () => {
  const { currentUser } = useCurrentUser();
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const loadRegionPreference = async () => {
      const storedRegion = await AsyncStorage.getItem("region");
      setSelectedRegion(storedRegion || tunisianGovernorates[0]);
    };
    loadRegionPreference();
  }, []);

  const handleRegionSelect = async (value: string) => {
    setSelectedRegion(value);
    await AsyncStorage.setItem("region", value);
  };

  return (
    <View className="flex-1 px-5 mb-2">
      {/* Header */}
      <View className="flex flex-row justify-between items-center py-2">
        <Text className="text-4xl font-bold pb-1">Home</Text>
        <Select
          title="Select Region"
          options={tunisianGovernorates.map((region) => ({
            label: region,
            value: region,
          }))}
          onSelect={handleRegionSelect}
          value={selectedRegion || ""}
        />
      </View>

      <Separator className="rounded-full" />

      {/* User + Notification Section */}
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

        {/* Welcome Text (Takes Available Space) */}
        <View className="flex-1 ml-2">
          <Text className="text-lg font-semibold">Welcome Back 👋</Text>
        </View>

        {/* Notification Bell (Aligned to Right) */}
        <IconWithTheme icon={Bell} size={24} color="white" />
      </View>

      {/* Search Section */}
      <View className="flex flex-row items-center px-3 py-2">
        <IconWithTheme icon={Search} size={20} className="mr-2" />
        <Input
          placeholder="Search..."
          placeholderTextColor="#9ca3af"
          className="flex-1 border-0 bg-transparent text-black dark:text-white"
        />
      </View>

      <Separator className="rounded-full w-full" />
      <ScrollView></ScrollView>
    </View>
  );
};
