import * as React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Textarea } from "~/components/ui/textarea";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFeedbackManager } from "./hooks/useFeedbackManager";
import { FEEDBACK_CATEGORIES } from "~/constants/feedback-categories";
import { useMutation } from "@tanstack/react-query";
import { firebaseFns } from "~/firebase";
import { Toast } from "react-native-toast-notifications";
import FeedbackCategorySelector from "~/components/categorieRadioGroup";

export default function FeedbackScreen() {
  const feedbackManager = useFeedbackManager();

  const { mutate: submitFeedback, isPending: isFeedbackSubmitting } =
    useMutation({
      mutationFn: async () =>
        firebaseFns.feedbackService.postFeedback(feedbackManager.getFeedback()),
      onSuccess: (data) => {
        Toast.show(data.message, {
          style: { backgroundColor: "green" },
        });
        feedbackManager.reset();
      },
      onError: () => {
        Toast.show("Oops! Failed to submit feedback", {
          style: { backgroundColor: "red" },
        });
      },
    });

  const handleSubmit = () => {
    submitFeedback();
  };

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <KeyboardAwareScrollView bounces={false}>
      <ScrollView
        bounces={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
      >
        <View className="flex flex-col gap-5 my-5 px-4">
          {/* Header Section */}
          <View className="mx-auto">
            <Text className="font-extrabold text-lg">
              We'd love your feedback!
            </Text>
            <Text className="font-thin mt-2 text-sm">
              Please share your thoughts and help us improve.
            </Text>
          </View>

          {/* Feedback Message Field */}
          <View>
            <Text className="font-semibold mb-2">Feedback Message (*)</Text>
            <Textarea
              editable={!isFeedbackSubmitting}
              value={feedbackManager.message}
              onChangeText={(value: string) =>
                feedbackManager.set("message", value)
              }
              placeholder="Share your feedback here..."
              numberOfLines={5}
              multiline
            />
          </View>
          {/* Category Radio Group */}
          <FeedbackCategorySelector />
          {/* Rating Field */}
          <View>
            <Text className="font-semibold mb-2">Rating (*)</Text>
            <Input
              editable={!isFeedbackSubmitting}
              value={feedbackManager.rating?.toString() || ""}
              onChangeText={(value: string) =>
                feedbackManager.set("rating", value)
              }
              maxLength={1}
              placeholder="Rate us from 1 to 5"
              keyboardType="numeric"
              className="p-3 rounded-md"
            />
          </View>

          {/* Submit Button */}
          <Button
            disabled={isFeedbackSubmitting}
            className="w-full"
            variant={"outline"}
            onPress={handleSubmit}
          >
            <Text>
              {isFeedbackSubmitting ? "Submitting..." : "Submit Feedback"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
