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
        <SidebarMenu className="px-2">
          {conversations?.map((conversation) => (
            <SidebarMenuItem key={conversation.id}>
              <SidebarMenuButton asChild tooltip={conversation.title}>
                <Link
                  to="/$conversationId"
                  params={{ conversationId: conversation.id }}
                  activeOptions={{ exact: true }}
                  activeProps={{ className: cn('bg-muted') }}
                  className={cn('px-4 flex justify-start gap-4')}
                >
                  <MessageSquare className="shrink-0" />
                  <span>{conversation.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
