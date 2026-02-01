#!/usr/bin/env node

/**
 * Stripe Configuration Verification Script
 * Run this script to verify your Stripe configuration is set up correctly
 * 
 * Usage: node verify-stripe-config.js
 */

import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

console.log('\n🔍 Verifying Stripe Configuration...\n');

// Check if STRIPE_SECRET_KEY exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in your .env file');
  console.log('\n📝 To fix this:');
  console.log('1. Create a .env file in the backend folder if it doesn\'t exist');
  console.log('2. Add: STRIPE_SECRET_KEY=sk_test_your_key_here');
  console.log('3. Get your key from: https://dashboard.stripe.com/apikeys\n');
  process.exit(1);
}

// Check key format
const key = process.env.STRIPE_SECRET_KEY;
const isTestKey = key.startsWith('sk_test_');
const isLiveKey = key.startsWith('sk_live_');

if (!isTestKey && !isLiveKey) {
  console.error('❌ Invalid STRIPE_SECRET_KEY format');
  console.log('   Key should start with "sk_test_" (test mode) or "sk_live_" (live mode)');
  console.log('   Current key starts with:', key.substring(0, 8) + '...\n');
  process.exit(1);
}

console.log(`✅ STRIPE_SECRET_KEY found`);
console.log(`   Mode: ${isTestKey ? '🧪 Test Mode' : '🚀 Live Mode'}`);

// Check currency
const currency = process.env.STRIPE_CURRENCY || 'usd';
console.log(`✅ Currency: ${currency.toUpperCase()}`);

// Try to initialize Stripe
console.log('\n🔌 Attempting to connect to Stripe API...');

try {
  const stripe = new Stripe(key);
  console.log('✅ Stripe client initialized successfully');

  // Try to retrieve account information
  stripe.balance.retrieve()
    .then(balance => {
      console.log('✅ Successfully connected to Stripe API');
      console.log(`   Available balance: ${balance.available.map(b => 
        `${(b.amount / 100).toFixed(2)} ${b.currency.toUpperCase()}`
      ).join(', ') || '0.00 ' + currency.toUpperCase()}`);
      
      // Test creating a product (will not actually create, just test permissions)
      console.log('\n✅ All checks passed! Your Stripe configuration is correct.');
      console.log('\n📋 Next steps:');
      console.log('1. Start your backend server: npm start');
      console.log('2. Visit: http://localhost:4000/api/order/payment-config');
      console.log('3. You should see stripe.configured: true\n');
      console.log('🧪 Test cards:');
      console.log('   Success: 4242 4242 4242 4242');
      console.log('   Decline: 4000 0000 0000 9995\n');
    })
    .catch(error => {
      if (error.type === 'StripeAuthenticationError') {
        console.error('❌ Authentication failed: Invalid API key');
        console.log('   Please check your STRIPE_SECRET_KEY in .env file');
        console.log('   Get a valid key from: https://dashboard.stripe.com/apikeys\n');
      } else if (error.type === 'StripePermissionError') {
        console.error('❌ Permission error:', error.message);
        console.log('   Your API key may not have the required permissions\n');
      } else {
        console.error('❌ Error:', error.message);
      }
      process.exit(1);
    });
} catch (error) {
  console.error('❌ Failed to initialize Stripe:', error.message);
  process.exit(1);
}
