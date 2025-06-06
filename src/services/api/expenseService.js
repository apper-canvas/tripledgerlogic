import expenseData from '../mockData/expense.json'

let expenses = [...expenseData]

// Default categories
// Default categories
let categories = [
  { id: 'transport', name: 'Transport', description: 'Flights, trains, buses, taxis, car rentals' },
  { id: 'accommodation', name: 'Accommodation', description: 'Hotels, hostels, vacation rentals' },
  { id: 'meals', name: 'Meals', description: 'Restaurants, cafes, food delivery, groceries' },
  { id: 'entertainment', name: 'Entertainment', description: 'Tours, activities, attractions, shows' },
  { id: 'shopping', name: 'Shopping', description: 'Souvenirs, clothes, personal items' },
  { id: 'other', name: 'Other', description: 'Miscellaneous expenses' }
]

// Default payment modes
let paymentModes = [
  { id: 'cash', name: 'Cash', description: 'Physical cash payments', icon: 'Banknote' },
  { id: 'credit-card', name: 'Credit Card', description: 'Credit card transactions', icon: 'CreditCard' },
  { id: 'debit-card', name: 'Debit Card', description: 'Debit card transactions', icon: 'CreditCard' },
  { id: 'bank-transfer', name: 'Bank Transfer', description: 'Direct bank transfers', icon: 'ArrowLeftRight' },
  { id: 'digital-wallet', name: 'Digital Wallet', description: 'PayPal, Apple Pay, Google Pay, etc.', icon: 'Smartphone' },
  { id: 'other', name: 'Other', description: 'Other payment methods', icon: 'MoreHorizontal' }
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
      id: Date.now().toString(),
      paymentMode: expenseData.paymentMode || 'cash'
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
  },

  // Payment mode management
  async getPaymentModes() {
    await delay(200)
    return [...paymentModes]
  },

  async createPaymentMode(paymentModeData) {
    await delay(300)
    const existingMode = paymentModes.find(mode => 
      mode.name.toLowerCase() === paymentModeData.name.toLowerCase()
    )
    if (existingMode) {
      throw new Error('Payment mode with this name already exists')
    }

    const newPaymentMode = {
      id: paymentModeData.name.toLowerCase().replace(/\s+/g, '-'),
      name: paymentModeData.name,
      description: paymentModeData.description || '',
      icon: paymentModeData.icon || 'MoreHorizontal'
    }
    paymentModes.push(newPaymentMode)
    return { ...newPaymentMode }
  },

  async updatePaymentMode(id, updates) {
    await delay(300)
    const index = paymentModes.findIndex(mode => mode.id === id)
    if (index === -1) throw new Error('Payment mode not found')
    
    paymentModes[index] = { ...paymentModes[index], ...updates }
    return { ...paymentModes[index] }
  },

  async deletePaymentMode(id) {
    await delay(250)
    // Prevent deletion of default payment modes
    const defaultModes = ['cash', 'credit-card', 'debit-card', 'bank-transfer', 'digital-wallet', 'other']
    if (defaultModes.includes(id)) {
      throw new Error('Cannot delete default payment mode')
    }

    const index = paymentModes.findIndex(mode => mode.id === id)
    if (index === -1) throw new Error('Payment mode not found')
    
    const deleted = paymentModes.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default expenseService