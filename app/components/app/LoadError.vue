<script lang="ts" setup>
defineProps<{ title: string; description: string }>();
defineEmits<{ (e: "retry"): void }>();
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyTitle>{{ title }}</EmptyTitle>
      <EmptyDescription>{{ description }}</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline" @click="$emit('retry')">Tentar de novo</Button>
    </EmptyContent>
  </Empty>
</template>
