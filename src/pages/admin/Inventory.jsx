import React from 'react';

const InventoryData = [
  { id: 'MED-001', name: 'Paracetamol 500mg', category: 'Pharmacy', stock: 1200, unit: 'Tablets', status: 'In Stock' },
  { id: 'MED-002', name: 'Amoxicillin 250mg', category: 'Pharmacy', stock: 45, unit: 'Capsules', status: 'Low Stock' },
  { id: 'SUP-001', name: 'Surgical Gloves (M)', category: 'Supplies', stock: 500, unit: 'Pairs', status: 'In Stock' },
  { id: 'SUP-002', name: 'Face Masks (N95)', category: 'Supplies', stock: 12, unit: 'Pieces', status: 'Out of Stock' },
  { id: 'MED-003', name: 'Insulin Glargine', category: 'Pharmacy', stock: 85, unit: 'Vials', status: 'In Stock' },
];

export default function Inventory() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-headline">Inventory & Supplies</h1>
          <p className="text-on-surface-variant font-medium">Pharmacy and medical equipment management</p>
        </div>
        <button className="px-6 py-2 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Total SKU</p>
          <h3 className="text-3xl font-extrabold font-headline">458</h3>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 shadow-sm">
          <p className="text-amber-700 text-xs font-bold uppercase tracking-widest mb-1">Low Stock Alerts</p>
          <h3 className="text-3xl font-extrabold font-headline text-amber-900">12</h3>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm">
          <p className="text-red-700 text-xs font-bold uppercase tracking-widest mb-1">Out of Stock</p>
          <h3 className="text-3xl font-extrabold font-headline text-red-900">4</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold font-headline">Inventory Log</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search items..." 
              className="px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Item ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm font-medium">
              {InventoryData.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 font-bold text-xs">{item.id}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-surface-container-high text-[10px] font-bold">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.stock}</span>
                      <span className="text-[10px] text-on-surface-variant">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      item.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
