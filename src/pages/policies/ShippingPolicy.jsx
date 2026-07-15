import { motion } from 'framer-motion'

export default function ShippingPolicy() {
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
              Shipping <span className="text-gradient">Policy</span>
            </h1>
            <p className="mt-4 text-gray-500">Last updated: March 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>Shipping Options</h2>
            
            <h3>Standard Delivery</h3>
            <ul>
              <li>Duration: 3-5 business days</li>
              <li>Cost: Rs. 350</li>
              <li>Free on orders over Rs. 5,000</li>
            </ul>

            <h3>Express Delivery</h3>
            <ul>
              <li>Duration: 1-2 business days</li>
              <li>Cost: Rs. 700</li>
            </ul>

            <h3>Store Pickup</h3>
            <ul>
              <li>Ready within 2 hours</li>
              <li>Free</li>
            </ul>

            <h2>Coverage Area</h2>
            <p>
              We deliver islandwide to all districts in Sri Lanka. Delivery times may vary 
              for remote areas.
            </p>

            <h2>Order Processing</h2>
            <p>
              Orders placed before 2 PM will be processed same day. Orders placed after 
              2 PM will be processed the next business day.
            </p>

            <h2>Tracking</h2>
            <p>
              Once your order is shipped, you will receive a tracking number via SMS and email. 
              You can track your order using our order tracking page.
            </p>

            <h2>International Shipping</h2>
            <p>
              Currently, we only ship within Sri Lanka. International shipping coming soon!
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
