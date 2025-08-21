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
import { ref, computed } from 'vue'

// 太极拳数据
const martialArt = {
  id: 10001,
  name: '太极拳',
  category: '拳脚',
  conflict: [],
  insight: [
    { level: 0, difficulty: 1.2, cost: 0 },
    { level: 1, difficulty: 1.3, cost: 20 },
    { level: 2, difficulty: 1.5, cost: 500 },
    { level: 3, difficulty: 1.8, cost: 2480 },
  ],
}

// 等级映射
const levelMap = {
  0: '基础',
  1: '普通',
  2: '进阶',
  3: '精通',
}

// 状态管理
const isDialogOpen = ref(false)
const isLearned = ref(false)
const currentLevel = ref(null)
const selectedLevel = ref(0)

// 计算属性：获取当前选中等级的信息
const selectedLevelInfo = computed(() => {
  return martialArt.insight.find((item) => item.level === selectedLevel.value)
})

// 打开对话框
const openDialog = () => {
  if (isLearned.value && currentLevel.value !== null) {
    selectedLevel.value = currentLevel.value
  } else {
    selectedLevel.value = 0
  }
  isDialogOpen.value = true
}

// 学习或更新等级
const learnMartialArt = () => {
  isLearned.value = true
  currentLevel.value = selectedLevel.value
  isDialogOpen.value = false
}

// 取消学习（删除已学习状态）
const unlearnMartialArt = () => {
  isLearned.value = false
  currentLevel.value = null
  isDialogOpen.value = false
}

// 获取当前等级信息
const getLevelInfo = (level) => {
  return martialArt.insight.find((item) => item.level === level)
}

// 获取当前等级名称
const getCurrentLevelName = () => {
  if (!isLearned.value || currentLevel.value === null) return ''
  return levelMap[currentLevel.value]
}
</script>

<template>
  <div class="flex justify-center">
    <Card
      @click="openDialog"
      class="w-48 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105"
    >
      <CardHeader>
        <CardTitle class="text-center">{{ martialArt.name }}</CardTitle>
      </CardHeader>
      <CardContent class="flex justify-center">
        <Badge :variant="isLearned ? 'success' : 'destructive'" class="text-sm">
          {{ isLearned ? '已学会' : '未学会' }}
        </Badge>
      </CardContent>
    </Card>
  </div>

  <!-- 学习等级选择对话框 -->
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ martialArt.name }}</DialogTitle>
        <DialogDescription>
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
              v-for="levelInfo in martialArt.insight"
              :key="levelInfo.level"
              :value="levelInfo.level"
            >
              <div class="font-medium">{{ levelMap[levelInfo.level] }}</div>
              <div class="text-sm text-muted-foreground">
                花费: {{ levelInfo.cost }} | 难度: {{ levelInfo.difficulty }}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter class="mt-4 flex flex-row gap-2 w-full">
        <!-- 仅当已学习时显示取消学习按钮 -->
        <Button v-if="isLearned" variant="destructive" @click="unlearnMartialArt" class="flex-1">
          删除
        </Button>
        <Button @click="learnMartialArt" class="flex-1">
          {{ isLearned ? '更新' : '学习' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
