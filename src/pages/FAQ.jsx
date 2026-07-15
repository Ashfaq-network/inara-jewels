import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqCategories = [
  {
    title: 'Delivery',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3-5 business days within Sri Lanka. Express delivery is available for 1-2 business days at an additional cost.',
      },
      {
        q: 'Is there free shipping?',
        a: 'Yes! We offer free standard shipping on all orders over Rs. 5,000.',
      },
      {
        q: 'Do you deliver islandwide?',
        a: 'Yes, we deliver to all districts in Sri Lanka.',
      },
    ],
  },
  {
    title: 'Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, Mastercard (via Stripe), local bank payments via PayHere, and Cash on Delivery.',
      },
      {
        q: 'Is it safe to pay online?',
        a: 'Yes! All transactions are encrypted with SSL security. We never store your card details.',
      },
    ],
  },
  {
    title: 'Returns',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day return policy for unworn items in original packaging. Custom orders cannot be returned.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact us via WhatsApp or email with your order number. We will guide you through the process.',
      },
    ],
  },
  {
    title: 'Jewelry Care',
    questions: [
      {
        q: 'How long does the color last?',
        a: 'Our 18K electroplated jewelry maintains its vibrant color for 3-4 months with proper care.',
      },
      {
        q: 'How should I care for my jewelry?',
        a: 'Avoid contact with water, perfume, and chemicals. Store in a dry place. Clean gently with a soft cloth.',
      },
      {
        q: 'Will the jewelry turn my skin green?',
        a: 'No! Our premium stainless steel base prevents skin discoloration.',
      },
    ],
  },
  {
    title: 'Shipping',
    questions: [
      {
        q: 'Can I track my order?',
        a: 'Yes! Once shipped, you will receive a tracking number via SMS and email.',
      },
      {
        q: 'What if my order is delayed?',
        a: 'Contact us immediately and we will investigate. Delays are rare but we will ensure you receive your order.',
      },
    ],
  },
]

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState(null)

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0)

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-softwhite">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-rosegold-50 to-softwhite">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500">
              Find answers to common questions about our products and services
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-rose pl-12 text-lg"
            />
          </div>

          {/* FAQ List */}
          <div className="space-y-8">
            {filteredCategories.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="text-xl font-display font-semibold text-gray-800 mb-4">{category.title}</h2>
                <div className="space-y-3">
                  {category.questions.map((item, qIndex) => {
                    const index = `${catIndex}-${qIndex}`
                    const isOpen = openIndex === index

                    return (
                      <div
                        key={qIndex}
                        className="card-rose overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(index)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <span className="font-medium text-gray-800 pr-4">{item.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-4 pb-4 text-gray-500 border-t border-rosegold-200/50 pt-4">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No questions found matching your search.</p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 card-rose p-8 text-center">
            <h3 className="text-xl font-display font-semibold text-gray-800 mb-2">Still have questions?</h3>
            <p className="text-gray-500 mb-6">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <a
              href="https://wa.me/94770786864"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-rose inline-flex items-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
