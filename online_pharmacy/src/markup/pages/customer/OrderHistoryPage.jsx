import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext';
import { orderAPI } from '../../../api/api';
import { Card, CardContent } from '../../../uti/card';
import { Button } from '../../../uti/button';
import { toast } from 'sonner';
import { Package, ChevronRight, Calendar, DollarSign, Search } from 'lucide-react';
import { Input } from '../../../uti/input';

// Local Status Badge Components
const OrderStatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Processing: 'bg-blue-100 text-blue-800 border-blue-300',
    Shipped: 'bg-purple-100 text-purple-800 border-purple-300',
    Delivered: 'bg-green-100 text-green-800 border-green-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
    Dispensed: 'bg-teal-100 text-teal-800 border-teal-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      {status}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Paid: 'bg-green-100 text-green-800 border-green-300',
    Failed: 'bg-red-100 text-red-800 border-red-300',
    Refunded: 'bg-orange-100 text-orange-800 border-orange-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      {status}
    </span>
  );
};

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      try {
        const data = await orderAPI.getUserOrders(user.user_ID);
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = orders.filter(order => 
        order.order_ID.toString().includes(searchQuery) ||
        order.order_status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchQuery, orders]);

  const getStatusProgress = (status) => {
    const statuses = ['Pending', 'Processing', 'Dispensed', 'Shipped', 'Delivered'];
    return statuses.indexOf(status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your orders
            </p>
          </div>
          <Button onClick={() => navigate('/products')}>
            Shop More
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try a different search term' : 'You haven\'t placed any orders yet'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/products')}>
                Start Shopping
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card 
                key={order.order_ID} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/customer/orders/${order.order_ID}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-lg">
                          Order #{order.order_ID}
                        </h3>
                        <OrderStatusBadge status={order.order_status} />
                        <PaymentStatusBadge status={order.payment_status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.order_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex-1 max-w-md">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Ordered</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ 
                            width: `${((getStatusProgress(order.order_status) + 1) / 5) * 100}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Action */}
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;