import React from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import TripSelector from '@/components/molecules/TripSelector'

const Header = ({ trips, selectedTrip, onSelectTrip, darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate()
  const tripOptions = [{ value: '', label: 'Select Trip' }, ...trips.map(trip => ({ value: trip.id, label: trip.name }))]

  return (
    <header className="bg-white dark:bg-surface-800 shadow-soft border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Plane" className="h-8 w-8 text-primary" />
              <Text as="h1" className="text-2xl font-bold text-surface-900 dark:text-surface-50">TripLedger</Text>
            </div>

            <div className="hidden sm:block">
              <TripSelector
                value={selectedTrip?.id || ''}
                onChange={onSelectTrip}
                options={tripOptions}
              />
            </div>
</div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate('/trips/new')}
              variant="primary"
              iconName="Plus"
              iconSize={16}
              className="hidden sm:flex"
            >
              New Trip
            </Button>
            
            <Button
              onClick={() => navigate('/categories')}
              variant="outline"
              iconName="Settings"
              iconSize={16}
              className="hidden sm:flex"
            >
              Categories
            </Button>

            <Button
              onClick={onToggleDarkMode}
              variant="secondary"
              iconName={darkMode ? "Sun" : "Moon"}
              iconSize={20}
              className="p-2"
            >
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header