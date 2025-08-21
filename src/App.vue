<script setup>
import SkillsView from '@/views/SkillsView.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>

<template>
  <div class="max-w-6xl mx-auto px-2 py-4">
    <Tabs default-value="skills" class="w-full">
      <!-- 标签切换列表 -->
      <TabsList
        class="w-full max-w-md mx-auto flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg"
      >
        <TabsTrigger
          value="meridians"
          class="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm transition-all duration-200"
        >
          经脉
        </TabsTrigger>
        <TabsTrigger
          value="qi"
          class="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm transition-all duration-200"
        >
          真元
        </TabsTrigger>
        <TabsTrigger
          value="skills"
          class="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm transition-all duration-200"
        >
          武学
        </TabsTrigger>
      </TabsList>

      <!-- 标签内容区域 -->
      <TabsContent value="meridians" class="mt-4 px-1">
        <div
          class="min-h-[300px] flex items-center justify-center text-neutral-500 dark:text-neutral-400"
        >
          筋脉内容区域
        </div>
      </TabsContent>
      <TabsContent value="qi" class="mt-4 px-1">
        <div
          class="min-h-[300px] flex items-center justify-center text-neutral-500 dark:text-neutral-400"
        >
          真元内容区域
        </div>
      </TabsContent>
      <TabsContent value="skills" class="mt-4 px-1">
        <SkillsView />
      </TabsContent>
    </Tabs>
  </div>
</template>
