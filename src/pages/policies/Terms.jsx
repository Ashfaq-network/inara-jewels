import { motion } from 'framer-motion'

export default function Terms() {
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
              Terms & <span className="text-gradient">Conditions</span>
            </h1>
            <p className="mt-4 text-gray-500">Last updated: March 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Inara Jewels website, you accept and agree to be 
              bound by these Terms and Conditions.
            </p>

            <h2>2. Products and Pricing</h2>
            <p>
              All product descriptions, images, and prices are subject to change without notice. 
              We reserve the right to modify or discontinue any product at any time.
            </p>

            <h2>3. Orders and Payment</h2>
            <p>
              By placing an order, you represent that all information provided is accurate. 
              We reserve the right to refuse or cancel any order for any reason.
            </p>

            <h2>4. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and images, is the 
              property of Inara Jewels and is protected by copyright laws.
            </p>

            <h2>5. Limitation of Liability</h2>
            <p>
              Inara Jewels shall not be liable for any indirect, incidental, or consequential 
              damages arising from the use of our products or website.
            </p>

            <h2>6. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of 
              Sri Lanka.
            </p>

            <h2>7. Contact</h2>
            <p>
              For questions about these Terms, please contact us at info@jewelinara.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
