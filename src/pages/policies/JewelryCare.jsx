import { motion } from 'framer-motion'
import { Droplets, Wind, Sun, Sparkles } from 'lucide-react'

const careTips = [
  {
    icon: Droplets,
    title: 'Avoid Water',
    description: 'Remove jewelry before swimming, bathing, or washing hands. Water can accelerate color fading.',
  },
  {
    icon: Wind,
    title: 'Store Properly',
    description: 'Keep jewelry in a dry, cool place. Use the original box or a jewelry pouch.',
  },
  {
    icon: Sun,
    title: 'Avoid Chemicals',
    description: 'Keep away from perfume, hairspray, lotions, and cleaning products.',
  },
  {
    icon: Sparkles,
    title: 'Clean Gently',
    description: 'Wipe with a soft, dry cloth after each wear to remove oils and dirt.',
  },
]

export default function JewelryCare() {
  return (
    <div className="min-h-screen bg-softwhite">
      <section className="section-padding bg-gradient-to-b from-rosegold-50 to-softwhite">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800">
              Jewelry <span className="text-gradient">Care Guide</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500">
              Tips to keep your jewelry looking beautiful
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Color Guarantee */}
          <div className="card-rose p-8 mb-12 text-center">
            <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
              3-4 Month Color Guarantee
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our 18K electroplated jewelry is designed to maintain its vibrant color 
              for 3-4 months with proper care. Follow these tips to maximize the lifespan 
              of your jewelry.
            </p>
          </div>

          {/* Care Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {careTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-rose p-6"
              >
                <div className="w-12 h-12 rounded-full bg-rosegold-50 flex items-center justify-center mb-4">
                  <tip.icon className="w-6 h-6 text-rosegold-500" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{tip.title}</h3>
                <p className="text-gray-500 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional Tips */}
          <div className="card-rose p-8">
            <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
              Additional Care Tips
            </h2>
            <ul className="space-y-4 text-gray-500">
              <li className="flex items-start gap-3">
                <span className="text-rosegold-500 mt-1">•</span>
                <span>Put on jewelry last, after applying makeup and perfume</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rosegold-500 mt-1">•</span>
                <span>Remove jewelry before exercising or doing physical work</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rosegold-500 mt-1">•</span>
                <span>Avoid wearing jewelry while sleeping</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rosegold-500 mt-1">•</span>
                <span>Separate different jewelry pieces to prevent scratching</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rosegold-500 mt-1">•</span>
                <span>For chain necklaces, clasp them when storing to prevent tangling</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
