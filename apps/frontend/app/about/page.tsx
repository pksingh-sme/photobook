'use client';

import { Button } from '@ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Us</h1>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Creating Memories That Last
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            We help you turn your precious moments into beautiful, lasting photo books.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Our Story
            </h2>
            <div className="mt-6 text-gray-500 space-y-6">
              <p className="text-lg">
                Founded in 2023, Photo Book Creator began with a simple mission: to help people preserve their most cherished memories in beautiful, high-quality photo books.
              </p>
              <p className="text-lg">
                Our team of passionate designers and engineers came together with the goal of creating the most intuitive and powerful photo book design tool available. We believe that everyone should be able to easily create professional-quality photo books without any design experience.
              </p>
              <p className="text-lg">
                Today, we've helped thousands of customers create stunning photo books for weddings, family vacations, baby's first year, and countless other special moments.
              </p>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="bg-gray-200 rounded-lg overflow-hidden aspect-w-16 aspect-h-9">
              <img 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1517597764930-9354f9d5b0d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
                alt="Team working on photo book designs"
              />
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Our Values
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Quality</h3>
                  <p className="mt-5 text-base text-gray-500">
                    We never compromise on quality. Every photo book is printed with premium materials and careful attention to detail.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Innovation</h3>
                  <p className="mt-5 text-base text-gray-500">
                    We're constantly improving our design tools and printing technology to give you the best possible experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Community</h3>
                  <p className="mt-5 text-base text-gray-500">
                    We believe in building a community of creators who inspire and support each other in preserving memories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="mt-10 lg:mt-0">
              <div className="bg-gray-200 rounded-lg overflow-hidden aspect-w-16 aspect-h-9">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1517597764930-9354f9d5b0d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
                  alt="Photo book printing process"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Our Commitment to Sustainability
              </h2>
              <div className="mt-6 text-gray-500 space-y-6">
                <p className="text-lg">
                  We're committed to reducing our environmental impact through sustainable practices:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-lg text-gray-500">Carbon-neutral shipping</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-lg text-gray-500">Recycled paper options</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-lg text-gray-500">Eco-friendly inks</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-lg text-gray-500">Sustainable packaging</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ready to create your photo book?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Join thousands of happy customers who have preserved their memories with us.
          </p>
          <div className="mt-8">
            <Button size="lg">
              Start Creating
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}