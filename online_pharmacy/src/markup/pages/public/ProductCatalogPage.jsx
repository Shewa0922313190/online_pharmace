import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
//import PropTypes from 'prop-types';
import { productAPI } from '../../../api/api';
import ProductCard from '../../../uti/ProductCard';
import SearchFilterBar from '../../../uti/SearchFilterBar';
import { Button } from '../../../uti/button';
import { Skeleton } from '../../../uti/skeleton';
import { toast } from 'sonner';
import { Package, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Parse initial filters from URL
  const getInitialFilters = useCallback(() => {
    return {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
    };
  }, [searchParams]);

  const loadProducts = useCallback(async (filters = {}) => {
    setIsLoading(true);
    try {
      const data = await productAPI.getProducts(filters);
      setProducts(data);
      setCurrentPage(1);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(getInitialFilters());
  }, [loadProducts, getInitialFilters]);

  const handleSearch = (filters) => {
    // Update URL params
    console.log(filters);
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    setSearchParams(params);
    
    loadProducts(filters);
  };

  // Pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
          <p className="text-muted-foreground">
            Browse our selection of prescription and over-the-counter medications
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <SearchFilterBar 
            onSearch={handleSearch}
            initialFilters={getInitialFilters()}
            showCategoryFilter={true}
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {isLoading ? 'Loading...' : `${products.length} products found`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => handleSearch({})}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            } gap-6`}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.product_ID} product={product} />
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCatalogPage;