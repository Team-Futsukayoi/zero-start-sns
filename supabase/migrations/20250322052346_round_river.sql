/*
  # Initial Schema for Personality-Evolving Social Network

  1. New Tables
    - `posts`: Stores user posts
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `text` (text)
      - `user_id` (uuid, references auth.users)
    
    - `evaluations`: Stores personality evaluations for posts
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, references auth.users)
      - `trait` (text)
      - `value` (integer)
    
    - `profiles`: Stores user profiles with personality traits
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
      - `extroversion` (float)
      - `openness` (float)
      - `conscientiousness` (float)
      - `optimism` (float)
      - `independence` (float)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  text text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  trait text NOT NULL,
  value integer NOT NULL CHECK (value >= -1 AND value <= 1),
  UNIQUE(post_id, user_id, trait)
);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all evaluations"
  ON evaluations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create evaluations"
  ON evaluations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  extroversion float DEFAULT 0 CHECK (extroversion >= -1 AND extroversion <= 1),
  openness float DEFAULT 0 CHECK (openness >= -1 AND openness <= 1),
  conscientiousness float DEFAULT 0 CHECK (conscientiousness >= -1 AND conscientiousness <= 1),
  optimism float DEFAULT 0 CHECK (optimism >= -1 AND optimism <= 1),
  independence float DEFAULT 0 CHECK (independence >= -1 AND independence <= 1)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to create profile on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();