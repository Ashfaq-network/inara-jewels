import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
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
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="mt-4 text-gray-500">Last updated: March 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including your name, email address, 
              phone number, shipping address, and payment information when you make a purchase.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and updates</li>
              <li>Communicate with you about products and promotions</li>
              <li>Improve our services and website</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share 
              your information with trusted service providers who assist us in operating our 
              website and conducting our business.
            </p>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              All payment transactions are encrypted using SSL technology.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. 
              To exercise these rights, please contact us at info@jewelinara.com.
            </p>

            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at 
              info@jewelinara.com or via WhatsApp at +94 XX XXX XXXX.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
