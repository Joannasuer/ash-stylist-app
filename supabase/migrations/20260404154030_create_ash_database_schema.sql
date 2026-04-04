/*
  # Ash Stylist Database Schema
  
  Creates the core database structure for the Ash Stylist VIP system.
  
  ## Tables Created
  
  1. **profiles**
    - `id` (uuid, primary key, references auth.users)
    - `email` (text, unique)
    - `full_name` (text)
    - `dob` (date) - for zodiac calculation
    - `zodiac` (text) - calculated zodiac sign
    - `height_cm` (integer)
    - `weight_kg` (integer)
    - `skin_tone` (text)
    - `vip_status` (boolean, default false)
    - `style_dna` (jsonb) - stores quiz results, preferences
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  2. **user_closets**
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `product_id` (text) - Shopify product ID
    - `product_data` (jsonb) - cached product details
    - `added_at` (timestamptz)
  
  3. **chat_history**
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `message` (text)
    - `sender` (text) - 'user' or 'ash'
    - `suggested_look` (jsonb) - outfit recommendations
    - `created_at` (timestamptz)
  
  4. **sketches**
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `prompt` (text)
    - `design_options` (jsonb)
    - `image_url` (text)
    - `created_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated users can read/write their profiles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  dob date,
  zodiac text,
  height_cm integer,
  weight_kg integer,
  skin_tone text,
  vip_status boolean DEFAULT false,
  style_dna jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create user_closets table
CREATE TABLE IF NOT EXISTS user_closets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  product_data jsonb DEFAULT '{}'::jsonb,
  added_at timestamptz DEFAULT now()
);

ALTER TABLE user_closets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own closet"
  ON user_closets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own closet"
  ON user_closets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own closet"
  ON user_closets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  sender text NOT NULL,
  suggested_look jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own chat history"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create sketches table
CREATE TABLE IF NOT EXISTS sketches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  prompt text NOT NULL,
  design_options jsonb DEFAULT '{}'::jsonb,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sketches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sketches"
  ON sketches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sketches"
  ON sketches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sketches"
  ON sketches FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
