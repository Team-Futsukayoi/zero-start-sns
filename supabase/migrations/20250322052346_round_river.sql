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
      - `value` (float)
    
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
  value float NOT NULL CHECK (value >= -1 AND value <= 1),
  UNIQUE(post_id, user_id, trait)
);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- 全ての認証済みユーザーが評価を読み取れる
CREATE POLICY "Users can read all evaluations"
  ON evaluations
  FOR SELECT
  TO authenticated
  USING (true);

-- 認証済みユーザーは評価を作成・更新できる
CREATE POLICY "Users can manage evaluations"
  ON evaluations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  extroversion integer DEFAULT 0 CHECK (extroversion >= -10 AND extroversion <= 10),
  openness integer DEFAULT 0 CHECK (openness >= -10 AND openness <= 10),
  conscientiousness integer DEFAULT 0 CHECK (conscientiousness >= -10 AND conscientiousness <= 10),
  optimism integer DEFAULT 0 CHECK (optimism >= -10 AND optimism <= 10),
  independence integer DEFAULT 0 CHECK (independence >= -10 AND independence <= 10)
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

-- Create function to update user personality
CREATE OR REPLACE FUNCTION update_user_personality(
  p_user_id uuid,
  p_trait text,
  p_value integer
) RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    extroversion = CASE WHEN p_trait = 'extroversion' THEN p_value ELSE extroversion END,
    openness = CASE WHEN p_trait = 'openness' THEN p_value ELSE openness END,
    conscientiousness = CASE WHEN p_trait = 'conscientiousness' THEN p_value ELSE conscientiousness END,
    optimism = CASE WHEN p_trait = 'optimism' THEN p_value ELSE optimism END,
    independence = CASE WHEN p_trait = 'independence' THEN p_value ELSE independence END
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;