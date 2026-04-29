'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getProducts, ProductWithCategory } from '@/actions/products'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

const SearchBar = () => {
  const [search, setSearch] = useState<string>("")
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const debounceTimer = useRef<NodeJS.Timeout>(null)

  // Debounced search function
  const fetchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const result = await getProducts({
        search: query,
        pageSize: 12,
      })
      setProducts(result.products)
    } catch (error) {
      console.error('Search error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle search input with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (!search.trim()) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceTimer.current = setTimeout(() => {
      fetchProducts(search)
    }, 300)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [search, fetchProducts])

  const handleClear = () => {
    setSearch("")
    setProducts([])
  }

  return (
    <Dialog open={showSearch} onOpenChange={setShowSearch}>
      <DialogTrigger
        render={
          <button className="cursor-pointer relative p-2 hover:bg-[#BFA47A]/10 rounded-full transition-colors">
            <Search className='w-5 h-5 text-muted-foreground hover:text-primary' />
          </button>
        }
      />

      <DialogContent className='w-full md:min-w-4xl h-[85vh] flex flex-col overflow-hidden rounded-xl p-0'>
        <DialogHeader className='px-6 pt-4 pb-4 border-b'>
          <DialogTitle className='text-2xl'>Search Products</DialogTitle>
          <p className='text-sm text-muted-foreground'>Find your perfect item by name or description</p>
        </DialogHeader>

        {/* Search Input */}
        <div className='px-6 pt-0 pb-2'>
          <div className='relative flex items-center'>
            <Input
              placeholder='Search for products...'
              className='pr-10 py-3 text-base rounded-lg border border-input'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                onClick={handleClear}
                className='absolute right-3 p-1 hover:bg-muted rounded-md transition-colors'
              >
                <X className='w-5 h-5 text-muted-foreground hover:text-foreground' />
              </button>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className='flex-1 overflow-auto px-6 pb-6'>
          {!search.trim() ? (
            <div className='cursor-pointer flex flex-col items-center justify-center h-full text-center py-12'>
              <Search className=' w-12 h-12 text-muted-foreground/30 mb-4' />
              <p className='text-muted-foreground'>Start typing to search products</p>
            </div>
          ) : loading ? (
            // Loading Skeleton UI
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='space-y-3'>
                  <Skeleton className='aspect-square rounded-lg' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-6 w-1/2' />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            // Results Grid
            <div>
              <p className='text-sm text-muted-foreground mb-4 font-medium'>
                Found {products.length} product{products.length !== 1 ? 's' : ''} for "{search}"
              </p>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.category.slug}/${product.slug}`}
                    onClick={() => setShowSearch(false)}
                    className='group'
                  >
                    <div className='space-y-2 cursor-pointer'>
                      {/* Product Image */}
                      <div className='relative aspect-square bg-muted rounded-lg overflow-hidden'>
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className='object-cover group-hover:scale-105 transition-transform duration-200'
                          />
                        ) : (
                          <div className='cursor-pointer w-full h-full bg-muted flex items-center justify-center'>
                            <Search className='w-8 h-8 text-muted-foreground' />
                          </div>
                        )}
                        {product.status !== 'NORMAL' && (
                          <div className='absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded'>
                            {product.status}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className='space-y-1'>
                        <h3 className='font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors'>
                          {product.name}
                        </h3>
                        <p className='text-xs text-muted-foreground'>
                          {product.category.name}
                        </p>
                        <div className='flex items-baseline gap-2'>
                          <span className='font-semibold text-sm'>
                            ${product.discountPrice ? product.discountPrice : product.price}
                          </span>
                          {product.discountPrice && (
                            <span className='text-xs line-through text-muted-foreground'>
                              ${product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // No Results
            <div className='cursor-pointer flex flex-col items-center justify-center h-full text-center py-12'>
              <Search className='w-12 h-12 text-muted-foreground/30 mb-4' />
              <p className='text-muted-foreground'>No products found for "{search}"</p>
              <p className='text-xs text-muted-foreground/70 mt-1'>Try different keywords</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SearchBar

