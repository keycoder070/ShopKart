
import { useEffect, useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 1999, oldPrice: 2999, emoji: "🎧", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", rating: 4.5 },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 2499, oldPrice: 3499, emoji: "⌚", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", rating: 4.3 },
  { id: 3, name: "Running Shoes", category: "Fashion", price: 1799, oldPrice: 2499, emoji: "👟", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", rating: 4.6 },
  { id: 4, name: "Classic Backpack", category: "Fashion", price: 999, oldPrice: 1499, emoji: "🎒", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600", rating: 4.2 },
  { id: 5, name: "Sunglasses", category: "Fashion", price: 799, oldPrice: 1199, emoji: "🕶️", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600", rating: 4.1 },
  { id: 6, name: "Coffee Maker", category: "Home", price: 2299, oldPrice: 2999, emoji: "☕", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600", rating: 4.4 },
  { id: 7, name: "Desk Lamp", category: "Home", price: 699, oldPrice: 999, emoji: "💡", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600", rating: 4.0 },
  { id: 8, name: "Bluetooth Speaker", category: "Electronics", price: 1499, oldPrice: 2199, emoji: "🔊", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600", rating: 4.5 },
];

function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopkart-cart")) || [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("shopkart-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = () => {
    if (cart.length === 0) return;

    const confirmed = window.confirm(
      `Your total is ₹${totalPrice.toLocaleString("en-IN")}. Place demo order?`
    );

    if (confirmed) {
      alert("Order placed successfully! This is a demo checkout.");
      setCart([]);
      setCartOpen(false);
    }
  };

  return (
    <div className="shop">
      <header className="navbar">
        <a className="logo" href="#">Shop<span>Kart.</span></a>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span>⌕</span>
        </div>

        <button className="cart-button" onClick={() => setCartOpen(true)}>
          🛒 Cart <span className="cart-count">{totalItems}</span>
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">YOUR EVERYDAY SHOPPING DESTINATION</p>
            <h1>Find Your<br /><span>Everyday Essentials.</span></h1>
            <p>Discover amazing products at prices you'll love.</p>
            <a href="#products" className="hero-button">Shop Now →</a>
          </div>
          <div className="hero-art">🛍️</div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR COLLECTION</p>
              <h2>Explore Products</h2>
            </div>
            <span>{filteredProducts.length} products found</span>
          </div>

          <div className="categories">
            {["All", "Electronics", "Fashion", "Home"].map((item) => (
              <button
                key={item}
                className={category === item ? "category active" : "category"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <span className="product-emoji">{product.emoji}</span>
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="discount">
                    {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                  </span>
                </div>

                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <p className="rating">★ {product.rating} <span>• Free delivery</span></p>

                  <div className="price-row">
                    <div>
                      <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                      <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>
                    </div>
                    <button className="add-button" onClick={() => addToCart(product)}>
                      + Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="empty-message">No products found. Try another search.</p>
          )}
        </section>

        {cartOpen && (
          <div className="cart-overlay" onClick={() => setCartOpen(false)}>
            <aside className="cart-panel" onClick={(e) => e.stopPropagation()}>
              <div className="cart-heading">
                <h2>Your Cart ({totalItems})</h2>
                <button onClick={() => setCartOpen(false)}>✕</button>
              </div>

              {cart.length === 0 ? (
                <p className="empty-message">Your cart is empty. Start shopping!</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img
                        className="cart-product-image"
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                        <div className="quantity">
                          <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="cart-total">
                    <span>Total Amount</span>
                    <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
                  </div>

                  <button className="checkout-button" onClick={checkout}>
                    Proceed to Checkout →
                  </button>
                  <p className="demo-note">Demo checkout — no real payment is processed.</p>
                </>
              )}
            </aside>
          </div>
        )}
      </main>

      <footer>
        <a className="logo" href="#">Shop<span>Kart.</span></a>
        <p>Shopping made simple. © 2026 ShopKart.</p>
      </footer>
    </div>
  );
}

export default App;
