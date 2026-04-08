 import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Contexts/AuthContext';
import { useCart } from '../../../Contexts/CartContext';
import { userAPI, orderAPI, paymentAPI } from '../../../api/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../../uti/card';
import { Button } from '../../../uti/button';
import { Input } from '../../../uti/input';
import { toast } from 'sonner';
import { Loader2, Plus, CreditCard, CheckCircle, MapPin } from 'lucide-react';

// Local replacements for UI components
const Label = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}>
    {children}
  </label>
);

const Separator = () => (
  <div className="h-px w-full bg-border my-4" />
);

const RadioGroup = ({ value, onValueChange, children }) => {
  return (
    <div className="space-y-2" role="radiogroup">
      {React.Children.map(children, (child) => {
        if (!child) return null;
        return React.cloneElement(child, {
          checked: child.props.value === value,
          onChange: () => onValueChange(child.props.value),
        });
      })}
    </div>
  );
};

const RadioGroupItem = ({ value, id, checked, onChange }) => (
  <input
    type="radio"
    id={id}
    name="radio-group"
    value={value}
    checked={checked}
    onChange={onChange}
    className="h-4 w-4 border-primary text-primary focus:ring-primary cursor-pointer"
  />
);

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg bg-background rounded-lg shadow-lg border p-6">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

const DialogFooter = ({ children }) => (
  <div className="flex justify-end gap-2 mt-6">{children}</div>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderComplete, setOrderComplete] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null);
  
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
  });

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return;
      try {
        const data = await userAPI.getUserAddresses(user.user_ID);
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddress(data[0].address_ID.toString());
        }
      } catch (error) {
        toast.error('Failed to load addresses');
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [items, navigate, orderComplete]);

  const handleAddAddress = async () => {
    if (!user) return;
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip_code) {
      toast.error('Please fill in all address fields');
      return;
    }

    try {
      const address = await userAPI.addAddress({
        ...newAddress,
        user_ID: user.user_ID,
      });
      setAddresses([...addresses, address]);
      setSelectedAddress(address.address_ID.toString());
      setShowNewAddress(false);
      setNewAddress({ street: '', city: '', state: '', zip_code: '', country: 'USA' });
      toast.success('Address added successfully');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const order = await orderAPI.createOrder({
        user_ID: user.user_ID,
        total_amount: total,
        payment_status: 'Pending',
        shipping_address_ID: parseInt(selectedAddress),
        order_status: 'Pending',
      });

      // Process payment (mock)
      await paymentAPI.createPaymentIntent(total * 100, order.order_ID);
      await paymentAPI.confirmPayment(order.order_ID);

      setNewOrderId(order.order_ID);
      setOrderComplete(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. Your order number is #{newOrderId}.
            </p>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => navigate('/customer/orders')}>
                View Order History
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No addresses saved</p>
                    <Button onClick={() => setShowNewAddress(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.address_ID} className="flex items-start space-x-3">
                          <RadioGroupItem 
                            value={address.address_ID.toString()} 
                            id={`address-${address.address_ID}`}
                          />
                          <Label 
                            htmlFor={`address-${address.address_ID}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="p-4 border rounded-lg hover:bg-muted transition-colors">
                              <p className="font-medium">{address.street}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.zip_code}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.country}
                              </p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
                
                {addresses.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowNewAddress(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-5 w-5" />
                        Credit/Debit Card (Stripe)
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                
                {paymentMethod === 'card' && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      You'll be prompted to enter your card details securely via Stripe.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2 max-h-48 overflow-auto">
                  {items.map((item) => (
                    <div key={item.product.product_ID} className="flex justify-between text-sm">
                      <span className="truncate flex-1">
                        {item.quantity} x {item.product.name}
                      </span>
                      <span className="ml-4">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddress}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* New Address Dialog */}
      <Dialog open={showNewAddress} onOpenChange={setShowNewAddress}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                placeholder="123 Main St, Apt 4B"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="Los Angeles"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  placeholder="CA"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ZIP Code</Label>
                <Input
                  value={newAddress.zip_code}
                  onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })}
                  placeholder="90001"
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  placeholder="USA"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAddress(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAddress}>Add Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;