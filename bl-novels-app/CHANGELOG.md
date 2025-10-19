# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-10-19

### Added

#### Story Upload Form Enhancements
- **Chapter Count Field**: Added input field for number of chapters available in the story
- **Story Status Dropdown**: Added status selection (Ongoing, Completed, Paused) to upload form
- **Translator/Editor Name**: Made translator/editor name field always visible (not conditional)
- **Better Field Organization**: Reorganized form fields for better user experience

#### Story Detail Modals
- **Translation Platform Display**: Added platform information with icons:
  - 📱 Wattpad
  - 📝 WordPress
  - 🌐 Web
  - 📖 Other platforms
- **Translation URL Link**: Added clickable link to read the story on the translation platform
- **Background Section**: Moved background/context section higher in the modal (before summary)
- **Tags Display**: Tags are now displayed in all modals (Search, Works List, Author List)
- **Improved Layout**: Better organization of modal content with proper ordering

#### Database Schema Updates
- **works table**: Added three new columns:
  - `translator_name` (VARCHAR 255): Primary translator name
  - `translation_platform` (VARCHAR 100): Platform name (Wattpad, WordPress, etc.)
  - `translation_url` (VARCHAR 500): URL to the translation
- **story_upload_requests table**: Added two new columns:
  - `chapter_count` (INT): Number of chapters available
  - `story_status` (VARCHAR 50): Story status (ongoing, completed, paused)

#### Performance Improvements
- Added database indexes for faster queries:
  - `idx_works_translator_name`
  - `idx_works_translation_platform`
  - `idx_story_upload_requests_story_status`

### Changed

#### Modal Display Order
All story detail modals now follow this consistent order:
1. Title
2. Author
3. Genre
4. Status
5. Tags (if available)
6. Background/Context (if available)
7. Summary
8. Translator Name (if available)
9. Translation Platform (if available)
10. Translation URL Link (if available)

#### Form Improvements
- Translator/editor name field is now always visible (not hidden behind checkbox)
- Checkbox now indicates "I am the translator/editor of this story"
- Added helpful placeholder text and descriptions for all new fields

### Fixed

#### Admin Access Issue
- Fixed admin dashboard access by correcting the role check from `account_type` to `role`
- Added loading state to prevent premature redirects
- Added debug information for troubleshooting

#### Modal Display Issues
- Removed transparency/blur from modal backgrounds for better readability
- Fixed genre display showing "N/A" by ensuring proper data fetching
- Added proper theme variable usage for consistent styling

### Technical Details

#### Files Modified

**Components:**
- `src/components/StoryUploadTab.jsx` - Added chapter_count and story_status fields
- `src/components/SearchTab.jsx` - Updated modal layout and added translation info
- `src/components/WorksListTab.jsx` - Updated modal layout and added translation info
- `src/components/AuthorListTab.jsx` - Updated modal layout and added translation info
- `src/AdminApp.jsx` - Fixed admin role check

**Styles:**
- `src/styles/SearchTab.css` - Added translation-link styling
- `src/styles/WorksListTab.css` - Added translation-link styling
- `src/styles/AuthorListTab.css` - Added translation-link styling

**Database:**
- `supabase_schema.sql` - Updated schema with new columns
- `migrations/complete_migration.sql` - Complete migration script
- `migrations/add_translation_info_to_works.sql` - Translation fields migration
- `migrations/add_chapter_count_and_story_status.sql` - Upload form fields migration
- `migrations/README.md` - Migration instructions

**Utilities:**
- `check-admin.html` - Admin diagnostic tool for troubleshooting

### Migration Required

⚠️ **Important**: Database migration is required for these changes to work properly.

Run the migration script in Supabase SQL Editor:
```bash
bl-novels-app/migrations/complete_migration.sql
```

See `migrations/README.md` for detailed instructions.

### Breaking Changes

None. All changes are backward compatible.

### Notes

- All database migrations are idempotent (safe to run multiple times)
- Form data validation remains the same
- Existing data is not affected by the migration
- New fields are optional and have default values

### Testing Checklist

- [ ] Run database migration in Supabase
- [ ] Test story upload form with new fields
- [ ] Verify modal displays show all information correctly
- [ ] Check translation links work properly
- [ ] Test admin dashboard access
- [ ] Verify theme consistency across all modals
- [ ] Test on mobile devices

### Future Improvements

- Add bulk import for translation URLs
- Add platform-specific validation for URLs
- Add chapter management interface
- Add translator profile pages
- Add platform statistics dashboard

---

## Previous Versions

### [1.0.0] - Initial Release
- Basic story browsing functionality
- Search by title and author
- Genre and tag filtering
- Story upload system
- Admin dashboard
- Translator dashboard
- Theme system (Blue Sky & Blossom Dawn)

