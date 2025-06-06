import expenseData from '../mockData/expense.json'

let expenses = [...expenseData]

// Default categories
let categories = [
  { id: 'transport', name: 'Transport', description: 'Flights, trains, buses, taxis, car rentals' },
  { id: 'accommodation', name: 'Accommodation', description: 'Hotels, hostels, vacation rentals' },
  { id: 'meals', name: 'Meals', description: 'Restaurants, cafes, food delivery, groceries' },
  { id: 'entertainment', name: 'Entertainment', description: 'Tours, activities, attractions, shows' },
  { id: 'shopping', name: 'Shopping', description: 'Souvenirs, clothes, personal items' },
  { id: 'other', name: 'Other', description: 'Miscellaneous expenses' }
]

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
  },

  // Category management
  async getCategories() {
    await delay(200)
    return [...categories]
  },

  async createCategory(categoryData) {
    await delay(300)
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === categoryData.name.toLowerCase()
    )
    if (existingCategory) {
      throw new Error('Category with this name already exists')
    }

    const newCategory = {
      id: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      name: categoryData.name,
      description: categoryData.description || ''
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async updateCategory(id, updates) {
    await delay(300)
    const index = categories.findIndex(cat => cat.id === id)
    if (index === -1) throw new Error('Category not found')
    
    categories[index] = { ...categories[index], ...updates }
    return { ...categories[index] }
  },

  async deleteCategory(id) {
    await delay(250)
    // Prevent deletion of default categories
    const defaultCategories = ['transport', 'accommodation', 'meals', 'entertainment', 'shopping', 'other']
    if (defaultCategories.includes(id)) {
      throw new Error('Cannot delete default category')
    }

    const index = categories.findIndex(cat => cat.id === id)
    if (index === -1) throw new Error('Category not found')
    
    const deleted = categories.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default expenseService