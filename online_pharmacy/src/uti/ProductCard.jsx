import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Contexts/CartContext';
import { useAuth } from '../Contexts/AuthContext';
import { Card, CardContent, CardFooter } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { ShoppingCart, Pill, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { isAuthenticated, user } = useAuth();

  const isPrescription = product.category === 'Prescription';
  const inCart = items.find(item => item.product.product_ID === product.product_ID);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user?.role !== 'customer') {
      toast.error('Only customers can purchase products');
      return;
    }

    if (isPrescription) {
      toast.info('Please upload a prescription for this medication');
      navigate('/customer/prescriptions');
      return;
    }

    try {
      addToCart(product);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={() => navigate(`/products/${product.product_ID}`)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {/* Category Badge */}
        <Badge 
          variant={isPrescription ? 'destructive' : 'secondary'}
          className="absolute left-2 top-2"
        >
          {isPrescription ? (
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Rx Required
            </span>
          ) : (
            'OTC'
          )}
        </Badge>
        {/* Low Stock Badge */}
        {product.stock_quantity < 20 && (
          <Badge 
            variant="outline" 
            className="absolute right-2 top-2 bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Low Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Manufacturer */}
        <p className="text-xs text-muted-foreground mb-1">
          {product.manufacturer}
        </p>
        
        {/* Product Name */}
        <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        {/* Dosage */}
        {product.dosage && (
          <p className="text-xs text-muted-foreground mb-2">
            {product.dosage}
          </p>
        )}
        
        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          variant={inCart ? 'secondary' : 'default'}
        >
          {product.stock_quantity === 0 ? (
            'Out of Stock'
          ) : inCart ? (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              In Cart ({inCart.quantity})
            </>
          ) : isPrescription ? (
            <>
              <Pill className="mr-2 h-4 w-4" />
              Rx Required
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;