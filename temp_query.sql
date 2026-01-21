-- Update bookings to use the correct Clerk user ID
UPDATE "Bookings" 
SET user_id = 'user_38YQNUoeeBDaXhgBmTfRtiIRTA5' 
WHERE user_id = 'user_23520156_uit';

-- Verify the update
SELECT booking_code, user_id, showtime_id, status, created_at 
FROM "Bookings" 
WHERE user_id = 'user_38YQNUoeeBDaXhgBmTfRtiIRTA5'
ORDER BY created_at DESC;
