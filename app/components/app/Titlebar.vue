<script setup lang="ts">
import { useSidebar } from "../ui/sidebar";
const { state, isMobile } = useSidebar();

// Com a barra lateral recolhida, os botões da janela do macOS ficam sobre este cabeçalho.
const besideWindowButtons = computed(
  () => isDesktopMac && (state.value === "collapsed" || isMobile.value),
);
</script>

<template>
  <header
    class="flex h-12 items-center px-4"
    :class="[
      isDesktopMac && 'max-md:pt-4 [-webkit-app-region:drag]',
      besideWindowButtons && 'pl-20',
    ]"
  >
    <SidebarTrigger class="[-webkit-app-region:no-drag]" />
  </header>
</template>
