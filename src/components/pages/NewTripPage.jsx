import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '@/components/molecules/Header'
import TripForm from '@/components/organisms/TripForm'
import tripService from '@/services/api/tripService'

const NewTripPage = ({ darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleCreateTrip = async (tripData) => {
    setLoading(true)
    try {
      const newTrip = await tripService.create(tripData)
      toast.success('Trip created successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to create trip. Please try again.')
      console.error('Error creating trip:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-surface-900">
      <Header 
        trips={[]}
        selectedTrip={null}
        onSelectTrip={() => {}}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <TripForm
          onSubmit={handleCreateTrip}
          onCancel={() => navigate('/')}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default NewTripPage