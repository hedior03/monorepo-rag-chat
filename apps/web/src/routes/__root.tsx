import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="w-full h-full">
        <main className="p-10 container mx-auto">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
