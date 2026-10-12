<script lang="ts" setup>
import { Trash2 } from "@lucide/vue";
import { toast } from "vue-sonner";
import type { AreaColor, AreaIcon } from "#shared/utils/areas";

type Area = { id: string; name: string; color: AreaColor; icon: AreaIcon };

const props = defineProps<{ area: Area }>();

defineEmits<{
  (e: "delete"): void;
}>();

async function save(patch: Partial<Omit<Area, "id">>) {
  try {
    await $fetch(`/api/areas/${props.area.id}`, {
      method: "PATCH",
      body: patch,
    });
    refreshNuxtData("areas");
    return true;
  } catch {
    toast.error("Não foi possível salvar. Tente novamente.");
    return false;
  }
}

const optionClass =
  "flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-accent has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring";
</script>

<template>
  <li :id="`area-${area.id}`" class="flex items-center gap-2 px-2 py-2">
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="ghost" size="icon-sm">
          <AreaIcon :area="area" />
          <span class="sr-only">Mudar cor e ícone</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" class="flex w-auto flex-col gap-3">
        <fieldset>
          <legend class="mb-1 text-xs text-muted-foreground">Ícone</legend>
          <div class="grid grid-cols-6 gap-1">
            <label v-for="icon in AREA_ICONS" :key="icon" :class="optionClass">
              <input
                type="radio"
                class="sr-only"
                :name="`icon-${area.id}`"
                :checked="icon === area.icon"
                :aria-label="AREA_ICON_STYLES[icon].label"
                @change="save({ icon })"
              />
              <component
                :is="AREA_ICON_STYLES[icon].component"
                class="size-4"
              />
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend class="mb-1 text-xs text-muted-foreground">Cor</legend>
          <div class="grid grid-cols-8 gap-1">
            <label
              v-for="color in AREA_COLORS"
              :key="color"
              :class="optionClass"
            >
              <input
                type="radio"
                class="sr-only"
                :name="`color-${area.id}`"
                :checked="color === area.color"
                :aria-label="AREA_COLOR_STYLES[color].label"
                @change="save({ color })"
              />
              <span
                class="size-4 rounded-full"
                :class="AREA_COLOR_STYLES[color].bg"
              />
            </label>
          </div>
        </fieldset>
      </PopoverContent>
    </Popover>
    <AppInlineInput
      :value="area.name"
      :save="(name) => save({ name })"
      required
      ghost
      aria-label="Nome da área"
    />
    <Button
      variant="ghost"
      size="icon-sm"
      class="text-muted-foreground"
      @click="$emit('delete')"
    >
      <Trash2 />
      <span class="sr-only">Excluir</span>
    </Button>
  </li>
</template>
