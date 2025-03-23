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
      - `value` (integer, -1 to 1)
    
    - `profiles`: Stores user profiles with personality traits
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
      - `extroversion` (integer, -10 to 10)
      - `openness` (integer, -10 to 10)
      - `conscientiousness` (integer, -10 to 10)
      - `optimism` (integer, -10 to 10)
      - `independence` (integer, -10 to 10)

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

CREATE POLICY "Users can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

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

-- Create function to update profile trait
CREATE OR REPLACE FUNCTION update_profile_trait()
RETURNS TRIGGER AS $$
DECLARE
  new_value integer;
BEGIN
  -- 新しい値を計算
  new_value := CASE 
    WHEN NEW.trait = 'extroversion' THEN profiles.extroversion + NEW.value
    WHEN NEW.trait = 'openness' THEN profiles.openness + NEW.value
    WHEN NEW.trait = 'conscientiousness' THEN profiles.conscientiousness + NEW.value
    WHEN NEW.trait = 'optimism' THEN profiles.optimism + NEW.value
    WHEN NEW.trait = 'independence' THEN profiles.independence + NEW.value
  END;

  -- 値を-10から10の範囲に制限
  new_value := GREATEST(-10, LEAST(10, new_value));

  -- プロフィールを更新
  UPDATE profiles
  SET
    extroversion = CASE WHEN NEW.trait = 'extroversion' THEN new_value ELSE profiles.extroversion END,
    openness = CASE WHEN NEW.trait = 'openness' THEN new_value ELSE profiles.openness END,
    conscientiousness = CASE WHEN NEW.trait = 'conscientiousness' THEN new_value ELSE profiles.conscientiousness END,
    optimism = CASE WHEN NEW.trait = 'optimism' THEN new_value ELSE profiles.optimism END,
    independence = CASE WHEN NEW.trait = 'independence' THEN new_value ELSE profiles.independence END
  WHERE user_id = (
    SELECT user_id FROM posts WHERE id = NEW.post_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for profile updates
DROP TRIGGER IF EXISTS on_evaluation_insert ON evaluations;
CREATE TRIGGER on_evaluation_insert
  AFTER INSERT ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_trait();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;