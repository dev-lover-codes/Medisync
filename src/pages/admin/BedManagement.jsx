import React from 'react';

const Wards = [
  { name: 'Emergency Care', total: 10, occupied: 8 },
  { name: 'Intensive Care (ICU)', total: 5, occupied: 4 },
  { name: 'General Ward - A', total: 20, occupied: 12 },
  { name: 'Pediatrics', total: 15, occupied: 10 },
  { name: 'Maternity', total: 10, occupied: 5 },
];

/**
 * BedManagement Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function BedManagement() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div>
        <h1 className="text-3xl font-extrabold font-headline">Bed & Ward Management</h1>
        <p className="text-on-surface-variant font-medium">Real-time occupancy tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Wards.map((ward) => (
          <div key={ward.name} className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-extrabold text-lg">{ward.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                ward.occupied / ward.total > 0.8 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {Math.round((ward.occupied / ward.total) * 100)}% Full
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant font-medium">Occupied Beds</span>
                <span className="font-bold">{ward.occupied}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant font-medium">Available Beds</span>
                <span className="font-bold text-primary">{ward.total - ward.occupied}</span>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${ward.occupied / ward.total > 0.8 ? 'bg-red-500' : 'bg-primary'}`} 
                  style={{ width: `${(ward.occupied / ward.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10">
          <h2 className="text-xl font-extrabold font-headline">Detailed Bed Registry</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Bed ID</th>
                <th className="px-6 py-4">Ward</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Admission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {[101, 102, 103, 201].map((id) => (
                <tr key={id} className="hover:bg-surface-container-lowest">
                  <td className="px-6 py-4 font-bold">B-{id}</td>
                  <td className="px-6 py-4 font-medium">General Ward A</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Available</span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">---</td>
                  <td className="px-6 py-4 text-on-surface-variant">---</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
