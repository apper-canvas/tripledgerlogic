import tripData from '../mockData/trip.json'

let trips = [...tripData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const tripService = {
  async getAll() {
    await delay(300)
    return [...trips]
  },

  async getById(id) {
    await delay(200)
    const trip = trips.find(t => t.id === id)
    return trip ? { ...trip } : null
  },

  async create(tripData) {
    await delay(400)
    const newTrip = {
      ...tripData,
      id: Date.now().toString(),
      status: 'active'
    }
    trips.push(newTrip)
    return { ...newTrip }
  },

  async update(id, updates) {
    await delay(350)
    const index = trips.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    trips[index] = { ...trips[index], ...updates }
    return { ...trips[index] }
  },

  async delete(id) {
    await delay(250)
    const index = trips.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    const deleted = trips.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default tripService