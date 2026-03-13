-- ================================================
-- EXTENSIONS
-- ================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ================================================
-- SPRITES
-- ================================================

-- Filter active sprites, sort by created_at
CREATE INDEX idx_sprite_active_created_at 
    ON sprites (created_at DESC) 
    WHERE deleted_at IS NULL;

-- Filter active sprites by user
CREATE INDEX idx_sprite_active_created_by 
    ON sprites (created_by) 
    WHERE deleted_at IS NULL;

-- Trash query (deleted_at IS NOT NULL)
CREATE INDEX idx_sprite_deleted_at 
    ON sprites (deleted_at) 
    WHERE deleted_at IS NOT NULL;

-- Full-text search
CREATE INDEX idx_sprite_name_trgm 
    ON sprites USING GIN (name gin_trgm_ops);

-- ================================================
-- SPRITE_CATEGORIES (join table)
-- ================================================

-- Lookup sprites by category
CREATE INDEX idx_sprite_category_category 
    ON sprite_categories (category_id);

-- Lookup categories by sprite
CREATE INDEX idx_sprite_category_sprite 
    ON sprite_categories (sprite_id);

-- Composite cho JOIN + filter 
CREATE INDEX idx_sprite_category_composite 
    ON sprite_categories (category_id, sprite_id);

-- ================================================
-- ASSET_PACK
-- ================================================

-- Filter active, sort by created_at
CREATE INDEX idx_asset_pack_active_created_at 
    ON asset_pack (created_at DESC) 
    WHERE deleted_at IS NULL;

-- Filter active, sort/filter by price
CREATE INDEX idx_asset_pack_active_price 
    ON asset_pack (price) 
    WHERE deleted_at IS NULL;

-- Trash query
CREATE INDEX idx_asset_pack_deleted_at 
    ON asset_pack (deleted_at) 
    WHERE deleted_at IS NOT NULL;

-- Full-text search on asset pack
CREATE INDEX idx_asset_pack_name_trgm 
    ON asset_pack USING GIN (name gin_trgm_ops);

-- ================================================
-- ASSET_PACK_SPRITES (join table)
-- ================================================

CREATE INDEX idx_asset_pack_sprites_pack 
    ON asset_pack_sprites (asset_pack_id);

CREATE INDEX idx_asset_pack_sprites_sprite 
    ON asset_pack_sprites (sprite_id);

CREATE INDEX idx_asset_pack_sprites_composite 
    ON asset_pack_sprites (asset_pack_id, sprite_id);

-- ================================================
-- USERS
-- ================================================

-- Lookup by email (login)
CREATE INDEX idx_user_email 
    ON users (email);

-- ================================================
-- REFRESH_TOKENS
-- ================================================

-- Lookup token by refresh
CREATE INDEX idx_refresh_token_token 
    ON refresh_tokens (token);

-- Cleanup expired tokens
CREATE INDEX idx_refresh_token_expires_at 
    ON refresh_tokens (expires_at);