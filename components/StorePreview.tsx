import React, { useState } from 'react';
import { Product, Service } from '../types';
import { generateProductDescription } from '../services/geminiService';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'The Zenith Cat Castle', price: 299.99, category: 'furniture', image: 'https://picsum.photos/400/400?random=1', description: 'A towering fortress for your feline overlord.' },
  { id: '2', name: 'Organic Salmon Snaps', price: 12.99, category: 'food', image: 'https://picsum.photos/400/400?random=2', description: 'Freeze-dried perfection for picky eaters.' },
  { id: '3', name: 'Turbo-Chaser Laser Bot', price: 45.00, category: 'toy', image: 'https://picsum.photos/400/400?random=3', description: 'Automated laser engagement system.' },
  { id: '4', name: 'Velvet Lounge Bed', price: 85.50, category: 'furniture', image: 'https://picsum.photos/400/400?random=4', description: 'Orthopedic memory foam luxury.' },
  { id: '5', name: 'Crystal Water Fountain', price: 55.00, category: 'accessory', image: 'https://picsum.photos/400/400?random=5', description: 'Filtered hydration with zen aesthetics.' },
  { id: '6', name: 'Feather Wand Pro', price: 15.99, category: 'toy', image: 'https://picsum.photos/400/400?random=6', description: 'Aerodynamic feathers mimicking real prey.' },
];

const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Virtual Vet Consult', price: '$40/session', icon: '🩺', description: '24/7 access to licensed veterinarians via video chat.' },
  { id: 's2', name: 'Purr-sonal Styling', price: '$25/month', icon: '🎀', description: 'Monthly curated box of accessories tailored to your cat.' },
  { id: 's3', name: 'Cat Sitting Match', price: 'Varies', icon: '🏡', description: 'Connect with verified, cat-obsessed sitters in your area.' },
];

const StorePreview: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleGenerateDescription = async (id: string, name: string, category: string) => {
    setLoadingId(id);
    const newDesc = await generateProductDescription(name, category);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, description: newDesc } : p));
    setLoadingId(null);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
        <img src="https://picsum.photos/1200/600?grayscale" alt="Cat Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-cat-900/80 to-transparent flex items-center">
          <div className="p-12 text-white max-w-xl">
            <h1 className="text-5xl font-serif font-bold mb-4">Luxury for Your Little Lion.</h1>
            <p className="text-lg text-cat-100 mb-8">Curated products and premium services for the discerning cat owner.</p>
            <button className="bg-accent hover:bg-accent-dark text-cat-900 font-bold py-3 px-8 rounded-full transition shadow-lg transform hover:scale-105">
              Shop Collection
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold text-cat-800">Trending Products</h2>
          <span className="text-cat-500 cursor-pointer hover:text-accent-dark">View All &rarr;</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-cat-100 group">
              <div className="h-64 overflow-hidden relative">
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-cat-800 uppercase tracking-wide">
                   {product.category}
                 </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-cat-900">{product.name}</h3>
                  <span className="text-lg font-serif text-cat-600">${product.price}</span>
                </div>
                <p className="text-cat-500 text-sm mb-4 min-h-[3rem]">{product.description}</p>
                <div className="flex justify-between items-center">
                    <button 
                      onClick={() => handleGenerateDescription(product.id, product.name, product.category)}
                      className="text-xs text-accent-dark font-semibold hover:underline disabled:opacity-50"
                      disabled={loadingId === product.id}
                    >
                      {loadingId === product.id ? '✨ Dreaming...' : '✨ AI Rewrite Desc'}
                    </button>
                    <button className="bg-cat-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-cat-700 transition">
                      Add to Cart
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white rounded-3xl p-12 shadow-lg border border-cat-200">
        <h2 className="text-3xl font-serif font-bold text-cat-800 mb-10 text-center">Premium Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_SERVICES.map(service => (
            <div key={service.id} className="text-center p-6 rounded-xl hover:bg-cat-50 transition duration-300">
              <div className="text-6xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-cat-900 mb-2">{service.name}</h3>
              <p className="text-cat-500 mb-4">{service.description}</p>
              <span className="inline-block bg-cat-100 text-cat-800 px-4 py-1 rounded-full text-sm font-semibold">
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePreview;