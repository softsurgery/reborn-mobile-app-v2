import * as TabsPrimitive from "@rn-primitives/tabs";
import * as React from "react";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/ui/text";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  TabsPrimitive.ListRef,
  TabsPrimitive.ListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("h-20 rounded-md bg-muted", className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  TabsPrimitive.TriggerRef,
  TabsPrimitive.TriggerProps
>(({ className, ...props }, ref) => {
  const { value } = TabsPrimitive.useRootContext();
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm native:text-base font-medium text-muted-foreground web:transition-all",
        value === props.value && "text-foreground"
      )}
    >
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "inline-flex h-full items-center justify-center shadow-none web:whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium web:ring-offset-background web:transition-all web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.disabled && "web:pointer-events-none opacity-50",
          props.value === value && "bg-gray-200 dark:bg-black ",
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsTriggerWithIcon = React.forwardRef<
  TabsPrimitive.TriggerRef,
  TabsPrimitive.TriggerProps
>(({ className, ...props }, ref) => {
  const { value } = TabsPrimitive.useRootContext();
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm native:text-base font-medium text-muted-foreground web:transition-all",
        value === props.value && "text-foreground"
      )}
    >
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center shadow-none web:whitespace-nowrap rounded-sm px-3 py-5 text-sm font-medium web:ring-offset-background web:transition-all web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.disabled && "web:pointer-events-none opacity-50",
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
});
TabsTriggerWithIcon.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  TabsPrimitive.ContentRef,
  TabsPrimitive.ContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger, TabsTriggerWithIcon };
