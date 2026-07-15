import { motion } from 'framer-motion'
import { Target, Eye, Heart, Award, Users, Globe } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const values = [
  {
    icon: Award,
    title: 'Quality First',
    description: 'We never compromise on quality. Every piece is crafted with premium materials and meticulous attention to detail.',
  },
  {
    icon: Heart,
    title: 'Customer Love',
    description: 'Your satisfaction is our priority. We go above and beyond to ensure you love your jewelry.',
  },
  {
    icon: Globe,
    title: 'Sustainability',
    description: 'We believe in responsible fashion. Our stainless steel jewelry is eco-friendly and long-lasting.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a community of jewelry lovers who appreciate affordable luxury.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-softwhite">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-rosegold-50 to-softwhite">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800">
              Our <span className="text-gradient">Story</span>
            </h1>
            <div className="w-16 h-0.5 bg-rosegold-400 mx-auto mt-6" />
            <p className="mt-8 text-xl text-gray-500 leading-relaxed">
              Born from a passion for elegant jewelry that everyone can afford
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 text-center mb-10">
              From Passion to <span className="text-gradient">Purpose</span>
            </h2>
            <div className="space-y-8">
              <p className="text-gray-500 leading-loose text-center text-lg">
                Inara Jewels was founded with a simple vision: to make beautiful, high-quality 
                jewelry accessible to everyone. We believe that luxury shouldn't come with 
                a luxury price tag.
              </p>
              <p className="text-gray-500 leading-loose text-center text-lg">
                Our journey began when we noticed a gap in the market for premium jewelry 
                that combines elegant design with affordability. We source our materials 
                directly from trusted factories, cutting out middlemen to bring you the 
                best prices without compromising on quality.
              </p>
              <p className="text-gray-500 leading-loose text-center text-lg">
                Every piece in our collection is made from premium stainless steel with 
                18K electroplating, ensuring lasting beauty that withstands the test of time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-rosegold-50 to-softwhite">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800">
              Mission & <span className="text-gradient">Vision</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="card-rose p-10"
            >
              <Target className="w-12 h-12 text-rosegold-500 mb-6" />
              <h3 className="text-2xl font-display font-bold text-gray-800 mb-5">Our Mission</h3>
              <p className="text-gray-500 leading-loose text-lg">
                To provide premium, affordable jewelry that empowers everyone to express 
                their unique style. We are committed to delivering exceptional quality, 
                outstanding customer service, and a seamless shopping experience.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="card-rose p-10"
            >
              <Eye className="w-12 h-12 text-rosegold-500 mb-6" />
              <h3 className="text-2xl font-display font-bold text-gray-800 mb-5">Our Vision</h3>
              <p className="text-gray-500 leading-loose text-lg">
                To become Sri Lanka's most loved jewelry brand, known for our quality, 
                innovation, and commitment to making luxury accessible. We envision a 
                world where everyone can sparkle without breaking the bank.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800">
              Our <span className="text-gradient">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="card-rose p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rosegold-50 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-rosegold-500" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
