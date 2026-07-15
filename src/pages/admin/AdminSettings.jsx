import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, Truck, Store, CheckCircle } from 'lucide-react';
import { supabase } from '@lib/supabase';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(null);
  const [success, setSuccess] = useState(null);

  const [delivery, setDelivery] = useState({
    standard: '',
    express: '',
    pickup: '',
  });

  const [storeInfo, setStoreInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('store_settings')
      .select('*');

    if (!error && data) {
      data.forEach((row) => {
        if (row.key === 'delivery_charges') {
          const val = row.value || {};
          setDelivery({
            standard: val.standard ?? '',
            express: val.express ?? '',
            pickup: val.pickup ?? '',
          });
        }
        if (row.key === 'store_info') {
          const val = row.value || {};
          setStoreInfo({
            name: val.name ?? '',
            email: val.email ?? '',
            phone: val.phone ?? '',
            address: val.address ?? '',
          });
        }
      });
    }
    setLoading(false);
  };

  const showSuccess = (section) => {
    setSuccess(section);
    setTimeout(() => setSuccess(null), 2500);
  };

  const saveDelivery = async () => {
    setSavingSection('delivery');
    const value = {
      standard: Number(delivery.standard) || 0,
      express: Number(delivery.express) || 0,
      pickup: Number(delivery.pickup) || 0,
    };
    const { error } = await supabase
      .from('store_settings')
      .upsert({ key: 'delivery_charges', value }, { onConflict: 'key' });
    setSavingSection(null);
    if (!error) showSuccess('delivery');
  };

  const saveStoreInfo = async () => {
    setSavingSection('store');
    const value = {
      name: storeInfo.name,
      email: storeInfo.email,
      phone: storeInfo.phone,
      address: storeInfo.address,
    };
    const { error } = await supabase
      .from('store_settings')
      .upsert({ key: 'store_info', value }, { onConflict: 'key' });
    setSavingSection(null);
    if (!error) showSuccess('store');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-rosegold-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>

      <div className="card-rose rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Truck className="w-5 h-5 text-rosegold-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            Delivery Charges
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Standard (LKR)
            </label>
            <input
              type="number"
              className="input-rose w-full"
              value={delivery.standard}
              onChange={(e) =>
                setDelivery({ ...delivery, standard: e.target.value })
              }
              min={0}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Express (LKR)
            </label>
            <input
              type="number"
              className="input-rose w-full"
              value={delivery.express}
              onChange={(e) =>
                setDelivery({ ...delivery, express: e.target.value })
              }
              min={0}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Pickup (LKR)
            </label>
            <input
              type="number"
              className="input-rose w-full"
              value={delivery.pickup}
              onChange={(e) =>
                setDelivery({ ...delivery, pickup: e.target.value })
              }
              min={0}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            className="btn-rose inline-flex items-center gap-2"
            onClick={saveDelivery}
            disabled={savingSection === 'delivery'}
          >
            {savingSection === 'delivery' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
          <AnimatePresence>
            {success === 'delivery' && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Settings saved successfully!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="card-rose rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Store className="w-5 h-5 text-rosegold-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            Store Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Store Name
            </label>
            <input
              type="text"
              className="input-rose w-full"
              value={storeInfo.name}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              className="input-rose w-full"
              value={storeInfo.email}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Phone
            </label>
            <input
              type="tel"
              className="input-rose w-full"
              value={storeInfo.phone}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              className="input-rose w-full"
              value={storeInfo.address}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, address: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            className="btn-rose inline-flex items-center gap-2"
            onClick={saveStoreInfo}
            disabled={savingSection === 'store'}
          >
            {savingSection === 'store' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
          <AnimatePresence>
            {success === 'store' && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Settings saved successfully!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
