-- =====================================================
-- FOOTWAREAPP_DEV DATABASE CLEANER & REBUILDER
-- Description: Comprehensive script to clean and rebuild database
-- Author: Database Administrator
-- Version: 1.0
-- =====================================================

USE master;
GO

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'FootwareApp_Dev')
BEGIN
    CREATE DATABASE FootwareApp_Dev;
    PRINT '✓ Database FootwareApp_Dev created successfully.';
END
ELSE
BEGIN
    PRINT '✓ Database FootwareApp_Dev already exists.';
END
GO

USE FootwareApp_Dev;
GO

-- =====================================================
-- SECTION 1: DATABASE CLEANER
-- =====================================================
PRINT '🔧 INITIALIZING DATABASE CLEANER...';
PRINT '=========================================';
PRINT 'Database: FootwareApp_Dev';
PRINT 'Start Time: ' + CONVERT(VARCHAR, GETDATE(), 120);
PRINT '';

BEGIN TRY
    -- Step 1: Display Foreign Key Relationships
    PRINT '📋 STEP 1: DISPLAYING FOREIGN KEY RELATIONSHIPS';
    PRINT '-----------------------------------------';
    
    IF EXISTS (SELECT 1 FROM sys.foreign_keys)
    BEGIN
        SELECT 
            fk.name AS [ForeignKeyName],
            OBJECT_SCHEMA_NAME(fk.parent_object_id) + '.' + OBJECT_NAME(fk.parent_object_id) AS [ChildTable],
            COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS [ChildColumn],
            OBJECT_SCHEMA_NAME(fk.referenced_object_id) + '.' + OBJECT_NAME(fk.referenced_object_id) AS [ParentTable],
            COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS [ParentColumn]
        FROM sys.foreign_keys AS fk
        INNER JOIN sys.foreign_key_columns AS fkc ON fk.object_id = fkc.constraint_object_id
        ORDER BY [ParentTable], [ChildTable];
        
        PRINT '✓ Foreign key relationships displayed.';
    END
    ELSE
    BEGIN
        PRINT 'ℹ No foreign key relationships found.';
    END
    PRINT '';

    -- Step 2: Display Tables Information
    PRINT '📊 STEP 2: DISPLAYING TABLES INFORMATION';
    PRINT '-----------------------------------------';
    
    DECLARE @TableCount INT;
    SELECT @TableCount = COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_TYPE = 'BASE TABLE' 
    AND TABLE_CATALOG = 'FootwareApp_Dev';
    
    IF @TableCount > 0
    BEGIN
        SELECT 
            ROW_NUMBER() OVER (ORDER BY TABLE_NAME) AS [SrNo],
            TABLE_NAME AS [TableName],
            TABLE_TYPE AS [TableType]
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE' 
        AND TABLE_CATALOG = 'FootwareApp_Dev'
        ORDER BY TABLE_NAME;
        
        PRINT '✓ ' + CAST(@TableCount AS VARCHAR(10)) + ' tables found.';
    END
    ELSE
    BEGIN
        PRINT 'ℹ No tables found in database.';
    END
    PRINT '';

    -- Step 3: Count Records in Each Table
    PRINT '🔢 STEP 3: COUNTING RECORDS IN TABLES';
    PRINT '-----------------------------------------';
    
    IF @TableCount > 0
    BEGIN
        DECLARE @TableName NVARCHAR(128);
        DECLARE @CountSQL NVARCHAR(MAX);
        DECLARE @RecordCount INT;
        DECLARE @TotalRecords INT = 0;
        
        DECLARE table_cursor CURSOR FOR 
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE' 
        AND TABLE_CATALOG = 'FootwareApp_Dev'
        ORDER BY TABLE_NAME;
        
        OPEN table_cursor;
        FETCH NEXT FROM table_cursor INTO @TableName;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            SET @CountSQL = 'SELECT @Count = COUNT(*) FROM ' + QUOTENAME(@TableName);
            EXEC sp_executesql @CountSQL, N'@Count INT OUTPUT', @RecordCount OUTPUT;
            
            PRINT '   Table: ' + @TableName + ' | Records: ' + CAST(@RecordCount AS VARCHAR(20));
            SET @TotalRecords = @TotalRecords + @RecordCount;
            
            FETCH NEXT FROM table_cursor INTO @TableName;
        END
        
        CLOSE table_cursor;
        DEALLOCATE table_cursor;
        
        PRINT '✓ Total records across all tables: ' + CAST(@TotalRecords AS VARCHAR(20));
    END
    ELSE
    BEGIN
        PRINT 'ℹ No tables to count records from.';
    END
    PRINT '';

    -- Step 4: Drop Foreign Key Constraints
    PRINT '🗑️  STEP 4: DROPPING FOREIGN KEY CONSTRAINTS';
    PRINT '-----------------------------------------';
    
    DECLARE @FKCount INT = 0;
    DECLARE @DropFKSQL NVARCHAR(MAX);
    
    DECLARE fk_cursor CURSOR FOR 
    SELECT 
        'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(fk.parent_object_id)) + '.' + 
        QUOTENAME(OBJECT_NAME(fk.parent_object_id)) + 
        ' DROP CONSTRAINT ' + QUOTENAME(fk.name) AS DropStatement
    FROM sys.foreign_keys fk;
    
    OPEN fk_cursor;
    FETCH NEXT FROM fk_cursor INTO @DropFKSQL;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        BEGIN TRY
            EXEC sp_executesql @DropFKSQL;
            PRINT '   ✓ Dropped: ' + OBJECT_NAME(OBJECT_ID(@DropFKSQL));
            SET @FKCount = @FKCount + 1;
        END TRY
        BEGIN CATCH
            PRINT '   ✗ Error dropping: ' + ERROR_MESSAGE();
        END CATCH
        
        FETCH NEXT FROM fk_cursor INTO @DropFKSQL;
    END
    
    CLOSE fk_cursor;
    DEALLOCATE fk_cursor;
    
    PRINT '✓ ' + CAST(@FKCount AS VARCHAR(10)) + ' foreign key constraints dropped.';
    PRINT '';

    -- Step 5: Drop All Tables
    PRINT '🗑️  STEP 5: DROPPING ALL TABLES';
    PRINT '-----------------------------------------';
    
    DECLARE @DropTableSQL NVARCHAR(MAX);
    DECLARE @DroppedTables INT = 0;
    
    -- Drop tables in dependency order (child tables first)
    DECLARE drop_cursor CURSOR FOR 
    SELECT 
        'DROP TABLE ' + QUOTENAME(TABLE_SCHEMA) + '.' + QUOTENAME(TABLE_NAME) AS DropStatement
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_TYPE = 'BASE TABLE' 
    AND TABLE_CATALOG = 'FootwareApp_Dev'
    ORDER BY CASE 
        WHEN TABLE_NAME = 'Payment' THEN 1
        WHEN TABLE_NAME = 'Cart_item' THEN 2
        WHEN TABLE_NAME = 'Customer' THEN 3
        WHEN TABLE_NAME = 'Product' THEN 4
        WHEN TABLE_NAME = 'Cart' THEN 5
        ELSE 6
    END;
    
    OPEN drop_cursor;
    FETCH NEXT FROM drop_cursor INTO @DropTableSQL;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        BEGIN TRY
            EXEC sp_executesql @DropTableSQL;
            PRINT '   ✓ ' + @DropTableSQL;
            SET @DroppedTables = @DroppedTables + 1;
        END TRY
        BEGIN CATCH
            PRINT '   ✗ Error: ' + @DropTableSQL + ' | ' + ERROR_MESSAGE();
        END CATCH
        
        FETCH NEXT FROM drop_cursor INTO @DropTableSQL;
    END
    
    CLOSE drop_cursor;
    DEALLOCATE drop_cursor;
    
    PRINT '✓ ' + CAST(@DroppedTables AS VARCHAR(10)) + ' tables dropped.';
    PRINT '';

    -- Step 6: Verify Cleanup
    PRINT '✅ STEP 6: VERIFYING CLEANUP';
    PRINT '-----------------------------------------';
    
    DECLARE @RemainingTables INT;
    SELECT @RemainingTables = COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_TYPE = 'BASE TABLE' 
    AND TABLE_CATALOG = 'FootwareApp_Dev';
    
    IF @RemainingTables = 0
    BEGIN
        PRINT '✓ SUCCESS: Database cleaned successfully. All tables removed.';
    END
    ELSE
    BEGIN
        PRINT '⚠ WARNING: ' + CAST(@RemainingTables AS VARCHAR(10)) + ' tables remaining.';
        
        SELECT TABLE_NAME AS [RemainingTables]
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE' 
        AND TABLE_CATALOG = 'FootwareApp_Dev';
    END

    PRINT '';
    PRINT '=========================================';
    PRINT '🎉 DATABASE CLEANUP COMPLETED SUCCESSFULLY!';
    PRINT 'End Time: ' + CONVERT(VARCHAR, GETDATE(), 120);
    PRINT '=========================================';
    
END TRY
BEGIN CATCH
    PRINT '';
    PRINT '❌ *** CLEANUP ERROR ***';
    PRINT '   Error Message: ' + ERROR_MESSAGE();
    PRINT '   Error Number: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT '   Error Procedure: ' + ISNULL(ERROR_PROCEDURE(), 'N/A');
    PRINT '   Error Line: ' + CAST(ERROR_LINE() AS VARCHAR(10));
    PRINT '   Cleanup process aborted.';
    PRINT '=========================================';
    RETURN;
END CATCH
GO

-- =====================================================
-- SECTION 2: DATABASE REBUILDER (REFINED WITH AUDIT FIELDS)
-- =====================================================
PRINT '';
PRINT '🔨 INITIALIZING DATABASE REBUILDER...';
PRINT '=========================================';
PRINT 'Start Time: ' + CONVERT(VARCHAR, GETDATE(), 120);
PRINT '';

BEGIN TRY
    -- Create Tables
    PRINT '📋 CREATING TABLES';
    PRINT '-----------------------------------------';
    
    -- Create Cart Table
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cart' AND xtype='U')
    BEGIN
        CREATE TABLE Cart (
            cart_id VARCHAR(7) PRIMARY KEY,
            created_on DATETIME NULL DEFAULT(GETDATE()),
            isactive BIT NULL DEFAULT(1)
        );
        PRINT '✓ Cart table created successfully.';
    END
    ELSE
    BEGIN
        PRINT 'ℹ Cart table already exists.';
    END

    -- Create Customer Table
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customer' AND xtype='U')
    BEGIN
        CREATE TABLE Customer (
            customer_id VARCHAR(7) PRIMARY KEY,
            name NVARCHAR(50) NOT NULL,
            email NVARCHAR(50) NOT NULL UNIQUE,
            password NVARCHAR(255) NOT NULL,
            address NVARCHAR(MAX) NOT NULL,
            pincode INT NOT NULL,
            phone_number NVARCHAR(15) NOT NULL,
            cart_id VARCHAR(7) NOT NULL,
            role NVARCHAR(10) DEFAULT 'user',
            created_on DATETIME NULL DEFAULT(GETDATE()),
            isactive BIT NULL DEFAULT(1),
            FOREIGN KEY (cart_id) REFERENCES Cart(cart_id)
        );
        PRINT '✓ Customer table created successfully.';
    END
    ELSE
    BEGIN
        PRINT 'ℹ Customer table already exists.';
    END

    -- Create Product Table
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Product' AND xtype='U')
    BEGIN
        CREATE TABLE Product (
            product_id VARCHAR(10) PRIMARY KEY,
            product_name NVARCHAR(50) NOT NULL,
            product_company NVARCHAR(50) NOT NULL,
            color NVARCHAR(20),
            size INT,
            gender CHAR(1),
            cost INT,
            quantity INT,
            image NVARCHAR(MAX),
            created_on DATETIME NULL DEFAULT(GETDATE()),
            isactive BIT NULL DEFAULT(1)
        );
        PRINT '✓ Product table created successfully.';
    END
    ELSE
    BEGIN
        PRINT 'ℹ Product table already exists.';
    END

    -- Create Cart_item Table
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cart_item' AND xtype='U')
    BEGIN
        CREATE TABLE Cart_item (
            cart_id VARCHAR(7) NOT NULL,
            product_id VARCHAR(10) NOT NULL,
            cart_quantity INT NOT NULL,
            date_added DATE NOT NULL,
            purchased NVARCHAR(10) DEFAULT 'NO',
            created_on DATETIME NULL DEFAULT(GETDATE()),
            isactive BIT NULL DEFAULT(1),
            PRIMARY KEY (cart_id, product_id),
            FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
            FOREIGN KEY (product_id) REFERENCES Product(product_id)
        );
        PRINT '✓ Cart_item table created successfully.';
    END
    ELSE
    BEGIN
        PRINT 'ℹ Cart_item table already exists.';
    END

    -- Create Payment Table
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Payment' AND xtype='U')
    BEGIN
        CREATE TABLE Payment (
            payment_id VARCHAR(10) PRIMARY KEY,
            payment_date DATE NOT NULL,
            payment_type NVARCHAR(20),
            customer_id VARCHAR(7),
            cart_id VARCHAR(7),
            total_amount INT,
            created_on DATETIME NULL DEFAULT(GETDATE()),
            isactive BIT NULL DEFAULT(1),
            FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
            FOREIGN KEY (cart_id) REFERENCES Cart(cart_id)
        );
        PRINT '✓ Payment table created successfully.';
    END
    ELSE
    BEGIN
        PRINT 'ℹ Payment table already exists.';
    END

    -- Display Final Table Structure
    PRINT '';
    PRINT '📊 FINAL DATABASE STRUCTURE';
    PRINT '-----------------------------------------';
    
    SELECT 
        ROW_NUMBER() OVER (ORDER BY TABLE_NAME) AS [SrNo],
        TABLE_NAME AS [TableName],
        TABLE_TYPE AS [TableType]
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_TYPE = 'BASE TABLE' 
    AND TABLE_CATALOG = 'FootwareApp_Dev'
    ORDER BY TABLE_NAME;

    PRINT '';
    PRINT '=========================================';
    PRINT '🎉 DATABASE REBUILD COMPLETED SUCCESSFULLY!';
    PRINT 'End Time: ' + CONVERT(VARCHAR, GETDATE(), 120);
    PRINT '=========================================';
    
END TRY
BEGIN CATCH
    PRINT '';
    PRINT '❌ *** REBUILD ERROR ***';
    PRINT '   Error Message: ' + ERROR_MESSAGE();
    PRINT '   Error Number: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT '   Error Procedure: ' + ISNULL(ERROR_PROCEDURE(), 'N/A');
    PRINT '   Error Line: ' + CAST(ERROR_LINE() AS VARCHAR(10));
    PRINT '   Rebuild process aborted.';
    PRINT '=========================================';
END CATCH
GO

PRINT '';
PRINT '✨ SCRIPT EXECUTION COMPLETED ✨';
PRINT 'FootwareApp_Dev database is now clean and rebuilt.';
PRINT 'Ready for development use.';
GO

USE FootwareApp_Dev;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AuditLog' AND xtype='U')
BEGIN
    CREATE TABLE AuditLog (
        audit_guid UNIQUEIDENTIFIER NOT NULL 
            DEFAULT NEWSEQUENTIALID() PRIMARY KEY,  -- Globally unique, faster than NEWID()

        flag CHAR(3) NOT NULL CHECK (flag IN ('INS', 'UPD', 'DEL', 'SI', 'SO', 'ERR')), 
            -- INS = Insert, UPD = Update, DEL = Delete, 
            -- SI = Sign In (Login), SO = Sign Out (Logout), ERR = Error

        event_type NVARCHAR(50) NOT NULL,           -- optional human-readable label like 'USER_REGISTER'
        table_name NVARCHAR(100) NULL,              -- which table or module was affected
        record_key NVARCHAR(100) NULL,              -- e.g., product_id, customer_id
        action_by NVARCHAR(100) NULL,               -- user or system actor
        action_details NVARCHAR(MAX) NULL,          -- JSON or description of what happened
        status_ NVARCHAR(20) NULL DEFAULT('SUCCESS'),-- SUCCESS / FAILED
        created_on DATETIME DEFAULT(GETDATE()),     -- time of logging
        isactive BIT DEFAULT(1),

        -- ✅ Computed column: gives a readable one-liner summary for quick viewing
        summary AS 
            CONCAT(flag, ' | ', ISNULL(table_name, ''), ' | ', ISNULL(record_key, ''), ' | ', ISNULL(status_, ''))
    );

    PRINT '✓ Table [AuditLog] created successfully with GUID key, computed column, and flag.';
END
ELSE
BEGIN
    PRINT '✓ Table [AuditLog] already exists.';
END
GO

IF OBJECT_ID('dbo.usp_AddLog2Audit', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_AddLog2Audit;
GO

CREATE PROCEDURE dbo.usp_AddLog2Audit
    @flag CHAR(3),
    @event_type NVARCHAR(50),
    @table_name NVARCHAR(100) = NULL,
    @record_key NVARCHAR(100) = NULL,
    @action_by NVARCHAR(100) = NULL,
    @action_details NVARCHAR(MAX) = NULL,
    @status NVARCHAR(20) = 'SUCCESS'
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Validation: ensure flag is valid
        IF (@flag NOT IN ('INS', 'UPD', 'DEL', 'SI', 'SO', 'ERR'))
        BEGIN
            RAISERROR('Invalid flag provided. Use INS, UPD, DEL, SI, SO, or ERR.', 16, 1);
            RETURN;
        END

        INSERT INTO AuditLog (
            flag,
            event_type,
            table_name,
            record_key,
            action_by,
            action_details,
            status_
        )
        VALUES (
            @flag,
            @event_type,
            @table_name,
            @record_key,
            @action_by,
            @action_details,
            @status
        );

        PRINT '✓ Log entry successfully inserted into AuditLog.';
    END TRY

    BEGIN CATCH
        DECLARE @ErrMsg NVARCHAR(4000), @ErrSeverity INT;
        SELECT @ErrMsg = ERROR_MESSAGE(), @ErrSeverity = ERROR_SEVERITY();

        -- Log the failure into AuditLog itself
        INSERT INTO AuditLog (
            flag,
            event_type,
            table_name,
            action_by,
            action_details,
            status_
        )
        VALUES (
            'ERR',
            'AuditLogFailure',
            'AuditLog',
            'SYSTEM',
            CONCAT('Failed to insert audit log: ', @ErrMsg),
            'FAILED'
        );

        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END
GO

-- ----------------------------------------------------------------------------------------------------------
USE FootwareApp_Dev;
GO

-- ================================================
-- 🔐 AUTO AUDIT TRIGGERS (FIXED & OPTIMIZED)
-- Description: Tracks DML changes for core tables
-- Excludes: AuditLog
-- ================================================


-- =====================================================
-- TRIGGER: Cart
-- =====================================================
IF OBJECT_ID('tr_Cart_Audit', 'TR') IS NOT NULL
    DROP TRIGGER tr_Cart_Audit;
GO

CREATE TRIGGER tr_Cart_Audit
ON dbo.Cart
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Action CHAR(3),
            @cart_id VARCHAR(7);

    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
        SET @Action = 'UPD';
    ELSE IF EXISTS (SELECT 1 FROM inserted)
        SET @Action = 'INS';
    ELSE
        SET @Action = 'DEL';

    SELECT TOP 1 
        @cart_id = COALESCE((SELECT TOP 1 cart_id FROM inserted), (SELECT TOP 1 cart_id FROM deleted));

    EXEC dbo.usp_AddLog2Audit
        @flag = @Action,
        @event_type = 'Cart Change',
        @table_name = 'Cart',
        @record_key = @cart_id,
        @action_by = 'ServerAdmin',
        @action_details = 'Cart record changed via DML trigger',
        @status = 'SUCCESS';
END
GO


-- =====================================================
-- TRIGGER: Customer
-- =====================================================
IF OBJECT_ID('tr_Customer_Audit', 'TR') IS NOT NULL
    DROP TRIGGER tr_Customer_Audit;
GO

CREATE TRIGGER tr_Customer_Audit
ON dbo.Customer
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Action CHAR(3),
            @customer_id VARCHAR(7),
            @details NVARCHAR(MAX);

    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
        SET @Action = 'UPD';
    ELSE IF EXISTS (SELECT 1 FROM inserted)
        SET @Action = 'INS';
    ELSE
        SET @Action = 'DEL';

    SELECT TOP 1 
        @customer_id = COALESCE((SELECT TOP 1 customer_id FROM inserted), (SELECT TOP 1 customer_id FROM deleted));

    SET @details =
        CASE 
            WHEN @Action = 'INS' THEN 'Customer record inserted.'
            WHEN @Action = 'UPD' THEN 'Customer record updated.'
            WHEN @Action = 'DEL' THEN 'Customer record deleted.'
        END;

    EXEC dbo.usp_AddLog2Audit
        @flag = @Action,
        @event_type = 'Customer Change',
        @table_name = 'Customer',
        @record_key = @customer_id,
        @action_by = 'ServerAdmin',
        @action_details = @details,
        @status = 'SUCCESS';
END
GO


-- =====================================================
-- TRIGGER: Product
-- =====================================================
IF OBJECT_ID('tr_Product_Audit', 'TR') IS NOT NULL
    DROP TRIGGER tr_Product_Audit;
GO

CREATE TRIGGER tr_Product_Audit
ON dbo.Product
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Action CHAR(3),
            @product_id VARCHAR(10),
            @details NVARCHAR(MAX);

    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
        SET @Action = 'UPD';
    ELSE IF EXISTS (SELECT 1 FROM inserted)
        SET @Action = 'INS';
    ELSE
        SET @Action = 'DEL';

    SELECT TOP 1 
        @product_id = COALESCE((SELECT TOP 1 product_id FROM inserted), (SELECT TOP 1 product_id FROM deleted));

    SET @details =
        CASE 
            WHEN @Action = 'INS' THEN 'Product added to catalog.'
            WHEN @Action = 'UPD' THEN 'Product details updated.'
            WHEN @Action = 'DEL' THEN 'Product removed from catalog.'
        END;

    EXEC dbo.usp_AddLog2Audit
        @flag = @Action,
        @event_type = 'Product Change',
        @table_name = 'Product',
        @record_key = @product_id,
        @action_by = 'ServerAdmin',
        @action_details = @details,
        @status = 'SUCCESS';
END
GO


-- =====================================================
-- TRIGGER: Cart_item
-- =====================================================
IF OBJECT_ID('tr_Cart_item_Audit', 'TR') IS NOT NULL
    DROP TRIGGER tr_Cart_item_Audit;
GO

CREATE TRIGGER tr_Cart_item_Audit
ON dbo.Cart_item
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Action CHAR(3),
            @cart_id VARCHAR(7),
            @product_id VARCHAR(10),
            @details NVARCHAR(MAX),
            @record_key_ NVARCHAR(100);

    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
        SET @Action = 'UPD';
    ELSE IF EXISTS (SELECT 1 FROM inserted)
        SET @Action = 'INS';
    ELSE
        SET @Action = 'DEL';

    -- Assign identifiers safely using separate SELECTs
    SELECT TOP 1 @cart_id = cart_id FROM inserted;
    IF @cart_id IS NULL SELECT TOP 1 @cart_id = cart_id FROM deleted;

    SELECT TOP 1 @product_id = product_id FROM inserted;
    IF @product_id IS NULL SELECT TOP 1 @product_id = product_id FROM deleted;

    SET @record_key_ = COALESCE(@cart_id, '') + '-' + COALESCE(@product_id, '');

    SET @details =
        CASE 
            WHEN @Action = 'INS' THEN 'Product added to cart.'
            WHEN @Action = 'UPD' THEN 'Cart item quantity updated.'
            WHEN @Action = 'DEL' THEN 'Product removed from cart.'
        END;

    EXEC dbo.usp_AddLog2Audit
        @flag = @Action,
        @event_type = 'Cart Item Change',
        @table_name = 'Cart_item',
        @record_key = @record_key_,
        @action_by = 'ServerAdmin',
        @action_details = @details,
        @status = 'SUCCESS';
END
GO


-- =====================================================
-- TRIGGER: Payment
-- =====================================================
IF OBJECT_ID('tr_Payment_Audit', 'TR') IS NOT NULL
    DROP TRIGGER tr_Payment_Audit;
GO

CREATE TRIGGER tr_Payment_Audit
ON dbo.Payment
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Action CHAR(3),
            @payment_id VARCHAR(10),
            @details NVARCHAR(MAX);

    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
        SET @Action = 'UPD';
    ELSE IF EXISTS (SELECT 1 FROM inserted)
        SET @Action = 'INS';
    ELSE
        SET @Action = 'DEL';

    SELECT TOP 1 
        @payment_id = COALESCE((SELECT TOP 1 payment_id FROM inserted), (SELECT TOP 1 payment_id FROM deleted));

    SET @details =
        CASE 
            WHEN @Action = 'INS' THEN 'New payment record created.'
            WHEN @Action = 'UPD' THEN 'Payment record updated.'
            WHEN @Action = 'DEL' THEN 'Payment record deleted.'
        END;

    EXEC dbo.usp_AddLog2Audit
        @flag = @Action,
        @event_type = 'Payment Change',
        @table_name = 'Payment',
        @record_key = @payment_id,
        @action_by = 'ServerAdmin',
        @action_details = @details,
        @status = 'SUCCESS';
END
GO