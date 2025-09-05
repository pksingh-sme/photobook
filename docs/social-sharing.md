# Social Sharing Documentation

## Overview

This document describes the social sharing implementation for the Photo Book Creator application. Users can share their photo book designs and creations on various social media platforms.

## Supported Platforms

- Facebook
- Twitter
- Instagram
- Pinterest
- LinkedIn
- WhatsApp
- Email

## Implementation

### Social Sharing Component

```typescript
// components/SocialShare.tsx
import { useState } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  image?: string;
}

export default function SocialShare({ url, title, description, image }: SocialShareProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image || '')}&description=${encodeURIComponent(description)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
  };

  const handleShare = (platform: string) => {
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    // Show success message
  };

  return (
    <div className="social-share">
      <button onClick={() => setShowShareOptions(!showShareOptions)}>
        Share
      </button>
      
      {showShareOptions && (
        <div className="share-options">
          <button onClick={() => handleShare('facebook')}>
            <FacebookIcon />
            Facebook
          </button>
          <button onClick={() => handleShare('twitter')}>
            <TwitterIcon />
            Twitter
          </button>
          <button onClick={() => handleShare('linkedin')}>
            <LinkedInIcon />
            LinkedIn
          </button>
          <button onClick={() => handleShare('pinterest')}>
            <PinterestIcon />
            Pinterest
          </button>
          <button onClick={() => handleShare('whatsapp')}>
            <WhatsAppIcon />
            WhatsApp
          </button>
          <button onClick={handleEmailShare}>
            <EmailIcon />
            Email
          </button>
          <button onClick={copyToClipboard}>
            <CopyIcon />
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
```

### Integration in Design Page

```typescript
// app/design/page.tsx
import SocialShare from '@ui/SocialShare';

export default function DesignPage() {

  const designUrl = `${window.location.origin}/design/${design.id}`;
  const designTitle = `Check out my photo book design: ${design.title}`;
  const designDescription = 'I created this amazing photo book using Photo Book Creator!';
  const designImage = design.thumbnail || '';

  return (
    <div className="design-page">
      {/* ... existing code ... */}
      
      <div className="design-actions">
        <SocialShare 
          url={designUrl}
          title={designTitle}
          description={designDescription}
          image={designImage}
        />
      </div>
    </div>
  );
}
```

### Integration in Product Pages

```typescript
// app/products/[id]/page.tsx
import SocialShare from '@ui/SocialShare';

export default function ProductDetailPage({ params }: { params: { id: string } }) {

  const productUrl = `${window.location.origin}/products/${params.id}`;
  const productTitle = `Check out this ${product.name}!`;
  const productDescription = product.description || '';

  return (
    <div className="product-detail">
      {/* ... existing code ... */}
      
      <div className="product-actions">
        <SocialShare 
          url={productUrl}
          title={productTitle}
          description={productDescription}
        />
      </div>
    </div>
  );
}
```

## Meta Tags for Social Media

### Open Graph Tags (Facebook, LinkedIn)

```html
<meta property="og:title" content="Photo Book Creator" />
<meta property="og:description" content="Create beautiful custom photo books" />
<meta property="og:image" content="https://example.com/og-image.jpg" />
<meta property="og:url" content="https://photobookcreator.com" />
<meta property="og:type" content="website" />
```

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Photo Book Creator" />
<meta name="twitter:description" content="Create beautiful custom photo books" />
<meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
<meta name="twitter:site" content="@photobookcreator" />
```

### Implementation in Next.js

```typescript
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Book Creator',
  description: 'Create beautiful custom photo books',
  openGraph: {
    title: 'Photo Book Creator',
    description: 'Create beautiful custom photo books',
    url: 'https://photobookcreator.com',
    siteName: 'Photo Book Creator',
    images: [
      {
        url: 'https://photobookcreator.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Photo Book Creator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo Book Creator',
    description: 'Create beautiful custom photo books',
    creator: '@photobookcreator',
    images: ['https://photobookcreator.com/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Dynamic Meta Tags for Design Pages

```typescript
// app/design/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const design = await getDesign(params.id);
  
  return {
    title: `${design.title} - Photo Book Creator`,
    description: design.description || 'Check out this amazing photo book design!',
    openGraph: {
      title: `${design.title} - Photo Book Creator`,
      description: design.description || 'Check out this amazing photo book design!',
      url: `https://photobookcreator.com/design/${params.id}`,
      images: [
        {
          url: design.thumbnail || 'https://photobookcreator.com/default-design-image.jpg',
          width: 1200,
          height: 630,
          alt: design.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${design.title} - Photo Book Creator`,
      description: design.description || 'Check out this amazing photo book design!',
      images: [design.thumbnail || 'https://photobookcreator.com/default-design-image.jpg'],
    },
  };
}
```

## Web Share API

### Progressive Enhancement

```typescript
// lib/socialShare.ts
export const shareNative = async (data: ShareData) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }
  return false;
};

// Usage in component
const handleNativeShare = async () => {
  const shareData = {
    title: 'Photo Book Creator',
    text: 'Check out this amazing photo book!',
    url: window.location.href,
  };

  const shared = await shareNative(shareData);
  if (!shared) {
    // Fallback to traditional sharing options
    setShowShareOptions(true);
  }
};
```

## Analytics Integration

### Tracking Social Shares

```typescript
// lib/analytics.ts
export const trackSocialShare = (platform: string, contentId: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'share', {
      method: platform,
      content_id: contentId,
    });
  }

  // Custom analytics
  fetch('/api/analytics/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      platform,
      contentId,
      timestamp: new Date().toISOString(),
    }),
  });
};
```

### Integration with Social Share Component

```typescript
// components/SocialShare.tsx
import { trackSocialShare } from '@/lib/analytics';

const handleShare = (platform: string) => {
  trackSocialShare(platform, contentId);
  window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
};
```

## Security Considerations

### 1. URL Validation
- Validate URLs before sharing
- Prevent XSS attacks through URL parameters
- Sanitize user-generated content

### 2. Rate Limiting
- Implement rate limiting for share actions
- Prevent abuse of sharing functionality

### 3. Content Moderation
- Review shared content for appropriateness
- Implement reporting mechanisms

## Performance Optimization

### 1. Lazy Loading
- Load social sharing components only when needed
- Use dynamic imports for sharing libraries

### 2. Image Optimization
- Optimize images for social media sharing
- Use appropriate image dimensions (1200x630 for Open Graph)

### 3. Caching
- Cache social media metadata
- Implement CDN for shared images

## Testing

### Unit Tests

```typescript
// __tests__/SocialShare.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SocialShare from '../components/SocialShare';

describe('SocialShare', () => {
  const defaultProps = {
    url: 'https://example.com',
    title: 'Test Title',
    description: 'Test Description',
  };

  it('renders share button', () => {
    render(<SocialShare {...defaultProps} />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('opens share options when clicked', () => {
    render(<SocialShare {...defaultProps} />);
    fireEvent.click(screen.getByText('Share'));
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  it('calls window.open for social platforms', () => {
    window.open = jest.fn();
    render(<SocialShare {...defaultProps} />);
    fireEvent.click(screen.getByText('Share'));
    fireEvent.click(screen.getByText('Facebook'));
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com'),
      '_blank'
    );
  });
});
```

## Accessibility

### 1. Keyboard Navigation
- Ensure all share options are keyboard accessible
- Use proper ARIA labels for icons

### 2. Screen Reader Support
- Provide descriptive text for screen readers
- Use semantic HTML for share components

### 3. Focus Management
- Manage focus when opening/closing share options
- Return focus to trigger button after closing

## Future Enhancements

### 1. Social Media Previews
- Generate dynamic preview images for designs
- Implement server-side image generation

### 2. Social Media Integration
- Direct posting to social media platforms
- OAuth integration for authenticated sharing

### 3. Analytics Dashboard
- Track sharing metrics
- Identify popular content and platforms

### 4. Custom Share Messages
- Allow users to customize share messages
- Template system for different content types