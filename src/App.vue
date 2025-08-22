<script setup>
import SkillsView from '@/views/SkillsView.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
</script>

<template>
  <div class="max-w-6xl mx-auto px-2 py-2 h-screen">
    <Tabs default-value="skills" class="w-full h-full flex flex-col">
      <ScrollArea class="flex-1 overflow-auto mb-4">
        <!-- 标签内容区域 -->
        <div class="mt-2 mb-2 px-1 flex-1">
          <TabsContent value="meridians">
            <div
              class="min-h-[300px] flex items-center justify-center text-neutral-500 dark:text-neutral-400"
            >
              筋脉内容区域
            </div>
          </TabsContent>
          <TabsContent value="qi">
            <div
              class="min-h-[300px] flex items-center justify-center text-neutral-500 dark:text-neutral-400"
            >
              真元内容区域
            </div>
          </TabsContent>
          <TabsContent value="skills">
            <SkillsView />
          </TabsContent>
        </div>
      </ScrollArea>

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
    </Tabs>
  </div>
</template>
