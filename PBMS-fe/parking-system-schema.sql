CREATE DATABASE IF NOT EXISTS parking_management_db;
USE parking_management_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff', 'user') NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    department VARCHAR(50) DEFAULT NULL,
    join_date DATE DEFAULT NULL,
    portrait VARCHAR(255) DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS card_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    vehicle_type ENUM('motorcycle', 'car') NOT NULL,
    ticket_type ENUM('single', 'monthly') NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    description TEXT DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lanes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('entry', 'exit') NOT NULL,
    area VARCHAR(50) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS floors (
    floor_code VARCHAR(10) PRIMARY KEY,
    total_car_slots INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_no VARCHAR(50) NOT NULL UNIQUE,
    card_code VARCHAR(50) NOT NULL UNIQUE,
    group_id INT NOT NULL,
    customer_id INT DEFAULT NULL,
    plate_no VARCHAR(20) DEFAULT NULL,
    regist_date DATE NOT NULL,
    expire_date DATE DEFAULT NULL,
    status ENUM('active', 'expired', 'locked') DEFAULT 'active',
    note TEXT DEFAULT NULL,
    FOREIGN KEY (group_id) REFERENCES card_groups(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS parking_slots (
    code VARCHAR(20) PRIMARY KEY,
    floor_code VARCHAR(10) NOT NULL,
    zone VARCHAR(10) NOT NULL,
    status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (floor_code) REFERENCES floors(floor_code) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS requests (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM(
        'Wrong Slot Parking Report', 
        'Cannot Enter', 
        'Cannot Exit', 
        'Monthly Card Information Error', 
        'Penalty Appeal', 
        'Vehicle Information Update', 
        'Report Refund Not Received'
    ) NOT NULL,
    user_id INT DEFAULT NULL,
    vehicle_plate VARCHAR(20) DEFAULT NULL,
    status ENUM('Pending', 'Processing', 'Resolved', 'Rejected') DEFAULT 'Pending',
    created_at DATETIME NOT NULL,
    assigned_to INT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS staff_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    lane_id INT NOT NULL,
    shift ENUM('morning', 'afternoon', 'night') NOT NULL,
    work_date DATE NOT NULL,
    status ENUM('assigned', 'on-duty', 'done', 'cancelled') DEFAULT 'assigned',
    note TEXT DEFAULT NULL,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lane_id) REFERENCES lanes(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS card_histories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    staff_id INT NOT NULL,
    action ENUM('activate', 'renew', 'lock', 'unlock') NOT NULL,
    action_time DATETIME NOT NULL,
    detail TEXT DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_no VARCHAR(50) NOT NULL UNIQUE,
    card_id INT DEFAULT NULL,
    lane_in_id INT NOT NULL,
    lane_out_id INT DEFAULT NULL,
    staff_id INT NOT NULL,
    plate_no VARCHAR(20) DEFAULT NULL,
    vehicle_type ENUM('motorcycle', 'car') NOT NULL,
    ticket_type ENUM('single', 'monthly') NOT NULL,
    check_in DATETIME NOT NULL,
    check_out DATETIME DEFAULT NULL,
    fee DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    portrait VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
    FOREIGN KEY (lane_in_id) REFERENCES lanes(id) ON DELETE RESTRICT,
    FOREIGN KEY (lane_out_id) REFERENCES lanes(id) ON DELETE RESTRICT,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS alert_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_type ENUM('unknown-card', 'expired', 'suspicious') NOT NULL,
    message VARCHAR(255) NOT NULL,
    occur_time DATETIME NOT NULL,
    lane_id INT DEFAULT NULL,
    staff_id INT DEFAULT NULL,
    status ENUM('new', 'resolved') DEFAULT 'new',
    FOREIGN KEY (lane_id) REFERENCES lanes(id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    expected_arrival TIME NOT NULL,
    floor_code VARCHAR(10) NOT NULL,
    zone VARCHAR(10) NOT NULL,
    slot_code VARCHAR(20) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    status ENUM(
        'Confirmed', 
        'Awaiting User Confirmation', 
        'Reassignment Required', 
        'Checked In', 
        'Completed', 
        'Cancelled by User', 
        'Cancelled by System', 
        'No-show'
    ) DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (floor_code) REFERENCES floors(floor_code) ON DELETE RESTRICT,
    FOREIGN KEY (slot_code) REFERENCES parking_slots(code) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS violations (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_plate VARCHAR(20) NOT NULL,
    user_id INT DEFAULT NULL,
    monthly_card_id INT DEFAULT NULL,
    slot_code VARCHAR(20) DEFAULT NULL,
    type ENUM('Wrong Slot', 'Overnight', 'Overtime') NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    evidence VARCHAR(255) DEFAULT NULL,
    related_request_id VARCHAR(50) DEFAULT NULL,
    created_by INT NOT NULL,
    status ENUM(
        'Pending Approval', 
        'Approved-Unpaid', 
        'Paid', 
        'Waived', 
        'Refund Pending', 
        'Refund Disputed', 
        'Refunded', 
        'Rejected'
    ) DEFAULT 'Pending Approval',
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (monthly_card_id) REFERENCES cards(id) ON DELETE SET NULL,
    FOREIGN KEY (slot_code) REFERENCES parking_slots(code) ON DELETE SET NULL,
    FOREIGN KEY (related_request_id) REFERENCES requests(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    event_type ENUM(
        'Slot Override', 
        'Alternative Slot Proposed', 
        'Alternative Slot Accepted', 
        'Alternative Slot Rejected', 
        'Alternative Slot Expired', 
        'Force Check-out', 
        'Slot Disabled', 
        'Slot Enabled', 
        'Reservation Cancelled', 
        'Privilege Locked', 
        'Privilege Restored', 
        'Refund Status Updated'
    ) NOT NULL,
    performed_by INT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vehicle VARCHAR(20) DEFAULT NULL,
    old_slot VARCHAR(20) DEFAULT NULL,
    new_slot VARCHAR(20) DEFAULT NULL,
    reason TEXT DEFAULT NULL,
    reservation_id VARCHAR(50) DEFAULT NULL,
    request_id VARCHAR(50) DEFAULT NULL,
    detail TEXT DEFAULT NULL,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE SET NULL
);

CREATE INDEX idx_cards_card_no ON cards(card_no);
CREATE INDEX idx_tickets_check_in ON tickets(check_in);
CREATE INDEX idx_tickets_plate_no ON tickets(plate_no);
CREATE INDEX idx_parking_slots_floor_status ON parking_slots(floor_code, status);
CREATE INDEX idx_reservations_date_slot ON reservations(date, slot_code);
CREATE INDEX idx_violations_vehicle_status ON violations(vehicle_plate, status);
CREATE INDEX idx_requests_status ON requests(status);
