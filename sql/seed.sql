USE admin_pretest;

INSERT INTO products (name, description, price) VALUES
('Pensil Kayu HB', 'Pensil tulis standar', 0.50),
('Buku Tulis A5', 'Buku garis 80 halaman', 1.50),
('Pulpen Gel', 'Pulpen gel halus', 0.80),
('Penghapus Karet', 'Penghapus lembut', 0.30),
('Rautan Pensil', 'Rautan kecil', 0.25),
('Penggaris 30cm', 'Penggaris plastik', 1.00),
('Spidol Permanen', 'Marker hitam', 1.20),
('Stapler Mini', 'Stapler kecil + isi', 2.00),
('Kertas A4 Pack50', '50 lembar kertas A4', 4.50),
('Map Plastik', 'Map dokumen A4', 0.90);

INSERT INTO stock (product_id, quantity) VALUES
(1, 100),
(2, 80),
(3, 150),
(4, 200),
(5, 120),
(6, 60),
(7, 90),
(8, 40),
(9, 30),
(10, 110);
