import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../../api/productAPI';
import { useCart } from '../../Contexts/CartContext';
import { useAuth } from '../../Contexts/AuthContext';
import { Button } from '../../uti/button';
import { Badge } from '../../uti/badge';
import { Card, CardContent } from '../../uti/card';
import { Skeleton } from '../../uti/skeleton';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Pill,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Package,
  Beaker,
  Info,
} from 'lucide-react';

// Local replacement for Separator
const Separator = () => (
  <div className="h-px w-full bg-border my-4" />
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const data = await productAPI.getProduct(parseInt(id));
        setProduct(data);
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user?.role !== 'customer') {
      toast.error('Only customers can purchase products');
      return;
    }

    if (product.category === 'Prescription') {
      toast.info('Please upload a prescription for this medication');
      navigate('/customer/prescriptions');
      return;
    }

    try {
      // Add multiple quantities
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast.success(`${quantity} x ${product.name} added to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  const inCart = product ? items.find(item => item.product.product_ID === product.product_ID) : null;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Product not found</h2>
        <Button onClick={() => navigate('/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  const isPrescription = product.category === 'Prescription';

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Breadcrumb */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <Badge 
              variant={isPrescription ? 'destructive' : 'secondary'}
              className="absolute left-4 top-4"
            >
              {isPrescription ? (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Prescription Required
                </span>
              ) : (
                'Over the Counter'
              )}
            </Badge>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {product.manufacturer}
              </p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.dosage && (
                <p className="text-lg text-muted-foreground">
                  {product.dosage}
                </p>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-muted-foreground">per unit</span>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Active Ingredients */}
            {product.active_ingredients && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Active Ingredients
                  </h3>
                  <p className="text-muted-foreground">
                    {product.active_ingredients}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-5 w-5 ${
                product.stock_quantity > 0 ? 'text-green-500' : 'text-red-500'
              }`} />
              <span>
                {product.stock_quantity > 0 
                  ? `In Stock (${product.stock_quantity} available)` 
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Add to Cart Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              {!isPrescription && product.stock_quantity > 0 && (
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                  >
                    +
                  </Button>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button 
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity === 0 ? (
                  'Out of Stock'
                ) : isPrescription ? (
                  <>
                    <Pill className="mr-2 h-5 w-5" />
                    Upload Prescription
                  </>
                ) : inCart ? (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    In Cart ({inCart.quantity})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            {/* Prescription Notice */}
            {isPrescription && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">
                      Prescription Required
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      This medication requires a valid prescription from a licensed healthcare provider. 
                      Please upload your prescription to purchase this item.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => navigate('/customer/prescriptions')}
                    >
                      Upload Prescription
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;