import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { ChevronDown } from "lucide-react-native";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { cn } from "~/lib/utils";

interface StatusProfileMenuProps {
  className?: string;
}

const statusOptions = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
  { label: "Away", value: "away" },
];

function StatusProfileMenu({ className }: StatusProfileMenuProps) {
  const { currentUser } = useCurrentUser();
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0].value);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    // currentUser?.updateProfile({ status: value });
    // Here, you could also update the status in a global state or backend API
  };

  return (
    <DropdownMenu className={cn("flex-1 items-center pl-4", className)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Text className="mr-2">{statusOptions.find((s) => s.value === selectedStatus)?.label}</Text>
          <IconWithTheme icon={ChevronDown} size={24} color="white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent insets={undefined}>
        <DropdownMenuGroup>
          {statusOptions.map((status) => (
            <DropdownMenuItem key={status.value} onPress={() => handleStatusChange(status.value)}>
              <Text>{status.label}</Text>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default StatusProfileMenu;
