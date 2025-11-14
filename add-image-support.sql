-- Add image support to questions table
-- Savollarga va variantlarga rasm qo'shish

-- Add question_image_url column (savol uchun rasm URL)
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS question_image_url TEXT;

-- Add option_images column (variant rasmlari uchun JSON)
-- Format: {"0": "url1", "1": "url2", "2": "url3", "3": "url4"}
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS option_images JSONB DEFAULT '{}'::jsonb;

-- Add comments
COMMENT ON COLUMN questions.question_image_url IS 'Optional image URL for the question';
COMMENT ON COLUMN questions.option_images IS 'Optional image URLs for options in JSON format';
