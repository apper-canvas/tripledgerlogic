import exchangeRateData from '../mockData/exchangeRate.json'

let exchangeRates = [...exchangeRateData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const exchangeRateService = {
  async getAll() {
    await delay(200)
    return [...exchangeRates]
  },

  async getById(id) {
    await delay(150)
    const rate = exchangeRates.find(r => r.id === id)
    return rate ? { ...rate } : null
  },

  async create(rateData) {
    await delay(300)
    const newRate = {
      ...rateData,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    exchangeRates.push(newRate)
    return { ...newRate }
  },

  async update(id, updates) {
    await delay(250)
    const index = exchangeRates.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Exchange rate not found')
    
    exchangeRates[index] = { ...exchangeRates[index], ...updates }
    return { ...exchangeRates[index] }
  },

  async delete(id) {
    await delay(200)
    const index = exchangeRates.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Exchange rate not found')
    
    const deleted = exchangeRates.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default exchangeRateService