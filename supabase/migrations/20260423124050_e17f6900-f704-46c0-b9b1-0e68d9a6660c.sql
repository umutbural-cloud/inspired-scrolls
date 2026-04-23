-- Bucket'ı public olmaktan çıkar; SELECT policy'sini koru ki bilinen URL'lerle erişim devam etsin,
-- ama listing API'si izin gerektirsin.
UPDATE storage.buckets SET public = false WHERE id = 'post-images';