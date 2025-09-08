-- Initialize the database with basic setup
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'manager',
    status user_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    ingredients TEXT[],
    allergens TEXT[],
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_status ON admin_users(status);

CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort ON menu_items(sort_order);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at 
    BEFORE UPDATE ON menu_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (id, name, email, password, role, status) 
VALUES (
    uuid_generate_v4(),
    'Admin User',
    'admin@burgerhouse.com',
    crypt('admin123', gen_salt('bf')),
    'admin',
    'active'
) ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO categories (id, name, description, sort_order) VALUES
    (uuid_generate_v4(), 'Burgers', 'Delicious burgers made with fresh ingredients', 1),
    (uuid_generate_v4(), 'Sides', 'Perfect sides to complement your meal', 2),
    (uuid_generate_v4(), 'Drinks', 'Refreshing beverages', 3),
    (uuid_generate_v4(), 'Desserts', 'Sweet treats to end your meal', 4)
ON CONFLICT DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (id, name, description, price, category_id, ingredients, allergens, is_featured) 
SELECT 
    uuid_generate_v4(),
    'Classic Burger',
    'Our signature burger with fresh lettuce, tomato, and our special sauce',
    12.99,
    c.id,
    ARRAY['Beef patty', 'Lettuce', 'Tomato', 'Onion', 'Special sauce', 'Bun'],
    ARRAY['Gluten', 'Dairy'],
    true
FROM categories c WHERE c.name = 'Burgers'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, name, description, price, category_id, ingredients, allergens, is_featured) 
SELECT 
    uuid_generate_v4(),
    'Cheese Burger',
    'Classic burger topped with melted cheddar cheese',
    14.99,
    c.id,
    ARRAY['Beef patty', 'Cheddar cheese', 'Lettuce', 'Tomato', 'Onion', 'Bun'],
    ARRAY['Gluten', 'Dairy'],
    true
FROM categories c WHERE c.name = 'Burgers'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, name, description, price, category_id, ingredients, allergens) 
SELECT 
    uuid_generate_v4(),
    'French Fries',
    'Crispy golden fries seasoned to perfection',
    4.99,
    c.id,
    ARRAY['Potatoes', 'Salt', 'Vegetable oil'],
    ARRAY[]
FROM categories c WHERE c.name = 'Sides'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, name, description, price, category_id, ingredients, allergens) 
SELECT 
    uuid_generate_v4(),
    'Coca Cola',
    'Classic refreshing cola',
    2.99,
    c.id,
    ARRAY['Carbonated water', 'Sugar', 'Natural flavors'],
    ARRAY[]
FROM categories c WHERE c.name = 'Drinks'
ON CONFLICT DO NOTHING;
