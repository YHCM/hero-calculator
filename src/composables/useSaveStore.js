import { useStorage } from '@vueuse/core'
import { computed, readonly } from 'vue'

// 生成初始存档 ID
const initialSaveId = Data.now().toString()

// 默认存档数据
const defaultSaveData = {
  id: initialSaveId,
  name: '默认存档',
  baseData: {
    effectiveComprehension: 10,
    effectiveConstitution: 10,
    innateSkillLevel: 0,
    bedLevel: 0,
    hasFrostyjade: false,
    hasMonthlyCard: false,
    titleLevel: 0,
    breakthroughTimeReductionLevel: 0,
    cultivationSpeedBoostLevel: 0,
    potentialCostReductionLevel: 0,
  },
  skillsData: [],
}

// 使用 useStorage 创建响应式状态
const currentSaveId = useStorage('save-current-id', initialSaveId)
const saves = useStorage('save-data', { [initialSaveId]: defaultSaveData })

// 计算当前存档数据
const currentSave = computed(() => saves.value[currentSaveId.value])

/**
 * 验证存档是否存在
 * @param {string} saveId - 存档 ID
 * @returns {boolean} 是否验证通过
 */
function validateSave(saveId) {
  // 验证存档是否存在
  if (!saveId.value[saveId]) {
    console.warn(`存档 ID ${saveId} 不存在`)
    return false
  }
  return true
}

/**
 * 验证存档名字是否合法
 * @param {string} name - 存档名字
 * @returns {boolean} 是否验证通过
 */
function validateName(name) {
  // 验证存档名字是否合法
  if (name !== undefined && !name.trim()) {
    console.warn('存档名称不能为空')
    return false
  }
  return true
}

/**
 * 检查存档名称是否已存在
 * @param {string} name - 要检查的名称
 * @param {string} excludeId - 要排除的存档 ID（用于重命名时）
 * @returns {boolean} 是否已存在
 */
function isNameExists(name, excludeId = '') {
  return Object.values(saves.value).some(
    (save) => save.id !== excludeId && save.name.trim() === name.trim(),
  )
}

/**
 * 创建新存档
 * @param {string} saveName - 存档名称（不能为空）
 * @returns {string|null} 新存档 ID，创建失败返回 null
 */
function createSave(saveName) {
  // 验证存档名是否合规
  if (!validateName(saveName)) {
    return null
  }

  // 检查存档名是否存在
  if (isNameExists(saveName)) {
    console.warn('该存档名已存在')
    return null
  }

  const saveId = Date.now().toString() // 时间戳当 ID
  // 初始化存档数据
  saves.value[saveId] = {
    id: saveId,
    name: saveName,
    baseData: {
      // 基本数据
      effectiveComprehension: 10,
      effectiveConstitution: 10,
      innateSkillLevel: 0,
      bedLevel: 0,
      hasFrostyjade: false,
      hasMonthlyCard: false,
      titleLevel: 0,
      breakthroughTimeReductionLevel: 0,
      cultivationSpeedBoostLevel: 0,
      potentialCostReductionLevel: 0,
    },
    skillsData: [], // 技能数据列表
  }
  currentSaveId.value = saveId // 设置为当前存档
  return saveId
}

/**
 * 切换存档
 * @param {string} saveId - 要切换的存档 ID
 * @returns {boolean} 是否切换成功
 */
function switchSave(saveId) {
  if (!validateSave(saveId)) {
    return false
  }

  // 存在就切换
  currentSaveId.value = saveId
  return true
}

/**
 * 删除存档
 * @param {string} saveId - 要删除的存档的 ID
 * @returns {boolean} 是否删除成功
 */
function deleteSave(saveId) {
  if (!validateSave(saveId)) {
    return false
  }

  // 获取存档数量
  const saveCount = Object.keys(saves.value).length

  // 如果存档只有一个，也不能删除
  if (saveCount === 1) {
    console.log('至少保留一个存档')
    return false
  }

  // 如果删除的是当前存档，删除后自动切换到下一个存档
  if (currentSaveId.value === saveId) {
    // 获取其他的存档 ID
    const remainingIds = Object.keys(saves.value).filter((id) => id !== saveId)
    currentSaveId.value = remainingIds[0]
  }

  // 删除这个存档
  delete saves.value[saveId]
  return true
}

/**
 * 更新整个存档（谨慎使用）
 * @param {string} saveId - 存档 ID
 * @param {object} data - 要更新的数据
 * @returns {boolean} 是否更新成功
 */
function updateSave(saveId, data) {
  if (!validateSave(saveId)) {
    return false
  }

  // 合并更新（避免覆盖未传入的字段）
  saves.value[saveId] = { ...saves.value[saveId], ...data }
  return true
}

/**
 * 更新基础数据
 * @param {string} saveId - 存档 ID
 * @param {object} baseData - 要更新的基础数据
 * @returns {boolean} 是否更新成功
 */
function updateBaseData(saveId, baseData) {
  if (!validateSave(saveId)) {
    return false
  }

  // 只更新基础数据
  saves.value[saveId].baseData = { ...saves.value[saveId].baseData, ...baseData }
  return true
}

/**
 * 更新技能数据
 * @param {string} saveId - 存档 ID
 * @param {array} skillsData - 完整的技能数据数组
 * @returns {boolean} 是否更新成功
 */
function updateSkillsData(saveId, skillsData) {
  if (!validateSave(saveId)) {
    return false
  }

  // 直接替换技能数据组
  saves.value[saveId].skillsData = [...skillsData]
  return true
}

/**
 * 更新单个技能数据
 * @param {string} saveId - 存档 ID
 * @param {object} skill - 单个的技能数据
 * @returns {boolean} 是否更新成功
 */
function updateSkill(saveId, skill) {
  if (!validateSave(saveId)) {
    return false
  }

  // 获取技能在当前技能数据列表的下标
  const skillIndex = saves.value[saveId].skillsData.findIndex((s) => s.id === skill.id)

  if (skillIndex > -1) {
    // 如果存在数据，则更新已有技能
    saves.value[saveId].skillsData[skillIndex] = {
      ...saves.value[saveId].skillsData[skillIndex],
      ...skill,
    }
  } else {
    // 否则，添加技能数据
    saves.value[saveId].skillsData.push(skill)
  }
  return true
}

/**
 * 删除单个技能数据
 * @param {string} saveId - 存档 ID
 * @param {number} skillId - 要删除的技能 ID
 * @returns {boolean} 是否删除成功
 */
function deleteSkill(saveId, skillId) {
  if (!validateSave(saveId)) {
    return false
  }

  // 找到技能在技能数组的索引
  const skillIndex = saves.value[saveId].skillsData.findIndex((s) => s.id === skillId)

  if (skillId > -1) {
    // 如果找到了技能，就把它删掉
    saves.value[saveId].skillsData.splice(skillIndex, 1)
    return true
  }

  // 如果没有找到，返回 false
  console.warn(`技能 ID ${skillId} 不存在于存档 ${saveId} 中`)
  return false
}

/**
 * 重命名存档
 * @param {string} saveId - 存档 ID
 * @param {string} newName - 新名字（不能为空）
 * @returns {boolean} 是否重命名成功
 */
function renameSave(saveId, newName) {
  if (!validateSave(saveId) || !validateName(newName)) {
    return false
  }

  // 检查存档名称是否已存在
  if (isNameExists(newName, saveId)) {
    console.warn('该名称已存在')
    return false
  }

  // 重命名
  saves.value[saveId].name = newName
  return true
}

// 导出所有状态和方法
export function useSaveStore() {
  return {
    // 状态（只读）
    currentSaveId: readonly(currentSaveId),
    saves: readonly(saves),
    currentSave: readonly(currentSave),

    // 方法
    validateSave,
    validateName,
    isNameExists,
    createSave,
    switchSave,
    deleteSave,
    updateSave,
    updateBaseData,
    updateSkillsData,
    updateSkill,
    deleteSkill,
    renameSave,
  }
}

/**
 * // 存档数据结构详细说明
 * {
 *   id: string,    // 存档 ID，唯一标识
 *   name: string,  // 存档名称
 *   baseData: {
 *     // 存档人物基本数据
 *     effectiveComprehension: number,  // 有效悟性
 *     effectiveConstitution: number,   // 有效根骨
 *     innateSkillLevel: number,        // 先天功等级
 *     bedLevel: number,                // 床的等级
 *     hasFrostyjade: boolean,          // 是否有寒玉
 *     hasMonthlyCard: boolean,         // 是否有月卡
 *     titleLevel: number,              // 称号等级，[0, 3]
 *     breakthroughTimeReductionLevel: number,  // 突破时间减少等级
 *     cultivationSpeedBoostLevel: number,      // 修炼速度增加等级
 *     potentialCostReductionLevel: number,     // 潜能消耗减少等级
 *   },
 *   skillsData: [  // 技能数据列表
 *     {
 *       id: number,    // 武学 ID
 *       currentLevel: number,    // 当前武学等级
 *       targetedLevel: number,   // 目标等级
 *       insightLevel: number,  // 领悟等级
 *     },
 *   ]
 * }
 */
