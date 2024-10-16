import * as React from "react";
import { Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Mail } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuthManager } from "~/lib/stores/use-auth-form";
import { Label } from "~/components/ui/label";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { Result } from "~/types";
import { SignInWithEmail } from "~/firebase/authentification";
import { useMutation } from "@tanstack/react-query";
import DividerWithText from "~/components/ui/divider-with-text";
import { useToast } from "react-native-toast-notifications";
import { isEmail } from "~/lib/validators/isEmail";

const description = "Please check your credentials and try again";

export default function Screen() {
  const authManager = useAuthManager();
  const navigation = useNavigation<NavigationProps>();
  const toast = useToast();

  const { mutate: SignInMutator, isPending: isLoginPending } = useMutation({
    mutationFn: async () =>
      SignInWithEmail({
        email: authManager.email,
        password: authManager.password,
      }),
    onSuccess: (data: Result) => {
      if (data.success) {
        navigation.navigate("success");
      } else {
        toast.show("oops! " + data.message, {
          style: { backgroundColor: "red" },
        });
      }
    },
  });

  React.useEffect(() => {
    authManager.reset();
  }, []);

  const onLoginPress = () => {
    authManager.resetErrors();
    if (!isEmail(authManager.email))
      authManager.set("emailError", "Please enter a valid email");
    if (authManager.password.length < 6)
      authManager.set("passwordError", "Please enter a valid password");
    else SignInMutator();
  };

  return (
    <KeyboardAwareScrollView className="">
      <View className="flex flex-col justify-center gap-5 p-4">
        {/* Greetings */}
        <View className="my-5">
          <Text className="text-2xl font-extrabold mx-auto ">
            Welecome Back
          </Text>
          <Text className="text-2xl font-thin mx-auto ">
            Glad to see you again
          </Text>
        </View>

        {/* Form */}
        <View className="flex flex-col gap-2 px-2 my-5">
          <View>
            <Input
              editable={!isLoginPending}
              placeholder="E-mail"
              value={authManager.email}
              onChangeText={(text) => authManager.set("email", text)}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
            {authManager.emailError && (
              <Text className="font-bold my-1.5 color-red-600">
                {authManager.emailError}
              </Text>
            )}
          </View>
          <View>
            <Input
              editable={!isLoginPending}
              secureTextEntry={true}
              placeholder="Password"
              value={authManager.password}
              onChangeText={(text) => authManager.set("password", text)}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
            {authManager.passwordError && (
              <Text className="font-bold my-1.5 color-red-600">
                {authManager.passwordError}
              </Text>
            )}
          </View>

          <Text className="text-md font-bold ml-auto my-1">
            Forget Password ?
          </Text>

          {/* Email Button */}
          <Button
            disabled={isLoginPending}
            className="flex flex-row justify-center gap-2 my-1"
            onPress={() => {
              onLoginPress();
            }}
          >
            <IconWithTheme icon={Mail} size={18} className="mt-1" />
            <Text className="font-bold">Continue with E-mail</Text>
          </Button>
          {/* Divider */}
          <DividerWithText text="OR" />
          {/* SAO */}
          <View className="flex flex-col justify-center gap-2 my-1">
            {/* Google */}
            <Button
              disabled={isLoginPending}
              className="flex flex-row w-fit gap-2 bg-red-600"
            >
              <Image
                className="w-5 h-5 shadow-md"
                source={require("~/assets/images/google.png")}
              />
              <Text className="text-lg font-bold text-white">
                Continue with Google
              </Text>
            </Button>
            {/* Facebook */}
            <Button
              disabled={isLoginPending}
              className="flex flex-row w-fit gap-2 bg-blue-600"
            >
              <Image
                className="w-5 h-5 shadow-md"
                source={require("~/assets/images/facebook.png")}
              />
              <Text className="text-lg font-bold text-white">
                Continue with Facebook
              </Text>
            </Button>
          </View>
        </View>
        {/* Navigate to sign up */}
        <View className="flex flex-row gap-1 items-center justify-center my-auto">
          <Label className="text-lg">Don't have an account?</Label>
          <Label
            className="font-bold underline"
            onPress={() => navigation.navigate("auth/sign-up-screen")}
          >
            Sign up
          </Label>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
