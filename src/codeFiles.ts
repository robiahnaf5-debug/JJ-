export interface AndroidFile {
  name: string;
  path: string;
  language: 'java' | 'xml' | 'json' | 'gradle';
  category: 'Java Classes' | 'XML Layouts' | 'Config & Gradle' | 'MVVM Architecture';
  content: string;
}

export const androidCodeProject: AndroidFile[] = [
  {
    name: "AndroidManifest.xml",
    path: "app/src/main/AndroidManifest.xml",
    language: "xml",
    category: "Config & Gradle",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.bangla_ecommerce">

    <!-- Permissions for Internet and Storage -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.BanglaEcommerce"
        android:usesCleartextTraffic="true">

        <!-- Splash Screen Activity -->
        <activity
            android:name=".view.activity.SplashActivity"
            android:exported="true"
            android:theme="@style/Theme.BanglaEcommerce.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Auth Activities -->
        <activity android:name=".view.activity.LoginActivity" android:exported="false" />
        <activity android:name=".view.activity.SignUpActivity" android:exported="false" />
        <activity android:name=".view.activity.ForgotPasswordActivity" android:exported="false" />

        <!-- Main eCommerce App Flow -->
        <activity android:name=".view.activity.MainActivity" android:exported="false" />
        <activity android:name=".view.activity.ProductDetailActivity" android:exported="false" />
        <activity android:name=".view.activity.CheckoutActivity" android:exported="false" />
        <activity android:name=".view.activity.OrderHistoryActivity" android:exported="false" />
        
        <!-- Admin Panel Activities -->
        <activity android:name=".view.activity.AdminActivity" android:exported="false" />
        <activity android:name=".view.activity.AdminAddProductActivity" android:exported="false" />
        <activity android:name=".view.activity.AdminOrderManageActivity" android:exported="false" />

    </application>
</manifest>`
  },
  {
    name: "build.gradle (Module: app)",
    path: "app/build.gradle",
    language: "gradle",
    category: "Config & Gradle",
    content: `plugins {
    id 'com.android.application'
    id 'com.google.gms.google-services' // Firebase Services
}

android {
    namespace 'com.example.bangla_ecommerce'
    compileSdk 34

    defaultConfig {
        applicationId "com.example.bangla_ecommerce"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    buildFeatures {
        viewBinding true // Modern and safe view binding enabled
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Lifecycle components (MVVM & LiveData)
    implementation 'androidx.lifecycle:lifecycle-viewmodel:2.6.2'
    implementation 'androidx.lifecycle:lifecycle-livedata:2.6.2'
    implementation 'androidx.lifecycle:lifecycle-common-java8:2.6.2'

    // Firebase Core, Authentication, Firestore & Cold Storage
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-firestore'
    implementation 'com.google.firebase:firebase-storage'
    implementation 'com.google.firebase:firebase-messaging' // Push Notification

    // Beautiful UI, Image and Animation Utilities
    implementation 'com.github.bumptech.glide:glide:4.16.0' // Smart image loading
    annotationProcessor 'com.github.bumptech.glide:compiler:4.16.0'
    implementation 'com.airbnb.android:lottie:6.1.0' // Smooth UI Vector Animations
    implementation 'com.facebook.shimmer:shimmer:0.5.0' // Loading Placeholders
    implementation 'de.hdodenhof:circleimageview:3.1.0' // Rounded profile avatars
    
    // Test Libraries
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}`
  },
  {
    name: "Product.java",
    path: "app/src/main/java/com/example/bangla_ecommerce/model/Product.java",
    language: "java",
    category: "Java Classes",
    content: `package com.example.bangla_ecommerce.model;

import java.io.Serializable;
import java.util.List;

public class Product implements Serializable {
    private String id;
    private String name;
    private String description;
    private double price;
    private double discountPrice;
    private String category;
    private String mainImage;
    private List<String> images;
    private float rating;
    private int stock;
    private boolean isAvailable;

    // Required empty constructor for Firestore
    public Product() {}

    public Product(String id, String name, String description, double price, double discountPrice, 
                   String category, String mainImage, List<String> images, float rating, int stock) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.discountPrice = discountPrice;
        this.category = category;
        this.mainImage = mainImage;
        this.images = images;
        this.rating = rating;
        this.stock = stock;
        this.isAvailable = stock > 0;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(double discountPrice) { this.discountPrice = discountPrice; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMainImage() { return mainImage; }
    public void setMainImage(String mainImage) { this.mainImage = mainImage; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public float getRating() { return rating; }
    public void setRating(float rating) { this.rating = rating; }

    public int getStock() { return stock; }
    public void setStock(int stock) { 
        this.stock = stock;
        this.isAvailable = stock > 0;
    }

    public boolean isAvailable() { return isAvailable; }

    // Business Logic Helpers
    public double getEffectivePrice() {
        return discountPrice > 0 ? discountPrice : price;
    }

    public double getDiscountPercentage() {
        if (price <= 0 || discountPrice <= 0 || discountPrice >= price) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    }
}`
  },
  {
    name: "ProductRepository.java",
    path: "app/src/main/java/com/example/bangla_ecommerce/repository/ProductRepository.java",
    language: "java",
    category: "MVVM Architecture",
    content: `package com.example.bangla_ecommerce.repository;

import androidx.lifecycle.MutableLiveData;
import com.example.bangla_ecommerce.model.Product;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import java.util.ArrayList;
import java.util.List;

public class ProductRepository {
    private final FirebaseFirestore firestore;
    private final MutableLiveData<List<Product>> productsLiveData;
    private final MutableLiveData<Boolean> isUpdating;

    public ProductRepository() {
        this.firestore = FirebaseFirestore.getInstance();
        this.productsLiveData = new MutableLiveData<>();
        this.isUpdating = new MutableLiveData<>();
    }

    public MutableLiveData<List<Product>> getProducts() {
        isUpdating.setValue(true);
        firestore.collection("products")
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful() && task.getResult() != null) {
                        List<Product> products = new ArrayList<>();
                        for (QueryDocumentSnapshot document : task.getResult()) {
                            Product product = document.toObject(Product.class);
                            product.setId(document.getId());
                            products.add(product);
                        }
                        productsLiveData.setValue(products);
                    }
                    isUpdating.setValue(false);
                });
        return productsLiveData;
    }

    public MutableLiveData<List<Product>> getProductsByCategory(String category) {
        MutableLiveData<List<Product>> categoryFiltered = new MutableLiveData<>();
        firestore.collection("products")
                .whereEqualTo("category", category)
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful() && task.getResult() != null) {
                        List<Product> products = new ArrayList<>();
                        for (QueryDocumentSnapshot document : task.getResult()) {
                            Product product = document.toObject(Product.class);
                            product.setId(document.getId());
                            products.add(product);
                        }
                        categoryFiltered.setValue(products);
                    }
                });
        return categoryFiltered;
    }

    public void addProduct(Product product, MutableLiveData<Boolean> successState) {
        String docId = firestore.collection("products").document().getId();
        product.setId(docId);
        firestore.collection("products").document(docId)
                .set(product)
                .addOnSuccessListener(aVoid -> successState.setValue(true))
                .addOnFailureListener(e -> successState.setValue(false));
    }

    public void updateProduct(Product product, MutableLiveData<Boolean> successState) {
        firestore.collection("products").document(product.getId())
                .set(product)
                .addOnSuccessListener(aVoid -> successState.setValue(true))
                .addOnFailureListener(e -> successState.setValue(false));
    }

    public void deleteProduct(String id, MutableLiveData<Boolean> successState) {
        firestore.collection("products").document(id)
                .delete()
                .addOnSuccessListener(aVoid -> successState.setValue(true))
                .addOnFailureListener(e -> successState.setValue(false));
    }
}`
  },
  {
    name: "HomeViewModel.java",
    path: "app/src/main/java/com/example/bangla_ecommerce/viewmodel/HomeViewModel.java",
    language: "java",
    category: "MVVM Architecture",
    content: `package com.example.bangla_ecommerce.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.example.bangla_ecommerce.model.Product;
import com.example.bangla_ecommerce.repository.ProductRepository;
import java.util.List;

public class HomeViewModel extends ViewModel {
    private final ProductRepository repository;
    private LiveData<List<Product>> allProducts;
    private final MutableLiveData<String> searchKeyword;

    public HomeViewModel() {
        this.repository = new ProductRepository();
        this.allProducts = repository.getProducts();
        this.searchKeyword = new MutableLiveData<>("");
    }

    public LiveData<List<Product>> getAllProducts() {
        return allProducts;
    }

    public void refreshProducts() {
        allProducts = repository.getProducts();
    }

    public LiveData<List<Product>> filterByCategory(String category) {
        if (category == null || category.isEmpty() || category.equals("সকল পণ্য") || category.equals("All Items") || category.equals("All")) {
            return allProducts;
        }
        return repository.getProductsByCategory(category);
    }

    public LiveData<String> getSearchKeyword() {
        return searchKeyword;
    }

    public void setSearchKeyword(String query) {
        this.searchKeyword.setValue(query);
    }
}`
  },
  {
    name: "ProductAdapter.java",
    path: "app/src/main/java/com/example/bangla_ecommerce/adapter/ProductAdapter.java",
    language: "java",
    category: "Java Classes",
    content: `package com.example.bangla_ecommerce.adapter;

import android.content.Context;
import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.example.bangla_ecommerce.databinding.ItemProductBinding;
import com.example.bangla_ecommerce.model.Product;
import java.util.List;

public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ProductViewHolder> {

    private final Context context;
    private final List<Product> productList;
    private final OnProductClickListener listener;

    public interface OnProductClickListener {
        void onProductClick(Product product);
    }

    public ProductAdapter(Context context, List<Product> productList, OnProductClickListener listener) {
        this.context = context;
        this.productList = productList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemProductBinding binding = ItemProductBinding.inflate(LayoutInflater.from(context), parent, false);
        return new ProductViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ProductViewHolder holder, int position) {
        Product product = productList[position];
        holder.bind(product);
    }

    @Override
    public int getItemCount() {
        return productList.size();
    }

    class ProductViewHolder extends RecyclerView.ViewHolder {
        private final ItemProductBinding binding;

        public ProductViewHolder(@NonNull ItemProductBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(Product product) {
            binding.tvProductName.setText(product.getName());
            binding.ratingBar.setRating(product.getRating());
            
            // Checking Stock Status
            if (product.getStock() <= 0) {
                binding.tvStockStatus.setText("Out of Stock");
                binding.tvStockStatus.setTextColor(context.getResources().getColor(android.R.color.holo_red_dark));
                binding.tvStockStatus.setBackgroundResource(android.R.drawable.editbox_dropdown_light_frame);
            } else {
                binding.tvStockStatus.setText("In Stock");
                binding.tvStockStatus.setTextColor(context.getResources().getColor(android.R.color.holo_green_dark));
            }

            // Calculation of Price & Discount Display
            if (product.getDiscountPrice() > 0 && product.getDiscountPrice() < product.getPrice()) {
                binding.tvProductPrice.setText(String.format("৳%.0f", product.getDiscountPrice()));
                binding.tvProductOriginalPrice.setText(String.format("৳%.0f", product.getPrice()));
                binding.tvProductOriginalPrice.setPaintFlags(binding.tvProductOriginalPrice.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
                binding.tvProductOriginalPrice.setVisibility(View.VISIBLE);
                
                // Discount Badge tag
                binding.tvDiscountBadge.setText(String.format("-%.0f%%", product.getDiscountPercentage()));
                binding.tvDiscountBadge.setVisibility(View.VISIBLE);
            } else {
                binding.tvProductPrice.setText(String.format("৳%.0f", product.getPrice()));
                binding.tvProductOriginalPrice.setVisibility(View.GONE);
                binding.tvDiscountBadge.setVisibility(View.GONE);
            }

            // High Performance Image loader using Glide Library
            Glide.with(context)
                    .load(product.getMainImage())
                    .placeholder(android.R.drawable.ic_menu_gallery)
                    .error(android.R.drawable.ic_dialog_alert)
                    .into(binding.ivProductImage);

            itemView.setOnClickListener(v -> {
                if (listener != null) listener.onProductClick(product);
            });
        }
    }
}`
  },
  {
    name: "MainActivity.java",
    path: "app/src/main/java/com/example/bangla_ecommerce/view/activity/MainActivity.java",
    language: "java",
    category: "Java Classes",
    content: `package com.example.bangla_ecommerce.view.activity;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import com.example.bangla_ecommerce.R;
import com.example.bangla_ecommerce.databinding.ActivityMainBinding;
import com.example.bangla_ecommerce.view.fragment.HomeFragment;
import com.example.bangla_ecommerce.view.fragment.CartFragment;
import com.example.bangla_ecommerce.view.fragment.ProfileFragment;
import com.example.bangla_ecommerce.view.fragment.WishlistFragment;
import com.google.firebase.auth.FirebaseAuth;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        mAuth = FirebaseAuth.getInstance();

        // Guard authentication status
        if (mAuth.getCurrentUser() == null) {
            Intent intent = new Intent(MainActivity.this, LoginActivity.class);
            startActivity(intent);
            finish();
            return;
        }

        // Set default fragment dashboard
        replaceFragment(new HomeFragment());

        // Configure smooth navigation transitions
        binding.bottomNavigationView.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) {
                replaceFragment(new HomeFragment());
                return true;
            } else if (id == R.id.nav_wishlist) {
                replaceFragment(new WishlistFragment());
                return true;
            } else if (id == R.id.nav_cart) {
                replaceFragment(new CartFragment());
                return true;
            } else if (id == R.id.nav_profile) {
                replaceFragment(new ProfileFragment());
                return true;
            }
            return false;
        });
    }

    private void replaceFragment(Fragment fragment) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.setCustomAnimations(
                android.R.anim.fade_in,
                android.R.anim.fade_out,
                android.R.anim.slide_in_left,
                android.R.anim.slide_out_right
        );
        fragmentTransaction.replace(R.id.frameLayout, fragment);
        fragmentTransaction.commit();
    }
}`
  },
  {
    name: "activity_main.xml",
    path: "app/src/main/res/layout/activity_main.xml",
    language: "xml",
    category: "XML Layouts",
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.tools.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/bg_light"
    tools:context=".view.activity.MainActivity">

    <!-- Container Frame Layout for Dynamic Fragment Switching -->
    <FrameLayout
        android:id="@+id/frameLayout"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:layout_constraintBottom_toTopOf="@+id/bottomNavigationView"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <!-- Bottom Navigation Bar for Premium Android Navigation Actions -->
    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottomNavigationView"
        android:layout_width="0dp"
        android:layout_height="64dp"
        android:background="@color/white"
        app:elevation="8dp"
        app:itemIconSize="24dp"
        app:itemIconTint="@color/selector_nav_colors"
        app:itemTextColor="@color/selector_nav_colors"
        app:labelVisibilityMode="labeled"
        app:menu="@menu/bottom_menu"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>`
  },
  {
    name: "fragment_home.xml",
    path: "app/src/main/res/layout/fragment_home.xml",
    language: "xml",
    category: "XML Layouts",
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.core.widget.NestedScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fillViewport="true"
    android:background="#FAFAFC">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:paddingBottom="24dp">

        <!-- Custom Android Header with Search View -->
        <RelativeLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:background="@color/primary_brand_color"
            android:padding="16dp">

            <TextView
                android:id="@+id/tvAppTitle"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Amar Bazar"
                android:textColor="@color/white"
                android:textSize="22sp"
                android:textStyle="bold" />

            <ImageView
                android:id="@+id/btnNotification"
                android:layout_width="28dp"
                android:layout_height="28dp"
                android:layout_alignParentEnd="true"
                android:src="@drawable/ic_bell"
                app:tint="@color/white" />

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="48dp"
                android:layout_below="@id/tvAppTitle"
                android:layout_marginTop="16dp"
                android:background="@drawable/shape_rounded_white"
                android:gravity="center_vertical"
                android:orientation="horizontal"
                android:paddingHorizontal="14dp">

                <ImageView
                    android:layout_width="20dp"
                    android:layout_height="20dp"
                    android:src="@android:drawable/ic_menu_search"
                    app:tint="#888888" />

                <EditText
                    android:id="@+id/etSearchBox"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginStart="10dp"
                    android:background="@null"
                    android:hint="Search premium products..."
                    android:textColor="#333333"
                    android:textColorHint="#999999"
                    android:textSize="14sp" />
            </LinearLayout>
        </RelativeLayout>

        <!-- Dynamic Offer Banner viewPager2 -->
        <androidx.cardview.widget.CardView
            android:layout_width="match_parent"
            android:layout_height="180dp"
            android:layout_margin="16dp"
            app:cardCornerRadius="16dp"
            app:cardElevation="2dp">

            <androidx.viewpager2.widget.ViewPager2
                android:id="@+id/bannerViewPager"
                android:layout_width="match_parent"
                android:layout_height="match_parent" />
        </androidx.cardview.widget.CardView>

        <!-- Category Horizontal Title -->
        <HorizontalScrollView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:scrollbars="none"
            android:paddingHorizontal="12dp">

            <LinearLayout
                android:id="@+id/categoryLayout"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:paddingVertical="8dp">
                <!-- Programmatically populated Beautiful Categories Chips -->
            </LinearLayout>
        </HorizontalScrollView>

        <!-- Featured Products Section -->
        <RelativeLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:paddingHorizontal="16dp">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Special Offers"
                android:textColor="#1A1A1A"
                android:textSize="18sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/btnViewMoreOffers"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_alignParentEnd="true"
                android:text="View All"
                android:textColor="@color/primary_brand_color"
                android:textSize="14sp"
                android:textStyle="bold" />
        </RelativeLayout>

        <!-- Products List Shimmer Loading -->
        <com.facebook.shimmer.ShimmerFrameLayout
            android:id="@+id/shimmerView"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_margin="16dp"
            tools:visibility="gone">
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical">
                <include layout="@layout/item_product_placeholder" />
                <include layout="@layout/item_product_placeholder" />
            </LinearLayout>
        </com.facebook.shimmer.ShimmerFrameLayout>

        <!-- Main Product Grid RecyclerView -->
        <androidx.recyclerview.widget.RecyclerView
            android:id="@+id/rvProductsGrid"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginHorizontal="12dp"
            android:layout_marginTop="8dp"
            android:nestedScrollingEnabled="false"
            app:layoutManager="androidx.recyclerview.widget.GridLayoutManager"
            app:spanCount="2"
            tools:listitem="@layout/item_product" />

    </LinearLayout>
</androidx.core.widget.NestedScrollView>`
  },
  {
    name: "item_product.xml",
    path: "app/src/main/res/layout/item_product.xml",
    language: "xml",
    category: "XML Layouts",
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.cardview.widget.CardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="6dp"
    app:cardCornerRadius="14dp"
    app:cardElevation="3dp"
    app:cardBackgroundColor="@color/white">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <RelativeLayout
            android:layout_width="match_parent"
            android:layout_height="140dp">

            <!-- Primary Glide Target Image -->
            <ImageView
                android:id="@+id/ivProductImage"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:scaleType="centerCrop"
                tools:src="@drawable/sample_product" />

            <!-- Percent Discount Rounded Tags -->
            <TextView
                android:id="@+id/tvDiscountBadge"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_alignParentStart="true"
                android:layout_alignParentTop="true"
                android:layout_margin="10dp"
                android:background="@drawable/shape_discount_badge"
                android:paddingHorizontal="8dp"
                android:paddingVertical="4dp"
                android:text="-20%"
                android:textColor="@color/white"
                android:textSize="11sp"
                android:textStyle="bold" />

            <!-- Active stock warning visual chips -->
            <TextView
                android:id="@+id/tvStockStatus"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_alignParentEnd="true"
                android:layout_alignParentBottom="true"
                android:layout_margin="8dp"
                android:background="#E6FFE6"
                android:paddingHorizontal="6dp"
                android:paddingVertical="2dp"
                android:text="In Stock"
                android:textColor="#009900"
                android:textSize="10sp"
                android:textStyle="semibold" />
        </RelativeLayout>

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="12dp">

            <!-- Title content -->
            <TextView
                android:id="@+id/tvProductName"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:ellipsize="end"
                android:maxLines="2"
                android:text="Premium Shoes Collection"
                android:textColor="#2A2A2A"
                android:textSize="14sp"
                android:textStyle="bold" />

            <!-- Google Material Star Rating Bar -->
            <RatingBar
                android:id="@+id/ratingBar"
                style="?android:attr/ratingBarStyleSmall"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="4dp"
                android:numStars="5"
                android:rating="4.5"
                android:stepSize="0.5"
                android:theme="@style/RatingRatingBar" />

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="8dp"
                android:gravity="bottom"
                android:orientation="horizontal">

                <!-- Promo Sales Price Tags -->
                <TextView
                    android:id="@+id/tvProductPrice"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="৳১২০০"
                    android:textColor="@color/primary_brand_color"
                    android:textSize="16sp"
                    android:textStyle="bold" />

                <!-- Original slash tag -->
                <TextView
                    android:id="@+id/tvProductOriginalPrice"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginStart="8dp"
                    android:text="৳১৫০০"
                    android:textColor="#888888"
                    android:textSize="11sp"
                    android:visibility="visible" />
            </LinearLayout>

        </LinearLayout>
    </LinearLayout>
</androidx.cardview.widget.CardView>`
  },
  {
    name: "CheckoutActivity.java",
    path: "app/src/main/java/com/example/bangla_ecommerce/view/activity/CheckoutActivity.java",
    language: "java",
    category: "Java Classes",
    content: `package com.example.bangla_ecommerce.view.activity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.bangla_ecommerce.databinding.ActivityCheckoutBinding;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import java.util.HashMap;
import java.util.Map;

public class CheckoutActivity extends AppCompatActivity {

    private ActivityCheckoutBinding binding;
    private final FirebaseFirestore db = FirebaseFirestore.getInstance();
    private final String userId = FirebaseAuth.getInstance().getCurrentUser().getUid();
    private double grandTotal = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityCheckoutBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        grandTotal = getIntent().getDoubleExtra("GRAND_TOTAL", 0);
        binding.tvCheckoutGrandTotal.setText(String.format("৳%.2f", grandTotal));

        binding.btnConfirmOrder.setOnClickListener(v -> validateAndPlaceOrder());
    }

    private void validateAndPlaceOrder() {
        String name = binding.etCheckoutName.getText().toString().trim();
        String phone = binding.etCheckoutPhone.getText().toString().trim();
        String address = binding.etCheckoutAddress.getText().toString().trim();

        if (name.isEmpty() || phone.isEmpty() || address.isEmpty()) {
            Toast.makeText(this, "Please fill in all details", Toast.LENGTH_SHORT).show();
            return;
        }

        String paymentMethod = "Cash On Delivery";
        if (binding.rbBkash.isChecked()) {
            paymentMethod = "bKash";
        } else if (binding.rbNagad.isChecked()) {
            paymentMethod = "Nagad";
        }

        // Setup firebase order map object
        Map<String, Object> order = new HashMap<>();
        order.put("userId", userId);
        order.put("customerName", name);
        order.put("customerPhone", phone);
        order.put("customerAddress", address);
        order.put("totalAmount", grandTotal);
        order.put("paymentMethod", paymentMethod);
        order.put("orderStatus", "Pending"); // Initial order state
        order.put("timestamp", System.currentTimeMillis());

        binding.btnConfirmOrder.setEnabled(false);
        binding.btnConfirmOrder.setText("Processing order...");

        db.collection("orders").add(order)
                .addOnSuccessListener(documentReference -> {
                    Toast.makeText(CheckoutActivity.this, "Order placed successfully!", Toast.LENGTH_LONG).show();
                    // Clear user cart reference on success 
                    db.collection("carts").document(userId).delete();
                    
                    Intent intent = new Intent(CheckoutActivity.this, OrderHistoryActivity.class);
                    startActivity(intent);
                    finish();
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(CheckoutActivity.this, "Order placement failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    binding.btnConfirmOrder.setEnabled(true);
                    binding.btnConfirmOrder.setText("Confirm Order");
                });
    }
}`
  },
  {
    name: "firestore.rules",
    path: "firestore.rules",
    language: "xml",
    category: "Config & Gradle",
    content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User credentials security structure
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Product read rules (anyone authenticated or public)
    match /products/{productId} {
      allow read: if true; // Allowed even without log-in to allow guests to explore.
      allow write, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Shopping carts secure references
    match /carts/{userId} {
      allow read, write, delete: if request.auth != null && request.auth.uid == userId;
    }

    // Orders permissions rules
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}`
  }
];
