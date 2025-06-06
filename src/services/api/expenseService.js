import expenseData from '../mockData/expense.json'

let expenses = [...expenseData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const expenseService = {
  async getAll() {
    await delay(250)
    return [...expenses]
  },

  async getById(id) {
    await delay(200)
    const expense = expenses.find(e => e.id === id)
    return expense ? { ...expense } : null
  },

  async create(expenseData) {
    await delay(400)
    const newExpense = {
      ...expenseData,
      id: Date.now().toString()
    }
    expenses.push(newExpense)
    return { ...newExpense }
  },

  async update(id, updates) {
    await delay(350)
    const index = expenses.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Expense not found')
    
    expenses[index] = { ...expenses[index], ...updates }
    return { ...expenses[index] }
  },

  async delete(id) {
    await delay(250)
    const index = expenses.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Expense not found')
    
    const deleted = expenses.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default expenseService