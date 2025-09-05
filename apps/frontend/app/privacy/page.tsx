'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="mt-16 prose prose-blue prose-lg mx-auto">
          <h2>1. Introduction</h2>
          <p>
            Photo Book Creator ("we," "our," or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you visit our website and use our services. Please read this 
            privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the site or use our services.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>
            We may collect personally identifiable information that you voluntarily provide to us 
            when you register on the site, express an interest in obtaining information about us 
            or our products and services, participate in activities on the site, or otherwise 
            contact us. The personal information we collect may include:
          </p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Mailing address</li>
            <li>Payment information</li>
            <li>Photographs and other content you upload</li>
          </ul>

          <h3>Derivative Information</h3>
          <p>
            Information our servers automatically collect when you access our Service, such as 
            your IP address, your browser type, your operating system, your access times, 
            and the pages you have viewed directly before and after accessing our Service.
          </p>

          <h3>Financial Information</h3>
          <p>
            We may collect information necessary to process your payment, such as your credit 
            card number and billing address. However, we do not store full credit card information 
            on our servers. All payment processing is handled by third-party payment processors 
            such as Stripe, who use bank-level security to protect your information.
          </p>

          <h2>3. Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, 
            efficient, and customized experience. Specifically, we may use information collected 
            about you via the Service to:
          </p>
          <ul>
            <li>Create and manage your account</li>
            <li>Process your transactions and send related information</li>
            <li>Send you promotional information, if you have requested it</li>
            <li>Respond to your comments, questions, and provide customer service</li>
            <li>Monitor and analyze usage and trends to improve your experience</li>
            <li>Protect, investigate, and deter fraudulent, unauthorized, or illegal activity</li>
          </ul>

          <h2>4. Disclosure of Your Information</h2>
          <p>
            We may share information we have collected about you in certain situations:
          </p>
          <ul>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party vendors, 
            service providers, contractors, or agents who perform services for us or on our behalf 
            and require access to such information to do that work.</li>
            <li><strong>Communications</strong> We may use your personal information to contact you with newsletters, 
            marketing or promotional materials, and other information that may be of interest to you.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information where we are legally required 
            to do so in order to comply with applicable law, governmental requests, a judicial 
            proceeding, court order, or legal process.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, 
            or during negotiations of, any merger, sale of company assets, financing, or 
            acquisition of all or a portion of our business to another company.</li>
          </ul>

          <h2>5. Tracking Technologies</h2>
          <h3>Cookies</h3>
          <p>
            We use cookies and similar tracking technologies to access or store information. 
            Cookies are small data files that are placed on your computer or other mobile device 
            when you visit a website. We use both session cookies (which expire once you close 
            your web browser) and persistent cookies (which stay on your computer or mobile device 
            until you delete them) to analyze trends, administer the site, track users' movements 
            around the site, and gather demographic information about our user base as a whole.
          </p>

          <h3>Web Beacons</h3>
          <p>
            We may use web beacons, also known as "clear gifs," "pixel tags," or "single-pixel gifs." 
            These are tiny graphics with a unique identifier, similar in function to cookies, 
            and are used to track the online movements of web users. In contrast to cookies, 
            which are stored on a user's computer hard drive, web beacons are embedded invisibly 
            on web pages. We may use web beacons to verify cookie deployment, compile statistics 
            about web usage and site performance, and monitor the effectiveness of our promotional 
            campaigns.
          </p>

          <h2>6. Third-Party Websites</h2>
          <p>
            The Service may contain links to third-party websites and applications. Any such 
            links are provided solely as a convenience to you, and the inclusion of such links 
            does not imply endorsement by us. We have no control over the content, privacy policies, 
            or practices of any third-party websites or services. We encourage you to review 
            the privacy policy of any third-party websites you visit.
          </p>

          <h2>7. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect 
            your personal information. While we have taken reasonable steps to secure the personal 
            information you provide to us, please be aware that despite our efforts, no security 
            measures are perfect or impenetrable, and no method of data transmission can be 
            guaranteed against any interception or other type of misuse.
          </p>

          <h2>8. Data Retention</h2>
          <p>
            We will retain your information for as long as your account is active or as needed 
            to provide you services. We will retain and use your information as necessary to 
            comply with our legal obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2>9. Data Transfer</h2>
          <p>
            Your information, including personal information, may be transferred to and maintained 
            on computers located outside of your state, province, country, or other governmental 
            jurisdiction where the data protection laws may differ from those in your jurisdiction. 
            If you are located outside the United States and choose to provide information to us, 
            please note that we transfer the information, including personal information, to the 
            United States and process it there.
          </p>

          <h2>10. Your Data Protection Rights</h2>
          <p>
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <ul>
            <li><strong>The right to access</strong> - You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification</strong> - You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
            <li><strong>The right to erasure</strong> - You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing</strong> - You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>The right to object to processing</strong> - You have the right to object to our processing of your personal data, under certain conditions.</li>
            <li><strong>The right to data portability</strong> - You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
          <p>
            If you make a request, we have one month to respond to you. If you would like to exercise 
            any of these rights, please contact us.
          </p>

          <h2>11. Children's Privacy</h2>
          <p>
            We do not knowingly solicit information from or market to children under the age of 13. 
            If you become aware of any data we have collected from children under age 13, please 
            contact us.
          </p>

          <h2>12. California Privacy Rights</h2>
          <p>
            California Civil Code Section 1798.83, also known as the "Shine The Light" law, 
            permits our customers who are California residents to request and obtain from us, 
            once a year and free of charge, information about categories of personal information 
            (if any) we disclosed to third parties for direct marketing purposes and the names 
            and addresses of all third parties with which we shared personal information in 
            the immediately preceding calendar year. If you are a California resident and would 
            like to make such a request, please submit your request in writing to us using 
            the contact information provided below.
          </p>

          <h2>13. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time in order to reflect, for example, 
            changes to our practices or for other operational, legal, or regulatory reasons. 
            We will post the revised Privacy Policy on the Service and update the "Last updated" 
            date at the top of this Privacy Policy. You are advised to review this Privacy Policy 
            periodically for any changes. Changes to this Privacy Policy are effective when 
            they are posted on this page.
          </p>

          <h2>14. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may email us at:
          </p>
          <p>
            Photo Book Creator<br />
            123 Photo Street<br />
            San Francisco, CA 94103<br />
            Email: privacy@photobookcreator.com
          </p>
        </div>
      </div>
    </div>
  );
}