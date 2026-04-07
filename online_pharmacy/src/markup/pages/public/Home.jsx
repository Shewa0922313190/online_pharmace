import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../../api/api';
import ProductCard from '../../../uti/ProductCard';
import { Button } from '../../../uti/button';
import { Input } from '../../../uti/Input';
import { Badge } from '../../../uti/badge';
import { 
  Search, 
  Shield, 
  Truck, 
  Clock, 
  Pill, 
  FileText, 
  CreditCard,
  ChevronRight,
  Star,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productAPI.getProducts();
        // Get first 4 products as featured
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Licensed Pharmacy',
      description: 'All medications sourced from certified manufacturers',
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $35',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer service',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Easy Prescriptions',
      description: 'Upload and verify prescriptions online',
    },
  ];

  const categories = [
    { name: 'Over the Counter', count: 150, icon: <Pill className="h-5 w-5" />, category: 'OTC' },
    { name: 'Prescription', count: 80, icon: <FileText className="h-5 w-5" />, category: 'Prescription' },
    { name: 'Vitamins', count: 45, icon: <Star className="h-5 w-5" />, category: 'OTC' },
    { name: 'Personal Care', count: 120, icon: <Users className="h-5 w-5" />, category: 'OTC' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm">
                Trusted by 50,000+ customers
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Your Health,{' '}
                <span className="text-primary">Delivered</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Order prescription and over-the-counter medications online. 
                Fast, secure, and delivered to your doorstep.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search medications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button type="submit" size="lg">
                  Search
                </Button>
              </form>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  HIPAA Compliant
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Secure Payment
                </span>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop"
                  alt="Pharmacy"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-lg font-semibold">Licensed Pharmacists</p>
                  <p className="text-sm opacity-90">Available for consultation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-background rounded-xl shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <Button variant="ghost" onClick={() => navigate('/products')}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => navigate(`/products?category=${category.category}`)}
                className="flex items-center gap-4 p-6 bg-muted rounded-xl hover:bg-muted/80 transition-colors text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} products
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">
                Popular medications and health products
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/products')}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.product_ID} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">
              Getting your medications is simple and convenient
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Browse', desc: 'Search our catalog of medications' },
              { step: '2', title: 'Upload Rx', desc: 'Submit prescription if required' },
              { step: '3', title: 'Checkout', desc: 'Secure payment with Stripe' },
              { step: '4', title: 'Delivery', desc: 'Fast shipping to your door' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            Create an account today and experience the convenience of online pharmacy services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;