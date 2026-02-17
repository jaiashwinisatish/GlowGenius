/*
  # AI Beauty Analysis System Schema

  ## Overview
  Creates tables to store face analysis results and personalized beauty recommendations
  for the virtual makeup and styling platform.

  ## New Tables
  
  ### `beauty_analyses`
  Stores complete face analysis results including:
  - `id` (uuid, primary key) - Unique identifier for each analysis
  - `user_id` (uuid, nullable) - Optional link to authenticated user
  - `image_data` (text, nullable) - Base64 encoded image data or URL
  - `skin_tone` (text) - Detected skin tone: 'fair', 'wheatish', 'dark'
  - `undertone` (text) - Detected undertone: 'warm', 'cool', 'neutral'
  - `lip_color` (jsonb) - RGB values of natural lip color
  - `eye_color` (text, nullable) - Detected eye color
  - `face_shape` (text, nullable) - Detected face shape
  - `skin_tone_rgb` (jsonb) - Average RGB values of skin tone
  - `recommendations` (jsonb) - Generated recommendations for lipstick, dresses, makeup, accessories
  - `created_at` (timestamptz) - Timestamp of analysis
  
  ### `recommendation_feedback`
  Stores user feedback on recommendations to improve the system:
  - `id` (uuid, primary key) - Unique identifier
  - `analysis_id` (uuid) - Reference to beauty_analyses
  - `recommendation_type` (text) - Type: 'lipstick', 'dress', 'makeup', 'accessory'
  - `item_name` (text) - Name of the recommended item
  - `rating` (integer) - User rating 1-5
  - `feedback_text` (text, nullable) - Optional user comments
  - `created_at` (timestamptz) - Timestamp of feedback

  ## Security
  - Enable RLS on all tables
  - Allow anonymous users to create analyses (for guest access)
  - Allow users to view their own analyses
  - Allow users to provide feedback on their analyses
*/

CREATE TABLE IF NOT EXISTS beauty_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  image_data text DEFAULT NULL,
  skin_tone text NOT NULL,
  undertone text NOT NULL,
  lip_color jsonb NOT NULL DEFAULT '{}',
  eye_color text DEFAULT NULL,
  face_shape text DEFAULT NULL,
  skin_tone_rgb jsonb NOT NULL DEFAULT '{}',
  recommendations jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recommendation_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES beauty_analyses(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL,
  item_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE beauty_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create beauty analyses"
  ON beauty_analyses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own analyses"
  ON beauty_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can view their recent analyses"
  ON beauty_analyses
  FOR SELECT
  TO anon
  USING (created_at > now() - interval '24 hours');

CREATE POLICY "Users can provide feedback on their analyses"
  ON recommendation_feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM beauty_analyses
      WHERE beauty_analyses.id = recommendation_feedback.analysis_id
      AND (beauty_analyses.user_id = auth.uid() OR beauty_analyses.user_id IS NULL)
    )
  );

CREATE POLICY "Users can view feedback on their analyses"
  ON recommendation_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM beauty_analyses
      WHERE beauty_analyses.id = recommendation_feedback.analysis_id
      AND beauty_analyses.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_beauty_analyses_user_id ON beauty_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_beauty_analyses_created_at ON beauty_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendation_feedback_analysis_id ON recommendation_feedback(analysis_id);