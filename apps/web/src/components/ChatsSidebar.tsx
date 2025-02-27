import { MessageSquare, Plus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import type { Conversation } from '~/lib/api';
import { Link } from '@tanstack/react-router';
import { cn } from '~/lib/utils';

export type ChatsSidebarProps = {
  conversations: Conversation[];
};

export default function ChatsSidebar({ conversations }: ChatsSidebarProps) {
  return (
    <Sidebar variant="floating">
      <SidebarHeader className="flex flex-row items-center justify-between">
        <h2 className="px-2 text-lg font-semibold tracking-tight">Chats</h2>
        <SidebarMenuButton
          className="p-1 size-6 rounded-full"
          tooltip="New Chat"
          asChild
        >
          <Link
            to="/"
            params={{}}
            activeOptions={{ exact: true }}
            activeProps={{ className: 'bg-muted' }}
          >
            <Plus />
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex flex-col gap-2 px-2">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <SidebarMenuItem
                key={conversation.id}
                className="flex flex-row justify-between items-center w-full"
              >
                <Link
                  to="/$conversationId"
                  params={{ conversationId: conversation.id }}
                  activeOptions={{ exact: true }}
                  activeProps={{ className: cn('bg-muted rounded-md') }}
                  className={cn(
                    'px-2 py-2 flex justify-start items-center gap-4 w-full',
                  )}
                >
                  <MessageSquare className="shrink-0" />
                  <span className="overflow-ellipsis">
                    {conversation.title}
                  </span>
                </Link>
              </SidebarMenuItem>
            ))
          ) : (
            <SidebarMenuItem className="flex flex-row justify-center items-center w-full mt-4">
              <p className="text-sm text-muted-foreground">No conversations</p>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
