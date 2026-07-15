import { useState, useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { Loader2, Users, Mail, Phone, Shield } from 'lucide-react'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setCustomers(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-rosegold-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800">Customers</h1>
        <p className="text-gray-400 text-sm mt-1">{customers.length} registered users</p>
      </div>

      <div className="card-rose hover:transform-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rosegold-100">
                <th className="text-left px-5 py-3 font-medium text-gray-400">Name</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Email</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Phone</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Role</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-rosegold-50 last:border-0 hover:bg-rosegold-50/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-rosegold-100 flex items-center justify-center text-sm font-semibold text-rosegold-600 flex-shrink-0">
                          {customer.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-gray-700">{customer.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-300" />
                        <span className="truncate max-w-[160px]" title={customer.email || customer.user_id || '—'}>
                          {customer.email || (customer.user_id ? customer.user_id.slice(0, 8) + '…' : '—')}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {customer.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-300" />
                          {customer.phone}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        customer.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {customer.role === 'admin' && <Shield className="w-3 h-3" />}
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString('en-LK')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
