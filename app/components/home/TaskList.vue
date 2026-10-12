<script lang="ts" setup>
import { Check, ChevronRight, Play, Sun } from "@lucide/vue";
import type { AreaColor, AreaIcon } from "#shared/utils/areas";

// Bloco recolhido da Home. Com `today`, são as tarefas de hoje fora do
// destaque (dá para focar ou tirar de hoje); sem, são sugestões (dá para
// trazer para hoje).
defineProps<{
  label: string;
  today: boolean;
  items: {
    task: { id: string; title: string };
    project?: { id: string; name: string };
    area?: { icon: AreaIcon; color: AreaColor };
  }[];
}>();

defineEmits<{ (e: "focus", taskId: string): void }>();
</script>

<template>
  <Collapsible class="group/collapsible">
    <CollapsibleTrigger as-child>
      <Button variant="ghost" size="sm" class="-ml-2 text-muted-foreground">
        <ChevronRight
          class="transition-transform group-data-[state=open]/collapsible:rotate-90 motion-reduce:transition-none"
        />
        {{ label }}
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <ItemGroup class="mt-2">
        <Item
          v-for="{ task, project, area } in items"
          :key="task.id"
          size="sm"
          class="px-0"
        >
          <ItemMedia v-if="area">
            <AreaIcon :area="area" class="size-4" />
          </ItemMedia>
          <ItemContent class="min-w-0">
            <ItemTitle class="max-w-full truncate">{{ task.title }}</ItemTitle>
            <ItemDescription v-if="project">
              <NuxtLink :to="`/projects/${project.id}`">
                {{ project.name }}
              </NuxtLink>
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              v-if="today"
              variant="ghost"
              size="sm"
              @click="$emit('focus', task.id)"
            >
              <Play />
              Focar
            </Button>
            <Button
              variant="ghost"
              :size="today ? 'icon-sm' : 'sm'"
              :class="today && 'text-primary'"
              @click="setTaskToday(task.id, !today)"
            >
              <Sun :fill="today ? 'currentColor' : 'none'" />
              <span :class="today && 'sr-only'">
                {{ today ? `Tirar ${task.title} de hoje` : "Fazer hoje" }}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              class="text-muted-foreground"
              @click="setTaskDone(task.id, true)"
            >
              <Check />
              <span class="sr-only">Concluir {{ task.title }}</span>
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </CollapsibleContent>
  </Collapsible>
</template>
