<script lang="ts" setup>
import type { AreaColor, AreaIcon } from "#shared/utils/areas";

defineProps<{ area: { icon: AreaIcon; color: AreaColor } }>();
</script>

<template>
  <component
    :is="AREA_ICON_STYLES[area.icon].component"
    :class="AREA_COLOR_STYLES[area.color].text"
  />
</template>
