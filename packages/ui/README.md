# UI Components Package

This package contains shared UI components used across the Photo Book Creator application.

## Components

### Chat Components

#### TawkToChat
A component that integrates the Tawk.to live chat widget into the application.

**Props:**
- `propertyId` (string): The Tawk.to property ID
- `widgetId` (string): The Tawk.to widget ID

**Usage:**
```tsx
import { TawkToChat } from '@ui/TawkToChat';

<TawkToChat propertyId="your-property-id" widgetId="your-widget-id" />
```

#### ChatTrigger
A floating button that allows users to open the Tawk.to chat widget.

**Usage:**
```tsx
import { ChatTrigger } from '@ui/ChatTrigger';

<ChatTrigger />
```

The component automatically hides itself when the Tawk.to API is not available and shows when it is loaded.

## Installation

This package is part of the monorepo and should be installed with the rest of the dependencies:

```bash
npm install
```

## Development

To run tests for the UI components:

```bash
npm test
```