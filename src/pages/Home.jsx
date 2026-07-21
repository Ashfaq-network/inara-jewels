import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Truck, Droplet, ShieldCheck, Star, Heart } from 'lucide-react'
import { supabase } from '@lib/supabase'

const CATEGORIES = [
  { name: 'NECKLACES', slug: 'necklaces', img: '/images/products/necklace-new-1.jpg' },
  { name: 'BRACELETS', slug: 'bracelets', img: '/images/products/bracelet-new-1.jpg' },
  { name: 'BANGLES',   slug: 'bangles',   img: '/images/products/bracelet-new-3.jpg' },
  { name: 'RINGS',     slug: 'rings',     img: '/images/products/ring-new-1.jpg'    },
  { name: 'ANKLETS',   slug: 'anklets',   img: '/images/products/anklet-new-1.jpg'  },
];


const fadeInUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function InaraHome() {
  const [newArrivals, setNewArrivals] = useState([])

  useEffect(() => {
    supabase.from('products').select('*').eq('is_new', true).order('created_at', { ascending: false }).limit(5).then(({ data }) => setNewArrivals(data || []))
  }, [])

  return (
    <div className="min-h-screen w-full bg-background font-body overflow-x-hidden">

      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(350px, 55vw, 600px)' }}
      >
        <img
          src="/hero.jpeg"
          alt="INARA – An opulent touch everyday"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '35% center' }}
        />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-12 md:left-[28%] z-10">
          <Link
            to="/shop"
            className="inline-block pl-20 pr-16 py-3.5 text-transparent uppercase hover:text-white/30 transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white py-10 px-6 border-y border-border/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Truck size={32} className="text-primary mb-4 stroke-[1.5]" />,       label: 'ISLANDWIDE DELIVERY', sub: 'Fast & reliable delivery'  },
              { icon: <Droplet size={32} className="text-primary mb-4 stroke-[1.5]" />,     label: 'WATERPROOF',          sub: 'Made for everyday wear'   },
              { icon: <ShieldCheck size={32} className="text-primary mb-4 stroke-[1.5]" />, label: 'HYPOALLERGENIC',       sub: 'Safe for sensitive skin'  },
              { icon: <Star size={32} className="text-primary mb-4 stroke-[1.5]" />,        label: '18K GOLD PLATED',     sub: 'Premium quality'           },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center">
                {icon}
                <h3 className="font-heading tracking-widest text-sm font-semibold mb-2">{label}</h3>
                <p className="text-muted-foreground text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 px-6 container mx-auto">
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl tracking-[0.2em]">SHOP BY CATEGORY</h2>
          <div className="text-primary text-[10px] mt-4">✦</div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-12">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="relative block aspect-[4/5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03]"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-center">
                  <span className="text-white font-body tracking-widest text-sm font-semibold">{cat.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/shop"
            className="inline-block border border-primary text-primary px-8 py-3 tracking-widest text-sm hover:bg-primary hover:text-white transition-colors"
          >
            VIEW ALL COLLECTIONS
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20 px-6 container mx-auto">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl tracking-[0.2em]">NEW ARRIVALS</h2>
            <div className="text-primary text-[10px] mt-4">✦</div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-12">
            {newArrivals.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/shop/${product.slug}`}
                  className="block bg-white rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary/10">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="absolute top-3 right-3 z-10 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Heart size={20} className="group-hover:fill-primary group-hover:text-primary transition-all" />
                    </button>
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm text-muted-foreground mb-2 truncate">{product.name}</h3>
                    <p className="font-semibold text-foreground">Rs. {(product.price || 0).toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/shop"
              className="inline-block bg-primary text-primary-foreground px-10 py-3 tracking-widest text-sm hover:bg-primary/90 transition-colors"
            >
              SHOP ALL
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
