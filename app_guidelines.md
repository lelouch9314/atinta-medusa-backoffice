# Platform Guidelines & Moderation Rules

This document outlines the operational guidelines for the Custom Print Platform.

## 1. User Roles & Permissions

- **Customer**: Can browse approved designs, create customization requests, and manage their own orders.
- **Designer**: Can upload new designs, manage their portfolio, and view the status of their submissions.
- **Moderator**: Can review pending designs, approve or reject them based on guidelines, and manage reported content.
- **Admin**: Full access to the system, including user management, product/category configuration, and system settings.

## 2. Design Submission & Moderation Flow

1. **Submission**: A Designer uploads a design (image, title, description). The initial status is `PENDING_REVIEW`.
2. **Review**: A Moderator reviews the design.
3. **Approval**: If the design complies with guidelines, it is marked as `APPROVED` and becomes visible to Customers.
4. **Rejection**: If the design violates guidelines, it is marked as `REJECTED`. The Moderator must provide `moderationNotes` explaining the reason.
5. **Archiving**: Designers or Admins can mark a design as `ARCHIVED` to remove it from public view without deleting it.

## 3. Platform Guidelines

- **Originality**: Designs must be original or the designer must have the right to use the assets.
- **Content Standards**: No hate speech, explicit violence, or illegal content.
- **Quality**: Images must meet minimum resolution and quality standards for printing.
- **Product Compatibility**: Designs should be applicable to the selected product categories (e.g., T-Shirts, Cups).

## 4. Customization Process

- Customers select a Product and optionally an Approved Design.
- Customers provide specific properties (e.g., Size: XL, Color: Blue).
- The status of a customization request follows: `DRAFT` -> `ORDERED` -> `IN_PRODUCTION` -> `COMPLETED`/`CANCELLED`.

## 5. Technical Guidelines

- All API responses should follow a consistent JSON format.
- Errors should be handled gracefully with descriptive messages.
- Sensitive data (passwords) must be hashed.
- File uploads must be validated for type and size.
