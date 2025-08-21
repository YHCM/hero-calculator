<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ref, computed, watchEffect } from 'vue'
import { useSaveStore } from '@/composables/useSaveStore.js'

// 存档
const saveStore = useSaveStore()

// 接收父组件传入的技能数据
const props = defineProps({
  skill: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      name: '',
      category: '',
      conflict: [],
      insight: [],
    }),
  },
})

// 等级映射
const levelMap = {
  0: '基础',
  1: '普通',
  2: '进阶',
  3: '精通',
}

// 状态管理
const isDialogOpen = ref(false)
const selectedLevel = ref(0)

// 从存档中获取当前的技能数据
const currentSkillData = computed(() => {
  return saveStore.currentSave.value?.skillsData?.find((s) => s.id === props.skill.id)
})

// 是否已学习
const isLearned = computed(() => {
  return !!currentSkillData.value // 2 次 !! 转成 boolean
})

// 当前领悟等级
const currentLevel = computed(() => {
  return currentSkillData.value?.insightLevel ?? null
})

// 计算属性：获取当前选中等级的信息
const selectedLevelInfo = computed(() => {
  return props.skill.insight.find((item) => item.level === selectedLevel.value)
})

// 当技能数据变化时，更新选择等级
watchEffect(() => {
  if (isLearned.value && currentLevel.value !== null) {
    selectedLevel.value = currentLevel.value
  } else {
    selectedLevel.value = 0
  }
})

// 打开对话框
const openDialog = () => {
  isDialogOpen.value = true
}

// 学习或更新等级
const learnSkill = () => {
  const skillData = {
    id: props.skill.id,
    insightLevel: selectedLevel.value,
  }

  // 先关弹窗
  isDialogOpen.value = false

  // 更新存档中的数据，延迟，确保弹窗已经关闭了
  setTimeout(() => {
    saveStore.updateSkill(saveStore.currentSaveId.value, skillData)
  }, 100)
}

// 取消学习（删除已学习状态），延迟，确保弹窗已经关闭了
const unlearnSkill = () => {
  // 先关弹窗
  isDialogOpen.value = false

  setTimeout(() => {
    saveStore.deleteSkill(saveStore.currentSaveId.value, props.skill.id)
  }, 100)
}

// 获取当前等级信息
const getLevelInfo = (level) => {
  return props.skill.insight.find((item) => item.level === level)
}

// 获取当前等级名称
const getCurrentLevelName = () => {
  if (!isLearned.value || currentLevel.value === null) return ''
  return levelMap[currentLevel.value]
}
</script>

<template>
  <Card
    @click="openDialog"
    class="w-full cursor-pointer hover:shadow-md transition-all duration-300 active:scale-95"
  >
    <CardHeader class="p-3">
      <CardTitle class="text-center text-xs truncate">{{ skill.name }}</CardTitle>
    </CardHeader>
    <CardContent class="flex justify-center p-3 pt-0">
      <Badge :variant="isLearned ? 'success' : 'destructive'" class="text-xs">
        {{ isLearned ? '已学会' : '未学会' }}
      </Badge>
    </CardContent>
  </Card>

  <!-- 学习等级选择对话框 -->
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="max-w-[95vw] rounded-lg sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg">{{ skill.name }}</DialogTitle>
        <DialogDescription class="text-sm">
          <template v-if="isLearned && currentLevel !== null">
            状态: {{ levelMap[currentLevel] }}，难度: {{ getLevelInfo(currentLevel)?.difficulty }}
          </template>
          <template v-else> 状态：未学会 </template>
        </DialogDescription>
      </DialogHeader>

      <div class="mt-4">
        <Select v-model="selectedLevel">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="选择学习等级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="levelInfo in skill.insight"
              :key="levelInfo.level"
              :value="levelInfo.level"
              class="text-sm"
            >
              <div class="font-medium">{{ levelMap[levelInfo.level] }}</div>
              <div class="text-xs text-muted-foreground">
                残章: {{ levelInfo.cost }} | 难度: {{ levelInfo.difficulty }}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter class="mt-4 flex flex-row gap-2 w-full">
        <!-- 仅当已学习时显示取消学习按钮 -->
        <Button
          v-if="isLearned"
          variant="destructive"
          @click="unlearnSkill"
          class="flex-1 text-sm py-2"
        >
          删除
        </Button>
        <Button @click="learnSkill" class="flex-1 text-sm py-2">
          {{ isLearned ? '更新' : '学习' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
