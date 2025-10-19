#!/usr/bin/env node

/**
 * Script to create an admin account in Supabase
 * Usage: node create-admin.js
 */

const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment or .env.local
require('dotenv').config({ path: './bl-novels-app/.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in bl-novels-app/.env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminAccount() {
  try {
    console.log('🔐 Creating admin account...\n');

    // Admin account details
    const adminData = {
      email: 'duongmkqn001@gmail.com',
      username: 'duongmkqn001',
      password_hash: Buffer.from('duongmkqn1').toString('base64'), // Base64 encoding (use bcrypt in production)
      user_type: 'admin',
      role: 'admin',
      is_active: true
    };

    console.log('📝 Admin Account Details:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Role: ${adminData.role}`);
    console.log(`   User Type: ${adminData.user_type}\n`);

    // Check if account already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('user_accounts')
      .select('id, email, username')
      .eq('email', adminData.email)
      .single();

    if (existingUser) {
      console.log('⚠️  Account already exists!');
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Username: ${existingUser.username}\n`);
      
      // Ask if user wants to update it
      console.log('Would you like to update this account to admin? (Manual action required)\n');
      process.exit(0);
    }

    // Insert new admin account
    const { data, error } = await supabase
      .from('user_accounts')
      .insert([adminData])
      .select();

    if (error) {
      console.error('❌ Error creating admin account:');
      console.error(error.message);
      process.exit(1);
    }

    console.log('✅ Admin account created successfully!\n');
    console.log('📊 Account Details:');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Email: ${data[0].email}`);
    console.log(`   Username: ${data[0].username}`);
    console.log(`   Role: ${data[0].role}`);
    console.log(`   User Type: ${data[0].user_type}`);
    console.log(`   Active: ${data[0].is_active}\n`);

    console.log('🎉 You can now login with:');
    console.log(`   Email: duongmkqn001@gmail.com`);
    console.log(`   Password: duongmkqn1\n`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

createAdminAccount();

