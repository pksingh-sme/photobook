# Design Templates Documentation

## Overview

The Design Templates feature allows users to save their photo book designs as reusable templates and load existing templates to jumpstart their design process. This feature enhances productivity by enabling users to create and reuse design patterns.

## Features

1. **Save Designs as Templates** - Users can save their current designs as reusable templates
2. **Load Templates** - Users can load existing templates to use as a starting point
3. **Template Management** - Users can view, edit, and delete their templates
4. **Public Templates** - Templates can be marked as public for community sharing

## Frontend Implementation

### Templates Page
Located at: `apps/frontend/app/templates/page.tsx`

This page provides the main interface for managing templates:
- Display a grid of saved templates with previews
- Save current design as a new template
- Load templates into the designer
- Delete existing templates

### Design Store Updates
Located at: `apps/frontend/lib/store.ts`

The design store has been enhanced with template functionality:
- `saveAsTemplate(name, description)` - Saves current design as a template
- `loadTemplate(template)` - Loads a template into the current design
- `loadTemplates()` - Loads all available templates
- `deleteTemplate(templateId)` - Deletes a template
- `getTemplates()` - Returns currently loaded templates

### Design API Updates
Located at: `apps/frontend/lib/api.ts`

The design API has been extended with template-specific functionality:
- `getTemplates()` - Fetches all public templates
- Enhanced `createDesign()` to support isPublic flag
- Enhanced `getDesigns()` to support filtering by isPublic

## Backend Implementation

### Design Controller Updates
Located at: `apps/backend/src/controllers/designController.ts`

The design controller has been updated to support template functionality:
- Enhanced `getDesigns()` to filter by isPublic parameter
- Enhanced `getDesignById()` to allow access to public designs
- Maintained authentication for private designs

### Design Routes Updates
Located at: `apps/backend/src/routes/designRoutes.ts`

The design routes remain unchanged as the filtering is handled in the controller.

## API Endpoints

### Get Templates (Public Designs)
```
GET /api/designs?isPublic=true
```

Returns all public designs that can be used as templates.

**Response:**
```json
[
  {
    "id": "template-1",
    "name": "Wedding Album Template",
    "description": "Beautiful wedding album layout",
    "isPublic": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Create Template
```
POST /api/designs
```

Creates a new design that can be used as a template by setting `isPublic` to `true`.

**Request Body:**
```json
{
  "name": "Template Name",
  "description": "Template Description",
  "data": { /* design data */ },
  "isPublic": true
}
```

### Get Design (Template)
```
GET /api/designs/:id
```

Retrieves a specific design/template. Public templates can be accessed by any authenticated user.

## User Workflow

### Saving a Design as Template
1. User completes a design in the designer
2. User navigates to the Templates page
3. User clicks "Save Current Design as Template"
4. User enters template name and description
5. Template is saved and appears in the templates list

### Loading a Template
1. User navigates to the Templates page
2. User browses available templates
3. User clicks "Load" on a desired template
4. Template is loaded into the designer as the current design

### Managing Templates
1. User navigates to the Templates page
2. User can view all their saved templates
3. User can delete templates they no longer need
4. User can edit templates by clicking "Edit" and making changes

## Technical Details

### State Management
- Templates are stored in the Zustand store for quick access
- Templates are also persisted to the backend database
- Local templates are combined with backend templates for display

### Data Structure
Templates use the same data structure as regular designs with an additional `isPublic` flag to indicate if they should be available as templates for other users.

### Security
- Only authenticated users can create templates
- Users can only delete templates they created
- Public templates can be viewed by any authenticated user
- Private designs remain accessible only to their owners

## Testing

### Frontend Tests
Located at: `apps/frontend/lib/designApi.test.ts`

Tests should cover:
- Template creation with isPublic flag
- Template retrieval
- Template loading into designer
- Template deletion

### Backend Tests
Backend tests should cover:
- Template creation with isPublic flag
- Template retrieval with filtering
- Access control for public vs private templates
- Template deletion

## Future Enhancements

1. **Template Categories** - Organize templates by category (wedding, family, travel, etc.)
2. **Template Search** - Search templates by name, description, or tags
3. **Template Previews** - Generate visual previews of templates
4. **Template Ratings** - Allow users to rate templates
5. **Template Comments** - Allow users to comment on templates
6. **Template Versioning** - Track changes to templates over time
7. **Template Imports/Exports** - Import/export templates as files
8. **Template Recommendations** - Recommend templates based on user behavior

## Performance Considerations

1. **Pagination** - Implement pagination for large template collections
2. **Caching** - Cache frequently accessed templates
3. **Lazy Loading** - Load template previews only when visible
4. **Efficient Queries** - Optimize database queries for template retrieval

## Integration Points

1. **Designer Page** - Link to templates from the designer
2. **Dashboard** - Quick access to templates from the user dashboard
3. **Gallery** - Integration with photo gallery for template application