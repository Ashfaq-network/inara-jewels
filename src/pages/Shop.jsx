import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@components/product/ProductCard'
import { supabase } from '@lib/supabase'

const categories = [
  { id: 'all', name: 'All' },
  { id: 'rings', name: 'Rings' },
  { id: 'necklaces', name: 'Necklaces' },
  { id: 'bracelets', name: 'Bracelets' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'anklets', name: 'Anklets' },
  { id: 'couple', name: 'Couple Collection' },
  { id: 'gifts', name: 'Gift Collection' },
]

const priceRanges = [
  { id: 'all', name: 'All Prices', min: null, max: null },
  { id: 'under-3000', name: 'Under Rs. 3,000', min: null, max: 3000 },
  { id: '3000-5000', name: 'Rs. 3,000 - 5,000', min: 3000, max: 5000 },
  { id: '5000-10000', name: 'Rs. 5,000 - 10,000', min: 5000, max: 10000 },
  { id: 'over-10000', name: 'Over Rs. 10,000', min: 10000, max: null },
]

const sortOptions = [
  { id: 'newest', name: 'Newest First' },
  { id: 'price-asc', name: 'Price: Low to High' },
  { id: 'price-desc', name: 'Price: High to Low' },
  { id: 'popular', name: 'Most Popular' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const currentCategory = searchParams.get('category') || 'all'
  const currentSort = searchParams.get('sort') || 'newest'
  const currentPriceRange = searchParams.get('price') || 'all'

  useEffect(() => { fetchProducts() }, [currentCategory, currentSort, currentPriceRange])

  const fetchProducts = async () => {
    setIsLoading(true)
    let query = supabase.from('products').select('*')
    
    if (currentCategory !== 'all') {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', currentCategory).single()
      if (cat) query = query.eq('category_id', cat.id)
    }
    
    const priceRange = priceRanges.find(p => p.id === currentPriceRange)
    if (priceRange && priceRange.id !== 'all') {
      if (priceRange.min !== null) query = query.gte('price', priceRange.min)
      if (priceRange.max !== null) query = query.lte('price', priceRange.max)
    }
    switch (currentSort) {
      case 'price-asc': query = query.order('price', { ascending: true }); break
      case 'price-desc': query = query.order('price', { ascending: false }); break
      case 'popular': query = query.order('review_count', { ascending: false }); break
      default: query = query.order('created_at', { ascending: false })
    }
    const { data } = await query
    setProducts(data || [])
    setIsLoading(false)
  }

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all' || value === 'newest') params.delete(key)
    else params.set(key, value)
    setSearchParams(params)
  }

  const clearFilters = () => setSearchParams({})

  const hasActiveFilters = currentCategory !== 'all' || currentPriceRange !== 'all'

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="py-16" style={{ backgroundColor: '#AA9092' }}>
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-center text-white">
            Shop <span className="text-gradient">Collection</span>
          </h1>
          <div className="divider-gold mt-4" />
          <p className="mt-6 text-gray-400 text-center max-w-2xl mx-auto">
            Discover our exquisite range of premium stainless steel jewelry
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => updateFilter('category', category.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-none text-sm transition-all ${
                        currentCategory === category.id
                          ? 'bg-gold-50 text-gold-700 font-medium border border-gold-200'
                          : 'text-gray-500 hover:bg-gold-50 hover:text-gold-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Price Range</h3>
                <div className="space-y-1">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => updateFilter('price', range.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-none text-sm transition-all ${
                        currentPriceRange === range.id
                          ? 'bg-gold-50 text-gold-700 font-medium border border-gold-200'
                          : 'text-gray-500 hover:bg-gold-50 hover:text-gold-700'
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden btn-ghost flex items-center gap-2 rounded-none border border-gray-200"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && <span className="w-2 h-2 bg-gold-500 rounded-full" />}
                </button>
                <p className="text-sm text-gray-400">
                  <span className="text-gray-900 font-medium">{products.length}</span> products
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={currentSort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-none px-4 py-2.5 pr-10 text-gray-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-none p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-none transition-colors ${viewMode === 'grid' ? 'bg-gold-50 text-gold-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-none transition-colors ${viewMode === 'list' ? 'bg-gold-50 text-gold-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {currentCategory !== 'all' && (
                  <span className="badge-rose flex items-center gap-1">
                    {categories.find(c => c.id === currentCategory)?.name}
                    <button onClick={() => updateFilter('category', 'all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {currentPriceRange !== 'all' && (
                  <span className="badge-rose flex items-center gap-1">
                    {priceRanges.find(p => p.id === currentPriceRange)?.name}
                    <button onClick={() => updateFilter('price', 'all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-gold-600 transition-colors">
                  Clear all
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card-luxury animate-pulse">
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded-none w-3/4" />
                      <div className="h-4 bg-gray-100 rounded-none w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No products found</p>
                <button onClick={clearFilters} className="btn-ghost mt-4 text-gold-600">Clear filters</button>
              </div>
            ) : (
              /* Product Grid */
              <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gold-50 rounded-none transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => { updateFilter('category', category.id); setIsFilterOpen(false) }}
                        className={`w-full text-left px-4 py-3 rounded-none text-sm transition-all ${
                          currentCategory === category.id
                            ? 'bg-gold-50 text-gold-700 font-medium border border-gold-200'
                            : 'text-gray-500 hover:bg-gold-50'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price Range */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Price Range</h3>
                  <div className="space-y-1">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => { updateFilter('price', range.id); setIsFilterOpen(false) }}
                        className={`w-full text-left px-4 py-3 rounded-none text-sm transition-all ${
                          currentPriceRange === range.id
                            ? 'bg-gold-50 text-gold-700 font-medium border border-gold-200'
                            : 'text-gray-500 hover:bg-gold-50'
                        }`}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
