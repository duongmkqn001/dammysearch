# 🗄️ Database Setup Guide

## ⚠️ IMPORTANT: Run the SQL Schema First!

Before using the application, you **MUST** run the SQL schema in your Supabase database.

---

## 🚀 How to Set Up the Database

### Step 1: Access Supabase Console
1. Go to: https://app.supabase.com
2. Login with your account
3. Select your project: **hkflizcmxtzmmdawiopq**

### Step 2: Open SQL Editor
1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**

### Step 3: Copy and Run the Schema
1. Open the file: `supabase_schema.sql` in your project
2. Copy ALL the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** button

### Step 4: Verify Tables Created
After running the SQL, you should see these tables in the **Table Editor**:
- ✅ `authors`
- ✅ `genres`
- ✅ `works`
- ✅ `work_tags`
- ✅ `translation_platforms`
- ✅ `translators`
- ✅ `chapters`
- ✅ `translations`
- ✅ `translator_accounts`
- ✅ `story_import_requests`
- ✅ `story_status_history`

---

## 📊 Database Schema Overview

### Core Tables

#### 1. **authors**
Stores author information
```
- id: BIGSERIAL PRIMARY KEY
- name: VARCHAR(255) UNIQUE
- bio: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. **genres**
Stores genre information
```
- id: BIGSERIAL PRIMARY KEY
- name: VARCHAR(100) UNIQUE
- description: TEXT
- created_at: TIMESTAMP
```

#### 3. **works** (Stories/Novels)
Stores story information
```
- id: BIGSERIAL PRIMARY KEY
- title: VARCHAR(255)
- author_id: BIGINT (FK → authors)
- summary: TEXT
- background: TEXT
- main_genre_id: BIGINT (FK → genres)
- status: VARCHAR(50) [ongoing, completed, hiatus]
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 4. **work_tags**
Stores tags for stories
```
- id: BIGSERIAL PRIMARY KEY
- work_id: BIGINT (FK → works)
- tag_name: VARCHAR(100)
- created_at: TIMESTAMP
```

#### 5. **translators**
Stores translator information
```
- id: BIGSERIAL PRIMARY KEY
- name: VARCHAR(255) UNIQUE
- bio: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 6. **translator_accounts**
Stores translator user accounts for authentication
```
- id: BIGSERIAL PRIMARY KEY
- email: VARCHAR(255) UNIQUE
- username: VARCHAR(100) UNIQUE
- password_hash: VARCHAR(255)
- translator_id: BIGINT (FK → translators)
- is_active: BOOLEAN
- is_verified: BOOLEAN
- verification_token: VARCHAR(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 7. **story_import_requests**
Stores story submissions from translators
```
- id: BIGSERIAL PRIMARY KEY
- title: VARCHAR(255)
- author_name: VARCHAR(255)
- summary: TEXT
- background: TEXT
- main_genre: VARCHAR(100)
- translator_id: BIGINT (FK → translators)
- translator_name: VARCHAR(255) ← NEW FIELD
- status: VARCHAR(50) [incoming, process, completed, rejected]
- source_url: VARCHAR(500)
- source_platform: VARCHAR(100)
- notes: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 8. **story_status_history**
Audit trail for status changes
```
- id: BIGSERIAL PRIMARY KEY
- story_import_id: BIGINT (FK → story_import_requests)
- old_status: VARCHAR(50)
- new_status: VARCHAR(50)
- changed_by: BIGINT (FK → translator_accounts)
- reason: TEXT
- created_at: TIMESTAMP
```

---

## 🔑 Key Relationships

```
translators (1) ──→ (many) translator_accounts
translators (1) ──→ (many) story_import_requests
authors (1) ──→ (many) works
genres (1) ──→ (many) works
works (1) ──→ (many) chapters
works (1) ──→ (many) work_tags
chapters (1) ──→ (many) translations
translation_platforms (1) ──→ (many) translations
translators (1) ──→ (many) translations
story_import_requests (1) ──→ (many) story_status_history
translator_accounts (1) ──→ (many) story_status_history
```

---

## 🔧 Important Fields

### translator_name (NEW)
**Why it was added**: 
- The `story_import_requests` table has a foreign key to `translators` table
- But we need to display the translator's username (from `translator_accounts`)
- Adding `translator_name` field allows us to store the username directly
- This avoids complex joins and improves query performance

**When it's set**:
- When a translator submits a story, their username is stored in this field
- This is done automatically by the application

**Example**:
```
translator_id: 1
translator_name: "duongmkqn001"
```

---

## 📝 SQL Schema File

**Location**: `supabase_schema.sql`

**What it contains**:
1. Table creation statements
2. Foreign key relationships
3. Indexes for performance
4. Full-text search configuration

**Important notes**:
- Uses 'english' for text search (Vietnamese not available in standard PostgreSQL)
- All tables have timestamps (created_at, updated_at)
- Foreign keys have ON DELETE CASCADE for data integrity
- Indexes are created for frequently queried columns

---

## ✅ Verification Checklist

After running the SQL schema, verify:

- [ ] All 11 tables are created
- [ ] `story_import_requests` has `translator_name` field
- [ ] All foreign keys are set up
- [ ] All indexes are created
- [ ] No errors in the SQL execution

---

## 🚨 Common Issues

### Issue 1: "Table already exists"
**Cause**: Schema was already run
**Solution**: 
- Drop the tables first (if you want to reset)
- Or skip this step if tables already exist

### Issue 2: "Foreign key constraint failed"
**Cause**: Trying to insert data with invalid foreign key
**Solution**:
- Ensure parent records exist first
- Check the foreign key relationships

### Issue 3: "Column does not exist"
**Cause**: Schema wasn't fully run
**Solution**:
- Run the entire SQL schema again
- Verify all tables were created

---

## 🔐 Security Notes

⚠️ **Important for Production**:

1. **Enable Row Level Security (RLS)**
   - Go to Supabase Console
   - Click on each table
   - Enable RLS
   - Create policies for access control

2. **Set up proper authentication**
   - Use Supabase Auth instead of simple password
   - Implement JWT tokens
   - Use bcrypt for password hashing

3. **Restrict API access**
   - Set up CORS policies
   - Use API keys properly
   - Implement rate limiting

4. **Backup your data**
   - Regular backups
   - Test restore procedures
   - Keep backups secure

---

## 📚 Next Steps

1. **Run the SQL schema** (see Step 1-4 above)
2. **Verify all tables** are created
3. **Start the application**: `npm run dev`
4. **Test the system**:
   - Register a translator account
   - Submit a test story
   - Approve it as admin
   - Verify it appears in the system

---

## 🆘 Troubleshooting

### Can't connect to Supabase
- Check `.env.local` file has correct credentials
- Verify internet connection
- Check Supabase project is active

### Tables not showing up
- Refresh the Supabase console
- Check SQL execution completed without errors
- Verify you're in the correct project

### Queries returning errors
- Check table names are correct
- Verify foreign key relationships
- Check column names match schema

---

## 📞 Support

For issues:
1. Check this guide first
2. Review the SQL schema file
3. Check Supabase documentation
4. Review application error messages

---

**Database Setup Status**: ✅ Ready to Configure

**Next**: Run the SQL schema in Supabase Console!

