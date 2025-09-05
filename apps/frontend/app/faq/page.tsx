'use client';

import { useState } from 'react';

const faqs = [
  {
    question: "How do I create a photo book?",
    answer: "Creating a photo book is easy! Simply sign up for an account, upload your photos, choose a template, customize your design using our intuitive editor, and place your order. Our step-by-step wizard will guide you through the entire process."
  },
  {
    question: "What file formats do you support?",
    answer: "We support all major image formats including JPEG, PNG, GIF, BMP, and TIFF. For best results, we recommend using high-resolution JPEG files. Each photo should be at least 300 DPI at the intended print size."
  },
  {
    question: "How long does it take to receive my photo book?",
    answer: "Production time is typically 3-5 business days. Shipping time varies depending on your location and selected shipping method. Standard shipping within the US takes 3-7 business days, while expedited shipping is available for 1-3 business days."
  },
  {
    question: "What sizes and formats are available?",
    answer: "We offer several popular sizes including 8x8 inches, 8x10 inches, 8.5x11 inches, 11x14 inches, and A4. You can choose from softcover, hardcover, and layflat binding options. Page counts range from 20 to 100 pages depending on the size."
  },
  {
    question: "Can I edit my photo book after placing an order?",
    answer: "Yes! You can save your photo book design as a draft and return to edit it at any time before placing your order. Once an order is placed and in production, modifications cannot be made, but you can always create a new order with your updated design."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 100% satisfaction guarantee. If you're not happy with your photo book, contact us within 30 days of delivery for a full refund or replacement. We may ask for photos of any defects to help us improve our quality."
  },
  {
    question: "How do I ensure the best print quality?",
    answer: "For best results, use high-resolution images (at least 300 DPI at print size), avoid placing important elements near the edges where they might be cut off, and preview your book carefully before ordering. Our design tool includes quality warnings for low-resolution images."
  },
  {
    question: "Can I share my photo book designs with others?",
    answer: "Yes! You can save your designs and share them with friends and family. You can also make designs public so others can use them as templates. Collaborative editing features are coming soon."
  },
  {
    question: "Do you offer discounts for bulk orders?",
    answer: "Yes, we offer volume discounts for orders of 10 or more photo books. Contact our sales team for custom pricing on large orders. We also offer special pricing for schools, businesses, and organizations."
  },
  {
    question: "How secure is my personal information?",
    answer: "We take security seriously. All data is encrypted in transit and at rest. We comply with GDPR and CCPA regulations. We never sell or share your personal information with third parties for marketing purposes. Payment information is processed securely through Stripe."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-base font-semibold text-blue-600 tracking-wide uppercase">FAQ</h1>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Frequently Asked Questions
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Find answers to common questions about creating and ordering photo books.
          </p>
        </div>

        <div className="mt-16">
          <dl className="space-y-6 divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="pt-6">
                <dt className="text-lg">
                  <button
                    type="button"
                    className="text-left w-full flex justify-between items-start text-gray-400"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                  >
                    <span className="font-medium text-gray-900 text-lg">
                      {faq.question}
                    </span>
                    <span className="ml-6 h-7 flex items-center">
                      <svg 
                        className={`h-6 w-6 transform ${openIndex === index ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                </dt>
                {openIndex === index && (
                  <dd className="mt-2 pr-12">
                    <p className="text-base text-gray-500">
                      {faq.answer}
                    </p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Still have questions?
            </h2>
            <p className="mt-2 text-lg text-gray-500">
              Can't find the answer you're looking for? Contact our support team.
            </p>
            <div className="mt-6">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}