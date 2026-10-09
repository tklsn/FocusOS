<template>
  <SidebarProvider>
    <TaskCaptureDialog />
    <AppSidebar />
    <SidebarInset>
      <AppTitlebar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
