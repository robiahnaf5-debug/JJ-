import React, { useState, useEffect, useMemo } from 'react';
import { 
  Smartphone, Code, RefreshCw, Layers, Check, Copy, Heart, ShoppingCart, 
  Search, Home, User, Bell, ChevronLeft, Minus, Plus, Trash2, ShieldCheck, 
  Database, CreditCard, Tag, CheckCircle2, ChevronRight, Settings, PlusCircle, 
  LayoutDashboard, Edit, Package, AlertCircle, ShoppingBag, Eye, Moon, Sun, 
  Wifi, WifiOff, MapPin, Phone, UserCheck, Inbox, ArrowRight, Star
} from 'lucide-react';

import { androidCodeProject } from './codeFiles';
import { initialProducts, initialOrders, ProductItem, OrderItem } from './productsData';
import PaymentSimulator from './components/PaymentSimulator';
import CodeWorkspace from './components/CodeWorkspace';

export default function App() {
  // Mobile Sandbox database and states
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [cart, setCart] = useState<{ id: string; product: ProductItem; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [packageName, setPackageName] = useState('com.example.bangla_ecommerce');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // App views & navigation inside physical emulator
  const [emulatorView, setEmulatorView] = useState<'home' | 'detail' | 'cart' | 'checkout' | 'orders' | 'profile' | 'auth' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [emulatorTheme, setEmulatorTheme] = useState<'light' | 'dark'>('light');
  const [isOnline, setIsOnline] = useState(true);

  // Auth States
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default logged in for fluent client testing
  const [authEmail, setAuthEmail] = useState('user@example.com');
  const [authPassword, setAuthPassword] = useState('123456');
  const [authName, setAuthName] = useState('Mahmudul Hasan Russel');
  const [authPhone, setAuthPhone] = useState('01789123456');
  const [authAddress, setAuthAddress] = useState('House-24, Road-5, Sector-3, Uttara, Dhaka-1230');

  // Checkout inputs
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutPayment, setCheckoutPayment] = useState<'bKash' | 'Nagad' | 'COD'>('COD');

  // Active Payment simulation triggers
  const [paymentGateway, setPaymentGateway] = useState<'bKash' | 'Nagad' | null>(null);

  // Admin section views & product editing inputs
  const [adminSubView, setAdminSubView] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [showProductModal, setShowProductModal] = useState(false);
  const [adminEditingProduct, setAdminEditingProduct] = useState<ProductItem | null>(null);

  // Add Product form state
  const [apName, setApName] = useState('');
  const [apCategory, setApCategory] = useState('Electronics');
  const [apPrice, setApPrice] = useState('');
  const [apDiscountPrice, setApDiscountPrice] = useState('');
  const [apStock, setApStock] = useState('10');
  const [apDescription, setApDescription] = useState('');
  const [apImage, setApImage] = useState('');

  // Local notifications inside Emulator
  const [emulatorNotifications, setEmulatorNotifications] = useState<string[]>([]);
  const [activeTabBannerIndex, setActiveTabBannerIndex] = useState(0);

  // Initialize Billing state once user opens checkout
  useEffect(() => {
    if (isLoggedIn) {
      setCheckoutName(authName);
      setCheckoutPhone(authPhone);
      setCheckoutAddress(authAddress);
    }
  }, [isLoggedIn, authName, authPhone, authAddress]);

  // Dynamic automatic image slider loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTabBannerIndex(prev => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Filtered products list display
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Calculations for checkout
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const activePrice = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
      return acc + (activePrice * item.quantity);
    }, 0);
  }, [cart]);

  const deliveryCharge = useMemo(() => {
    if (cart.length === 0) return 0;
    return checkoutAddress.toLowerCase().includes('dhaka') || checkoutAddress.toLowerCase().includes('dhaka') ? 60 : 120;
  }, [cart, checkoutAddress]);

  const grandTotal = useMemo(() => {
    return cartSubtotal + deliveryCharge;
  }, [cartSubtotal, deliveryCharge]);

  const totalSales = useMemo(() => {
    return orders
      .filter(o => o.orderStatus === 'Delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  // Wishlist toggle helper
  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    triggerNotification(wishlist.includes(id) ? "Product removed from wishlist." : "Product added to wishlist!");
  };

  // Push Local notifications helper inside phone screen
  const triggerNotification = (message: string) => {
    setEmulatorNotifications(prev => [message, ...prev.slice(0, 2)]);
    setTimeout(() => {
      setEmulatorNotifications(prev => prev.filter(m => m !== message));
    }, 4000);
  };

  // Cart operations
  const handleAddToCart = (product: ProductItem, quantity: number, directCheckout = false) => {
    if (product.stock <= 0) {
      triggerNotification("Sorry, this product is currently out of stock!");
      return;
    }
    
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx !== -1) {
        const newQty = prev[idx].quantity + quantity;
        if (newQty > product.stock) {
          triggerNotification(`Maximum available stock: ${product.stock} units`);
          return prev;
        }
        const updated = [...prev];
        updated[idx].quantity = newQty;
        return updated;
      }
      return [...prev, { id: 'cart_' + Date.now(), product, quantity }];
    });

    triggerNotification("Added to cart!");

    if (directCheckout) {
      setEmulatorView('checkout');
    }
  };

  const updateCartQty = (id: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const targetQty = item.quantity + change;
        if (targetQty <= 0) return item;
        if (targetQty > item.product.stock) {
          triggerNotification(`Sorry, stock limit reached! Max stock: ${item.product.stock}`);
          return item;
        }
        return { ...item, quantity: targetQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    triggerNotification("Product removed from cart");
  };

  // Authenticate triggers
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (!authEmail.includes('@') || authPassword.length < 5) {
        alert('Please enter a valid email and a password of at least 5 characters');
        return;
      }
      setIsLoggedIn(true);
      setEmulatorView('home');
      triggerNotification("Successfully logged in!");
    } else if (authMode === 'signup') {
      if (!authName || !authPhone || !authEmail) {
        alert('Please fill in all details');
        return;
      }
      setIsLoggedIn(true);
      setEmulatorView('home');
      triggerNotification("Account created successfully!");
    } else {
      alert(`Recovery email sent to ${authEmail}!`);
      setAuthMode('login');
    }
  };

  // Checkout confirmation and submission
  const handlePlaceOrderSuccess = () => {
    const newOrder: OrderItem = {
      id: "ORD_" + (Math.floor(Math.random() * 9000 + 1000)),
      customerName: checkoutName,
      phone: checkoutPhone,
      address: checkoutAddress,
      paymentMethod: checkoutPayment === 'COD' ? 'Cash On Delivery' : checkoutPayment,
      items: cart.map(c => ({
        productName: c.product.name,
        price: c.product.discountPrice > 0 ? c.product.discountPrice : c.product.price,
        quantity: c.quantity
      })),
      totalAmount: grandTotal,
      orderStatus: 'Pending',
      date: new Date().toISOString().slice(0, 10) + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      timestamp: Date.now()
    };

    // Deduct stock levels in-memory
    setProducts(prev => prev.map(p => {
      const orderedItem = cart.find(c => c.product.id === p.id);
      if (orderedItem) {
        const remaining = p.stock - orderedItem.quantity;
        return { ...p, stock: Math.max(0, remaining) };
      }
      return p;
    }));

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setPaymentGateway(null);
    setEmulatorView('orders');
    triggerNotification("Order successfully saved to database!");
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutPhone || !checkoutAddress) {
      alert("Please fill in all details!");
      return;
    }
    if (checkoutPhone.length !== 11) {
      alert("Please enter a valid 11-digit mobile number!");
      return;
    }

    if (checkoutPayment === 'bKash') {
      setPaymentGateway('bKash');
    } else if (checkoutPayment === 'Nagad') {
      setPaymentGateway('Nagad');
    } else {
      handlePlaceOrderSuccess();
    }
  };

  // Admin Actions: ADD or EDIT product
  const handleOpenAddProduct = () => {
    setApName('');
    setApCategory('Electronics');
    setApPrice('');
    setApDiscountPrice('');
    setApStock('10');
    setApDescription('');
    setApImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600');
    setAdminEditingProduct(null);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (product: ProductItem) => {
    setAdminEditingProduct(product);
    setApName(product.name);
    setApCategory(product.category);
    setApPrice(String(product.price));
    setApDiscountPrice(String(product.discountPrice || ''));
    setApStock(String(product.stock));
    setApDescription(product.description);
    setApImage(product.mainImage);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apName || !apPrice || !apStock || !apDescription) {
      alert('Please fill in the required fields');
      return;
    }

    const priceNum = Number(apPrice);
    const discPriceNum = apDiscountPrice ? Number(apDiscountPrice) : 0;
    const stockNum = Number(apStock);

    if (adminEditingProduct) {
      // Editing
      setProducts(prev => prev.map(p => {
        if (p.id === adminEditingProduct.id) {
          return {
            ...p,
            name: apName,
            category: apCategory,
            price: priceNum,
            discountPrice: discPriceNum,
            stock: stockNum,
            description: apDescription,
            mainImage: apImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400',
            images: [apImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400']
          };
        }
        return p;
      }));
      triggerNotification("Product updated successfully!");
    } else {
      // Adding new
      const newProd: ProductItem = {
        id: 'prod_' + (Date.now()),
        name: apName,
        category: apCategory,
        price: priceNum,
        discountPrice: discPriceNum,
        stock: stockNum,
        description: apDescription,
        mainImage: apImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
        images: [apImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'],
        rating: 4.8
      };
      setProducts(prev => [newProd, ...prev]);
      triggerNotification("Product saved to database!");
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product permanently?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      triggerNotification("Product deleted successfully");
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderItem['orderStatus']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, orderStatus: status };
      }
      return o;
    }));
    triggerNotification(`Order #${orderId} updated successfully!`);
  };

  // Emulator UI colors based on active local emulator theme selector (Light/Dark)
  const phoneBg = emulatorTheme === 'light' ? 'bg-[#FAFAFC] text-slate-800' : 'bg-[#121824] text-slate-100';
  const elementBg = emulatorTheme === 'light' ? 'bg-white border-slate-100' : 'bg-[#1A2333] border-slate-800/80';
  const textMuted = emulatorTheme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const textBold = emulatorTheme === 'light' ? 'text-slate-900' : 'text-white';
  const borderLight = emulatorTheme === 'light' ? 'border-slate-100' : 'border-slate-800/65';

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-200 font-sans flex flex-col selection:bg-[#3DDC84]/30 selection:text-white">
      
      {/* Top Professional Header Branding */}
      <header className="bg-slate-950 border-b border-slate-900 p-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3DDC84]/10 rounded-xl border border-[#3DDC84]/20">
            <Smartphone className="text-[#3DDC84] w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white font-display flex items-center gap-2">
              <span>Android eCommerce App Developer Studio</span>
              <span className="text-[10px] bg-red-500/10 text-red-400 font-mono py-0.5 px-2 rounded-full border border-red-500/10">Java + XML + Firebase MVP</span>
            </h1>
            <p className="text-xs text-slate-400">Android Studio Full Source Code Generator and Customized Device Emulator Live Previewer</p>
          </div>
        </div>

        {/* Action Indicators */}
        <div className="flex items-center gap-4">
          {/* Internet Toggle to explain Connectivity state */}
          <button 
            onClick={() => {
              setIsOnline(!isOnline);
              triggerNotification(isOnline ? "Internet disconnected!" : "Internet connection established!");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isOnline 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 animate-bounce'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi size={13} />
                <span>Simulator Online</span>
              </>
            ) : (
              <>
                <WifiOff size={13} />
                <span>Emulator Offline</span>
              </>
            )}
          </button>

          <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.2 font-mono">
            <Database size={12} className="text-[#FFCA28]" />
            <span>Firebase SDK v32.7.0</span>
          </span>
        </div>
      </header>

      {/* Main Dynamic Viewport Grid */}
      <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-900 h-full">
        
        {/* PANEL 1: Left Guideline & App Operations Details (3 Cols) */}
        <div className="lg:col-span-3 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3DDC84] flex items-center gap-2">
              <Layers size={13} />
              <span>Android Studio Setup Guide</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Copy these production-ready codes from the <strong>Android Studio IDE</strong> on the right side and paste them into your project. Below are the required steps:
            </p>
            
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside border-t border-slate-800 pt-2.5">
              <li>
                <span className="text-slate-200 font-semibold font-display">Create Project:</span> In Android Studio, open an <strong>Empty Views Activity</strong> project.
              </li>
              <li>
                <span className="text-slate-200 font-semibold font-display">Package Naming:</span> Enter your desired package name in the customization input. The source code on the right will update automatically.
              </li>
              <li>
                <span className="text-slate-200 font-semibold font-display">Integrate Dependencies:</span> Copy the dependency block from the <code className="text-slate-300 bg-slate-950 px-1 py-0.5 rounded text-[10px]">build.gradle</code> file on the right, paste it into your app module-level gradle, and click "Sync Now".
              </li>
              <li>
                <span className="text-slate-200 font-semibold font-display">Firebase Setup:</span> Enable Authentication, Cloud Firestore Database, and Cloud Storage in your Firebase Console.
              </li>
              <li>
                <span className="text-slate-200 font-semibold font-display">Replace Source Files:</span> Copy the XML layout and Java class codes and paste them into corresponding files in your Android Studio project.
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/30 to-slate-950/30 rounded-2xl border border-indigo-950/60 p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-2">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span>MVVM Architecture Flow</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              This project is designed following Google's recommended <span className="font-semibold text-slate-300">MVVM (Model-View-ViewModel)</span> design pattern.
            </p>
            <div className="text-[10px] space-y-2 font-mono text-indigo-300 bg-black/40 p-2.5 rounded-lg border border-indigo-950/80">
              <div className="flex items-center justify-between">
                <span>View (MainActivity/XML)</span>
                <span className="text-slate-500">→</span>
              </div>
              <div className="flex items-center justify-between pl-3">
                <span className="text-[#3DDC84]">ViewModel (HomeViewModel)</span>
                <span className="text-slate-500">→</span>
              </div>
              <div className="flex items-center justify-between pl-6">
                <span>Repository (ProductRepo)</span>
                <span className="text-slate-500">→</span>
              </div>
              <div className="flex items-center justify-between pl-9 text-slate-400">
                <span>Firebase Database / Auth</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-200">💡 Testing Tips:</span>
            <p>Interact with the Android emulator screen on the left to filter categories, add items to cart, and test simulated bKash/Nagad payments. Go to the Admin dashboard inside the emulator to update product quantities or prices in real time!</p>
          </div>

        </div>

        {/* PANEL 2: Center Android Device Interactive Emulator (4 Cols) */}
        <div className="lg:col-span-4 p-4 flex flex-col items-center justify-start bg-slate-950 overflow-y-auto">
          
          <div className="w-full max-w-[320px] flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3DDC84]"></span>
              <span className="text-xs text-slate-300 font-mono font-bold uppercase tracking-wider">Device Emulator</span>
            </div>
            
            {/* Quick toggle to toggle client vs admin app in emulator */}
            <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button 
                onClick={() => setEmulatorView('home')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
                  emulatorView !== 'admin' ? 'bg-[#3DDC84] text-black font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Customer App
              </button>
              <button 
                onClick={() => {
                  setEmulatorView('admin');
                  setAdminSubView('dashboard');
                }}
                className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
                  emulatorView === 'admin' ? 'bg-indigo-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin Panel
              </button>
            </div>
          </div>

          {/* PHYSICAL PHONE SHELL DESIGN (Pixel 8 Aspect) */}
          <div className="relative w-full max-w-[300px] h-[580px] bg-slate-900 rounded-[40px] p-3 border-4 border-slate-700/90 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Camera Speaker Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-36 bg-black rounded-b-2xl z-45 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2 border border-blue-900/80"></div>
              <div className="w-10 h-1 bg-slate-850 rounded-full"></div>
            </div>

            {/* STATUS BAR: Signal, Clock, Battery, Theme Toggle */}
            <div className={`pt-4 pb-1.5 px-6 flex items-center justify-between text-[10px] z-40 shrink-0 select-none ${
              emulatorTheme === 'light' ? 'bg-[#FAFAFC] text-slate-700' : 'bg-[#121824] text-slate-300'
            }`}>
              {/* Clock */}
              <span className="font-bold font-mono">16:21</span>
              
              {/* Center Theme switch or status */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setEmulatorTheme(prev => prev === 'light' ? 'dark' : 'light')} 
                  className="p-0.5 rounded hover:bg-slate-300/35 active:scale-90 transition-transform"
                  title="Switch Theme"
                >
                  {emulatorTheme === 'light' ? <Moon size={11} /> : <Sun size={11} className="text-[#FFCA28]" />}
                </button>
              </div>

              {/* Network / Battery status indicators */}
              <div className="flex items-center gap-1.5 font-mono">
                {isOnline ? <Wifi size={10} /> : <WifiOff size={10} className="text-red-500" />}
                <span className="text-[9px] font-bold">LTE</span>
                <span className="bg-slate-400/20 px-1 py-0.2 rounded text-[8px] font-bold">100%</span>
              </div>
            </div>

            {/* SCREEN PORT CONTAINERS */}
            <div className={`flex-1 overflow-hidden relative flex flex-col ${phoneBg}`}>
              
              {/* Interactive In-Emulator Notification Dropdown alerts */}
              {emulatorNotifications.map((noti, index) => (
                <div 
                  key={index}
                  className="absolute top-2 left-3 right-3 z-50 bg-[#1D3557] border border-blue-900 text-white rounded-xl py-2 px-3 text-[10px] shadow-lg flex items-center gap-2 animate-bounce"
                >
                  <Bell size={11} className="text-blue-400 shrink-0" />
                  <span className="font-medium font-sans">{noti}</span>
                </div>
              ))}

              {/* OFFLINE CHECKER BANNER overlay */}
              {!isOnline && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 p-4 text-center">
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-full mb-3 animate-pulse">
                    <WifiOff size={28} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 font-display">No Internet Connection</h3>
                  <p className="text-[10px] text-zinc-400 max-w-[200px] leading-relaxed">
                    The Java class 'InternetChecker' detected that you are offline. To restore internet access, click the 'Simulator Online' button in the developer panel.
                  </p>
                </div>
              )}

              {/* PAYMENTS SIMULATOR GATEWAY OVERLAY CONTAINER */}
              {paymentGateway && (
                <PaymentSimulator 
                  method={paymentGateway}
                  amount={grandTotal}
                  onClose={() => setPaymentGateway(null)}
                  onSuccess={handlePlaceOrderSuccess}
                />
              )}

              {/* EMULATOR SCREENS BRANCH-LOGIC */}
              
              {/* 1. AUTH SCREEN VIEW */}
              {emulatorView === 'auth' && (
                <div className="flex-1 p-4 flex flex-col justify-center overflow-y-auto">
                  <div className="text-center mb-4 space-y-1">
                    <h2 className="text-[#3DDC84] font-bold text-lg font-display">Android Shop (Demo)</h2>
                    <p className={`text-[10px] ${textMuted}`}>Firebase Authentication System</p>
                  </div>

                  <div className={`p-4 rounded-2xl border ${elementBg} shadow-md`}>
                    <form onSubmit={handleAuthSubmit} className="space-y-3 text-[11px]">
                      {authMode === 'signup' && (
                        <div>
                          <label className="block mb-1 font-semibold">Your Name</label>
                          <input 
                            type="text" 
                            required
                            value={authName}
                            onChange={(e) => setApName(e.target.value)}
                            className={`w-full border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#3DDC84] ${
                              emulatorTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
                            }`}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block mb-1 font-semibold">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className={`w-full border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#3DDC84] ${
                            emulatorTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
                          }`}
                        />
                      </div>

                      {authMode !== 'forgot' && (
                        <div>
                          <label className="block mb-1 font-semibold">Password</label>
                          <input 
                            type="password" 
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className={`w-full border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#3DDC84] ${
                              emulatorTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
                            }`}
                          />
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-2 rounded-lg bg-[#3DDC84] hover:bg-[#3DDC84]/90 text-black font-bold font-display cursor-pointer transition-colors mt-2"
                      >
                        {authMode === 'login' ? 'Login' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                      </button>
                    </form>

                    <div className="text-center mt-3 pt-3 border-t border-slate-300/20 text-[10px] space-y-1.5">
                      {authMode === 'login' ? (
                        <>
                          <button onClick={() => setAuthMode('signup')} className="text-blue-500 hover:underline">Create a new account?</button>
                          <br />
                          <button onClick={() => setAuthMode('forgot')} className="text-slate-400 hover:underline">Forgot password?</button>
                        </>
                      ) : (
                        <button onClick={() => setAuthMode('login')} className="text-blue-400 hover:underline">Login with existing account</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. MAIN APP HOME SCREEN CLIENT FEED */}
              {emulatorView === 'home' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Android Search Header components */}
                  <div className="p-3 bg-indigo-650 shrink-0 text-white space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag size={14} className="text-[#3DDC84]" />
                        <span className="font-bold tracking-tight font-display text-white">Android Shop (App)</span>
                      </div>
                      <button 
                        onClick={() => {
                          setEmulatorView('admin');
                          setAdminSubView('dashboard');
                        }}
                        className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-bold hover:bg-white/35 active:scale-95"
                      >
                        Admin App
                      </button>
                    </div>

                    {/* Search Area */}
                    <div className="flex items-center bg-white text-slate-800 rounded-lg px-2.5 py-1">
                      <Search size={11} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search favorite products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none text-[10px] text-slate-800 focus:outline-none w-full pl-2 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* SCROLLABLE HOME SCREEN FEED */}
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
                    
                    {/* ViewPager2 Image Slider Frame */}
                    <div className="rounded-xl overflow-hidden h-[95px] relative group shadow border border-slate-300/10">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-transparent z-10 flex flex-col justify-center px-4 space-y-1">
                        <span className="text-[7px] font-bold text-[#FFCA28] border border-[#FFCA28]/40 px-1 py-0.1 uppercase tracking-wider w-fit rounded">Mega Promo</span>
                        <h4 className="text-xs font-bold text-white leading-tight">On bKash & Nagad <br /><span className="text-green-300">10% Cash Back Offer!</span></h4>
                      </div>
                      <img 
                        src={activeTabBannerIndex === 0 
                          ? "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400"
                          : "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=400"
                        } 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="offer_banner"
                        referrerPolicy="no-referrer"
                      />
                      {/* Dots */}
                      <div className="absolute bottom-1 right-2 z-20 flex gap-1">
                        <span className={`w-1 h-1 rounded-full ${activeTabBannerIndex === 0 ? 'bg-white' : 'bg-white/50'}`}></span>
                        <span className={`w-1 h-1 rounded-full ${activeTabBannerIndex === 1 ? 'bg-white' : 'bg-white/50'}`}></span>
                      </div>
                    </div>

                    {/* Product Categories Horizontal Scrolling */}
                    <div className="space-y-1 shrink-0">
                      <span className={`text-[9px] font-bold uppercase tracking-wider block ${textMuted}`}>Product Categories</span>
                      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                        {['All', 'Electronics', 'Fashion', 'Grocery', 'Shoes', 'Cosmetics', 'Furniture'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 text-[8.5px] font-bold rounded-full border shrink-0 transition-colors ${
                              selectedCategory === cat 
                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                : `hover:bg-slate-200/50 ${elementBg} ${textMuted} ${borderLight}`
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Products 2-Column responsive GRID */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Featured Products</span>
                        <span className="text-[8px] text-blue-500 font-bold">Total: {filteredProducts.length} items</span>
                      </div>

                      {filteredProducts.length === 0 ? (
                        <div className="text-center py-6 space-y-1 bg-slate-900/10 rounded-xl">
                          <Inbox size={18} className="mx-auto text-slate-500" />
                          <p className="text-[10px] text-slate-400">Sorry, no products found!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {filteredProducts.map(prod => {
                            const isDiscounted = prod.discountPrice > 0 && prod.discountPrice < prod.price;
                            const hasHeart = wishlist.includes(prod.id);
                            return (
                              <div
                                key={prod.id}
                                onClick={() => {
                                  setSelectedProduct(prod);
                                  setEmulatorView('detail');
                                }}
                                className={`rounded-xl border group cursor-pointer overflow-hidden relative shadow hover:shadow-md transition-all flex flex-col justify-between ${elementBg} ${borderLight}`}
                              >
                                {/* Discount badge */}
                                {isDiscounted && (
                                  <span className="absolute top-1.5 left-1.5 z-10 bg-red-650 text-white font-mono font-bold text-[8px] px-1 py-0.2 rounded">
                                    -{Math.round(((prod.price - prod.discountPrice) / prod.price) * 100)}%
                                  </span>
                                )}

                                {/* Wishlist toggle */}
                                <button
                                  onClick={(e) => toggleWishlist(prod.id, e)}
                                  className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-slate-950/40 text-white hover:bg-slate-950/65 transition-colors"
                                >
                                  <Heart size={9} fill={hasHeart ? "#EF4444" : "none"} className={hasHeart ? "text-[#EF4444]" : "text-white"} />
                                </button>

                                {/* Media wrapper */}
                                <div className="h-16 w-full shrink-0 bg-slate-900 relative">
                                  <img 
                                    src={prod.mainImage} 
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform" 
                                    alt="prodImg"
                                    referrerPolicy="no-referrer"
                                  />
                                  {prod.stock <= 0 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[8px] text-white font-bold">
                                      Out of Stock
                                    </div>
                                  )}
                                </div>

                                <div className="p-1.5 space-y-1 flex-1 flex flex-col justify-between">
                                  <div>
                                    <h5 className="text-[9.5px] font-bold line-clamp-1 leading-tight text-white mb-0.5">{prod.name}</h5>
                                    
                                    {/* Star Rating summary inline */}
                                    <div className="flex items-center gap-0.5 mb-1 text-[8px] text-yellow-500">
                                      <Star size={7} fill="currentColor" />
                                      <span className="font-semibold text-slate-400">{prod.rating}</span>
                                    </div>
                                  </div>

                                  {/* Pricing block */}
                                  <div>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-[10px] font-extrabold text-indigo-500 font-mono">৳{(isDiscounted ? prod.discountPrice : prod.price).toLocaleString('bn-BD')}</span>
                                      {isDiscounted && (
                                        <span className="text-[7.5px] text-slate-500 line-through font-mono">৳{prod.price.toLocaleString('bn-BD')}</span>
                                      )}
                                    </div>
                                    <span className={`text-[7.5px] block leading-none font-medium ${
                                      prod.stock > 0 ? 'text-emerald-500' : 'text-rose-500'
                                    }`}>
                                      {prod.stock > 0 ? `Stock: ${prod.stock}` : 'Out of Stock'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PRODUCT DETAILS SCREEN PAGE */}
              {emulatorView === 'detail' && selectedProduct && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Detail Header bar */}
                  <div className="p-2 border-b flex items-center shrink-0 bg-indigo-650 text-white justify-between">
                    <button 
                      onClick={() => setEmulatorView('home')} 
                      className="p-1 hover:bg-white/10 rounded-full"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-bold tracking-tight font-display">Product Details</span>
                    <button 
                      onClick={() => setEmulatorView('cart')} 
                      className="p-1 hover:bg-white/10 rounded-full relative"
                    >
                      <ShoppingCart size={13} />
                      {cart.length > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 text-white text-[6px] font-bold rounded-full flex items-center justify-center">
                          {cart.reduce((s, c) => s + c.quantity, 0)}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Body scrolls */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    
                    {/* Sliding Main Images Frame */}
                    <div className="h-[125px] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700/20 shadow relative">
                      <img 
                        src={selectedProduct.mainImage} 
                        className="w-full h-full object-cover" 
                        alt="detailImg" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-3 bg-black/60 px-1.5 py-0.2 rounded text-[7px] text-white">
                        {selectedProduct.category}
                      </div>
                    </div>

                    {/* Metadata specs */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs font-extrabold font-display text-white leading-snug">{selectedProduct.name}</h3>
                        <span className={`text-[8px] uppercase tracking-wide px-1.5 py-0.2 rounded rounded-full shrink-0 font-bold ${
                          selectedProduct.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Ratings row */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="flex text-yellow-500">
                          <Star size={9} fill="currentColor" />
                          <Star size={9} fill="currentColor" />
                          <Star size={9} fill="currentColor" />
                          <Star size={9} fill="currentColor" />
                          <Star size={9} fill="none" className="text-slate-400" />
                        </div>
                        <span className="text-[8px] font-bold text-slate-400">({selectedProduct.rating} Rating, 44 Reviews)</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-slate-300/10 dark:bg-slate-800/45 p-2 rounded-xl flex items-center justify-between border border-slate-700/10">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-medium">Price:</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-[#3DDC84] font-mono">
                            ৳{(selectedProduct.discountPrice > 0 ? selectedProduct.discountPrice : selectedProduct.price).toLocaleString('bn-BD')}
                          </span>
                          {selectedProduct.discountPrice > 0 && (
                            <span className="text-[10px] text-slate-500 line-through font-mono">৳{selectedProduct.price.toLocaleString('bn-BD')}</span>
                          )}
                        </div>
                      </div>

                      {selectedProduct.stock > 0 && (
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block font-medium">Available Qty:</span>
                          <span className="text-[10px] text-slate-200 font-bold">{selectedProduct.stock} remaining</span>
                        </div>
                      )}
                    </div>

                    {/* Description details text */}
                    <div className="space-y-1 border-t border-slate-300/10 pt-2.5">
                      <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Product Summary</span>
                      <p className="text-[9.5px] leading-relaxed text-slate-300">{selectedProduct.description}</p>
                    </div>

                  </div>

                  {/* BOTTOM ACTION CTA BOX IN FRAME */}
                  <div className={`p-2.5 border-t flex gap-2 shrink-0 ${elementBg}`}>
                    <button
                      onClick={() => handleAddToCart(selectedProduct, 1)}
                      className="flex-1 py-1.5 border border-slate-500/30 hover:border-[#3DDC84]/50 rounded-lg text-[10px] font-bold text-white flex items-[#3DDC84] justify-center gap-1 transition-colors"
                    >
                      <ShoppingCart size={11} className="text-[#3DDC84]" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleAddToCart(selectedProduct, 1, true)}
                      className="flex-1 py-1.5 bg-[#3DDC84] hover:bg-[#3DDC84]/95 text-black font-bold text-[10px] rounded-lg tracking-wider font-display transition-transform duration-100 active:scale-95"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              )}

              {/* 4. CART SCREEN VIEW CONTENT */}
              {emulatorView === 'cart' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-2 border-b flex items-center justify-between shrink-0 bg-indigo-650 text-white">
                    <button onClick={() => setEmulatorView('home')} className="p-1 hover:bg-white/10 rounded-full">
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-bold tracking-tight">Shopping Cart ({cart.length})</span>
                    <span className="w-6"></span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="p-3 bg-slate-300/10 rounded-full animate-bounce">
                        <ShoppingCart size={28} className="text-slate-400" />
                      </div>
                      <h4 className="text-xs font-bold text-white">Your Cart is Empty!</h4>
                      <p className="text-[9px] text-slate-400 max-w-[160px] leading-relaxed">Go back to home page and add your favorite products to the cart.</p>
                      <button 
                        onClick={() => setEmulatorView('home')}
                        className="py-1 px-3 bg-indigo-500 hover:bg-indigo-600 text-white text-[9.5px] rounded-lg font-bold transition-all"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Products list scrollable */}
                      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                        {cart.map(item => {
                          const itemPrice = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
                          return (
                            <div 
                              key={item.id}
                              className={`p-2 rounded-xl border flex gap-2.5 items-center justify-between ${elementBg} ${borderLight}`}
                            >
                              <img src={item.product.mainImage} className="w-10 h-10 object-cover rounded-lg bg-slate-900 border border-slate-750 shrink-0" alt="cart" referrerPolicy="no-referrer" />
                              <div className="flex-1 min-w-0 pr-1 text-left">
                                <h5 className="text-[9.5px] font-bold text-white truncate leading-tight">{item.product.name}</h5>
                                <span className="text-[9px] font-mono text-indigo-400 font-bold">৳{itemPrice.toLocaleString('bn-BD')}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Qty adjustments */}
                                <div className="flex items-center border border-slate-700/20 bg-slate-400/10 rounded overflow-hidden">
                                  <button onClick={() => updateCartQty(item.id, -1)} className="p-0.5 hover:bg-indigo-500/10"><Minus size={9} /></button>
                                  <span className="px-1 text-[9px] font-bold font-mono">{item.quantity}</span>
                                  <button onClick={() => updateCartQty(item.id, 1)} className="p-0.5 hover:bg-indigo-500/10"><Plus size={9} /></button>
                                </div>

                                <button 
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="text-red-500 hover:bg-red-500/15 p-1 rounded transition-colors"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pricing calculation summary block and Checkout Button */}
                      <div className={`p-3 border-t space-y-2 shrink-0 bg-[#FAFAFC] dark:bg-[#151C2C] ${borderLight}`}>
                        <div className="space-y-1 text-[9px]">
                          <div className="flex justify-between">
                            <span className={textMuted}>Subtotal:</span>
                            <span className="font-mono font-bold">৳{cartSubtotal.toLocaleString('bn-BD')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={textMuted}>Delivery Charge:</span>
                            <span className="font-mono font-bold">৳{deliveryCharge.toLocaleString('bn-BD')}</span>
                          </div>
                          <div className="flex justify-between border-t border-dashed border-slate-400/20 pt-1.5 text-xs text-[#3DDC84] font-bold">
                            <span>Grand Total:</span>
                            <span className="font-mono">৳{grandTotal.toLocaleString('bn-BD')}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setEmulatorView('checkout')}
                          className="w-full py-1.8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg tracking-wider font-display transition-transform duration-75 active:scale-95"
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. CHECKOUT PAGE VIEW FORM */}
              {emulatorView === 'checkout' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-2 border-b flex items-center shrink-0 bg-indigo-650 text-white">
                    <button onClick={() => setEmulatorView('cart')} className="p-1 hover:bg-white/10 rounded-full">
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-bold tracking-tight">Delivery & Payment Details</span>
                  </div>

                  <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      
                      {/* Name, Phone, Address Inputs fieldsets */}
                      <div className={`p-3 rounded-xl border space-y-2.5 ${elementBg} ${borderLight}`}>
                        <span className="text-[9px] font-bold text-indigo-400 block uppercase border-b border-slate-400/10 pb-1">Shipping Address</span>
                        
                        <div className="space-y-1.5 text-[9.5px]">
                          <div>
                            <label className="block text-slate-400 mb-0.5">1. Customer Name:</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Enter your full name"
                              value={checkoutName}
                              onChange={(e) => setCheckoutName(e.target.value)}
                              className="w-full border border-slate-700/20 rounded bg-black/10 text-white px-2 py-1 focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-0.5">2. Mobile Number:</label>
                            <input 
                              type="tel"
                              required
                              placeholder="01XXXXXXXXX"
                              value={checkoutPhone}
                              onChange={(e) => setCheckoutPhone(e.target.value.replace(/\D/g, ''))}
                              className="w-full border border-slate-700/20 rounded bg-black/10 text-white px-2 py-1 font-mono focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-0.5">3. Delivery Address:</label>
                            <textarea 
                              required
                              rows={2}
                              placeholder="Enter home address, road, area, and city details..."
                              value={checkoutAddress}
                              onChange={(e) => setCheckoutAddress(e.target.value)}
                              className="w-full border border-slate-700/20 rounded bg-black/10 text-white px-2 py-1 resize-none focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment gateway selectors */}
                      <div className={`p-3 rounded-xl border space-y-2.5 ${elementBg} ${borderLight}`}>
                        <span className="text-[9px] font-bold text-indigo-400 block uppercase border-b border-slate-400/10 pb-1">Payment Method</span>
                        
                        <div className="space-y-2 text-[9.5px]">
                          <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-500/5 transition-colors">
                            <input 
                              type="radio" 
                              name="payMethod" 
                              checked={checkoutPayment === 'COD'}
                              onChange={() => setCheckoutPayment('COD')}
                              className="accent-indigo-500"
                            />
                            <div className="flex items-center gap-1">
                              <CreditCard size={11} className="text-slate-400" />
                              <span className="font-bold">Cash On Delivery (COD)</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-500/5 transition-colors">
                            <input 
                              type="radio" 
                              name="payMethod" 
                              checked={checkoutPayment === 'bKash'}
                              onChange={() => setCheckoutPayment('bKash')}
                              className="accent-indigo-500"
                            />
                            <div className="flex items-center gap-1.5">
                              <span className="bg-[#D12053] text-white text-[7.5px] px-1 rounded font-bold">bKash</span>
                              <span className="font-bold text-[#D12053]">bKash Account Payment</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-500/5 transition-colors">
                            <input 
                              type="radio" 
                              name="payMethod" 
                              checked={checkoutPayment === 'Nagad'}
                              onChange={() => setCheckoutPayment('Nagad')}
                              className="accent-indigo-500"
                            />
                            <div className="flex items-center gap-1.5">
                              <span className="bg-[#EC1C24] text-white text-[7.5px] px-1 rounded font-bold">Nagad</span>
                              <span className="font-bold text-[#EC1C24]">Nagad Account Payment</span>
                            </div>
                          </label>
                        </div>
                      </div>

                    </div>

                    {/* Footer price lock-out & Submit CTA */}
                    <div className={`p-2.5 border-t flex items-center justify-between shrink-0 bg-[#FAFAFC] dark:bg-[#151C2C] ${borderLight}`}>
                      <div>
                        <span className="text-[8px] text-slate-400 font-medium block">Grand Total:</span>
                        <span className="text-xs font-mono font-extrabold text-indigo-500">৳{grandTotal.toLocaleString('bn-BD')}</span>
                      </div>
                      
                      <button
                        type="submit"
                        className="py-1.8 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg tracking-wider font-display transition-transform active:scale-95 shadow cursor-pointer text-center"
                      >
                        {checkoutPayment === 'COD' ? 'Place Order' : 'Go to Payment Gateway'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 6. ORDERS HISTORY & STATUS TRACKING */}
              {emulatorView === 'orders' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-2 border-b flex items-center justify-between shrink-0 bg-indigo-650 text-white">
                    <button onClick={() => setEmulatorView('home')} className="p-1 hover:bg-white/10 rounded-full">
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-bold tracking-tight">My Orders (Tracker)</span>
                    <span className="w-6"></span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                    {orders.length === 0 ? (
                      <div className="text-center py-10 space-y-2">
                        <Inbox size={24} className="mx-auto text-slate-500" />
                        <p className="text-[10px] text-slate-400">You have not placed any orders yet!</p>
                      </div>
                    ) : (
                      orders.map(order => (
                        <div 
                          key={order.id}
                          className={`p-3 rounded-xl border space-y-2 text-left ${elementBg} ${borderLight} text-[10px]`}
                        >
                          <div className="flex justify-between items-center bg-slate-400/5 p-1 rounded-md mb-1 border border-slate-700/10">
                            <span className="font-bold text-white font-mono">{order.id}</span>
                            <span className={`text-[8px] font-bold rounded px-1.5 py-0.2 tracking-wide uppercase ${
                              order.orderStatus === 'Pending' ? 'bg-orange-500/10 text-orange-400' :
                              order.orderStatus === 'Processing' ? 'bg-blue-500/10 text-blue-400' :
                              order.orderStatus === 'Shipped' ? 'bg-cyan-500/10 text-cyan-400' :
                              order.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-400' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              {order.orderStatus === 'Pending' ? 'Pending' :
                               order.orderStatus === 'Processing' ? 'Processing' :
                               order.orderStatus === 'Shipped' ? 'Shipped' :
                               order.orderStatus === 'Delivered' ? 'Delivered' : 'Cancelled'}
                            </span>
                          </div>

                          {/* Ordered item references list */}
                          <div className="space-y-1 block divide-y divide-slate-700/10 max-h-[60px] overflow-y-auto pr-1">
                            {order.items.map((it, i) => (
                              <div key={i} className="flex justify-between items-center text-[9px] py-1 text-slate-300">
                                <span className="truncate pr-2">{it.productName} (x{it.quantity})</span>
                                <span className="font-mono font-bold">৳{it.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          {/* Tracking Vertical State Steps */}
                          <div className="border-t border-slate-400/10 pt-2 flex items-center justify-between">
                            <span className="text-slate-400 text-[8px]">{order.date}</span>
                            <span className="font-bold text-indigo-500 font-mono">Total Paid: ৳{order.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 7. PROFILE PAGE VIEW */}
              {emulatorView === 'profile' && (
                <div className="flex-1 flex flex-col overflow-hidden text-left">
                  <div className="p-2 border-b flex items-center shrink-0 bg-indigo-650 text-white">
                    <button onClick={() => setEmulatorView('home')} className="p-1 hover:bg-white/10 rounded-full">
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-bold tracking-tight">My Profile</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-center">
                    <div className="flex flex-col items-center space-y-1.5">
                      <div className="h-14 w-14 rounded-full bg-slate-900 border-2 border-indigo-400 overflow-hidden shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
                          referrerPolicy="no-referrer"
                          alt="avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{authName}</h4>
                        <span className="text-[9px] text-[#3DDC84] bg-[#3DDC84]/10 border border-[#3DDC84]/20 py-0.2 px-2 rounded-full font-mono font-semibold">Premium Member</span>
                      </div>
                    </div>

                    {/* Shipping stats credentials */}
                    <div className={`p-3 rounded-xl border text-left text-[10px] space-y-2.5 ${elementBg} ${borderLight}`}>
                      <div className="border-b border-slate-400/10 pb-1.5 font-bold text-slate-300 flex items-center gap-1.5">
                        <UserCheck size={11} className="text-indigo-400" />
                        <span>Default Customer Credentials</span>
                      </div>

                      <div className="space-y-1.5 leading-normal">
                        <div>
                          <span className={`${textMuted} font-semibold block text-[8px]`}>Email (Authentication):</span>
                          <span className="font-mono text-slate-300">{authEmail}</span>
                        </div>
                        <div>
                          <span className={`${textMuted} font-semibold block text-[8px]`}>Mobile Number:</span>
                          <span className="font-mono text-slate-300">{authPhone}</span>
                        </div>
                        <div>
                          <span className={`${textMuted} font-semibold block text-[8px]`}>Delivery Address:</span>
                          <span className="text-slate-300">{authAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setAuthMode('login');
                          setIsLoggedIn(false);
                          setEmulatorView('auth');
                        }}
                        className="flex-1 py-1.8 bg-red-500/15 text-red-500 hover:bg-red-500 text-white font-bold text-[10.5px] rounded-lg cursor-pointer border border-red-500/15 duration-75 text-center transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. COMPLETE ADMIN PANEL VIEW inside device */}
              {emulatorView === 'admin' && (
                <div className="flex-1 flex flex-col overflow-hidden text-left text-xs bg-slate-950 text-white">
                  
                  {/* Admin Navigation Header tab bar */}
                  <div className="p-2.5 bg-indigo-950 border-b border-indigo-900 shrink-0 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1">
                      <ShieldCheck size={12} className="text-yellow-400" />
                      <span className="font-extrabold text-[10px] tracking-tight">Admin Dashboard</span>
                    </div>

                    <button 
                      onClick={() => setEmulatorView('home')}
                      className="text-[8px] bg-[#3DDC84] text-black font-bold px-2 py-0.5 rounded"
                    >
                      Customer App
                    </button>
                  </div>

                  {/* Sub Views Header Tabs */}
                  <div className="px-2 bg-indigo-950/40 border-b border-indigo-950/80 shrink-0 flex gap-1.5 overflow-x-auto py-1">
                    <button 
                      onClick={() => setAdminSubView('dashboard')}
                      className={`px-2.5 py-0.8 text-[8.5px] font-extrabold rounded-md transition-colors flex items-center gap-0.8 ${
                        adminSubView === 'dashboard' ? 'bg-[#3DDC84] text-black font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <LayoutDashboard size={9} />
                      <span>Dashboard</span>
                    </button>
                    
                    <button 
                      onClick={() => setAdminSubView('products')}
                      className={`px-2.5 py-0.8 text-[8.5px] font-extrabold rounded-md transition-colors flex items-center gap-0.8 ${
                        adminSubView === 'products' ? 'bg-[#3DDC84] text-black font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Package size={9} />
                      <span>Products ({products.length})</span>
                    </button>
                    
                    <button 
                      onClick={() => setAdminSubView('orders')}
                      className={`px-2.5 py-0.8 text-[8.5px] font-extrabold rounded-md transition-colors flex items-center gap-0.8 ${
                        adminSubView === 'orders' ? 'bg-[#3DDC84] text-black font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ShoppingBag size={9} />
                      <span>Orders ({orders.length})</span>
                    </button>
                  </div>

                  {/* Scroll Area of Sub View */}
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
                    
                    {/* ADMIN VIEW 1: DASHBOARD STATS */}
                    {adminSubView === 'dashboard' && (
                      <div className="space-y-3 text-[10px] text-slate-300">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-indigo-900/20 border border-indigo-500/10 p-2 rounded-xl text-left">
                            <span className="text-slate-400 text-[8px] block font-semibold uppercase">Total Sales (Delivered):</span>
                            <span className="text-xs font-bold text-emerald-400 font-mono">৳{totalSales.toLocaleString()}</span>
                          </div>
                          <div className="bg-indigo-900/20 border border-indigo-500/10 p-2 rounded-xl text-left">
                            <span className="text-slate-400 text-[8px] block font-semibold uppercase">Total Orders:</span>
                            <span className="text-xs font-bold text-slate-100 font-mono">{orders.length}</span>
                          </div>
                        </div>

                        {/* Store parameters */}
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl space-y-1 text-left">
                          <span className="text-[9px] font-bold text-[#3DDC84] block tracking-wide uppercase">Realtime Database Info</span>
                          <div className="space-y-1 text-[9px] text-slate-400 leading-normal">
                            <div className="flex justify-between">
                              <span>Total Products:</span>
                              <span className="font-bold text-slate-200">{products.length} Products</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Product Categories:</span>
                              <span className="font-bold text-slate-200">6 Active</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Active Users (Firestore):</span>
                              <span className="font-bold text-slate-200">1 (Russel)</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-2.5 rounded-xl leading-relaxed text-[9px] text-center">
                          <strong>Admin Control:</strong> Any product price changes or stock increases here will instantly reflect in the customer's app in real-time!
                        </div>
                      </div>
                    )}

                    {/* ADMIN VIEW 2: MANAGE PRODUCTS SCREEN */}
                    {adminSubView === 'products' && (
                      <div className="space-y-2">
                        {/* Title & Plus btn */}
                        <div className="flex justify-between items-center bg-slate-900/35 p-1 rounded">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Product List</span>
                          <button 
                            onClick={handleSaveProduct ? handleOpenAddProduct : undefined}
                            className="text-[9px] bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-1 px-2.5 rounded flex items-center gap-1 active:scale-95 transition-all text-center"
                          >
                            <PlusCircle size={10} />
                            <span>New Item</span>
                          </button>
                        </div>

                        {/* List products for delete or edit */}
                        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                          {products.map(prod => {
                            const showPrice = prod.discountPrice > 0 ? prod.discountPrice : prod.price;
                            return (
                              <div key={prod.id} className="p-1.5 bg-slate-900 border border-slate-850 rounded-lg flex items-center justify-between text-[9px]">
                                <img src={prod.mainImage} className="w-8 h-8 object-cover rounded bg-black shrink-0" alt="adm" referrerPolicy="no-referrer" />
                                <div className="flex-1 min-w-0 px-2 text-left leading-tight">
                                  <h6 className="font-bold text-slate-200 truncate">{prod.name}</h6>
                                  <span className="font-mono text-emerald-400">৳{showPrice}</span>
                                  <span className="text-slate-400 ml-2 font-mono">Stock: {prod.stock}</span>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                  <button onClick={() => handleOpenEditProduct(prod)} className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400">
                                    <Edit size={8} />
                                  </button>
                                  <button onClick={() => handleDeleteProduct(prod.id)} className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-red-500">
                                    <Trash2 size={8} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ADMIN VIEW 3: MANAGE ORDERS TRACK & STATUS */}
                    {adminSubView === 'orders' && (
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase border-b border-slate-400/10 pb-1 text-left">Customer Orders</span>
                        
                        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                          {orders.map(order => (
                            <div key={order.id} className="p-2 bg-slate-900 border border-slate-850 rounded-lg space-y-1.5 text-[9px] text-left">
                              <div className="flex justify-between font-bold text-slate-200">
                                <span className="font-mono">{order.id}</span>
                                <span>৳{order.totalAmount}</span>
                              </div>
                              <p className="text-slate-400 text-[8.5px] truncate">Customer: {order.customerName} ({order.phone})</p>
                              
                              {/* Action dropdown emulator styled select inline */}
                              <div className="flex items-center gap-1 mt-1 bg-black/10 p-1 border border-slate-800 rounded">
                                <span className="text-[8px] text-slate-400 font-medium">Order Status:</span>
                                <select
                                  value={order.orderStatus}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderItem['orderStatus'])}
                                  className="bg-slate-950 border-none text-[8.5px] text-[#3DDC84] font-bold w-full rounded focus:outline-none"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* PHYSICAL BOTTOM ANDROID SYSTEM BAR NAVIGATOR */}
            <div className={`py-1.5 shrink-0 z-40 border-t flex justify-around select-none text-[8.5px] font-semibold ${
              emulatorTheme === 'light' ? 'bg-white border-slate-100 text-slate-500' : 'bg-[#121824] border-slate-800/80 text-slate-400'
            }`}>
              {/* Home */}
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    setEmulatorView('home');
                    setSelectedProduct(null);
                  } else {
                    setEmulatorView('auth');
                  }
                }}
                className={`flex flex-col items-center cursor-pointer hover:text-indigo-600 transition-colors ${
                  emulatorView === 'home' || emulatorView === 'detail' ? 'text-indigo-500' : ''
                }`}
              >
                <Home size={13} />
                <span>Home</span>
              </button>

              {/* Cart */}
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    setEmulatorView('cart');
                  } else {
                    setEmulatorView('auth');
                  }
                }}
                className={`flex flex-col items-center cursor-pointer hover:text-indigo-600 transition-colors relative ${
                  emulatorView === 'cart' || emulatorView === 'checkout' ? 'text-indigo-500' : ''
                }`}
              >
                <div className="relative">
                  <ShoppingCart size={13} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 text-white text-[6.5px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {cart.reduce((s, c) => s + c.quantity, 0)}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </button>

              {/* Order Track */}
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    setEmulatorView('orders');
                  } else {
                    setEmulatorView('auth');
                  }
                }}
                className={`flex flex-col items-center cursor-pointer hover:text-indigo-600 transition-colors ${
                  emulatorView === 'orders' ? 'text-indigo-500' : ''
                }`}
              >
                <Layers size={13} />
                <span>My Orders</span>
              </button>

              {/* Profile */}
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    setEmulatorView('profile');
                  } else {
                    setEmulatorView('auth');
                  }
                }}
                className={`flex flex-col items-center cursor-pointer hover:text-indigo-600 transition-colors ${
                  emulatorView === 'profile' ? 'text-indigo-500' : ''
                }`}
              >
                <User size={13} />
                <span>Profile</span>
              </button>
            </div>

            {/* Android Home Line bar Accent */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-500 rounded-full z-45 shrink-0"></div>
          </div>
        </div>

        {/* PANEL 3: Right Side Code Workspace Developer IDE Tree & Code Block (5 Cols) */}
        <div className="lg:col-span-5 p-4 flex flex-col overflow-hidden bg-[#0A0D14]">
          <CodeWorkspace 
            packageName={packageName}
            setPackageName={setPackageName}
          />
        </div>

      </main>

      {/* ADMIN ADD/EDIT ITEM MODAL OVERLAY */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2333] border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <PlusCircle size={15} className="text-[#3DDC84]" />
                <span>{adminEditingProduct ? 'Edit Product Details' : 'Add New Product'}</span>
              </h3>
              <button 
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 hover:bg-slate-750 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Product Name:</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. OnePlus 11..."
                  value={apName}
                  onChange={(e) => setApName(e.target.value)}
                  className="w-full bg-black/40 border border-[#121824] rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-[#3DDC84]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category:</label>
                  <select 
                    value={apCategory}
                    onChange={(e) => setApCategory(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded px-2 py-1.5 text-white text-xs select-none focus:outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Stock Quantity:</label>
                  <input 
                    type="number" 
                    required
                    placeholder="10"
                    value={apStock}
                    onChange={(e) => setApStock(e.target.value)}
                    className="w-full bg-black/40 border border-slate-800 rounded px-2.5 py-1 text-white focus:outline-none focus:border-[#3DDC84]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Regular Price (৳):</label>
                  <input 
                    type="number" 
                    required
                    placeholder="1200"
                    value={apPrice}
                    onChange={(e) => setApPrice(e.target.value)}
                    className="w-full bg-black/40 border border-slate-800 rounded px-2.5 py-1 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Discount Price (৳):</label>
                  <input 
                    type="number" 
                    placeholder="1000"
                    value={apDiscountPrice}
                    onChange={(e) => setApDiscountPrice(e.target.value)}
                    className="w-full bg-black/40 border border-slate-800 rounded px-2.5 py-1 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Image URL (Unsplash):</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..."
                  value={apImage}
                  onChange={(e) => setApImage(e.target.value)}
                  className="w-full bg-black/40 border border-slate-855 rounded px-2.5 py-1.5 text-white font-mono text-[10px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Detailed Description:</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Enter product details and features..."
                  value={apDescription}
                  onChange={(e) => setApDescription(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded px-2.5 py-1 text-white focus:outline-none focus:border-[#3DDC84] resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  className="py-1.5 px-4 rounded bg-slate-800 hover:bg-slate-750 text-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="py-1.5 px-5 rounded bg-[#3DDC84] hover:bg-[#3DDC84]/95 text-black font-bold font-display"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
