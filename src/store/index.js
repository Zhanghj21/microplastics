import { createStore } from 'vuex'

export default createStore({
  state: {
    waterData: {
      purified: '',
      untreated: '',
      treated: '',
      microplastics: {
        purified: 0,
        untreated: 0,
        treated: 0
      }
    },
    foodData: {
      milk: '',
      takeaway: '',
      honey: '',
      sugar: '',
      salt: '',
      rice: '',
      instantRice: '',
      microplastics: {
        milk: 0,
        takeaway: 0,
        honey: 0,
        sugar: 0,
        salt: 0,
        rice: 0,
        instantRice: 0
      }
    },
    airData: {
      weight: '',
      areaType: '',
      microplastics: 0
    },
    dailyItemsData: {
      teaBags: '',
      plasticUtensils: '',
      clothing: '',
      microplastics: {
        teaBags: 0,
        plasticUtensils: 0,
        clothing: 0
      }
    },
    clothingData: {
      cotton: '',
      carpetArea: '',
      microplastics: {
        cotton: 0,
        carpetArea: 0
      }
    },
    dietData: {
      seafood: '',
      beer: '',
      microplastics: {
        seafood: 0,
        beer: 0
      }
    }
  },
  mutations: {
    updateWaterData(state, data) {
      state.waterData = { ...state.waterData, ...data }
    },
    updateFoodData(state, data) {
      state.foodData = { ...state.foodData, ...data }
    },
    updateAirData(state, data) {
      state.airData = { ...state.airData, ...data }
    },
    updateDailyItemsData(state, data) {
      state.dailyItemsData = { ...state.dailyItemsData, ...data }
    },
    updateClothingData(state, data) {
      state.clothingData = { ...state.clothingData, ...data }
    },
    updateDietData(state, data) {
      state.dietData = { ...state.dietData, ...data }
    },
    resetAllData(state) {
      state.waterData = {
        purified: '',
        untreated: '',
        treated: '',
        microplastics: {
          purified: 0,
          untreated: 0,
          treated: 0
        }
      }
      state.foodData = {
        milk: '',
        takeaway: '',
        honey: '',
        sugar: '',
        salt: '',
        rice: '',
        instantRice: '',
        microplastics: {
          milk: 0,
          takeaway: 0,
          honey: 0,
          sugar: 0,
          salt: 0,
          rice: 0,
          instantRice: 0
        }
      }
      state.airData = {
        weight: '',
        areaType: '',
        microplastics: 0
      }
      state.dailyItemsData = {
        teaBags: '',
        plasticUtensils: '',
        clothing: '',
        microplastics: {
          teaBags: 0,
          plasticUtensils: 0,
          clothing: 0
        }
      }
      state.clothingData = {
        cotton: '',
        carpetArea: '',
        microplastics: {
          cotton: 0,
          carpetArea: 0
        }
      }
      state.dietData = {
        seafood: '',
        beer: '',
        microplastics: {
          seafood: 0,
          beer: 0
        }
      }
    }
  },
  getters: {
    totalPlastics: (state) => {
      return {
        water: calculateWaterPlastics(state.waterData),
        food: calculateFoodPlastics(state.foodData),
        air: calculateAirPlastics(state.airData),
        dailyItems: calculateDailyItemsPlastics(state.dailyItemsData),
        clothing: calculateClothingPlastics(state.clothingData),
        diet: calculateDietPlastics(state.dietData),
        total: calculateTotalPlastics(state)
      }
    }
  }
})

// 辅助计算函数
export const rates = {
  water: {
    purified: 0.22,    // 每100毫升含0.22个微塑料
    untreated: 330,    // 每100毫升含330个微塑料
    treated: 46        // 每100毫升含46个微塑料
  },
  food: {
    milk: 40,          // 每升含40个微塑料
    takeaway: 68000,   // 每升含68000个微塑料
    honey: 166,        // 每千克含166个微塑料
    sugar: 217,        // 每千克含217个微塑料
    salt: 615.5,       // 每千克含615.5个微塑料
    rice: 712,         // 每100克含712个微塑料
    instantRice: 2560  // 每100克含2560个微塑料
  },
  air: {
    city: 850,         // 城市区域每升含850个微塑料
    suburb: 400,       // 郊区每升含400个微塑料
    coastal: 550       // 沿海地区每升含550个微塑料
  },
  dailyItems: {
    teaBags: 2000,
    plasticUtensils: 125
  },
  clothing: {
    cotton: 400,       // 每件棉质衣物每天释放400个微塑料
    carpetArea: 12.5   // 每平方米地毯每天释放12.5个微塑料
  },
  diet: {
    seafood: 0.8,      // 每克海鲜含0.8个微塑料
    beer: 21           // 每升啤酒含21个微塑料
  }
}

function calculateWaterPlastics(waterData) {
  const { purified, untreated, treated } = waterData
  return Math.round(
    (parseFloat(purified || 0) * rates.water.purified / 100) +
    (parseFloat(untreated || 0) * rates.water.untreated / 100) +
    (parseFloat(treated || 0) * rates.water.treated / 100)
  )
}

function calculateFoodPlastics(foodData) {
  return Math.round(
    // 牛奶/软饮料（毫升转升）
    (parseFloat(foodData.milk || 0) / 1000) * rates.food.milk +
    // 外卖容器内食物（已经是升）
    parseFloat(foodData.takeaway || 0) * rates.food.takeaway +
    // 蜂蜜（克转千克）
    (parseFloat(foodData.honey || 0) / 1000) * rates.food.honey +
    // 糖（克转千克）
    (parseFloat(foodData.sugar || 0) / 1000) * rates.food.sugar +
    // 食盐（克转千克）
    (parseFloat(foodData.salt || 0) / 1000) * rates.food.salt +
    // 生米（克/100克）
    (parseFloat(foodData.rice || 0) / 100) * rates.food.rice +
    // 速熟米（克/100克）
    (parseFloat(foodData.instantRice || 0) / 100) * rates.food.instantRice
  )
}

function calculateAirPlastics(airData) {
  const weight = parseFloat(airData.weight || 0)
  const areaType = airData.areaType || 'city'
  const breathingVolume = weight * 12.5  // 每千克体重每天呼吸12.5升
  return Math.round(breathingVolume * rates.air[areaType])
}

function calculateClothingPlastics(clothingData) {
  // 将衣物和地毯的微塑料释放量转换为日均
  const dailyCotton = (parseFloat(clothingData.cotton || 0) * rates.clothing.cotton) / 31;
  const dailyCarpet = (parseFloat(clothingData.carpetArea || 0) * rates.clothing.carpetArea) / 31;
  
  return Math.round(dailyCotton + dailyCarpet);
}

function calculateDietPlastics(dietData) {
  // 将月摄入量转换为日均摄入量
  const dailySeafood = (parseFloat(dietData.seafood || 0) / 31) * rates.diet.seafood;
  const dailyBeer = (parseFloat(dietData.beer || 0) / 31) * rates.diet.beer;
  
  return Math.round(dailySeafood + dailyBeer);
}

function calculateDailyItemsPlastics(dailyItemsData) {
  return Math.round(
    (parseFloat(dailyItemsData.teaBags || 0) * 2000) +  // 每杯茶包释放2000个微塑料
    (parseFloat(dailyItemsData.plasticUtensils || 0) * 125)  // 每次塑料餐具释放125个微塑料
  )
}

function calculateTotalPlastics(state) {
  return calculateWaterPlastics(state.waterData) +
         calculateFoodPlastics(state.foodData) +
         calculateAirPlastics(state.airData) +
         calculateDailyItemsPlastics(state.dailyItemsData) +
         calculateClothingPlastics(state.clothingData) +
         calculateDietPlastics(state.dietData)
} 