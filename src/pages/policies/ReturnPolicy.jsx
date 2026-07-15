import { motion } from 'framer-motion'

export default function ReturnPolicy() {
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
              Return <span className="text-gradient">Policy</span>
            </h1>
            <p className="mt-4 text-gray-500">Last updated: March 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>7-Day Return Policy</h2>
            <p>
              We want you to love your purchase. If you're not completely satisfied, 
              we accept returns within 7 days of delivery.
            </p>

            <h2>Eligibility for Returns</h2>
            <ul>
              <li>Item must be unworn and in original condition</li>
              <li>Original packaging and tags must be included</li>
              <li>Proof of purchase required</li>
              <li>Custom orders are not eligible for returns</li>
            </ul>

            <h2>How to Initiate a Return</h2>
            <ol>
              <li>Contact us via WhatsApp or email with your order number</li>
              <li>Provide reason for return</li>
              <li>Receive return authorization and instructions</li>
              <li>Ship item back to us</li>
              <li>Receive refund within 5-7 business days</li>
            </ol>

            <h2>Refund Process</h2>
            <p>
              Once we receive and inspect your return, we will process your refund. 
              Refunds will be issued to the original payment method within 5-7 business days.
            </p>

            <h2>Exchanges</h2>
            <p>
              We offer exchanges for different sizes or colors of the same product, 
              subject to availability.
            </p>

            <h2>Damaged or Defective Items</h2>
            <p>
              If you receive a damaged or defective item, please contact us immediately 
              with photos of the damage. We will arrange a free return and replacement.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
