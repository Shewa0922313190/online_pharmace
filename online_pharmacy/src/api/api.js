import { mockUsers, mockProducts, mockPrescriptions, mockOrders, mockAddresses, mockAuditLogs } from '../assets/data/data.js';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Auth Service
export const authAPI = {
  login: async (credentials) => {
    await delay(800);
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    // In real app, verify password hash here
    return { user, token: `mock-jwt-token-${user.user_ID}` };
  },

  register: async (data) => {
    await delay(800);
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    const newUser = {
      user_ID: mockUsers.length + 1,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: 'customer',
      phone: data.phone,
      created_at: new Date().toISOString(),
      is_active: true,
    };
    mockUsers.push(newUser);
    return { user: newUser, token: `mock-jwt-token-${newUser.user_ID}` };
  },

  logout: async () => {
    await delay(300);
    // In real app, invalidate token on server
  },

  getCurrentUser: async (userId) => {
    await delay(500);
    const user = mockUsers.find(u => u.user_ID === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};

// User Service
export const userAPI = {
  getUser: async (id) => {
    await delay(500);
    const user = mockUsers.find(u => u.user_ID === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  updateUser: async (id, data) => {
    await delay(600);
    const index = mockUsers.findIndex(u => u.user_ID === id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = { ...mockUsers[index], ...data };
    return mockUsers[index];
  },

  getAllUsers: async () => {
    await delay(600);
    return [...mockUsers];
  },

  deleteUser: async (id) => {
    await delay(500);
    const index = mockUsers.findIndex(u => u.user_ID === id);
    if (index !== -1) {
      mockUsers[index].is_active = false;
    }
  },

  getUserAddresses: async (userId) => {
    await delay(500);
    return mockAddresses.filter(a => a.user_ID === userId);
  },

  addAddress: async (address) => {
    await delay(600);
    const newAddress = {
      ...address,
      address_ID: mockAddresses.length + 1,
    };
    mockAddresses.push(newAddress);
    return newAddress;
  },

  updateAddress: async (id, data) => {
    await delay(600);
    const index = mockAddresses.findIndex(a => a.address_ID === id);
    if (index === -1) throw new Error('Address not found');
    mockAddresses[index] = { ...mockAddresses[index], ...data };
    return mockAddresses[index];
  },

  deleteAddress: async (id) => {
    await delay(500);
    const index = mockAddresses.findIndex(a => a.address_ID === id);
    if (index !== -1) {
      mockAddresses.splice(index, 1);
    }
  },
};

// Product Service
export const productAPI = {
  getProducts: async (filters) => {
    await delay(600);
    let products = mockProducts.filter(p => p.is_active);
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(search) || 
          p.description.toLowerCase().includes(search)
        );
      }
      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice);
      }
    }
    
    return products;
  },

  getProduct: async (id) => {
    await delay(500);
    const product = mockProducts.find(p => p.product_ID === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  createProduct: async (data) => {
    await delay(700);
    const newProduct = {
      ...data,
      product_ID: mockProducts.length + 1,
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id, data) => {
    await delay(600);
    const index = mockProducts.findIndex(p => p.product_ID === id);
    if (index === -1) throw new Error('Product not found');
    mockProducts[index] = { ...mockProducts[index], ...data };
    return mockProducts[index];
  },

  deleteProduct: async (id) => {
    await delay(500);
    const index = mockProducts.findIndex(p => p.product_ID === id);
    if (index !== -1) {
      mockProducts[index].is_active = false;
    }
  },

  getLowStockProducts: async () => {
    await delay(500);
    return mockProducts.filter(p => p.stock_quantity < 50 && p.is_active);
  },
};

// Prescription Service
export const prescriptionAPI = {
  getPrescriptions: async () => {
    await delay(600);
    return mockPrescriptions.map(p => ({
      ...p,
      user_name: mockUsers.find(u => u.user_ID === p.user_ID)?.first_name + ' ' + 
                 mockUsers.find(u => u.user_ID === p.user_ID)?.last_name,
    }));
  },

  getUserPrescriptions: async (userId) => {
    await delay(500);
    return mockPrescriptions.filter(p => p.user_ID === userId);
  },

  uploadPrescription: async (data) => {
    await delay(1000);
    const newPrescription = {
      ...data,
      prescription_ID: mockPrescriptions.length + 1,
    };
    mockPrescriptions.push(newPrescription);
    return newPrescription;
  },

  verifyPrescription: async (id, status, notes, pharmacistId) => {
    await delay(700);
    const index = mockPrescriptions.findIndex(p => p.prescription_ID === id);
    if (index === -1) throw new Error('Prescription not found');
    mockPrescriptions[index] = {
      ...mockPrescriptions[index],
      verification_status: status,
      notes,
      pharmacist_ID: pharmacistId,
    };
    return mockPrescriptions[index];
  },

  getPendingPrescriptions: async () => {
    await delay(500);
    return mockPrescriptions
      .filter(p => p.verification_status === 'Pending')
      .map(p => ({
        ...p,
        user_name: mockUsers.find(u => u.user_ID === p.user_ID)?.first_name + ' ' + 
                   mockUsers.find(u => u.user_ID === p.user_ID)?.last_name,
      }));
  },
};

// Order Service
export const orderAPI = {
  getOrders: async () => {
    await delay(600);
    return mockOrders.map(o => ({
      ...o,
      user_name: mockUsers.find(u => u.user_ID === o.user_ID)?.first_name + ' ' + 
                 mockUsers.find(u => u.user_ID === o.user_ID)?.last_name,
    }));
  },

  getUserOrders: async (userId) => {
    await delay(500);
    return mockOrders.filter(o => o.user_ID === userId);
  },

  getOrder: async (id) => {
    await delay(500);
    const order = mockOrders.find(o => o.order_ID === id);
    if (!order) throw new Error('Order not found');
    return {
      ...order,
      shipping_address: mockAddresses.find(a => a.address_ID === order.shipping_address_ID),
    };
  },

  createOrder: async (data) => {
    await delay(800);
    const newOrder = {
      ...data,
      order_ID: mockOrders.length + 1,
      order_date: new Date().toISOString(),
    };
    mockOrders.push(newOrder);
    return newOrder;
  },

  updateOrderStatus: async (id, status) => {
    await delay(600);
    const index = mockOrders.findIndex(o => o.order_ID === id);
    if (index === -1) throw new Error('Order not found');
    mockOrders[index] = { ...mockOrders[index], order_status: status };
    return mockOrders[index];
  },

  getOrdersByStatus: async (status) => {
    await delay(500);
    return mockOrders.filter(o => o.order_status === status);
  },
};

// Payment Service (Mock Stripe)
export const paymentAPI = {
  createPaymentIntent: async (_amount, orderId) => {
    await delay(1000);
    // Mock Stripe PaymentIntent creation
    return { clientSecret: `mock_client_secret_${orderId}_${Date.now()}` };
  },

  confirmPayment: async (orderId) => {
    await delay(700);
    const index = mockOrders.findIndex(o => o.order_ID === orderId);
    if (index !== -1) {
      mockOrders[index].payment_status = 'Paid';
    }
  },
};

// Audit Log Service
export const auditLogAPI = {
  getAuditLogs: async () => {
    await delay(600);
    return mockAuditLogs.map(log => ({
      ...log,
      user_name: log.user_ID ? 
        mockUsers.find(u => u.user_ID === log.user_ID)?.first_name + ' ' + 
        mockUsers.find(u => u.user_ID === log.user_ID)?.last_name : 'System',
    }));
  },

  createAuditLog: async (data) => {
    await delay(400);
    const newLog = {
      ...data,
      log_ID: mockAuditLogs.length + 1,
      timestamp: new Date().toISOString(),
    };
    mockAuditLogs.push(newLog);
    return newLog;
  },
};

// Report Service
export const reportAPI = {
  getSalesReport: async () => {
    await delay(700);
    return [
      { period: 'Jan 2024', total_sales: 12500, order_count: 180, average_order_value: 69.44 },
      { period: 'Feb 2024', total_sales: 15200, order_count: 220, average_order_value: 69.09 },
      { period: 'Mar 2024', total_sales: 18900, order_count: 265, average_order_value: 71.32 },
    ];
  },

  getInventoryReport: async () => {
    await delay(600);
    return mockProducts
      .filter(p => p.is_active)
      .map(p => ({
        product_ID: p.product_ID,
        name: p.name,
        stock_quantity: p.stock_quantity,
        low_stock: p.stock_quantity < 50,
      }));
  },

  getPrescriptionReport: async () => {
    await delay(700);
    return [
      { period: 'Jan 2024', total: 45, verified: 38, rejected: 5, pending: 2 },
      { period: 'Feb 2024', total: 52, verified: 44, rejected: 6, pending: 2 },
      { period: 'Mar 2024', total: 48, verified: 40, rejected: 5, pending: 3 },
    ];
  },

  getCustomerReport: async () => {
    await delay(700);
    return [
      { period: 'Jan 2024', new_customers: 25, active_customers: 120, total_orders: 180 },
      { period: 'Feb 2024', new_customers: 32, active_customers: 135, total_orders: 220 },
      { period: 'Mar 2024', new_customers: 28, active_customers: 142, total_orders: 265 },
    ];
  },
};