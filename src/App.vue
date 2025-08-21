<script setup>
import { ref, computed, onMounted } from 'vue'
import SkillCard from '@/components/custom/SkillCard.vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 导入技能数据
import skillsData from '@/assets/data/skills.json'

// 状态管理
const allSkills = ref(skillsData)
const selectedCategory = ref('')

// 计算属性：根据选中的类别过滤技能
const filteredSkills = computed(() => {
  return allSkills.value.filter((skill) => skill.category === selectedCategory.value)
})

// 获取所有唯一的技能类别
const categories = computed(() => {
  const cats = new Set(allSkills.value.map((skill) => skill.category))
  return [...cats]
})

// 默认选择第一个类别：拳脚
onMounted(() => {
  if (categories.value.length > 0) {
    selectedCategory.value = categories.value[0]
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4 text-center">技能列表</h1>

    <!-- 类别筛选 -->
    <div class="flex justify-center mb-6">
      <Select v-model="selectedCategory">
        <SelectTrigger class="w-full max-w-xs">
          <SelectValue placeholder="选择技能类别" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- 技能卡片网格 -->
    <div class="grid grid-cols-3 gap-3">
      <SkillCard v-for="skill in filteredSkills" :key="skill.id" :skill="skill" />
    </div>
  </div>
</template>
