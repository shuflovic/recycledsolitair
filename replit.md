# Overview

This is a Flask-based blog application that provides user authentication and basic blog functionality. The application allows users to register, log in, create posts, and view posts from other users. It features a clean web interface with Bootstrap styling and implements standard blog features like user profiles, post creation, and pagination.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Web Framework
- **Flask**: Chosen as the main web framework for its simplicity and flexibility in building web applications
- **Jinja2 Templates**: Used for server-side rendering with template inheritance for consistent UI structure
- **Bootstrap 4**: Integrated for responsive CSS styling and component library

## Data Layer
- **SQLAlchemy ORM**: Provides database abstraction and object-relational mapping
- **SQLite Database**: Used as the primary database (site.db) for development simplicity
- **Database Models**: Two main entities - User and Post with a one-to-many relationship

## Authentication & Security
- **Flask-Login**: Manages user sessions and authentication state
- **Flask-Bcrypt**: Handles password hashing for secure storage
- **WTForms**: Provides form validation and CSRF protection
- **Secret Key**: Configured for session management and security

## Form Handling
- **Flask-WTF**: Integrates WTForms with Flask for form processing
- **Validation**: Built-in validators for email, length, and password confirmation
- **CSRF Protection**: Automatically handled through Flask-WTF

## File Structure
- **Package-based Structure**: Application organized as a Python package (flaskblog/)
- **Separation of Concerns**: Models, routes, and forms in separate modules
- **Template Organization**: HTML templates stored in templates/ directory
- **Static Assets**: CSS and images in static/ directory

## Image Handling
- **Pillow (PIL)**: Integrated for image processing capabilities
- **Profile Pictures**: Support for user profile image uploads with default fallback

# External Dependencies

## Core Framework Dependencies
- **Flask**: Web application framework
- **Flask-SQLAlchemy**: Database ORM integration
- **Flask-Login**: User session management
- **Flask-WTF**: Form handling and validation
- **Flask-Bcrypt**: Password hashing
- **Flask-Mail**: Email functionality (configured but not fully implemented)

## Utility Libraries
- **Pillow**: Image processing for user profile pictures
- **WTForms**: Form validation and rendering
- **SQLAlchemy**: Database toolkit and ORM
- **Jinja2**: Template engine
- **Werkzeug**: WSGI utility library

## Frontend Dependencies
- **Bootstrap 4**: CSS framework loaded via CDN
- **jQuery**: JavaScript library for Bootstrap functionality
- **Google Fonts**: External font resources (Permanent Marker, Creepster)

## Development Dependencies
- **Python 3.x**: Runtime environment
- **SQLite**: Embedded database for development

## Recent Updates (August 29, 2025)
- Successfully set up Flask blog application in Replit environment
- Installed all required Python dependencies
- Fixed missing imports and completed form classes
- Created all missing template files for the application
- Configured Flask app to run on 0.0.0.0:5000 for Replit proxy compatibility
- Set up workflow for automatic server management
- Created database tables and tested all major functionality
- Updated navigation to show different options for authenticated users
- Added flash message support for user feedback
- Configured deployment settings for production environment

## Current Status
The Flask blog application is fully functional and ready for use. All core features work including:
- User registration and authentication
- Blog post creation, viewing, updating, and deletion
- User account management with profile pictures
- Password reset functionality (mail sending may need configuration)
- Responsive design with Bootstrap 4
- Database integration with SQLite