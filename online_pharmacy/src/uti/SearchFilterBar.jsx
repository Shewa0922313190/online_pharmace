import React, { useState, useCallback } from 'react';
import { Input } from './Input';
import { Button } from './button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const SearchFilterBar = ({
  onSearch,
  initialFilters = {},
  showCategoryFilter = true,
  showPriceFilter = false,
}) => {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [category, setCategory] = useState(initialFilters.category || 'all');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(() => {
    const filters = {
      search: search || undefined,
      category: category === 'all' ? undefined : category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };
    onSearch(filters);
  }, [search, category, minPrice, maxPrice, onSearch]);

  const handleClear = () => {
    setSearch('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasActiveFilters = search || category !== 'all' || minPrice || maxPrice;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        {showCategoryFilter && (
          <Select value={category} onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="OTC">Over the Counter</SelectItem>
              <SelectItem value="Prescription">Prescription</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Filter Toggle */}
        {(showPriceFilter) && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-muted' : ''}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        )}

        {/* Search Button */}
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>

        {/* Clear Button */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Extended Filters */}
      {showFilters && showPriceFilter && (
        <div className="flex flex-col sm:flex-row gap-2 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Price Range:</span>
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;