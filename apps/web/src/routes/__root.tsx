import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AppQueryProvider } from '~/lib/providers/app-client-provider';
import { ThemeProvider } from '~/components/theme-provider';
import { SidebarProvider } from '~/components/ui/sidebar';
import { TooltipProvider } from '~/components/ui/tooltip';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider>
            <AppQueryProvider>
              <Outlet />
            </AppQueryProvider>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
