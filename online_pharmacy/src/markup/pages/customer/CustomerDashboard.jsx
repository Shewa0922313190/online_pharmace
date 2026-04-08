import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext';
import { orderAPI, prescriptionAPI } from '../../../api/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../../uti/card';
import { Button } from '../../../uti/button';
import { toast } from 'sonner';
import {
  Package,
  FileText,
  ShoppingCart,
  User,
  ChevronRight,
  Clock,
  CheckCircle,
} from 'lucide-react';

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

const PrescriptionStatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Verified: 'bg-green-100 text-green-800 border-green-300',
    Rejected: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      {status}
    </span>
  );
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingPrescriptions: 0,
    verifiedPrescriptions: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const [orders, prescriptions] = await Promise.all([
          orderAPI.getUserOrders(user.user_ID),
          prescriptionAPI.getUserPrescriptions(user.user_ID),
        ]);
        
        setRecentOrders(orders.slice(0, 5));
        setRecentPrescriptions(prescriptions.slice(0, 3));
        
        setStats({
          totalOrders: orders.length,
          pendingPrescriptions: prescriptions.filter(p => p.verification_status === 'Pending').length,
          verifiedPrescriptions: prescriptions.filter(p => p.verification_status === 'Verified').length,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Shop medications and health products',
      icon: <ShoppingCart className="h-5 w-5" />,
      onClick: () => navigate('/products'),
      color: 'bg-blue-500',
    },
    {
      title: 'Upload Prescription',
      description: 'Submit a new prescription',
      icon: <FileText className="h-5 w-5" />,
      onClick: () => navigate('/customer/prescriptions'),
      color: 'bg-green-500',
    },
    {
      title: 'View Orders',
      description: 'Track your order history',
      icon: <Package className="h-5 w-5" />,
      onClick: () => navigate('/customer/orders'),
      color: 'bg-purple-500',
    },
    {
      title: 'Edit Profile',
      description: 'Update your information',
      icon: <User className="h-5 w-5" />,
      onClick: () => navigate('/customer/profile'),
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your prescriptions and orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Rx</p>
                  <p className="text-2xl font-bold">{stats.pendingPrescriptions}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified Rx</p>
                  <p className="text-2xl font-bold">{stats.verifiedPrescriptions}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-start gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors text-left"
            >
              <div className={`h-10 w-10 rounded-lg ${action.color} text-white flex items-center justify-center shrink-0`}>
                {action.icon}
              </div>
              <div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/customer/orders')}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/products')}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.order_ID}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => navigate(`/customer/orders/${order.order_ID}`)}
                    >
                      <div>
                        <p className="font-medium">Order #{order.order_ID}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                        <OrderStatusBadge status={order.order_status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Prescriptions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Prescriptions</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/customer/prescriptions')}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : recentPrescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No prescriptions uploaded</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/customer/prescriptions')}
                  >
                    Upload Prescription
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPrescriptions.map((prescription) => (
                    <div
                      key={prescription.prescription_ID}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded bg-gray-200 overflow-hidden">
                          <img
                            src={prescription.image_url}
                            alt="Prescription"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            Prescription #{prescription.prescription_ID}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(prescription.prescription_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <PrescriptionStatusBadge status={prescription.verification_status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;