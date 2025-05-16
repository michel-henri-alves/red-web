import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', sku: '' });

  const load = async () => {
    const res = await axios.get('http://localhost:3001/products');
    setProducts(res.data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await axios.post('http://localhost:3001/products', form);
    setForm({ name: '', price: '', sku: '' });
    load();
  };

  const del = async (id) => {
    await axios.delete(`http://localhost:3001/products/${id}`);
    load();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Produtos</h2>
      <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Preço" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
      <input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
      <button onClick={save}>Salvar</button>
      <ul>
        {products.map(p => (
          <li key={p._id}>{p.name} - ${p.price} <button onClick={() => del(p._id)}>Excluir</button></li>
        ))}
      </ul>
    </div>
  );
}

export default App;

