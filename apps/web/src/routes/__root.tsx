import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AppQueryProvider } from '~/lib/providers/app-client-provider';
import { ThemeProvider } from '~/components/theme-provider';
import { SidebarProvider } from '~/components/ui/sidebar';
import { Toaster } from '~/components/ui/sonner';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <ThemeProvider>
        <SidebarProvider>
          <AppQueryProvider>
            <Outlet />
            <Toaster />
          </AppQueryProvider>
        </SidebarProvider>
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
