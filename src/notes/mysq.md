---
title: How to Reset MySQL Auto-Increment Values
permalink: /reset-mysql-auto-increment-value/
codeHighlighting: true
tags:
  - mysql
  - sql
  - database
---
1- Find the current auto-increment value:

```sql
SELECT `AUTO_INCREMENT`
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = '{db_name}'
AND TABLE_NAME = '{table_name}';
```

2- Set a new auto-increment value:

```sql
ALTER TABLE {table_name} AUTO_INCREMENT = {new_value};
```

## Notes

The behavior of resetting the auto-increment value to a lower number depends on the storage engine used:

MyISAM:
- If you try to reset the auto-increment value to a number less than or equal to the current maximum value in the AUTO_INCREMENT column, MySQL will reset it to the current maximum value plus one.

InnoDB:
- If you try to reset the auto-increment value to a number less than the current maximum value in the column, no error occurs, but the current sequence value is not changed.

In both cases, attempting to set a lower auto-increment value does not generate an error.