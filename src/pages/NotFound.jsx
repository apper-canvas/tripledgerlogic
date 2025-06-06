import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ApperIcon name="MapPin" className="h-24 w-24 text-surface-400 mx-auto mb-8" />
          <h1 className="text-6xl font-bold text-surface-900 dark:text-surface-50 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
            Trip Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
            Looks like you've wandered off the beaten path. This page doesn't exist in our travel logs.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound