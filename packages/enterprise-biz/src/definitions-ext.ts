// 自动生成（sql/generate-ot.mjs）—— 扩展域对象类型 / 链接类型定义。
// 由 enterprise_biz 实际 schema 解析生成，source_table / 列名与数据库真实表一致。请勿手工编辑，改动请改生成器后重跑。
import type { ObjectType, LinkType } from '@ontology/ontology-core';

export const EXT_OBJECT_TYPES: ObjectType[] = [
  {
    "apiName": "AmAsset",
    "displayName": "资产管理-资产",
    "description": "扩展域：资产管理-资产（源表 am_asset）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_name",
        "displayName": "asset_name",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "category",
        "displayName": "category",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "category",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "value",
        "displayName": "value",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "value",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetCalibration",
    "displayName": "资产管理-资产校准",
    "description": "扩展域：资产管理-资产校准（源表 am_asset_calibration）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_calibration",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cal_date",
        "displayName": "cal_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cal_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "result",
        "displayName": "result",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "result",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetCategory",
    "displayName": "资产管理-资产类别",
    "description": "扩展域：资产管理-资产类别（源表 am_asset_category）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_category",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cat_code",
        "displayName": "cat_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cat_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "parent",
        "displayName": "parent",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "parent",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetCheck",
    "displayName": "资产管理-资产盘点",
    "description": "扩展域：资产管理-资产盘点（源表 am_asset_check）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_check",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "check_date",
        "displayName": "check_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "check_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "result",
        "displayName": "result",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "result",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetDepreciation",
    "displayName": "资产管理-资产折旧",
    "description": "扩展域：资产管理-资产折旧（源表 am_asset_depreciation）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_depreciation",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "period",
        "displayName": "period",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "period",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetDisposal",
    "displayName": "资产管理-资产处置",
    "description": "扩展域：资产管理-资产处置（源表 am_asset_disposal）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_disposal",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "method",
        "displayName": "method",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "method",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetDoc",
    "displayName": "资产管理-资产文档",
    "description": "扩展域：资产管理-资产文档（源表 am_asset_doc）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_doc",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_type",
        "displayName": "doc_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "path",
        "displayName": "path",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "path",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetImage",
    "displayName": "资产管理-资产图片",
    "description": "扩展域：资产管理-资产图片（源表 am_asset_image）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_image",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "url",
        "displayName": "url",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "url",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetInsurance",
    "displayName": "资产管理-资产保险",
    "description": "扩展域：资产管理-资产保险（源表 am_asset_insurance）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_insurance",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "insurer",
        "displayName": "insurer",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "insurer",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "premium",
        "displayName": "premium",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "premium",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetLease",
    "displayName": "资产管理-资产租赁",
    "description": "扩展域：资产管理-资产租赁（源表 am_asset_lease）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_lease",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "lessor",
        "displayName": "lessor",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "lessor",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "rent",
        "displayName": "rent",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "rent",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetLicense",
    "displayName": "资产管理-资产许可",
    "description": "扩展域：资产管理-资产许可（源表 am_asset_license）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_license",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "license_no",
        "displayName": "license_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "license_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "expire",
        "displayName": "expire",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "expire",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetLifecycle",
    "displayName": "资产管理-资产生命周期",
    "description": "扩展域：资产管理-资产生命周期（源表 am_asset_lifecycle）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_lifecycle",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "stage",
        "displayName": "stage",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "stage",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ts",
        "displayName": "ts",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ts",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetLoan",
    "displayName": "资产管理-资产借用",
    "description": "扩展域：资产管理-资产借用（源表 am_asset_loan）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_loan",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "borrower",
        "displayName": "borrower",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "borrower",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "return_date",
        "displayName": "return_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "return_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetLocation",
    "displayName": "资产管理-资产位置",
    "description": "扩展域：资产管理-资产位置（源表 am_asset_location）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_location",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "building",
        "displayName": "building",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "building",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "floor",
        "displayName": "floor",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "floor",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetMaintenance",
    "displayName": "资产管理-资产保养",
    "description": "扩展域：资产管理-资产保养（源表 am_asset_maintenance）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_maintenance",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "m_date",
        "displayName": "m_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "m_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetRepair",
    "displayName": "资产管理-资产维修",
    "description": "扩展域：资产管理-资产维修（源表 am_asset_repair）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_repair",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "fault",
        "displayName": "fault",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "fault",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cost",
        "displayName": "cost",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cost",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetSupplier",
    "displayName": "资产管理-资产供应商",
    "description": "扩展域：资产管理-资产供应商（源表 am_asset_supplier）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_supplier",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "supplier",
        "displayName": "supplier",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "supplier",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "contact",
        "displayName": "contact",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "contact",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetTag",
    "displayName": "资产管理-资产标签",
    "description": "扩展域：资产管理-资产标签（源表 am_asset_tag）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_tag",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "tag",
        "displayName": "tag",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "tag",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetTransfer",
    "displayName": "资产管理-资产调拨",
    "description": "扩展域：资产管理-资产调拨（源表 am_asset_transfer）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_transfer",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "from_loc",
        "displayName": "from_loc",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "from_loc",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "to_loc",
        "displayName": "to_loc",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "to_loc",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetUtilization",
    "displayName": "资产管理-资产利用率",
    "description": "扩展域：资产管理-资产利用率（源表 am_asset_utilization）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_utilization",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "month",
        "displayName": "month",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "month",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "rate",
        "displayName": "rate",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "rate",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetValuation",
    "displayName": "资产管理-资产估值",
    "description": "扩展域：资产管理-资产估值（源表 am_asset_valuation）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_valuation",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "val_date",
        "displayName": "val_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "val_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "value",
        "displayName": "value",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "value",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "AmAssetWarranty",
    "displayName": "资产管理-资产保修",
    "description": "扩展域：资产管理-资产保修（源表 am_asset_warranty）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_warranty",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "start_date",
        "displayName": "start_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "start_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "months",
        "displayName": "months",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "months",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArArchive",
    "displayName": "档案管理-档案",
    "description": "扩展域：档案管理-档案（源表 ar_archive）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_archive",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "arc_code",
        "displayName": "arc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "arc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "year",
        "displayName": "year",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "year",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArAuditLog",
    "displayName": "档案管理-审计日志",
    "description": "扩展域：档案管理-审计日志（源表 ar_audit_log）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_audit_log",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "actor",
        "displayName": "actor",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "actor",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "action",
        "displayName": "action",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "action",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArClassification",
    "displayName": "档案管理-密级",
    "description": "扩展域：档案管理-密级（源表 ar_classification）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_classification",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "level",
        "displayName": "level",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "level",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArContractDoc",
    "displayName": "档案管理-合同文档",
    "description": "扩展域：档案管理-合同文档（源表 ar_contract_doc）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_contract_doc",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "party",
        "displayName": "party",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "party",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArDocument",
    "displayName": "档案管理-文档",
    "description": "扩展域：档案管理-文档（源表 ar_document）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_document",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArEmailArchive",
    "displayName": "档案管理-邮件归档",
    "description": "扩展域：档案管理-邮件归档（源表 ar_email_archive）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_email_archive",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "mail_code",
        "displayName": "mail_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "mail_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "subject",
        "displayName": "subject",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "subject",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "date",
        "displayName": "date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArFile",
    "displayName": "档案管理-文件",
    "description": "扩展域：档案管理-文件（源表 ar_file）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_file",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "file_code",
        "displayName": "file_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "file_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "folder_code",
        "displayName": "folder_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "folder_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArFolder",
    "displayName": "档案管理-文件夹",
    "description": "扩展域：档案管理-文件夹（源表 ar_folder）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_folder",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "folder_code",
        "displayName": "folder_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "folder_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "parent",
        "displayName": "parent",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "parent",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArForm",
    "displayName": "档案管理-表单",
    "description": "扩展域：档案管理-表单（源表 ar_form）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_form",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "form_code",
        "displayName": "form_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "form_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArImage",
    "displayName": "档案管理-图片档案",
    "description": "扩展域：档案管理-图片档案（源表 ar_image）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_image",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "img_code",
        "displayName": "img_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "img_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "url",
        "displayName": "url",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "url",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArKnowledge",
    "displayName": "档案管理-知识库",
    "description": "扩展域：档案管理-知识库（源表 ar_knowledge）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_knowledge",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "kb_code",
        "displayName": "kb_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "kb_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArMetadata",
    "displayName": "档案管理-元数据",
    "description": "扩展域：档案管理-元数据（源表 ar_metadata）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_metadata",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "key",
        "displayName": "key",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "key",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "value",
        "displayName": "value",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "value",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArPermission",
    "displayName": "档案管理-权限",
    "description": "扩展域：档案管理-权限（源表 ar_permission）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_permission",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "role",
        "displayName": "role",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "role",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "level",
        "displayName": "level",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "level",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArPolicy",
    "displayName": "档案管理-制度",
    "description": "扩展域：档案管理-制度（源表 ar_policy）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_policy",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "policy_code",
        "displayName": "policy_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "policy_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArProcedure",
    "displayName": "档案管理-流程",
    "description": "扩展域：档案管理-流程（源表 ar_procedure）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_procedure",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "proc_code",
        "displayName": "proc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "proc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArReport",
    "displayName": "档案管理-报告",
    "description": "扩展域：档案管理-报告（源表 ar_report）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_report",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "report_code",
        "displayName": "report_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "report_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "period",
        "displayName": "period",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "period",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArRetention",
    "displayName": "档案管理-保管期限",
    "description": "扩展域：档案管理-保管期限（源表 ar_retention）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_retention",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "years",
        "displayName": "years",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "years",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArShare",
    "displayName": "档案管理-共享",
    "description": "扩展域：档案管理-共享（源表 ar_share）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_share",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "to_user",
        "displayName": "to_user",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "to_user",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArTag",
    "displayName": "档案管理-标签",
    "description": "扩展域：档案管理-标签（源表 ar_tag）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_tag",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "tag",
        "displayName": "tag",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "tag",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArTemplate",
    "displayName": "档案管理-模板",
    "description": "扩展域：档案管理-模板（源表 ar_template）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_template",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "tpl_code",
        "displayName": "tpl_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "tpl_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArVersion",
    "displayName": "档案管理-版本",
    "description": "扩展域：档案管理-版本（源表 ar_version）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_version",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_code",
        "displayName": "doc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ver",
        "displayName": "ver",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ver",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "author",
        "displayName": "author",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "author",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ArVideo",
    "displayName": "档案管理-视频档案",
    "description": "扩展域：档案管理-视频档案（源表 ar_video）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_video",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "vid_code",
        "displayName": "vid_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "vid_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "url",
        "displayName": "url",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "url",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmActivity",
    "displayName": "CRM-活动",
    "description": "扩展域：CRM-活动（源表 crm_activity）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_activity",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "act_type",
        "displayName": "act_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "act_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "act_date",
        "displayName": "act_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "act_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmCampaign",
    "displayName": "CRM-营销活动",
    "description": "扩展域：CRM-营销活动（源表 crm_campaign）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_campaign",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "camp_name",
        "displayName": "camp_name",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "camp_name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "channel",
        "displayName": "channel",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "channel",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cost",
        "displayName": "cost",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cost",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmChannel",
    "displayName": "CRM-渠道",
    "description": "扩展域：CRM-渠道（源表 crm_channel）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_channel",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "channel_name",
        "displayName": "channel_name",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "channel_name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmComplaint",
    "displayName": "CRM-投诉",
    "description": "扩展域：CRM-投诉（源表 crm_complaint）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_complaint",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "complaint_no",
        "displayName": "complaint_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "complaint_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "level",
        "displayName": "level",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "level",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmContract",
    "displayName": "CRM-合同",
    "description": "扩展域：CRM-合同（源表 crm_contract）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_contract",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "contract_no",
        "displayName": "contract_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "contract_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmContractItem",
    "displayName": "CRM-合同明细",
    "description": "扩展域：CRM-合同明细（源表 crm_contract_item）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_contract_item",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "contract_no",
        "displayName": "contract_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "contract_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "item",
        "displayName": "item",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "item",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmCustomer",
    "displayName": "CRM-客户",
    "description": "扩展域：CRM-客户（源表 crm_customer）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_customer",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "industry",
        "displayName": "industry",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "industry",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "level",
        "displayName": "level",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "level",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmCustomerContact",
    "displayName": "CRM-客户联系人",
    "description": "扩展域：CRM-客户联系人（源表 crm_customer_contact）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_customer_contact",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "contact_name",
        "displayName": "contact_name",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "contact_name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "phone",
        "displayName": "phone",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "phone",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmInteraction",
    "displayName": "CRM-互动记录",
    "description": "扩展域：CRM-互动记录（源表 crm_interaction）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_interaction",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "channel",
        "displayName": "channel",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "channel",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "content",
        "displayName": "content",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "content",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmLead",
    "displayName": "CRM-线索",
    "description": "扩展域：CRM-线索（源表 crm_lead）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_lead",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "source",
        "displayName": "source",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "source",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmOpportunity",
    "displayName": "CRM-商机",
    "description": "扩展域：CRM-商机（源表 crm_opportunity）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_opportunity",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "opp_no",
        "displayName": "opp_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "opp_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmOpportunityStage",
    "displayName": "CRM-商机阶段",
    "description": "扩展域：CRM-商机阶段（源表 crm_opportunity_stage）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_opportunity_stage",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "opp_no",
        "displayName": "opp_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "opp_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "stage",
        "displayName": "stage",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "stage",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "probability",
        "displayName": "probability",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "probability",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmPartner",
    "displayName": "CRM-合作伙伴",
    "description": "扩展域：CRM-合作伙伴（源表 crm_partner）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_partner",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "partner_code",
        "displayName": "partner_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "partner_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmPriceBook",
    "displayName": "CRM-价格手册",
    "description": "扩展域：CRM-价格手册（源表 crm_price_book）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_price_book",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "list_price",
        "displayName": "list_price",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "list_price",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmQuote",
    "displayName": "CRM-报价单",
    "description": "扩展域：CRM-报价单（源表 crm_quote）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_quote",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "quote_no",
        "displayName": "quote_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "quote_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmQuoteItem",
    "displayName": "CRM-报价明细",
    "description": "扩展域：CRM-报价明细（源表 crm_quote_item）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_quote_item",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "quote_no",
        "displayName": "quote_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "quote_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "item",
        "displayName": "item",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "item",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "price",
        "displayName": "price",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "price",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmSatisfaction",
    "displayName": "CRM-满意度",
    "description": "扩展域：CRM-满意度（源表 crm_satisfaction）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_satisfaction",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "score",
        "displayName": "score",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "score",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "nps",
        "displayName": "nps",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "nps",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmSegment",
    "displayName": "CRM-客户分群",
    "description": "扩展域：CRM-客户分群（源表 crm_segment）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_segment",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "seg_name",
        "displayName": "seg_name",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "seg_name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "criteria",
        "displayName": "criteria",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "criteria",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmSubscription",
    "displayName": "CRM-订阅",
    "description": "扩展域：CRM-订阅（源表 crm_subscription）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_subscription",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "plan",
        "displayName": "plan",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "plan",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "renew_date",
        "displayName": "renew_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "renew_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmTag",
    "displayName": "CRM-客户标签",
    "description": "扩展域：CRM-客户标签（源表 crm_tag）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_tag",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "tag",
        "displayName": "tag",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "tag",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmTask",
    "displayName": "CRM-任务",
    "description": "扩展域：CRM-任务（源表 crm_task）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_task",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "owner",
        "displayName": "owner",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "owner",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "due_date",
        "displayName": "due_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "due_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "CrmVisit",
    "displayName": "CRM-拜访",
    "description": "扩展域：CRM-拜访（源表 crm_visit）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_visit",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer_code",
        "displayName": "customer_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "visit_date",
        "displayName": "visit_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "visit_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "summary",
        "displayName": "summary",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "summary",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpBom",
    "displayName": "ERP-物料清单",
    "description": "扩展域：ERP-物料清单（源表 erp_bom）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_bom",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "product_code",
        "displayName": "product_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "product_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "material_code",
        "displayName": "material_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "material_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpBudget",
    "displayName": "ERP-预算",
    "description": "扩展域：ERP-预算（源表 erp_budget）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_budget",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "year",
        "displayName": "year",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "year",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cc_code",
        "displayName": "cc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpCostCenter",
    "displayName": "ERP-成本中心",
    "description": "扩展域：ERP-成本中心（源表 erp_cost_center）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_cost_center",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cc_code",
        "displayName": "cc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "budget",
        "displayName": "budget",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "budget",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpGlAccount",
    "displayName": "ERP-总账科目",
    "description": "扩展域：ERP-总账科目（源表 erp_gl_account）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_gl_account",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc_code",
        "displayName": "acc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc_name",
        "displayName": "acc_name",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc_name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "direction",
        "displayName": "direction",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "direction",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpInventory",
    "displayName": "ERP-库存",
    "description": "扩展域：ERP-库存（源表 erp_inventory）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_inventory",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "warehouse",
        "displayName": "warehouse",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "warehouse",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpInventoryTxn",
    "displayName": "ERP-库存交易",
    "description": "扩展域：ERP-库存交易（源表 erp_inventory_txn）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_inventory_txn",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "txn_type",
        "displayName": "txn_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "txn_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpInvoice",
    "displayName": "ERP-发票",
    "description": "扩展域：ERP-发票（源表 erp_invoice）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_invoice",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "inv_no",
        "displayName": "inv_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "inv_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "tax_rate",
        "displayName": "tax_rate",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "tax_rate",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpMaterial",
    "displayName": "ERP-物料",
    "description": "扩展域：ERP-物料（源表 erp_material）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_material",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "material_code",
        "displayName": "material_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "material_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "unit",
        "displayName": "unit",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "unit",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpMaterialCategory",
    "displayName": "ERP-物料类别",
    "description": "扩展域：ERP-物料类别（源表 erp_material_category）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_material_category",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cat_code",
        "displayName": "cat_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cat_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "parent",
        "displayName": "parent",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "parent",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpPayment",
    "displayName": "ERP-付款",
    "description": "扩展域：ERP-付款（源表 erp_payment）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_payment",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "pay_no",
        "displayName": "pay_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "pay_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "method",
        "displayName": "method",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "method",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpProductionPlan",
    "displayName": "ERP-生产计划",
    "description": "扩展域：ERP-生产计划（源表 erp_production_plan）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_production_plan",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "plan_no",
        "displayName": "plan_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "plan_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "product_code",
        "displayName": "product_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "product_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "plan_qty",
        "displayName": "plan_qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "plan_qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpPurchaseOrder",
    "displayName": "ERP-采购订单",
    "description": "扩展域：ERP-采购订单（源表 erp_purchase_order）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_purchase_order",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "po_no",
        "displayName": "po_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "po_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "supplier_id",
        "displayName": "supplier_id",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "supplier_id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "order_date",
        "displayName": "order_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "order_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpPurchaseOrderItem",
    "displayName": "ERP-采购订单行",
    "description": "扩展域：ERP-采购订单行（源表 erp_purchase_order_item）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_purchase_order_item",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "po_no",
        "displayName": "po_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "po_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "price",
        "displayName": "price",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "price",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpQualityInspect",
    "displayName": "ERP-质检",
    "description": "扩展域：ERP-质检（源表 erp_quality_inspect）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_quality_inspect",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "wo_no",
        "displayName": "wo_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "wo_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "result",
        "displayName": "result",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "result",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "defect_rate",
        "displayName": "defect_rate",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "defect_rate",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpReceipt",
    "displayName": "ERP-收款",
    "description": "扩展域：ERP-收款（源表 erp_receipt）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_receipt",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "rcpt_no",
        "displayName": "rcpt_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "rcpt_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "method",
        "displayName": "method",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "method",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpSalesOrder",
    "displayName": "ERP-销售订单",
    "description": "扩展域：ERP-销售订单（源表 erp_sales_order）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_sales_order",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "so_no",
        "displayName": "so_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "so_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer",
        "displayName": "customer",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpSalesOrderItem",
    "displayName": "ERP-销售订单行",
    "description": "扩展域：ERP-销售订单行（源表 erp_sales_order_item）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_sales_order_item",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "so_no",
        "displayName": "so_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "so_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpSupplier",
    "displayName": "ERP-供应商",
    "description": "扩展域：ERP-供应商（源表 erp_supplier）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_supplier",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "supplier_code",
        "displayName": "supplier_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "supplier_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "contact",
        "displayName": "contact",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "contact",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "level",
        "displayName": "level",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "level",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpSupplierEval",
    "displayName": "ERP-供应商评估",
    "description": "扩展域：ERP-供应商评估（源表 erp_supplier_eval）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_supplier_eval",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "supplier_code",
        "displayName": "supplier_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "supplier_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "score",
        "displayName": "score",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "score",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "dimension",
        "displayName": "dimension",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "dimension",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpVoucher",
    "displayName": "ERP-凭证",
    "description": "扩展域：ERP-凭证（源表 erp_voucher）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_voucher",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "voucher_no",
        "displayName": "voucher_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "voucher_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc_code",
        "displayName": "acc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpWarehouse",
    "displayName": "ERP-仓库",
    "description": "扩展域：ERP-仓库（源表 erp_warehouse）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_warehouse",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "wh_code",
        "displayName": "wh_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "wh_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "location",
        "displayName": "location",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "location",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "capacity",
        "displayName": "capacity",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "capacity",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "ErpWorkOrder",
    "displayName": "ERP-工单",
    "description": "扩展域：ERP-工单（源表 erp_work_order）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_work_order",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "wo_no",
        "displayName": "wo_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "wo_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "product_code",
        "displayName": "product_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "product_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinAccount",
    "displayName": "财务-会计科目",
    "description": "扩展域：财务-会计科目（源表 fin_account）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_account",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc_code",
        "displayName": "acc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc_name",
        "displayName": "acc_name",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc_name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinAssetLedger",
    "displayName": "财务-资产台账",
    "description": "扩展域：财务-资产台账（源表 fin_asset_ledger）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_asset_ledger",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "value",
        "displayName": "value",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "value",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinBank",
    "displayName": "财务-银行",
    "description": "扩展域：财务-银行（源表 fin_bank）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_bank",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "bank_code",
        "displayName": "bank_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "bank_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "balance",
        "displayName": "balance",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "balance",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinBudget",
    "displayName": "财务-预算",
    "description": "扩展域：财务-预算（源表 fin_budget）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_budget",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "year",
        "displayName": "year",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "year",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "dept",
        "displayName": "dept",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "dept",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinCashFlow",
    "displayName": "财务-现金流",
    "description": "扩展域：财务-现金流（源表 fin_cash_flow）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_cash_flow",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cf_type",
        "displayName": "cf_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cf_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinCost",
    "displayName": "财务-成本",
    "description": "扩展域：财务-成本（源表 fin_cost）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_cost",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cost_type",
        "displayName": "cost_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cost_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "period",
        "displayName": "period",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "period",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinDividend",
    "displayName": "财务-分红",
    "description": "扩展域：财务-分红（源表 fin_dividend）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_dividend",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "shareholder",
        "displayName": "shareholder",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "shareholder",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinExpense",
    "displayName": "财务-费用",
    "description": "扩展域：财务-费用（源表 fin_expense）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_expense",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "exp_type",
        "displayName": "exp_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "exp_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "period",
        "displayName": "period",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "period",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinInvestment",
    "displayName": "财务-投资",
    "description": "扩展域：财务-投资（源表 fin_investment）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_investment",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "inv_code",
        "displayName": "inv_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "inv_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "return_rate",
        "displayName": "return_rate",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "return_rate",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinInvoice",
    "displayName": "财务-发票",
    "description": "扩展域：财务-发票（源表 fin_invoice）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_invoice",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "inv_no",
        "displayName": "inv_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "inv_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "tax",
        "displayName": "tax",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "tax",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinJournal",
    "displayName": "财务-日记账",
    "description": "扩展域：财务-日记账（源表 fin_journal）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_journal",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "j_no",
        "displayName": "j_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "j_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc_code",
        "displayName": "acc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinLedger",
    "displayName": "财务-分类账",
    "description": "扩展域：财务-分类账（源表 fin_ledger）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_ledger",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc_code",
        "displayName": "acc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "period",
        "displayName": "period",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "period",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "balance",
        "displayName": "balance",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "balance",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinLoan",
    "displayName": "财务-借款",
    "description": "扩展域：财务-借款（源表 fin_loan）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_loan",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "loan_no",
        "displayName": "loan_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "loan_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "rate",
        "displayName": "rate",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "rate",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinPayable",
    "displayName": "财务-应付",
    "description": "扩展域：财务-应付（源表 fin_payable）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_payable",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "supplier_code",
        "displayName": "supplier_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "supplier_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "due_date",
        "displayName": "due_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "due_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinPayment",
    "displayName": "财务-付款",
    "description": "扩展域：财务-付款（源表 fin_payment）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_payment",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "pay_no",
        "displayName": "pay_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "pay_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "method",
        "displayName": "method",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "method",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinReceipt",
    "displayName": "财务-收款",
    "description": "扩展域：财务-收款（源表 fin_receipt）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_receipt",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "rcpt_no",
        "displayName": "rcpt_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "rcpt_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "method",
        "displayName": "method",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "method",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinReceivable",
    "displayName": "财务-应收",
    "description": "扩展域：财务-应收（源表 fin_receivable）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_receivable",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cust_code",
        "displayName": "cust_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cust_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "due_date",
        "displayName": "due_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "due_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinReport",
    "displayName": "财务-报表",
    "description": "扩展域：财务-报表（源表 fin_report）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_report",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "rep_code",
        "displayName": "rep_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "rep_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "period",
        "displayName": "period",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "period",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinRevenue",
    "displayName": "财务-收入",
    "description": "扩展域：财务-收入（源表 fin_revenue）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_revenue",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "rev_type",
        "displayName": "rev_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "rev_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "period",
        "displayName": "period",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "period",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinSalary",
    "displayName": "财务-工资",
    "description": "扩展域：财务-工资（源表 fin_salary）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_salary",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "emp_code",
        "displayName": "emp_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "emp_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "gross",
        "displayName": "gross",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "gross",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "net",
        "displayName": "net",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "net",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinTax",
    "displayName": "财务-税务",
    "description": "扩展域：财务-税务（源表 fin_tax）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_tax",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "tax_type",
        "displayName": "tax_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "tax_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "period",
        "displayName": "period",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "period",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "FinVoucher",
    "displayName": "财务-凭证",
    "description": "扩展域：财务-凭证（源表 fin_voucher）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_voucher",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "voucher_no",
        "displayName": "voucher_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "voucher_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc_code",
        "displayName": "acc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrAttendance",
    "displayName": "人事-考勤",
    "description": "扩展域：人事-考勤（源表 hr_attendance）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_attendance",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "work_date",
        "displayName": "work_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "work_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "check_in",
        "displayName": "check_in",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "check_in",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "check_out",
        "displayName": "check_out",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "check_out",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "late_minutes",
        "displayName": "late_minutes",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "late_minutes",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrBonus",
    "displayName": "人事-奖金",
    "description": "扩展域：人事-奖金（源表 hr_bonus）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_bonus",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "reason",
        "displayName": "reason",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "reason",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrBusinessTrip",
    "displayName": "人事-出差",
    "description": "扩展域：人事-出差（源表 hr_business_trip）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_business_trip",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "city",
        "displayName": "city",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "city",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "start_date",
        "displayName": "start_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "start_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "days",
        "displayName": "days",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "days",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrCertification",
    "displayName": "人事-证书",
    "description": "扩展域：人事-证书（源表 hr_certification）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_certification",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cert_name",
        "displayName": "cert_name",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cert_name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "issue_date",
        "displayName": "issue_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "issue_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "valid_years",
        "displayName": "valid_years",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "valid_years",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrEmployeeContract",
    "displayName": "人事-员工合同",
    "description": "扩展域：人事-员工合同（源表 hr_employee_contract）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_employee_contract",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "contract_type",
        "displayName": "contract_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "contract_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "start_date",
        "displayName": "start_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "start_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "end_date",
        "displayName": "end_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "end_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "salary",
        "displayName": "salary",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "salary",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrEmployeeDocument",
    "displayName": "人事-员工档案",
    "description": "扩展域：人事-员工档案（源表 hr_employee_document）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_employee_document",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_type",
        "displayName": "doc_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "file_path",
        "displayName": "file_path",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "file_path",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrEmployeeSkill",
    "displayName": "人事-员工技能",
    "description": "扩展域：人事-员工技能（源表 hr_employee_skill）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_employee_skill",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "skill",
        "displayName": "skill",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "skill",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "level",
        "displayName": "level",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "level",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrExit",
    "displayName": "人事-离职",
    "description": "扩展域：人事-离职（源表 hr_exit）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_exit",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "exit_date",
        "displayName": "exit_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "exit_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "reason",
        "displayName": "reason",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "reason",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrHealth",
    "displayName": "人事-员工健康",
    "description": "扩展域：人事-员工健康（源表 hr_health）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_health",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "check_date",
        "displayName": "check_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "check_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "bmi",
        "displayName": "bmi",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "bmi",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrLeaveBalance",
    "displayName": "人事-年假余额",
    "description": "扩展域：人事-年假余额（源表 hr_leave_balance）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_leave_balance",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "year",
        "displayName": "year",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "year",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "total_days",
        "displayName": "total_days",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "total_days",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "used_days",
        "displayName": "used_days",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "used_days",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrOrgChart",
    "displayName": "人事-组织架构",
    "description": "扩展域：人事-组织架构（源表 hr_org_chart）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_org_chart",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "parent_code",
        "displayName": "parent_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "parent_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "manager",
        "displayName": "manager",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "manager",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrOvertime",
    "displayName": "人事-加班",
    "description": "扩展域：人事-加班（源表 hr_overtime）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_overtime",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ot_date",
        "displayName": "ot_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ot_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "hours",
        "displayName": "hours",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "hours",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "reason",
        "displayName": "reason",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "reason",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrPayroll",
    "displayName": "人事-工资单",
    "description": "扩展域：人事-工资单（源表 hr_payroll）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_payroll",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "pay_month",
        "displayName": "pay_month",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "pay_month",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "gross",
        "displayName": "gross",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "gross",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "net",
        "displayName": "net",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "net",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrPension",
    "displayName": "人事-社保公积金",
    "description": "扩展域：人事-社保公积金（源表 hr_pension）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_pension",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "month",
        "displayName": "month",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "month",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "pension_base",
        "displayName": "pension_base",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "pension_base",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "fund_base",
        "displayName": "fund_base",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "fund_base",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrPerformance",
    "displayName": "人事-绩效",
    "description": "扩展域：人事-绩效（源表 hr_performance）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_performance",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "period",
        "displayName": "period",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "period",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "score",
        "displayName": "score",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "score",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "rank",
        "displayName": "rank",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "rank",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrPosition",
    "displayName": "人事-岗位",
    "description": "扩展域：人事-岗位（源表 hr_position）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_position",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "level",
        "displayName": "level",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "level",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "headcount",
        "displayName": "headcount",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "headcount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrProbation",
    "displayName": "人事-试用期",
    "description": "扩展域：人事-试用期（源表 hr_probation）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_probation",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "start_date",
        "displayName": "start_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "start_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "end_date",
        "displayName": "end_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "end_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "passed",
        "displayName": "passed",
        "dataType": "BOOLEAN",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "passed",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrRecruitment",
    "displayName": "人事-招聘",
    "description": "扩展域：人事-招聘（源表 hr_recruitment）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_recruitment",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "position",
        "displayName": "position",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "position",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "candidates",
        "displayName": "candidates",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "candidates",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "stage",
        "displayName": "stage",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "stage",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrSalary",
    "displayName": "人事-薪资",
    "description": "扩展域：人事-薪资（源表 hr_salary）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_salary",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "pay_month",
        "displayName": "pay_month",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "pay_month",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "base_salary",
        "displayName": "base_salary",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "base_salary",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "bonus",
        "displayName": "bonus",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "bonus",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrSocialSecurity",
    "displayName": "人事-社保",
    "description": "扩展域：人事-社保（源表 hr_social_security）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_social_security",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "month",
        "displayName": "month",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "month",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrTraining",
    "displayName": "人事-培训",
    "description": "扩展域：人事-培训（源表 hr_training）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_training",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "course",
        "displayName": "course",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "course",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "hours",
        "displayName": "hours",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "hours",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "passed",
        "displayName": "passed",
        "dataType": "BOOLEAN",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "passed",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "HrTransfer",
    "displayName": "人事-调岗",
    "description": "扩展域：人事-调岗（源表 hr_transfer）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_transfer",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "from_dept",
        "displayName": "from_dept",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "from_dept",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "to_dept",
        "displayName": "to_dept",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "to_dept",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "eff_date",
        "displayName": "eff_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "eff_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdAttribute",
    "displayName": "产品管理-产品属性",
    "description": "扩展域：产品管理-产品属性（源表 pd_attribute）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_attribute",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "attr_code",
        "displayName": "attr_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "attr_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdAttributeValue",
    "displayName": "产品管理-属性值",
    "description": "扩展域：产品管理-属性值（源表 pd_attribute_value）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_attribute_value",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "attr_code",
        "displayName": "attr_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "attr_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "value",
        "displayName": "value",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "value",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdBug",
    "displayName": "产品管理-缺陷",
    "description": "扩展域：产品管理-缺陷（源表 pd_bug）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_bug",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "bug_no",
        "displayName": "bug_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "bug_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "severity",
        "displayName": "severity",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "severity",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdBundle",
    "displayName": "产品管理-产品组合",
    "description": "扩展域：产品管理-产品组合（源表 pd_bundle）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_bundle",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "bundle_code",
        "displayName": "bundle_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "bundle_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdCatalog",
    "displayName": "产品管理-产品目录",
    "description": "扩展域：产品管理-产品目录（源表 pd_catalog）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_catalog",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cat_code",
        "displayName": "cat_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cat_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdCategory",
    "displayName": "产品管理-产品类别",
    "description": "扩展域：产品管理-产品类别（源表 pd_category）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_category",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cat_code",
        "displayName": "cat_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cat_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "parent",
        "displayName": "parent",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "parent",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdChannelProduct",
    "displayName": "产品管理-渠道产品",
    "description": "扩展域：产品管理-渠道产品（源表 pd_channel_product）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_channel_product",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "channel",
        "displayName": "channel",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "channel",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdCompetitor",
    "displayName": "产品管理-竞品",
    "description": "扩展域：产品管理-竞品（源表 pd_competitor）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_competitor",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "comp_code",
        "displayName": "comp_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "comp_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "strength",
        "displayName": "strength",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "strength",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdFeedback",
    "displayName": "产品管理-用户反馈",
    "description": "扩展域：产品管理-用户反馈（源表 pd_feedback）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_feedback",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "channel",
        "displayName": "channel",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "channel",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "content",
        "displayName": "content",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "content",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdLaunch",
    "displayName": "产品管理-产品上市",
    "description": "扩展域：产品管理-产品上市（源表 pd_launch）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_launch",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "region",
        "displayName": "region",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "region",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "launch_date",
        "displayName": "launch_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "launch_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdLifecycle",
    "displayName": "产品管理-产品生命周期",
    "description": "扩展域：产品管理-产品生命周期（源表 pd_lifecycle）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_lifecycle",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "stage",
        "displayName": "stage",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "stage",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "date",
        "displayName": "date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdMarketAnalysis",
    "displayName": "产品管理-市场分析",
    "description": "扩展域：产品管理-市场分析（源表 pd_market_analysis）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_market_analysis",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "region",
        "displayName": "region",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "region",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "share",
        "displayName": "share",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "share",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdPricing",
    "displayName": "产品管理-定价",
    "description": "扩展域：产品管理-定价（源表 pd_pricing）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_pricing",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "price",
        "displayName": "price",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "price",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "currency",
        "displayName": "currency",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "currency",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdProductFeature",
    "displayName": "产品管理-产品特性",
    "description": "扩展域：产品管理-产品特性（源表 pd_product_feature）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_product_feature",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdProductRoadmap",
    "displayName": "产品管理-产品路线图",
    "description": "扩展域：产品管理-产品路线图（源表 pd_product_roadmap）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_product_roadmap",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "quarter",
        "displayName": "quarter",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "quarter",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "goal",
        "displayName": "goal",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "goal",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdProductSpec",
    "displayName": "产品管理-产品规格",
    "description": "扩展域：产品管理-产品规格（源表 pd_product_spec）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_product_spec",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "spec_name",
        "displayName": "spec_name",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "spec_name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "spec_value",
        "displayName": "spec_value",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "spec_value",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdProductVersion",
    "displayName": "产品管理-产品版本",
    "description": "扩展域：产品管理-产品版本（源表 pd_product_version）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_product_version",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "version",
        "displayName": "version",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "version",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "release_date",
        "displayName": "release_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "release_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdRelease",
    "displayName": "产品管理-发布",
    "description": "扩展域：产品管理-发布（源表 pd_release）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_release",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "release_no",
        "displayName": "release_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "release_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "date",
        "displayName": "date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdReleaseNote",
    "displayName": "产品管理-发布说明",
    "description": "扩展域：产品管理-发布说明（源表 pd_release_note）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_release_note",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "release_no",
        "displayName": "release_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "release_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "content",
        "displayName": "content",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "content",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdRequirement",
    "displayName": "产品管理-需求",
    "description": "扩展域：产品管理-需求（源表 pd_requirement）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_requirement",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "req_no",
        "displayName": "req_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "req_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "priority",
        "displayName": "priority",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "priority",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdReview",
    "displayName": "产品管理-产品评审",
    "description": "扩展域：产品管理-产品评审（源表 pd_review）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_review",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "reviewer",
        "displayName": "reviewer",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "reviewer",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "result",
        "displayName": "result",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "result",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PdUserStory",
    "displayName": "产品管理-用户故事",
    "description": "扩展域：产品管理-用户故事（源表 pd_user_story）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_user_story",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "req_no",
        "displayName": "req_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "req_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "story",
        "displayName": "story",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "story",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "points",
        "displayName": "points",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "points",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmBacklog",
    "displayName": "项目管理-需求池",
    "description": "扩展域：项目管理-需求池（源表 pm_backlog）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_backlog",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "priority",
        "displayName": "priority",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "priority",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmBudget",
    "displayName": "项目管理-项目预算",
    "description": "扩展域：项目管理-项目预算（源表 pm_budget）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_budget",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmChangeRequest",
    "displayName": "项目管理-变更请求",
    "description": "扩展域：项目管理-变更请求（源表 pm_change_request）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_change_request",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cr_no",
        "displayName": "cr_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cr_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "reason",
        "displayName": "reason",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "reason",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmComment",
    "displayName": "项目管理-评论",
    "description": "扩展域：项目管理-评论（源表 pm_comment）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_comment",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "task_code",
        "displayName": "task_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "task_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "author",
        "displayName": "author",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "author",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "content",
        "displayName": "content",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "content",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmDeliverable",
    "displayName": "项目管理-交付物",
    "description": "扩展域：项目管理-交付物（源表 pm_deliverable）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_deliverable",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmDocument",
    "displayName": "项目管理-项目文档",
    "description": "扩展域：项目管理-项目文档（源表 pm_document）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_document",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "doc_type",
        "displayName": "doc_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "doc_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "path",
        "displayName": "path",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "path",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmEpic",
    "displayName": "项目管理-史诗",
    "description": "扩展域：项目管理-史诗（源表 pm_epic）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_epic",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmExpense",
    "displayName": "项目管理-项目费用",
    "description": "扩展域：项目管理-项目费用（源表 pm_expense）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_expense",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "category",
        "displayName": "category",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "category",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "amount",
        "displayName": "amount",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "amount",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmIssue",
    "displayName": "项目管理-问题",
    "description": "扩展域：项目管理-问题（源表 pm_issue）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_issue",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "issue_no",
        "displayName": "issue_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "issue_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "severity",
        "displayName": "severity",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "severity",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmLessons",
    "displayName": "项目管理-经验教训",
    "description": "扩展域：项目管理-经验教训（源表 pm_lessons）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_lessons",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "content",
        "displayName": "content",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "content",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmMeeting",
    "displayName": "项目管理-会议",
    "description": "扩展域：项目管理-会议（源表 pm_meeting）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_meeting",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "date",
        "displayName": "date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmMilestone",
    "displayName": "项目管理-里程碑",
    "description": "扩展域：项目管理-里程碑（源表 pm_milestone）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_milestone",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "date",
        "displayName": "date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmPortfolio",
    "displayName": "项目管理-项目组合",
    "description": "扩展域：项目管理-项目组合（源表 pm_portfolio）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_portfolio",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "pf_code",
        "displayName": "pf_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "pf_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmProjectTask",
    "displayName": "项目管理-项目任务",
    "description": "扩展域：项目管理-项目任务（源表 pm_project_task）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_project_task",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "task_code",
        "displayName": "task_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "task_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmQualityGate",
    "displayName": "项目管理-质量门",
    "description": "扩展域：项目管理-质量门（源表 pm_quality_gate）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_quality_gate",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "gate",
        "displayName": "gate",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "gate",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "passed",
        "displayName": "passed",
        "dataType": "BOOLEAN",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "passed",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmResource",
    "displayName": "项目管理-资源",
    "description": "扩展域：项目管理-资源（源表 pm_resource）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_resource",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "res_code",
        "displayName": "res_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "res_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cost",
        "displayName": "cost",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cost",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmResourceAllocation",
    "displayName": "项目管理-资源分配",
    "description": "扩展域：项目管理-资源分配（源表 pm_resource_allocation）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_resource_allocation",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "res_code",
        "displayName": "res_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "res_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmRisk",
    "displayName": "项目管理-风险",
    "description": "扩展域：项目管理-风险（源表 pm_risk）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_risk",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "risk_no",
        "displayName": "risk_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "risk_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "level",
        "displayName": "level",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "level",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "mitigation",
        "displayName": "mitigation",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "mitigation",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmSprint",
    "displayName": "项目管理-迭代",
    "description": "扩展域：项目管理-迭代（源表 pm_sprint）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_sprint",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "start_date",
        "displayName": "start_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "start_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmStakeholder",
    "displayName": "项目管理-干系人",
    "description": "扩展域：项目管理-干系人（源表 pm_stakeholder）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_stakeholder",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "project_code",
        "displayName": "project_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "project_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "role",
        "displayName": "role",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "role",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmTaskDependency",
    "displayName": "项目管理-任务依赖",
    "description": "扩展域：项目管理-任务依赖（源表 pm_task_dependency）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_task_dependency",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "task_code",
        "displayName": "task_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "task_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "dep_task",
        "displayName": "dep_task",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "dep_task",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "PmTimesheet",
    "displayName": "项目管理-工时表",
    "description": "扩展域：项目管理-工时表（源表 pm_timesheet）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_timesheet",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "emp_code",
        "displayName": "emp_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "emp_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "task_code",
        "displayName": "task_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "task_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "hours",
        "displayName": "hours",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "hours",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecAccessLog",
    "displayName": "网络安全-访问日志",
    "description": "扩展域：网络安全-访问日志（源表 sec_access_log）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_access_log",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "user",
        "displayName": "user",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "user",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "resource",
        "displayName": "resource",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "resource",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ts",
        "displayName": "ts",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ts",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecAlert",
    "displayName": "网络安全-安全告警",
    "description": "扩展域：网络安全-安全告警（源表 sec_alert）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_alert",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "alert_no",
        "displayName": "alert_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "alert_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "rule",
        "displayName": "rule",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "rule",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "severity",
        "displayName": "severity",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "severity",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecAsset",
    "displayName": "网络安全-安全资产",
    "description": "扩展域：网络安全-安全资产（源表 sec_asset）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_asset",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "criticality",
        "displayName": "criticality",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "criticality",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecAudit",
    "displayName": "网络安全-安全审计",
    "description": "扩展域：网络安全-安全审计（源表 sec_audit）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_audit",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "audit_no",
        "displayName": "audit_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "audit_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "scope",
        "displayName": "scope",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "scope",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "result",
        "displayName": "result",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "result",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecAuthEvent",
    "displayName": "网络安全-认证事件",
    "description": "扩展域：网络安全-认证事件（源表 sec_auth_event）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_auth_event",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc",
        "displayName": "acc",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "result",
        "displayName": "result",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "result",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ts",
        "displayName": "ts",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ts",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecBackup",
    "displayName": "网络安全-备份",
    "description": "扩展域：网络安全-备份（源表 sec_backup）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_backup",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "bk_no",
        "displayName": "bk_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "bk_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "target",
        "displayName": "target",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "target",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecCertificate",
    "displayName": "网络安全-证书",
    "description": "扩展域：网络安全-证书（源表 sec_certificate）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_certificate",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cert_no",
        "displayName": "cert_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cert_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cn",
        "displayName": "cn",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cn",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "expire",
        "displayName": "expire",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "expire",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecCompliance",
    "displayName": "网络安全-合规",
    "description": "扩展域：网络安全-合规（源表 sec_compliance）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_compliance",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "cmp_code",
        "displayName": "cmp_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "cmp_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "standard",
        "displayName": "standard",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "standard",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecControl",
    "displayName": "网络安全-安全控制",
    "description": "扩展域：网络安全-安全控制（源表 sec_control）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_control",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ctrl_code",
        "displayName": "ctrl_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ctrl_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecEndpoint",
    "displayName": "网络安全-终端",
    "description": "扩展域：网络安全-终端（源表 sec_endpoint）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_endpoint",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ep_code",
        "displayName": "ep_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ep_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "os",
        "displayName": "os",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "os",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "compliant",
        "displayName": "compliant",
        "dataType": "BOOLEAN",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "compliant",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecFirewallRule",
    "displayName": "网络安全-防火墙规则",
    "description": "扩展域：网络安全-防火墙规则（源表 sec_firewall_rule）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_firewall_rule",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "fw_no",
        "displayName": "fw_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "fw_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "src",
        "displayName": "src",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "src",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "dst",
        "displayName": "dst",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "dst",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "action",
        "displayName": "action",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "action",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecIncident",
    "displayName": "网络安全-安全事件",
    "description": "扩展域：网络安全-安全事件（源表 sec_incident）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_incident",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "inc_no",
        "displayName": "inc_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "inc_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "level",
        "displayName": "level",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "level",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecIntrusion",
    "displayName": "网络安全-入侵检测",
    "description": "扩展域：网络安全-入侵检测（源表 sec_intrusion）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_intrusion",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ids_no",
        "displayName": "ids_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ids_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "src_ip",
        "displayName": "src_ip",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "src_ip",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "dst_ip",
        "displayName": "dst_ip",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "dst_ip",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecMalware",
    "displayName": "网络安全-恶意代码",
    "description": "扩展域：网络安全-恶意代码（源表 sec_malware）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_malware",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "mal_no",
        "displayName": "mal_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "mal_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecNetworkDevice",
    "displayName": "网络安全-网络设备",
    "description": "扩展域：网络安全-网络设备（源表 sec_network_device）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_network_device",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "dev_code",
        "displayName": "dev_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "dev_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ip",
        "displayName": "ip",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ip",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecPatch",
    "displayName": "网络安全-补丁",
    "description": "扩展域：网络安全-补丁（源表 sec_patch）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_patch",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "patch_no",
        "displayName": "patch_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "patch_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "asset_code",
        "displayName": "asset_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "asset_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecPhishing",
    "displayName": "网络安全-钓鱼",
    "description": "扩展域：网络安全-钓鱼（源表 sec_phishing）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_phishing",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ph_no",
        "displayName": "ph_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ph_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "target",
        "displayName": "target",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "target",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "blocked",
        "displayName": "blocked",
        "dataType": "BOOLEAN",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "blocked",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecPolicy",
    "displayName": "网络安全-安全策略",
    "description": "扩展域：网络安全-安全策略（源表 sec_policy）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_policy",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "policy_code",
        "displayName": "policy_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "policy_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "title",
        "displayName": "title",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "title",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecScan",
    "displayName": "网络安全-扫描",
    "description": "扩展域：网络安全-扫描（源表 sec_scan）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_scan",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "scan_no",
        "displayName": "scan_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "scan_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "target",
        "displayName": "target",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "target",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecThreatIntel",
    "displayName": "网络安全-威胁情报",
    "description": "扩展域：网络安全-威胁情报（源表 sec_threat_intel）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_threat_intel",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ti_code",
        "displayName": "ti_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ti_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ioc",
        "displayName": "ioc",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ioc",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecUserAccount",
    "displayName": "网络安全-账号",
    "description": "扩展域：网络安全-账号（源表 sec_user_account）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_user_account",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "acc",
        "displayName": "acc",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "acc",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "mfa",
        "displayName": "mfa",
        "dataType": "BOOLEAN",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "mfa",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "SecVulnerability",
    "displayName": "网络安全-漏洞",
    "description": "扩展域：网络安全-漏洞（源表 sec_vulnerability）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_vulnerability",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "vuln_no",
        "displayName": "vuln_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "vuln_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "severity",
        "displayName": "severity",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "severity",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsCrossDock",
    "displayName": "WMS-越库",
    "description": "扩展域：WMS-越库（源表 wms_cross_dock）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_cross_dock",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ib_no",
        "displayName": "ib_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ib_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ob_no",
        "displayName": "ob_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ob_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsCycleCount",
    "displayName": "WMS-循环盘点",
    "description": "扩展域：WMS-循环盘点（源表 wms_cycle_count）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_cycle_count",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "loc_code",
        "displayName": "loc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "loc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "count_date",
        "displayName": "count_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "count_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "diff",
        "displayName": "diff",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "diff",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsInbound",
    "displayName": "WMS-入库单",
    "description": "扩展域：WMS-入库单（源表 wms_inbound）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_inbound",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ib_no",
        "displayName": "ib_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ib_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "supplier",
        "displayName": "supplier",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "supplier",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsInboundLine",
    "displayName": "WMS-入库明细",
    "description": "扩展域：WMS-入库明细（源表 wms_inbound_line）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_inbound_line",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ib_no",
        "displayName": "ib_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ib_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsInventoryAdj",
    "displayName": "WMS-库存调整",
    "description": "扩展域：WMS-库存调整（源表 wms_inventory_adj）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_inventory_adj",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "adj_qty",
        "displayName": "adj_qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "adj_qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "reason",
        "displayName": "reason",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "reason",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsLocation",
    "displayName": "WMS-库位",
    "description": "扩展域：WMS-库位（源表 wms_location）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_location",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "zone_code",
        "displayName": "zone_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "zone_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "loc_code",
        "displayName": "loc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "loc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "capacity",
        "displayName": "capacity",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "capacity",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsLot",
    "displayName": "WMS-批次",
    "description": "扩展域：WMS-批次（源表 wms_lot）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_lot",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "lot_no",
        "displayName": "lot_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "lot_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "prod_date",
        "displayName": "prod_date",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "prod_date",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsOutbound",
    "displayName": "WMS-出库单",
    "description": "扩展域：WMS-出库单（源表 wms_outbound）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_outbound",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ob_no",
        "displayName": "ob_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ob_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "customer",
        "displayName": "customer",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "customer",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsOutboundLine",
    "displayName": "WMS-出库明细",
    "description": "扩展域：WMS-出库明细（源表 wms_outbound_line）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_outbound_line",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ob_no",
        "displayName": "ob_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ob_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsPacking",
    "displayName": "WMS-打包",
    "description": "扩展域：WMS-打包（源表 wms_packing）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_packing",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ob_no",
        "displayName": "ob_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ob_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "pack_type",
        "displayName": "pack_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "pack_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "weight",
        "displayName": "weight",
        "dataType": "NUMBER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "weight",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsPickingTask",
    "displayName": "WMS-拣货任务",
    "description": "扩展域：WMS-拣货任务（源表 wms_picking_task）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_picking_task",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ob_no",
        "displayName": "ob_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ob_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "picker",
        "displayName": "picker",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "picker",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsPutaway",
    "displayName": "WMS-上架",
    "description": "扩展域：WMS-上架（源表 wms_putaway）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_putaway",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ib_no",
        "displayName": "ib_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ib_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "loc_code",
        "displayName": "loc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "loc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsReceiving",
    "displayName": "WMS-收货",
    "description": "扩展域：WMS-收货（源表 wms_receiving）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_receiving",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ib_no",
        "displayName": "ib_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ib_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "damaged",
        "displayName": "damaged",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "damaged",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsReservation",
    "displayName": "WMS-预留",
    "description": "扩展域：WMS-预留（源表 wms_reservation）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_reservation",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "expire",
        "displayName": "expire",
        "dataType": "DATE",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "expire",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsReturn",
    "displayName": "WMS-退货",
    "description": "扩展域：WMS-退货（源表 wms_return）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_return",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "return_no",
        "displayName": "return_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "return_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "reason",
        "displayName": "reason",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "reason",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsSerial",
    "displayName": "WMS-序列号",
    "description": "扩展域：WMS-序列号（源表 wms_serial）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_serial",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "serial_no",
        "displayName": "serial_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "serial_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsShipping",
    "displayName": "WMS-发货",
    "description": "扩展域：WMS-发货（源表 wms_shipping）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_shipping",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "ob_no",
        "displayName": "ob_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "ob_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "carrier",
        "displayName": "carrier",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "carrier",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "track_no",
        "displayName": "track_no",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "track_no",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsSku",
    "displayName": "WMS-库存单位",
    "description": "扩展域：WMS-库存单位（源表 wms_sku）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_sku",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "uom",
        "displayName": "uom",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "uom",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsStock",
    "displayName": "WMS-库存",
    "description": "扩展域：WMS-库存（源表 wms_stock）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_stock",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "loc_code",
        "displayName": "loc_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "loc_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "qty",
        "displayName": "qty",
        "dataType": "INTEGER",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "qty",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsStockMove",
    "displayName": "WMS-库存移动",
    "description": "扩展域：WMS-库存移动（源表 wms_stock_move）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_stock_move",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "sku",
        "displayName": "sku",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "sku",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "from_loc",
        "displayName": "from_loc",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "from_loc",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "to_loc",
        "displayName": "to_loc",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "to_loc",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsWarehouse",
    "displayName": "WMS-仓库",
    "description": "扩展域：WMS-仓库（源表 wms_warehouse）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_warehouse",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "wh_code",
        "displayName": "wh_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "wh_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "location",
        "displayName": "location",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "location",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "type",
        "displayName": "type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  },
  {
    "apiName": "WmsZone",
    "displayName": "WMS-库区",
    "description": "扩展域：WMS-库区（源表 wms_zone）",
    "icon": "📄",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_zone",
    "properties": [
      {
        "apiName": "id",
        "displayName": "id",
        "dataType": "INTEGER",
        "required": true,
        "primaryKey": true,
        "identity": true,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "id",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "code",
        "displayName": "code",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "name",
        "displayName": "name",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "name",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "wh_code",
        "displayName": "wh_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "wh_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "zone_code",
        "displayName": "zone_code",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "zone_code",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "zone_type",
        "displayName": "zone_type",
        "dataType": "TEXT",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "zone_type",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "status",
        "displayName": "status",
        "dataType": "TEXT",
        "required": true,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "status",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "created_at",
        "displayName": "created_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "created_at",
          "connection": "src_enterprise_biz"
        }
      },
      {
        "apiName": "updated_at",
        "displayName": "updated_at",
        "dataType": "TIMESTAMP",
        "required": false,
        "primaryKey": false,
        "identity": false,
        "description": "",
        "sourceMapping": {
          "type": "column",
          "column": "updated_at",
          "connection": "src_enterprise_biz"
        }
      }
    ]
  }
];

export const EXT_LINK_TYPES: LinkType[] = [
  {
    "apiName": "AmAsset_Dept",
    "displayName": "资产管理-资产→Department",
    "description": "AmAsset 关联 Department",
    "sourceType": "AmAsset",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetCalibration_Dept",
    "displayName": "资产管理-资产校准→Department",
    "description": "AmAssetCalibration 关联 Department",
    "sourceType": "AmAssetCalibration",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetCategory_Dept",
    "displayName": "资产管理-资产类别→Department",
    "description": "AmAssetCategory 关联 Department",
    "sourceType": "AmAssetCategory",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetCheck_Dept",
    "displayName": "资产管理-资产盘点→Department",
    "description": "AmAssetCheck 关联 Department",
    "sourceType": "AmAssetCheck",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetDepreciation_Dept",
    "displayName": "资产管理-资产折旧→Department",
    "description": "AmAssetDepreciation 关联 Department",
    "sourceType": "AmAssetDepreciation",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetDisposal_Dept",
    "displayName": "资产管理-资产处置→Department",
    "description": "AmAssetDisposal 关联 Department",
    "sourceType": "AmAssetDisposal",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetDoc_Dept",
    "displayName": "资产管理-资产文档→Department",
    "description": "AmAssetDoc 关联 Department",
    "sourceType": "AmAssetDoc",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetImage_Dept",
    "displayName": "资产管理-资产图片→Department",
    "description": "AmAssetImage 关联 Department",
    "sourceType": "AmAssetImage",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetInsurance_Dept",
    "displayName": "资产管理-资产保险→Department",
    "description": "AmAssetInsurance 关联 Department",
    "sourceType": "AmAssetInsurance",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetLease_Dept",
    "displayName": "资产管理-资产租赁→Department",
    "description": "AmAssetLease 关联 Department",
    "sourceType": "AmAssetLease",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetLicense_Dept",
    "displayName": "资产管理-资产许可→Department",
    "description": "AmAssetLicense 关联 Department",
    "sourceType": "AmAssetLicense",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetLifecycle_Dept",
    "displayName": "资产管理-资产生命周期→Department",
    "description": "AmAssetLifecycle 关联 Department",
    "sourceType": "AmAssetLifecycle",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetLoan_Dept",
    "displayName": "资产管理-资产借用→Department",
    "description": "AmAssetLoan 关联 Department",
    "sourceType": "AmAssetLoan",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetLocation_Dept",
    "displayName": "资产管理-资产位置→Department",
    "description": "AmAssetLocation 关联 Department",
    "sourceType": "AmAssetLocation",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetMaintenance_Dept",
    "displayName": "资产管理-资产保养→Department",
    "description": "AmAssetMaintenance 关联 Department",
    "sourceType": "AmAssetMaintenance",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetRepair_Dept",
    "displayName": "资产管理-资产维修→Department",
    "description": "AmAssetRepair 关联 Department",
    "sourceType": "AmAssetRepair",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetSupplier_Dept",
    "displayName": "资产管理-资产供应商→Department",
    "description": "AmAssetSupplier 关联 Department",
    "sourceType": "AmAssetSupplier",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetTag_Dept",
    "displayName": "资产管理-资产标签→Department",
    "description": "AmAssetTag 关联 Department",
    "sourceType": "AmAssetTag",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetTransfer_Dept",
    "displayName": "资产管理-资产调拨→Department",
    "description": "AmAssetTransfer 关联 Department",
    "sourceType": "AmAssetTransfer",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetUtilization_Dept",
    "displayName": "资产管理-资产利用率→Department",
    "description": "AmAssetUtilization 关联 Department",
    "sourceType": "AmAssetUtilization",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetValuation_Dept",
    "displayName": "资产管理-资产估值→Department",
    "description": "AmAssetValuation 关联 Department",
    "sourceType": "AmAssetValuation",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "AmAssetWarranty_Dept",
    "displayName": "资产管理-资产保修→Department",
    "description": "AmAssetWarranty 关联 Department",
    "sourceType": "AmAssetWarranty",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArArchive_Dept",
    "displayName": "档案管理-档案→Department",
    "description": "ArArchive 关联 Department",
    "sourceType": "ArArchive",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArAuditLog_Dept",
    "displayName": "档案管理-审计日志→Department",
    "description": "ArAuditLog 关联 Department",
    "sourceType": "ArAuditLog",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArClassification_Dept",
    "displayName": "档案管理-密级→Department",
    "description": "ArClassification 关联 Department",
    "sourceType": "ArClassification",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArContractDoc_Dept",
    "displayName": "档案管理-合同文档→Department",
    "description": "ArContractDoc 关联 Department",
    "sourceType": "ArContractDoc",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArDocument_Dept",
    "displayName": "档案管理-文档→Department",
    "description": "ArDocument 关联 Department",
    "sourceType": "ArDocument",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArEmailArchive_Dept",
    "displayName": "档案管理-邮件归档→Department",
    "description": "ArEmailArchive 关联 Department",
    "sourceType": "ArEmailArchive",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArFile_Dept",
    "displayName": "档案管理-文件→Department",
    "description": "ArFile 关联 Department",
    "sourceType": "ArFile",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArFolder_Dept",
    "displayName": "档案管理-文件夹→Department",
    "description": "ArFolder 关联 Department",
    "sourceType": "ArFolder",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArForm_Dept",
    "displayName": "档案管理-表单→Department",
    "description": "ArForm 关联 Department",
    "sourceType": "ArForm",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArImage_Dept",
    "displayName": "档案管理-图片档案→Department",
    "description": "ArImage 关联 Department",
    "sourceType": "ArImage",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArKnowledge_Dept",
    "displayName": "档案管理-知识库→Department",
    "description": "ArKnowledge 关联 Department",
    "sourceType": "ArKnowledge",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArMetadata_Dept",
    "displayName": "档案管理-元数据→Department",
    "description": "ArMetadata 关联 Department",
    "sourceType": "ArMetadata",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArPermission_Dept",
    "displayName": "档案管理-权限→Department",
    "description": "ArPermission 关联 Department",
    "sourceType": "ArPermission",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArPolicy_Dept",
    "displayName": "档案管理-制度→Department",
    "description": "ArPolicy 关联 Department",
    "sourceType": "ArPolicy",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArProcedure_Dept",
    "displayName": "档案管理-流程→Department",
    "description": "ArProcedure 关联 Department",
    "sourceType": "ArProcedure",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArReport_Dept",
    "displayName": "档案管理-报告→Department",
    "description": "ArReport 关联 Department",
    "sourceType": "ArReport",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArRetention_Dept",
    "displayName": "档案管理-保管期限→Department",
    "description": "ArRetention 关联 Department",
    "sourceType": "ArRetention",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArShare_Dept",
    "displayName": "档案管理-共享→Department",
    "description": "ArShare 关联 Department",
    "sourceType": "ArShare",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArTag_Dept",
    "displayName": "档案管理-标签→Department",
    "description": "ArTag 关联 Department",
    "sourceType": "ArTag",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArTemplate_Dept",
    "displayName": "档案管理-模板→Department",
    "description": "ArTemplate 关联 Department",
    "sourceType": "ArTemplate",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArVersion_Dept",
    "displayName": "档案管理-版本→Department",
    "description": "ArVersion 关联 Department",
    "sourceType": "ArVersion",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ArVideo_Dept",
    "displayName": "档案管理-视频档案→Department",
    "description": "ArVideo 关联 Department",
    "sourceType": "ArVideo",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmActivity_Dept",
    "displayName": "CRM-活动→Department",
    "description": "CrmActivity 关联 Department",
    "sourceType": "CrmActivity",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmCampaign_Dept",
    "displayName": "CRM-营销活动→Department",
    "description": "CrmCampaign 关联 Department",
    "sourceType": "CrmCampaign",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmChannel_Dept",
    "displayName": "CRM-渠道→Department",
    "description": "CrmChannel 关联 Department",
    "sourceType": "CrmChannel",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmComplaint_Dept",
    "displayName": "CRM-投诉→Department",
    "description": "CrmComplaint 关联 Department",
    "sourceType": "CrmComplaint",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmContract_Dept",
    "displayName": "CRM-合同→Department",
    "description": "CrmContract 关联 Department",
    "sourceType": "CrmContract",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmContractItem_Dept",
    "displayName": "CRM-合同明细→Department",
    "description": "CrmContractItem 关联 Department",
    "sourceType": "CrmContractItem",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmCustomer_Dept",
    "displayName": "CRM-客户→Department",
    "description": "CrmCustomer 关联 Department",
    "sourceType": "CrmCustomer",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmCustomerContact_Dept",
    "displayName": "CRM-客户联系人→Department",
    "description": "CrmCustomerContact 关联 Department",
    "sourceType": "CrmCustomerContact",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmInteraction_Dept",
    "displayName": "CRM-互动记录→Department",
    "description": "CrmInteraction 关联 Department",
    "sourceType": "CrmInteraction",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmLead_Dept",
    "displayName": "CRM-线索→Department",
    "description": "CrmLead 关联 Department",
    "sourceType": "CrmLead",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmOpportunity_Dept",
    "displayName": "CRM-商机→Department",
    "description": "CrmOpportunity 关联 Department",
    "sourceType": "CrmOpportunity",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmOpportunityStage_Dept",
    "displayName": "CRM-商机阶段→Department",
    "description": "CrmOpportunityStage 关联 Department",
    "sourceType": "CrmOpportunityStage",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmPartner_Dept",
    "displayName": "CRM-合作伙伴→Department",
    "description": "CrmPartner 关联 Department",
    "sourceType": "CrmPartner",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmPriceBook_Dept",
    "displayName": "CRM-价格手册→Department",
    "description": "CrmPriceBook 关联 Department",
    "sourceType": "CrmPriceBook",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmQuote_Dept",
    "displayName": "CRM-报价单→Department",
    "description": "CrmQuote 关联 Department",
    "sourceType": "CrmQuote",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmQuoteItem_Dept",
    "displayName": "CRM-报价明细→Department",
    "description": "CrmQuoteItem 关联 Department",
    "sourceType": "CrmQuoteItem",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmSatisfaction_Dept",
    "displayName": "CRM-满意度→Department",
    "description": "CrmSatisfaction 关联 Department",
    "sourceType": "CrmSatisfaction",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmSegment_Dept",
    "displayName": "CRM-客户分群→Department",
    "description": "CrmSegment 关联 Department",
    "sourceType": "CrmSegment",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmSubscription_Dept",
    "displayName": "CRM-订阅→Department",
    "description": "CrmSubscription 关联 Department",
    "sourceType": "CrmSubscription",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmTag_Dept",
    "displayName": "CRM-客户标签→Department",
    "description": "CrmTag 关联 Department",
    "sourceType": "CrmTag",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmTask_Dept",
    "displayName": "CRM-任务→Department",
    "description": "CrmTask 关联 Department",
    "sourceType": "CrmTask",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "CrmVisit_Dept",
    "displayName": "CRM-拜访→Department",
    "description": "CrmVisit 关联 Department",
    "sourceType": "CrmVisit",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpBom_Dept",
    "displayName": "ERP-物料清单→Department",
    "description": "ErpBom 关联 Department",
    "sourceType": "ErpBom",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpBudget_Dept",
    "displayName": "ERP-预算→Department",
    "description": "ErpBudget 关联 Department",
    "sourceType": "ErpBudget",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpCostCenter_Dept",
    "displayName": "ERP-成本中心→Department",
    "description": "ErpCostCenter 关联 Department",
    "sourceType": "ErpCostCenter",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpGlAccount_Dept",
    "displayName": "ERP-总账科目→Department",
    "description": "ErpGlAccount 关联 Department",
    "sourceType": "ErpGlAccount",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpInventory_Dept",
    "displayName": "ERP-库存→Department",
    "description": "ErpInventory 关联 Department",
    "sourceType": "ErpInventory",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpInventoryTxn_Dept",
    "displayName": "ERP-库存交易→Department",
    "description": "ErpInventoryTxn 关联 Department",
    "sourceType": "ErpInventoryTxn",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpInvoice_Dept",
    "displayName": "ERP-发票→Department",
    "description": "ErpInvoice 关联 Department",
    "sourceType": "ErpInvoice",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpMaterial_Dept",
    "displayName": "ERP-物料→Department",
    "description": "ErpMaterial 关联 Department",
    "sourceType": "ErpMaterial",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpMaterialCategory_Dept",
    "displayName": "ERP-物料类别→Department",
    "description": "ErpMaterialCategory 关联 Department",
    "sourceType": "ErpMaterialCategory",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpPayment_Dept",
    "displayName": "ERP-付款→Department",
    "description": "ErpPayment 关联 Department",
    "sourceType": "ErpPayment",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpProductionPlan_Dept",
    "displayName": "ERP-生产计划→Department",
    "description": "ErpProductionPlan 关联 Department",
    "sourceType": "ErpProductionPlan",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpPurchaseOrder_Dept",
    "displayName": "ERP-采购订单→Department",
    "description": "ErpPurchaseOrder 关联 Department",
    "sourceType": "ErpPurchaseOrder",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpPurchaseOrderItem_Dept",
    "displayName": "ERP-采购订单行→Department",
    "description": "ErpPurchaseOrderItem 关联 Department",
    "sourceType": "ErpPurchaseOrderItem",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpQualityInspect_Dept",
    "displayName": "ERP-质检→Department",
    "description": "ErpQualityInspect 关联 Department",
    "sourceType": "ErpQualityInspect",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpReceipt_Dept",
    "displayName": "ERP-收款→Department",
    "description": "ErpReceipt 关联 Department",
    "sourceType": "ErpReceipt",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpSalesOrder_Dept",
    "displayName": "ERP-销售订单→Department",
    "description": "ErpSalesOrder 关联 Department",
    "sourceType": "ErpSalesOrder",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpSalesOrderItem_Dept",
    "displayName": "ERP-销售订单行→Department",
    "description": "ErpSalesOrderItem 关联 Department",
    "sourceType": "ErpSalesOrderItem",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpSupplier_Dept",
    "displayName": "ERP-供应商→Department",
    "description": "ErpSupplier 关联 Department",
    "sourceType": "ErpSupplier",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpSupplierEval_Dept",
    "displayName": "ERP-供应商评估→Department",
    "description": "ErpSupplierEval 关联 Department",
    "sourceType": "ErpSupplierEval",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpVoucher_Dept",
    "displayName": "ERP-凭证→Department",
    "description": "ErpVoucher 关联 Department",
    "sourceType": "ErpVoucher",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpWarehouse_Dept",
    "displayName": "ERP-仓库→Department",
    "description": "ErpWarehouse 关联 Department",
    "sourceType": "ErpWarehouse",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "ErpWorkOrder_Dept",
    "displayName": "ERP-工单→Department",
    "description": "ErpWorkOrder 关联 Department",
    "sourceType": "ErpWorkOrder",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinAccount_Dept",
    "displayName": "财务-会计科目→Department",
    "description": "FinAccount 关联 Department",
    "sourceType": "FinAccount",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinAssetLedger_Dept",
    "displayName": "财务-资产台账→Department",
    "description": "FinAssetLedger 关联 Department",
    "sourceType": "FinAssetLedger",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinBank_Dept",
    "displayName": "财务-银行→Department",
    "description": "FinBank 关联 Department",
    "sourceType": "FinBank",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinBudget_Dept",
    "displayName": "财务-预算→Department",
    "description": "FinBudget 关联 Department",
    "sourceType": "FinBudget",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinCashFlow_Dept",
    "displayName": "财务-现金流→Department",
    "description": "FinCashFlow 关联 Department",
    "sourceType": "FinCashFlow",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinCost_Dept",
    "displayName": "财务-成本→Department",
    "description": "FinCost 关联 Department",
    "sourceType": "FinCost",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinDividend_Dept",
    "displayName": "财务-分红→Department",
    "description": "FinDividend 关联 Department",
    "sourceType": "FinDividend",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinExpense_Dept",
    "displayName": "财务-费用→Department",
    "description": "FinExpense 关联 Department",
    "sourceType": "FinExpense",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinInvestment_Dept",
    "displayName": "财务-投资→Department",
    "description": "FinInvestment 关联 Department",
    "sourceType": "FinInvestment",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinInvoice_Dept",
    "displayName": "财务-发票→Department",
    "description": "FinInvoice 关联 Department",
    "sourceType": "FinInvoice",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinJournal_Dept",
    "displayName": "财务-日记账→Department",
    "description": "FinJournal 关联 Department",
    "sourceType": "FinJournal",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinLedger_Dept",
    "displayName": "财务-分类账→Department",
    "description": "FinLedger 关联 Department",
    "sourceType": "FinLedger",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinLoan_Dept",
    "displayName": "财务-借款→Department",
    "description": "FinLoan 关联 Department",
    "sourceType": "FinLoan",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinPayable_Dept",
    "displayName": "财务-应付→Department",
    "description": "FinPayable 关联 Department",
    "sourceType": "FinPayable",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinPayment_Dept",
    "displayName": "财务-付款→Department",
    "description": "FinPayment 关联 Department",
    "sourceType": "FinPayment",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinReceipt_Dept",
    "displayName": "财务-收款→Department",
    "description": "FinReceipt 关联 Department",
    "sourceType": "FinReceipt",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinReceivable_Dept",
    "displayName": "财务-应收→Department",
    "description": "FinReceivable 关联 Department",
    "sourceType": "FinReceivable",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinReport_Dept",
    "displayName": "财务-报表→Department",
    "description": "FinReport 关联 Department",
    "sourceType": "FinReport",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinRevenue_Dept",
    "displayName": "财务-收入→Department",
    "description": "FinRevenue 关联 Department",
    "sourceType": "FinRevenue",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinSalary_Dept",
    "displayName": "财务-工资→Department",
    "description": "FinSalary 关联 Department",
    "sourceType": "FinSalary",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinTax_Dept",
    "displayName": "财务-税务→Department",
    "description": "FinTax 关联 Department",
    "sourceType": "FinTax",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "FinVoucher_Dept",
    "displayName": "财务-凭证→Department",
    "description": "FinVoucher 关联 Department",
    "sourceType": "FinVoucher",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrAttendance_Dept",
    "displayName": "人事-考勤→Department",
    "description": "HrAttendance 关联 Department",
    "sourceType": "HrAttendance",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrBonus_Dept",
    "displayName": "人事-奖金→Department",
    "description": "HrBonus 关联 Department",
    "sourceType": "HrBonus",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrBusinessTrip_Dept",
    "displayName": "人事-出差→Department",
    "description": "HrBusinessTrip 关联 Department",
    "sourceType": "HrBusinessTrip",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrCertification_Dept",
    "displayName": "人事-证书→Department",
    "description": "HrCertification 关联 Department",
    "sourceType": "HrCertification",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrEmployeeContract_Dept",
    "displayName": "人事-员工合同→Department",
    "description": "HrEmployeeContract 关联 Department",
    "sourceType": "HrEmployeeContract",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrEmployeeDocument_Dept",
    "displayName": "人事-员工档案→Department",
    "description": "HrEmployeeDocument 关联 Department",
    "sourceType": "HrEmployeeDocument",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrEmployeeSkill_Dept",
    "displayName": "人事-员工技能→Department",
    "description": "HrEmployeeSkill 关联 Department",
    "sourceType": "HrEmployeeSkill",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrExit_Dept",
    "displayName": "人事-离职→Department",
    "description": "HrExit 关联 Department",
    "sourceType": "HrExit",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrHealth_Dept",
    "displayName": "人事-员工健康→Department",
    "description": "HrHealth 关联 Department",
    "sourceType": "HrHealth",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrLeaveBalance_Dept",
    "displayName": "人事-年假余额→Department",
    "description": "HrLeaveBalance 关联 Department",
    "sourceType": "HrLeaveBalance",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrOrgChart_Dept",
    "displayName": "人事-组织架构→Department",
    "description": "HrOrgChart 关联 Department",
    "sourceType": "HrOrgChart",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrOvertime_Dept",
    "displayName": "人事-加班→Department",
    "description": "HrOvertime 关联 Department",
    "sourceType": "HrOvertime",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrPayroll_Dept",
    "displayName": "人事-工资单→Department",
    "description": "HrPayroll 关联 Department",
    "sourceType": "HrPayroll",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrPension_Dept",
    "displayName": "人事-社保公积金→Department",
    "description": "HrPension 关联 Department",
    "sourceType": "HrPension",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrPerformance_Dept",
    "displayName": "人事-绩效→Department",
    "description": "HrPerformance 关联 Department",
    "sourceType": "HrPerformance",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrPosition_Dept",
    "displayName": "人事-岗位→Department",
    "description": "HrPosition 关联 Department",
    "sourceType": "HrPosition",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrProbation_Dept",
    "displayName": "人事-试用期→Department",
    "description": "HrProbation 关联 Department",
    "sourceType": "HrProbation",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrRecruitment_Dept",
    "displayName": "人事-招聘→Department",
    "description": "HrRecruitment 关联 Department",
    "sourceType": "HrRecruitment",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrSalary_Dept",
    "displayName": "人事-薪资→Department",
    "description": "HrSalary 关联 Department",
    "sourceType": "HrSalary",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrSocialSecurity_Dept",
    "displayName": "人事-社保→Department",
    "description": "HrSocialSecurity 关联 Department",
    "sourceType": "HrSocialSecurity",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrTraining_Dept",
    "displayName": "人事-培训→Department",
    "description": "HrTraining 关联 Department",
    "sourceType": "HrTraining",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "HrTransfer_Dept",
    "displayName": "人事-调岗→Department",
    "description": "HrTransfer 关联 Department",
    "sourceType": "HrTransfer",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdAttribute_Product",
    "displayName": "产品管理-产品属性→Product",
    "description": "PdAttribute 关联 Product",
    "sourceType": "PdAttribute",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdAttributeValue_Product",
    "displayName": "产品管理-属性值→Product",
    "description": "PdAttributeValue 关联 Product",
    "sourceType": "PdAttributeValue",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdBug_Product",
    "displayName": "产品管理-缺陷→Product",
    "description": "PdBug 关联 Product",
    "sourceType": "PdBug",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdBundle_Product",
    "displayName": "产品管理-产品组合→Product",
    "description": "PdBundle 关联 Product",
    "sourceType": "PdBundle",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdCatalog_Product",
    "displayName": "产品管理-产品目录→Product",
    "description": "PdCatalog 关联 Product",
    "sourceType": "PdCatalog",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdCategory_Product",
    "displayName": "产品管理-产品类别→Product",
    "description": "PdCategory 关联 Product",
    "sourceType": "PdCategory",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdChannelProduct_Product",
    "displayName": "产品管理-渠道产品→Product",
    "description": "PdChannelProduct 关联 Product",
    "sourceType": "PdChannelProduct",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdCompetitor_Product",
    "displayName": "产品管理-竞品→Product",
    "description": "PdCompetitor 关联 Product",
    "sourceType": "PdCompetitor",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdFeedback_Product",
    "displayName": "产品管理-用户反馈→Product",
    "description": "PdFeedback 关联 Product",
    "sourceType": "PdFeedback",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdLaunch_Product",
    "displayName": "产品管理-产品上市→Product",
    "description": "PdLaunch 关联 Product",
    "sourceType": "PdLaunch",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdLifecycle_Product",
    "displayName": "产品管理-产品生命周期→Product",
    "description": "PdLifecycle 关联 Product",
    "sourceType": "PdLifecycle",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdMarketAnalysis_Product",
    "displayName": "产品管理-市场分析→Product",
    "description": "PdMarketAnalysis 关联 Product",
    "sourceType": "PdMarketAnalysis",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdPricing_Product",
    "displayName": "产品管理-定价→Product",
    "description": "PdPricing 关联 Product",
    "sourceType": "PdPricing",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdProductFeature_Product",
    "displayName": "产品管理-产品特性→Product",
    "description": "PdProductFeature 关联 Product",
    "sourceType": "PdProductFeature",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdProductRoadmap_Product",
    "displayName": "产品管理-产品路线图→Product",
    "description": "PdProductRoadmap 关联 Product",
    "sourceType": "PdProductRoadmap",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdProductSpec_Product",
    "displayName": "产品管理-产品规格→Product",
    "description": "PdProductSpec 关联 Product",
    "sourceType": "PdProductSpec",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdProductVersion_Product",
    "displayName": "产品管理-产品版本→Product",
    "description": "PdProductVersion 关联 Product",
    "sourceType": "PdProductVersion",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdRelease_Product",
    "displayName": "产品管理-发布→Product",
    "description": "PdRelease 关联 Product",
    "sourceType": "PdRelease",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdReleaseNote_Product",
    "displayName": "产品管理-发布说明→Product",
    "description": "PdReleaseNote 关联 Product",
    "sourceType": "PdReleaseNote",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdRequirement_Product",
    "displayName": "产品管理-需求→Product",
    "description": "PdRequirement 关联 Product",
    "sourceType": "PdRequirement",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdReview_Product",
    "displayName": "产品管理-产品评审→Product",
    "description": "PdReview 关联 Product",
    "sourceType": "PdReview",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PdUserStory_Product",
    "displayName": "产品管理-用户故事→Product",
    "description": "PdUserStory 关联 Product",
    "sourceType": "PdUserStory",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmBacklog_Dept",
    "displayName": "项目管理-需求池→Department",
    "description": "PmBacklog 关联 Department",
    "sourceType": "PmBacklog",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmBudget_Dept",
    "displayName": "项目管理-项目预算→Department",
    "description": "PmBudget 关联 Department",
    "sourceType": "PmBudget",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmChangeRequest_Dept",
    "displayName": "项目管理-变更请求→Department",
    "description": "PmChangeRequest 关联 Department",
    "sourceType": "PmChangeRequest",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmComment_Dept",
    "displayName": "项目管理-评论→Department",
    "description": "PmComment 关联 Department",
    "sourceType": "PmComment",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmDeliverable_Dept",
    "displayName": "项目管理-交付物→Department",
    "description": "PmDeliverable 关联 Department",
    "sourceType": "PmDeliverable",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmDocument_Dept",
    "displayName": "项目管理-项目文档→Department",
    "description": "PmDocument 关联 Department",
    "sourceType": "PmDocument",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmEpic_Dept",
    "displayName": "项目管理-史诗→Department",
    "description": "PmEpic 关联 Department",
    "sourceType": "PmEpic",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmExpense_Dept",
    "displayName": "项目管理-项目费用→Department",
    "description": "PmExpense 关联 Department",
    "sourceType": "PmExpense",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmIssue_Dept",
    "displayName": "项目管理-问题→Department",
    "description": "PmIssue 关联 Department",
    "sourceType": "PmIssue",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmLessons_Dept",
    "displayName": "项目管理-经验教训→Department",
    "description": "PmLessons 关联 Department",
    "sourceType": "PmLessons",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmMeeting_Dept",
    "displayName": "项目管理-会议→Department",
    "description": "PmMeeting 关联 Department",
    "sourceType": "PmMeeting",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmMilestone_Dept",
    "displayName": "项目管理-里程碑→Department",
    "description": "PmMilestone 关联 Department",
    "sourceType": "PmMilestone",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmPortfolio_Dept",
    "displayName": "项目管理-项目组合→Department",
    "description": "PmPortfolio 关联 Department",
    "sourceType": "PmPortfolio",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmProjectTask_Dept",
    "displayName": "项目管理-项目任务→Department",
    "description": "PmProjectTask 关联 Department",
    "sourceType": "PmProjectTask",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmQualityGate_Dept",
    "displayName": "项目管理-质量门→Department",
    "description": "PmQualityGate 关联 Department",
    "sourceType": "PmQualityGate",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmResource_Dept",
    "displayName": "项目管理-资源→Department",
    "description": "PmResource 关联 Department",
    "sourceType": "PmResource",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmResourceAllocation_Dept",
    "displayName": "项目管理-资源分配→Department",
    "description": "PmResourceAllocation 关联 Department",
    "sourceType": "PmResourceAllocation",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmRisk_Dept",
    "displayName": "项目管理-风险→Department",
    "description": "PmRisk 关联 Department",
    "sourceType": "PmRisk",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmSprint_Dept",
    "displayName": "项目管理-迭代→Department",
    "description": "PmSprint 关联 Department",
    "sourceType": "PmSprint",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmStakeholder_Dept",
    "displayName": "项目管理-干系人→Department",
    "description": "PmStakeholder 关联 Department",
    "sourceType": "PmStakeholder",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmTaskDependency_Dept",
    "displayName": "项目管理-任务依赖→Department",
    "description": "PmTaskDependency 关联 Department",
    "sourceType": "PmTaskDependency",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "PmTimesheet_Dept",
    "displayName": "项目管理-工时表→Department",
    "description": "PmTimesheet 关联 Department",
    "sourceType": "PmTimesheet",
    "targetType": "Department",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "dept_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecAccessLog_OwnerEmp",
    "displayName": "网络安全-访问日志→Employee",
    "description": "SecAccessLog 关联 Employee",
    "sourceType": "SecAccessLog",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecAlert_OwnerEmp",
    "displayName": "网络安全-安全告警→Employee",
    "description": "SecAlert 关联 Employee",
    "sourceType": "SecAlert",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecAsset_OwnerEmp",
    "displayName": "网络安全-安全资产→Employee",
    "description": "SecAsset 关联 Employee",
    "sourceType": "SecAsset",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecAudit_OwnerEmp",
    "displayName": "网络安全-安全审计→Employee",
    "description": "SecAudit 关联 Employee",
    "sourceType": "SecAudit",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecAuthEvent_OwnerEmp",
    "displayName": "网络安全-认证事件→Employee",
    "description": "SecAuthEvent 关联 Employee",
    "sourceType": "SecAuthEvent",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecBackup_OwnerEmp",
    "displayName": "网络安全-备份→Employee",
    "description": "SecBackup 关联 Employee",
    "sourceType": "SecBackup",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecCertificate_OwnerEmp",
    "displayName": "网络安全-证书→Employee",
    "description": "SecCertificate 关联 Employee",
    "sourceType": "SecCertificate",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecCompliance_OwnerEmp",
    "displayName": "网络安全-合规→Employee",
    "description": "SecCompliance 关联 Employee",
    "sourceType": "SecCompliance",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecControl_OwnerEmp",
    "displayName": "网络安全-安全控制→Employee",
    "description": "SecControl 关联 Employee",
    "sourceType": "SecControl",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecEndpoint_OwnerEmp",
    "displayName": "网络安全-终端→Employee",
    "description": "SecEndpoint 关联 Employee",
    "sourceType": "SecEndpoint",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecFirewallRule_OwnerEmp",
    "displayName": "网络安全-防火墙规则→Employee",
    "description": "SecFirewallRule 关联 Employee",
    "sourceType": "SecFirewallRule",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecIncident_OwnerEmp",
    "displayName": "网络安全-安全事件→Employee",
    "description": "SecIncident 关联 Employee",
    "sourceType": "SecIncident",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecIntrusion_OwnerEmp",
    "displayName": "网络安全-入侵检测→Employee",
    "description": "SecIntrusion 关联 Employee",
    "sourceType": "SecIntrusion",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecMalware_OwnerEmp",
    "displayName": "网络安全-恶意代码→Employee",
    "description": "SecMalware 关联 Employee",
    "sourceType": "SecMalware",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecNetworkDevice_OwnerEmp",
    "displayName": "网络安全-网络设备→Employee",
    "description": "SecNetworkDevice 关联 Employee",
    "sourceType": "SecNetworkDevice",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecPatch_OwnerEmp",
    "displayName": "网络安全-补丁→Employee",
    "description": "SecPatch 关联 Employee",
    "sourceType": "SecPatch",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecPhishing_OwnerEmp",
    "displayName": "网络安全-钓鱼→Employee",
    "description": "SecPhishing 关联 Employee",
    "sourceType": "SecPhishing",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecPolicy_OwnerEmp",
    "displayName": "网络安全-安全策略→Employee",
    "description": "SecPolicy 关联 Employee",
    "sourceType": "SecPolicy",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecScan_OwnerEmp",
    "displayName": "网络安全-扫描→Employee",
    "description": "SecScan 关联 Employee",
    "sourceType": "SecScan",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecThreatIntel_OwnerEmp",
    "displayName": "网络安全-威胁情报→Employee",
    "description": "SecThreatIntel 关联 Employee",
    "sourceType": "SecThreatIntel",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecUserAccount_OwnerEmp",
    "displayName": "网络安全-账号→Employee",
    "description": "SecUserAccount 关联 Employee",
    "sourceType": "SecUserAccount",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "SecVulnerability_OwnerEmp",
    "displayName": "网络安全-漏洞→Employee",
    "description": "SecVulnerability 关联 Employee",
    "sourceType": "SecVulnerability",
    "targetType": "Employee",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "owner_emp_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsCrossDock_Product",
    "displayName": "WMS-越库→Product",
    "description": "WmsCrossDock 关联 Product",
    "sourceType": "WmsCrossDock",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsCycleCount_Product",
    "displayName": "WMS-循环盘点→Product",
    "description": "WmsCycleCount 关联 Product",
    "sourceType": "WmsCycleCount",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsInbound_Product",
    "displayName": "WMS-入库单→Product",
    "description": "WmsInbound 关联 Product",
    "sourceType": "WmsInbound",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsInboundLine_Product",
    "displayName": "WMS-入库明细→Product",
    "description": "WmsInboundLine 关联 Product",
    "sourceType": "WmsInboundLine",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsInventoryAdj_Product",
    "displayName": "WMS-库存调整→Product",
    "description": "WmsInventoryAdj 关联 Product",
    "sourceType": "WmsInventoryAdj",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsLocation_Product",
    "displayName": "WMS-库位→Product",
    "description": "WmsLocation 关联 Product",
    "sourceType": "WmsLocation",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsLot_Product",
    "displayName": "WMS-批次→Product",
    "description": "WmsLot 关联 Product",
    "sourceType": "WmsLot",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsOutbound_Product",
    "displayName": "WMS-出库单→Product",
    "description": "WmsOutbound 关联 Product",
    "sourceType": "WmsOutbound",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsOutboundLine_Product",
    "displayName": "WMS-出库明细→Product",
    "description": "WmsOutboundLine 关联 Product",
    "sourceType": "WmsOutboundLine",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsPacking_Product",
    "displayName": "WMS-打包→Product",
    "description": "WmsPacking 关联 Product",
    "sourceType": "WmsPacking",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsPickingTask_Product",
    "displayName": "WMS-拣货任务→Product",
    "description": "WmsPickingTask 关联 Product",
    "sourceType": "WmsPickingTask",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsPutaway_Product",
    "displayName": "WMS-上架→Product",
    "description": "WmsPutaway 关联 Product",
    "sourceType": "WmsPutaway",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsReceiving_Product",
    "displayName": "WMS-收货→Product",
    "description": "WmsReceiving 关联 Product",
    "sourceType": "WmsReceiving",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsReservation_Product",
    "displayName": "WMS-预留→Product",
    "description": "WmsReservation 关联 Product",
    "sourceType": "WmsReservation",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsReturn_Product",
    "displayName": "WMS-退货→Product",
    "description": "WmsReturn 关联 Product",
    "sourceType": "WmsReturn",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsSerial_Product",
    "displayName": "WMS-序列号→Product",
    "description": "WmsSerial 关联 Product",
    "sourceType": "WmsSerial",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsShipping_Product",
    "displayName": "WMS-发货→Product",
    "description": "WmsShipping 关联 Product",
    "sourceType": "WmsShipping",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsSku_Product",
    "displayName": "WMS-库存单位→Product",
    "description": "WmsSku 关联 Product",
    "sourceType": "WmsSku",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsStock_Product",
    "displayName": "WMS-库存→Product",
    "description": "WmsStock 关联 Product",
    "sourceType": "WmsStock",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsStockMove_Product",
    "displayName": "WMS-库存移动→Product",
    "description": "WmsStockMove 关联 Product",
    "sourceType": "WmsStockMove",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsWarehouse_Product",
    "displayName": "WMS-仓库→Product",
    "description": "WmsWarehouse 关联 Product",
    "sourceType": "WmsWarehouse",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  },
  {
    "apiName": "WmsZone_Product",
    "displayName": "WMS-库区→Product",
    "description": "WmsZone 关联 Product",
    "sourceType": "WmsZone",
    "targetType": "Product",
    "sourceCardinality": "many",
    "targetCardinality": "one",
    "cardinality": "many-to-many",
    "primaryKey": "product_id",
    "foreignKey": "id",
    "instanceSource": "source",
    "version": 1,
    "properties": []
  }
];
