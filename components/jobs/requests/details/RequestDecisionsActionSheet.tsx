import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { Check, Clock, Mail, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Text } from "@/components/ui/text";
import { useJobRequestActions } from "@/hooks/content/job/useJobRequestActions";
import { JobRequestStatus, ResponseJobRequestDto } from "@/types";
import { cn } from "@/lib/utils";
import { ApproveJobRequestActionSheet } from "./action-sheets/ApproveJobRequestActionSheet";
import { DeclineJobRequestActionSheet } from "./action-sheets/DeclineJobRequestActionSheet";
import { WaitlistJobRequestActionSheet } from "./action-sheets/WaitlistJobRequestActionSheet";
import { WithdrawJobRequestActionSheet } from "./action-sheets/WithdrawJobRequestActionSheet";
import { ActionPressable } from "@/components/shared/ActionPressable";
import { useColorPalette } from "@/hooks/useColorPalette";
import { hslToHex } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RequestDecisionsActionSheetProps {
  className?: string;
  request: ResponseJobRequestDto;
  isIncoming: boolean;
  refetch: () => void;
}

export const RequestDecisionsActionSheet = React.forwardRef<
  ActionSheetRef,
  RequestDecisionsActionSheetProps
>(({ className, request, isIncoming, refetch }, ref) => {
  const { palette } = useColorPalette();
  const innerRef = React.useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  React.useImperativeHandle(ref, () => innerRef.current as ActionSheetRef);

  const approveSheetRef = React.useRef<ActionSheetRef>(null);
  const rejectSheetRef = React.useRef<ActionSheetRef>(null);
  const waitlistSheetRef = React.useRef<ActionSheetRef>(null);
  const cancelSheetRef = React.useRef<ActionSheetRef>(null);

  const {
    approveJobRequest,
    isApprovePending,
    rejectJobRequest,
    isRejectPending,
    waitlistJobRequest,
    isWaitlistPending,
    cancelJobRequest,
    isCancelPending,
  } = useJobRequestActions({
    onSuccess: () => {
      refetch();
      approveSheetRef.current?.hide();
      rejectSheetRef.current?.hide();
      waitlistSheetRef.current?.hide();
      cancelSheetRef.current?.hide();
    },
  });

  const isIncomingActionPending =
    isApprovePending || isRejectPending || isWaitlistPending;

  const closeAndRun = (action: () => void) => {
    innerRef.current?.hide();
    setTimeout(action, 300);
  };

  const actions = {
    incoming: [
      {
        id: "approve",
        title: "Approve Candidate",
        description: "Accept application and start working",
        IconComp: Check,
        classNames: {
          icon: "bg-emerald-500/10",
          title: "text-emerald-600 font-bold",
        },
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          closeAndRun(() => approveSheetRef.current?.show());
        },
        disabled: isIncomingActionPending,
        isPending: isApprovePending,
        hidden: false,
      },
      {
        id: "waitlist",
        title: "Move to Waitlist",
        description: "Keep candidate for future consideration",
        IconComp: Clock,
        classNames: {
          icon: "bg-amber-500/10",
          title: "text-amber-600 font-bold",
        },
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          closeAndRun(() => waitlistSheetRef.current?.show());
        },
        disabled: isIncomingActionPending,
        isPending: isWaitlistPending,
        hidden: request.status === JobRequestStatus.Waitlist,
      },
      {
        id: "decline",
        title: "Decline Candidate",
        description: "Reject this application",
        IconComp: X,
        classNames: {
          icon: "bg-destructive/10",
          title: "text-destructive font-bold",
        },
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          closeAndRun(() => rejectSheetRef.current?.show());
        },
        disabled: isIncomingActionPending,
        isPending: isRejectPending,
        hidden: false,
      },
    ],
    outgoing: [
      {
        id: "withdraw",
        title: "Withdraw Application",
        description: "Cancel your pending request",
        IconComp: X,
        classNames: {
          icon: "bg-destructive/10",
          title: "text-destructive font-bold",
        },
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          closeAndRun(() => cancelSheetRef.current?.show());
        },
        disabled: isCancelPending,
        isPending: isCancelPending,
        hidden: false,
      },
    ],
  };

  const activeActions = isIncoming
    ? actions.incoming.filter((a) => !a.hidden)
    : actions.outgoing.filter((a) => !a.hidden);

  return (
    <>
      <ActionSheet
        ref={innerRef}
        containerStyle={{
          backgroundColor: hslToHex(palette.background),
        }}
        indicatorStyle={{
          backgroundColor: hslToHex(palette.muted),
        }}
        gestureEnabled={true}
      >
        <View 
          className={cn("px-4 pt-2", className)}
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <Text className="text-base font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">
            Application Decisions
          </Text>
          <View className="flex flex-col overflow-hidden">
            {request.status === JobRequestStatus.Pending ||
            request.status === JobRequestStatus.Waitlist ? (
              <React.Fragment>
                {activeActions.map((action, index) => (
                  <ActionPressable
                    key={action.id}
                    title={action.title}
                    description={action.description}
                    IconComp={action.IconComp}
                    classNames={{ ...action.classNames, wrapper: cn("py-4") }}
                    onPress={action.onPress}
                    disabled={action.disabled}
                    isPending={action.isPending}
                    isLast={index === activeActions.length - 1}
                  />
                ))}
              </React.Fragment>
            ) : request.status === JobRequestStatus.Approved ? (
              <ActionPressable
                title="Send Direct Message"
                description="Start conversation with counterparty"
                IconComp={Mail}
                classNames={{
                  icon: "bg-primary/10",
                  title: "text-primary font-bold",
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  innerRef.current?.hide();
                  router.push("/main/(tabs)/chat");
                }}
                isLast
              />
            ) : (
              <View className="w-full py-4 items-center justify-center">
                <Text className="text-sm font-semibold text-center text-destructive">
                  This job application has been declined.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ActionSheet>

      <ApproveJobRequestActionSheet
        ref={approveSheetRef}
        request={request}
        onConfirm={() => approveJobRequest(request.id)}
        onClose={() => approveSheetRef.current?.hide()}
        isPending={isApprovePending}
      />

      <DeclineJobRequestActionSheet
        ref={rejectSheetRef}
        request={request}
        onConfirm={() => rejectJobRequest(request.id)}
        onClose={() => rejectSheetRef.current?.hide()}
        isPending={isRejectPending}
      />

      <WaitlistJobRequestActionSheet
        ref={waitlistSheetRef}
        request={request}
        onConfirm={() => waitlistJobRequest(request.id)}
        onClose={() => waitlistSheetRef.current?.hide()}
        isPending={isWaitlistPending}
      />

      <WithdrawJobRequestActionSheet
        ref={cancelSheetRef}
        request={request}
        onConfirm={() => cancelJobRequest(request.id)}
        onClose={() => cancelSheetRef.current?.hide()}
        isPending={isCancelPending}
      />
    </>
  );
});
