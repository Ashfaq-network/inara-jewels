import { motion } from 'framer-motion'

const REVIEWS = [
  '/images/reviews/1.jpeg',
  '/images/reviews/2.jpeg',
  '/images/reviews/3.jpeg',
  '/images/reviews/4.jpeg',
  '/images/reviews/5.jpeg',
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Reviews() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-16" style={{ backgroundColor: '#AA9092' }}>
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-center text-white">
            Customer <span className="text-gradient">Reviews</span>
          </h1>
          <div className="divider-gold mt-4" />
          <p className="mt-6 text-gray-400 text-center max-w-2xl mx-auto">
            See what our customers have to say about INARA
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
            >
              <img
                src={img}
                alt={`Customer review ${i + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
