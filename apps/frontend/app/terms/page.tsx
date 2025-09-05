'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="mt-16 prose prose-blue prose-lg mx-auto">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Photo Book Creator ("we," "our," or "us"). These Terms of Service ("Terms") 
            govern your access to and use of our website, services, and applications (collectively, 
            the "Service"). By accessing or using our Service, you agree to be bound by these Terms 
            and our Privacy Policy.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use our Service. By agreeing to these Terms, 
            you represent and warrant that you are of legal age to form a binding contract with us.
          </p>

          <h2>3. Account Registration</h2>
          <p>
            To access certain features of our Service, you may be required to create an account. 
            You agree to provide accurate, current, and complete information during registration 
            and to update such information to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account and password 
            and for restricting access to your computer or device. You agree to accept responsibility 
            for all activities that occur under your account or password.
          </p>

          <h2>4. Use of Service</h2>
          <p>
            You agree to use our Service only for lawful purposes and in accordance with these Terms. 
            You agree not to:
          </p>
          <ul>
            <li>Use the Service in any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
            <li>Use the Service in any manner that could disable, overburden, damage, or impair the site</li>
            <li>Use any robot, spider, or other automatic device to monitor or copy our content</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain 
            the exclusive property of Photo Book Creator and its licensors. The Service is protected 
            by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>
          <p>
            Our trademarks and trade dress may not be used in connection with any product or service 
            without the prior written consent of Photo Book Creator.
          </p>

          <h2>6. User Content</h2>
          <p>
            You retain all rights in, and are solely responsible for, the User Content you post to the Service. 
            By posting User Content to the Service, you grant us a worldwide, non-exclusive, royalty-free 
            license to use, reproduce, modify, publish, translate, distribute, publicly display, and create 
            derivative works of such User Content in connection with operating and providing the Service.
          </p>
          <p>
            You represent and warrant that: (i) you own the User Content or have the right to use it; 
            and (ii) the User Content does not violate any third-party rights or any applicable laws.
          </p>

          <h2>7. Photo Books</h2>
          <p>
            When you order a photo book through our Service, you are making an offer to purchase the 
            photo book. All orders are subject to acceptance by us. We reserve the right to refuse 
            or cancel any order for any reason.
          </p>
          <p>
            You agree to pay all charges incurred by you or on your behalf through the Service, 
            at the prices in effect when such charges are incurred. All payments are non-refundable 
            except as expressly provided in these Terms or our Return Policy.
          </p>

          <h2>8. Privacy</h2>
          <p>
            Our Privacy Policy describes how we collect, use, and share information about you. 
            By using our Service, you agree that we may use your information in accordance with 
            our Privacy Policy.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE DISCLAIM ALL 
            WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION 
            ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
            TITLE, AND NON-INFRINGEMENT.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL PHOTO BOOK CREATOR, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE 
            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING 
            WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER LOSSES, RESULTING 
            FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) 
            ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; OR (III) UNAUTHORIZED 
            ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Photo Book Creator, its affiliates, 
            licensors, and service providers, and its and their respective officers, directors, 
            employees, contractors, agents, licensors, suppliers, successors, and assigns from 
            and against any claims, liabilities, damages, judgments, awards, losses, costs, 
            expenses, or fees (including reasonable attorneys' fees) arising out of or relating 
            to your violation of these Terms or your use of the Service, including, but not limited 
            to, your User Content, any use of the Service's content, services, and products other 
            than as expressly authorized in these Terms, or your use of any information obtained 
            from the Service.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of California, 
            without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered 
            a waiver of those rights. If any provision of these Terms is held to be invalid or 
            unenforceable by a court, the remaining provisions of these Terms will remain in effect. 
            These Terms constitute the entire agreement between us regarding our Service, and 
            supersede and replace any prior agreements we might have had between us regarding the Service.
          </p>

          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            If a revision is material, we will provide at least 30 days' notice prior to any new terms 
            taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after those revisions become effective, 
            you agree to be bound by the revised terms. If you do not agree to the new terms, 
            you must stop using the Service.
          </p>

          <h2>14. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            Photo Book Creator<br />
            123 Photo Street<br />
            San Francisco, CA 94103<br />
            Email: legal@photobookcreator.com
          </p>
        </div>
      </div>
    </div>
  );
}