import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export default function Catalog() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const response = await api.get(`/products?${params}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🛍️ Catalogue</h1>

        {/* Filtres */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded text-white"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="">Toutes les catégories</option>
            <option value="logiciels">Logiciels</option>
            <option value="templates">Templates</option>
            <option value="ebooks">Ebooks</option>
            <option value="cours">Cours</option>
            <option value="plugins">Plugins</option>
            <option value="themes">Themes</option>
            <option value="scripts">Scripts</option>
          </select>
        </div>

        {/* Produits */}
        {loading ? (
          <div className="text-center py-12">
            <p>Chargement...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{product.description.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-400">${product.price}</span>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded capitalize">{product.category}</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold transition">
                    🛒 Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
