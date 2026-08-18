// 自动生成（sql/generate-ot.mjs）—— 扩展域对象类型字段映射。
// 形状与 mappings.ts 中 objectTypeMappings 一致（CreateObjectTypeWithMappingInput）。
import type { CreateObjectTypeWithMappingInput } from '@ontology/data-integration';

export const EXT_OBJECT_TYPE_MAPPINGS: CreateObjectTypeWithMappingInput[] = [
  {
    "objectType": "AmAsset",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "asset_name",
        "sourceColumn": "asset_name"
      },
      {
        "property": "category",
        "sourceColumn": "category"
      },
      {
        "property": "value",
        "sourceColumn": "value"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetCalibration",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_calibration",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "cal_date",
        "sourceColumn": "cal_date"
      },
      {
        "property": "result",
        "sourceColumn": "result"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetCategory",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_category",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cat_code",
        "sourceColumn": "cat_code"
      },
      {
        "property": "parent",
        "sourceColumn": "parent"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetCheck",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_check",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "check_date",
        "sourceColumn": "check_date"
      },
      {
        "property": "result",
        "sourceColumn": "result"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetDepreciation",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_depreciation",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "period",
        "sourceColumn": "period"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetDisposal",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_disposal",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "method",
        "sourceColumn": "method"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetDoc",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_doc",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "doc_type",
        "sourceColumn": "doc_type"
      },
      {
        "property": "path",
        "sourceColumn": "path"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetImage",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_image",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "url",
        "sourceColumn": "url"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetInsurance",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_insurance",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "insurer",
        "sourceColumn": "insurer"
      },
      {
        "property": "premium",
        "sourceColumn": "premium"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetLease",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_lease",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "lessor",
        "sourceColumn": "lessor"
      },
      {
        "property": "rent",
        "sourceColumn": "rent"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetLicense",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_license",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "license_no",
        "sourceColumn": "license_no"
      },
      {
        "property": "expire",
        "sourceColumn": "expire"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetLifecycle",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_lifecycle",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "stage",
        "sourceColumn": "stage"
      },
      {
        "property": "ts",
        "sourceColumn": "ts"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetLoan",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_loan",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "borrower",
        "sourceColumn": "borrower"
      },
      {
        "property": "return_date",
        "sourceColumn": "return_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetLocation",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_location",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "building",
        "sourceColumn": "building"
      },
      {
        "property": "floor",
        "sourceColumn": "floor"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetMaintenance",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_maintenance",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "m_date",
        "sourceColumn": "m_date"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetRepair",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_repair",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "fault",
        "sourceColumn": "fault"
      },
      {
        "property": "cost",
        "sourceColumn": "cost"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetSupplier",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_supplier",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "supplier",
        "sourceColumn": "supplier"
      },
      {
        "property": "contact",
        "sourceColumn": "contact"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetTag",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_tag",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "tag",
        "sourceColumn": "tag"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetTransfer",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_transfer",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "from_loc",
        "sourceColumn": "from_loc"
      },
      {
        "property": "to_loc",
        "sourceColumn": "to_loc"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetUtilization",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_utilization",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "month",
        "sourceColumn": "month"
      },
      {
        "property": "rate",
        "sourceColumn": "rate"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetValuation",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_valuation",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "val_date",
        "sourceColumn": "val_date"
      },
      {
        "property": "value",
        "sourceColumn": "value"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "AmAssetWarranty",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "am_asset_warranty",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "start_date",
        "sourceColumn": "start_date"
      },
      {
        "property": "months",
        "sourceColumn": "months"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArArchive",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_archive",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "arc_code",
        "sourceColumn": "arc_code"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "year",
        "sourceColumn": "year"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArAuditLog",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_audit_log",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "actor",
        "sourceColumn": "actor"
      },
      {
        "property": "action",
        "sourceColumn": "action"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArClassification",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_classification",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "level",
        "sourceColumn": "level"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArContractDoc",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_contract_doc",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "party",
        "sourceColumn": "party"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArDocument",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_document",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArEmailArchive",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_email_archive",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "mail_code",
        "sourceColumn": "mail_code"
      },
      {
        "property": "subject",
        "sourceColumn": "subject"
      },
      {
        "property": "date",
        "sourceColumn": "date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArFile",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_file",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "file_code",
        "sourceColumn": "file_code"
      },
      {
        "property": "folder_code",
        "sourceColumn": "folder_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArFolder",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_folder",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "folder_code",
        "sourceColumn": "folder_code"
      },
      {
        "property": "parent",
        "sourceColumn": "parent"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArForm",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_form",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "form_code",
        "sourceColumn": "form_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArImage",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_image",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "img_code",
        "sourceColumn": "img_code"
      },
      {
        "property": "url",
        "sourceColumn": "url"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArKnowledge",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_knowledge",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "kb_code",
        "sourceColumn": "kb_code"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArMetadata",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_metadata",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "key",
        "sourceColumn": "key"
      },
      {
        "property": "value",
        "sourceColumn": "value"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArPermission",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_permission",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "role",
        "sourceColumn": "role"
      },
      {
        "property": "level",
        "sourceColumn": "level"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArPolicy",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_policy",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "policy_code",
        "sourceColumn": "policy_code"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArProcedure",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_procedure",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "proc_code",
        "sourceColumn": "proc_code"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArReport",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_report",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "report_code",
        "sourceColumn": "report_code"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "period",
        "sourceColumn": "period"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArRetention",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_retention",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "years",
        "sourceColumn": "years"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArShare",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_share",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "to_user",
        "sourceColumn": "to_user"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArTag",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_tag",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "tag",
        "sourceColumn": "tag"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArTemplate",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_template",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "tpl_code",
        "sourceColumn": "tpl_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArVersion",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_version",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_code",
        "sourceColumn": "doc_code"
      },
      {
        "property": "ver",
        "sourceColumn": "ver"
      },
      {
        "property": "author",
        "sourceColumn": "author"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ArVideo",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "ar_video",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "vid_code",
        "sourceColumn": "vid_code"
      },
      {
        "property": "url",
        "sourceColumn": "url"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmActivity",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_activity",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "act_type",
        "sourceColumn": "act_type"
      },
      {
        "property": "act_date",
        "sourceColumn": "act_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmCampaign",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_campaign",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "camp_name",
        "sourceColumn": "camp_name"
      },
      {
        "property": "channel",
        "sourceColumn": "channel"
      },
      {
        "property": "cost",
        "sourceColumn": "cost"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmChannel",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_channel",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "channel_name",
        "sourceColumn": "channel_name"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmComplaint",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_complaint",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "complaint_no",
        "sourceColumn": "complaint_no"
      },
      {
        "property": "level",
        "sourceColumn": "level"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmContract",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_contract",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "contract_no",
        "sourceColumn": "contract_no"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmContractItem",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_contract_item",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "contract_no",
        "sourceColumn": "contract_no"
      },
      {
        "property": "item",
        "sourceColumn": "item"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmCustomer",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_customer",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "industry",
        "sourceColumn": "industry"
      },
      {
        "property": "level",
        "sourceColumn": "level"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmCustomerContact",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_customer_contact",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "contact_name",
        "sourceColumn": "contact_name"
      },
      {
        "property": "phone",
        "sourceColumn": "phone"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmInteraction",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_interaction",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "channel",
        "sourceColumn": "channel"
      },
      {
        "property": "content",
        "sourceColumn": "content"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmLead",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_lead",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "source",
        "sourceColumn": "source"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmOpportunity",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_opportunity",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "opp_no",
        "sourceColumn": "opp_no"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmOpportunityStage",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_opportunity_stage",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "opp_no",
        "sourceColumn": "opp_no"
      },
      {
        "property": "stage",
        "sourceColumn": "stage"
      },
      {
        "property": "probability",
        "sourceColumn": "probability"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmPartner",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_partner",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "partner_code",
        "sourceColumn": "partner_code"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmPriceBook",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_price_book",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "list_price",
        "sourceColumn": "list_price"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmQuote",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_quote",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "quote_no",
        "sourceColumn": "quote_no"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmQuoteItem",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_quote_item",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "quote_no",
        "sourceColumn": "quote_no"
      },
      {
        "property": "item",
        "sourceColumn": "item"
      },
      {
        "property": "price",
        "sourceColumn": "price"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmSatisfaction",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_satisfaction",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "score",
        "sourceColumn": "score"
      },
      {
        "property": "nps",
        "sourceColumn": "nps"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmSegment",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_segment",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "seg_name",
        "sourceColumn": "seg_name"
      },
      {
        "property": "criteria",
        "sourceColumn": "criteria"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmSubscription",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_subscription",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "plan",
        "sourceColumn": "plan"
      },
      {
        "property": "renew_date",
        "sourceColumn": "renew_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmTag",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_tag",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "tag",
        "sourceColumn": "tag"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmTask",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_task",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "owner",
        "sourceColumn": "owner"
      },
      {
        "property": "due_date",
        "sourceColumn": "due_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "CrmVisit",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "crm_visit",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "customer_code",
        "sourceColumn": "customer_code"
      },
      {
        "property": "visit_date",
        "sourceColumn": "visit_date"
      },
      {
        "property": "summary",
        "sourceColumn": "summary"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpBom",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_bom",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "product_code",
        "sourceColumn": "product_code"
      },
      {
        "property": "material_code",
        "sourceColumn": "material_code"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpBudget",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_budget",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "year",
        "sourceColumn": "year"
      },
      {
        "property": "cc_code",
        "sourceColumn": "cc_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpCostCenter",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_cost_center",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cc_code",
        "sourceColumn": "cc_code"
      },
      {
        "property": "budget",
        "sourceColumn": "budget"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpGlAccount",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_gl_account",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "acc_code",
        "sourceColumn": "acc_code"
      },
      {
        "property": "acc_name",
        "sourceColumn": "acc_name"
      },
      {
        "property": "direction",
        "sourceColumn": "direction"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpInventory",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_inventory",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "warehouse",
        "sourceColumn": "warehouse"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpInventoryTxn",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_inventory_txn",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "txn_type",
        "sourceColumn": "txn_type"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpInvoice",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_invoice",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "inv_no",
        "sourceColumn": "inv_no"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "tax_rate",
        "sourceColumn": "tax_rate"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpMaterial",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_material",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "material_code",
        "sourceColumn": "material_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "unit",
        "sourceColumn": "unit"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpMaterialCategory",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_material_category",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cat_code",
        "sourceColumn": "cat_code"
      },
      {
        "property": "parent",
        "sourceColumn": "parent"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpPayment",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_payment",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "pay_no",
        "sourceColumn": "pay_no"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "method",
        "sourceColumn": "method"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpProductionPlan",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_production_plan",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "plan_no",
        "sourceColumn": "plan_no"
      },
      {
        "property": "product_code",
        "sourceColumn": "product_code"
      },
      {
        "property": "plan_qty",
        "sourceColumn": "plan_qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpPurchaseOrder",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_purchase_order",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "po_no",
        "sourceColumn": "po_no"
      },
      {
        "property": "supplier_id",
        "sourceColumn": "supplier_id"
      },
      {
        "property": "order_date",
        "sourceColumn": "order_date"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpPurchaseOrderItem",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_purchase_order_item",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "po_no",
        "sourceColumn": "po_no"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "price",
        "sourceColumn": "price"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpQualityInspect",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_quality_inspect",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "wo_no",
        "sourceColumn": "wo_no"
      },
      {
        "property": "result",
        "sourceColumn": "result"
      },
      {
        "property": "defect_rate",
        "sourceColumn": "defect_rate"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpReceipt",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_receipt",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "rcpt_no",
        "sourceColumn": "rcpt_no"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "method",
        "sourceColumn": "method"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpSalesOrder",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_sales_order",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "so_no",
        "sourceColumn": "so_no"
      },
      {
        "property": "customer",
        "sourceColumn": "customer"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpSalesOrderItem",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_sales_order_item",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "so_no",
        "sourceColumn": "so_no"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpSupplier",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_supplier",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "supplier_code",
        "sourceColumn": "supplier_code"
      },
      {
        "property": "contact",
        "sourceColumn": "contact"
      },
      {
        "property": "level",
        "sourceColumn": "level"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpSupplierEval",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_supplier_eval",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "supplier_code",
        "sourceColumn": "supplier_code"
      },
      {
        "property": "score",
        "sourceColumn": "score"
      },
      {
        "property": "dimension",
        "sourceColumn": "dimension"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpVoucher",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_voucher",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "voucher_no",
        "sourceColumn": "voucher_no"
      },
      {
        "property": "acc_code",
        "sourceColumn": "acc_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpWarehouse",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_warehouse",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "wh_code",
        "sourceColumn": "wh_code"
      },
      {
        "property": "location",
        "sourceColumn": "location"
      },
      {
        "property": "capacity",
        "sourceColumn": "capacity"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "ErpWorkOrder",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "erp_work_order",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "wo_no",
        "sourceColumn": "wo_no"
      },
      {
        "property": "product_code",
        "sourceColumn": "product_code"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinAccount",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_account",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "acc_code",
        "sourceColumn": "acc_code"
      },
      {
        "property": "acc_name",
        "sourceColumn": "acc_name"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinAssetLedger",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_asset_ledger",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "value",
        "sourceColumn": "value"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinBank",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_bank",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "bank_code",
        "sourceColumn": "bank_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "balance",
        "sourceColumn": "balance"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinBudget",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_budget",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "year",
        "sourceColumn": "year"
      },
      {
        "property": "dept",
        "sourceColumn": "dept"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinCashFlow",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_cash_flow",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cf_type",
        "sourceColumn": "cf_type"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinCost",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_cost",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cost_type",
        "sourceColumn": "cost_type"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "period",
        "sourceColumn": "period"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinDividend",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_dividend",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "shareholder",
        "sourceColumn": "shareholder"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinExpense",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_expense",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "exp_type",
        "sourceColumn": "exp_type"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "period",
        "sourceColumn": "period"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinInvestment",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_investment",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "inv_code",
        "sourceColumn": "inv_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "return_rate",
        "sourceColumn": "return_rate"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinInvoice",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_invoice",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "inv_no",
        "sourceColumn": "inv_no"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "tax",
        "sourceColumn": "tax"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinJournal",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_journal",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "j_no",
        "sourceColumn": "j_no"
      },
      {
        "property": "acc_code",
        "sourceColumn": "acc_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinLedger",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_ledger",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "acc_code",
        "sourceColumn": "acc_code"
      },
      {
        "property": "period",
        "sourceColumn": "period"
      },
      {
        "property": "balance",
        "sourceColumn": "balance"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinLoan",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_loan",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "loan_no",
        "sourceColumn": "loan_no"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "rate",
        "sourceColumn": "rate"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinPayable",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_payable",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "supplier_code",
        "sourceColumn": "supplier_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "due_date",
        "sourceColumn": "due_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinPayment",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_payment",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "pay_no",
        "sourceColumn": "pay_no"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "method",
        "sourceColumn": "method"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinReceipt",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_receipt",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "rcpt_no",
        "sourceColumn": "rcpt_no"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "method",
        "sourceColumn": "method"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinReceivable",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_receivable",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cust_code",
        "sourceColumn": "cust_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "due_date",
        "sourceColumn": "due_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinReport",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_report",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "rep_code",
        "sourceColumn": "rep_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "period",
        "sourceColumn": "period"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinRevenue",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_revenue",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "rev_type",
        "sourceColumn": "rev_type"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "period",
        "sourceColumn": "period"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinSalary",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_salary",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "emp_code",
        "sourceColumn": "emp_code"
      },
      {
        "property": "gross",
        "sourceColumn": "gross"
      },
      {
        "property": "net",
        "sourceColumn": "net"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinTax",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_tax",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "tax_type",
        "sourceColumn": "tax_type"
      },
      {
        "property": "period",
        "sourceColumn": "period"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "FinVoucher",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "fin_voucher",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "voucher_no",
        "sourceColumn": "voucher_no"
      },
      {
        "property": "acc_code",
        "sourceColumn": "acc_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrAttendance",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_attendance",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "work_date",
        "sourceColumn": "work_date"
      },
      {
        "property": "check_in",
        "sourceColumn": "check_in"
      },
      {
        "property": "check_out",
        "sourceColumn": "check_out"
      },
      {
        "property": "late_minutes",
        "sourceColumn": "late_minutes"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrBonus",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_bonus",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "reason",
        "sourceColumn": "reason"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrBusinessTrip",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_business_trip",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "city",
        "sourceColumn": "city"
      },
      {
        "property": "start_date",
        "sourceColumn": "start_date"
      },
      {
        "property": "days",
        "sourceColumn": "days"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrCertification",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_certification",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cert_name",
        "sourceColumn": "cert_name"
      },
      {
        "property": "issue_date",
        "sourceColumn": "issue_date"
      },
      {
        "property": "valid_years",
        "sourceColumn": "valid_years"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrEmployeeContract",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_employee_contract",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "contract_type",
        "sourceColumn": "contract_type"
      },
      {
        "property": "start_date",
        "sourceColumn": "start_date"
      },
      {
        "property": "end_date",
        "sourceColumn": "end_date"
      },
      {
        "property": "salary",
        "sourceColumn": "salary"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrEmployeeDocument",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_employee_document",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "doc_type",
        "sourceColumn": "doc_type"
      },
      {
        "property": "file_path",
        "sourceColumn": "file_path"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrEmployeeSkill",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_employee_skill",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "skill",
        "sourceColumn": "skill"
      },
      {
        "property": "level",
        "sourceColumn": "level"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrExit",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_exit",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "exit_date",
        "sourceColumn": "exit_date"
      },
      {
        "property": "reason",
        "sourceColumn": "reason"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrHealth",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_health",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "check_date",
        "sourceColumn": "check_date"
      },
      {
        "property": "bmi",
        "sourceColumn": "bmi"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrLeaveBalance",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_leave_balance",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "year",
        "sourceColumn": "year"
      },
      {
        "property": "total_days",
        "sourceColumn": "total_days"
      },
      {
        "property": "used_days",
        "sourceColumn": "used_days"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrOrgChart",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_org_chart",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "parent_code",
        "sourceColumn": "parent_code"
      },
      {
        "property": "manager",
        "sourceColumn": "manager"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrOvertime",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_overtime",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ot_date",
        "sourceColumn": "ot_date"
      },
      {
        "property": "hours",
        "sourceColumn": "hours"
      },
      {
        "property": "reason",
        "sourceColumn": "reason"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrPayroll",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_payroll",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "pay_month",
        "sourceColumn": "pay_month"
      },
      {
        "property": "gross",
        "sourceColumn": "gross"
      },
      {
        "property": "net",
        "sourceColumn": "net"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrPension",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_pension",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "month",
        "sourceColumn": "month"
      },
      {
        "property": "pension_base",
        "sourceColumn": "pension_base"
      },
      {
        "property": "fund_base",
        "sourceColumn": "fund_base"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrPerformance",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_performance",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "period",
        "sourceColumn": "period"
      },
      {
        "property": "score",
        "sourceColumn": "score"
      },
      {
        "property": "rank",
        "sourceColumn": "rank"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrPosition",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_position",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "level",
        "sourceColumn": "level"
      },
      {
        "property": "headcount",
        "sourceColumn": "headcount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrProbation",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_probation",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "start_date",
        "sourceColumn": "start_date"
      },
      {
        "property": "end_date",
        "sourceColumn": "end_date"
      },
      {
        "property": "passed",
        "sourceColumn": "passed"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrRecruitment",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_recruitment",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "position",
        "sourceColumn": "position"
      },
      {
        "property": "candidates",
        "sourceColumn": "candidates"
      },
      {
        "property": "stage",
        "sourceColumn": "stage"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrSalary",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_salary",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "pay_month",
        "sourceColumn": "pay_month"
      },
      {
        "property": "base_salary",
        "sourceColumn": "base_salary"
      },
      {
        "property": "bonus",
        "sourceColumn": "bonus"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrSocialSecurity",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_social_security",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "month",
        "sourceColumn": "month"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrTraining",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_training",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "course",
        "sourceColumn": "course"
      },
      {
        "property": "hours",
        "sourceColumn": "hours"
      },
      {
        "property": "passed",
        "sourceColumn": "passed"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "HrTransfer",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "hr_transfer",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "from_dept",
        "sourceColumn": "from_dept"
      },
      {
        "property": "to_dept",
        "sourceColumn": "to_dept"
      },
      {
        "property": "eff_date",
        "sourceColumn": "eff_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdAttribute",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_attribute",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "attr_code",
        "sourceColumn": "attr_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdAttributeValue",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_attribute_value",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "attr_code",
        "sourceColumn": "attr_code"
      },
      {
        "property": "value",
        "sourceColumn": "value"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdBug",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_bug",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "bug_no",
        "sourceColumn": "bug_no"
      },
      {
        "property": "severity",
        "sourceColumn": "severity"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdBundle",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_bundle",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "bundle_code",
        "sourceColumn": "bundle_code"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdCatalog",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_catalog",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "cat_code",
        "sourceColumn": "cat_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdCategory",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_category",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cat_code",
        "sourceColumn": "cat_code"
      },
      {
        "property": "parent",
        "sourceColumn": "parent"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdChannelProduct",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_channel_product",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "channel",
        "sourceColumn": "channel"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdCompetitor",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_competitor",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "comp_code",
        "sourceColumn": "comp_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "strength",
        "sourceColumn": "strength"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdFeedback",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_feedback",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "channel",
        "sourceColumn": "channel"
      },
      {
        "property": "content",
        "sourceColumn": "content"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdLaunch",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_launch",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "region",
        "sourceColumn": "region"
      },
      {
        "property": "launch_date",
        "sourceColumn": "launch_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdLifecycle",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_lifecycle",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "stage",
        "sourceColumn": "stage"
      },
      {
        "property": "date",
        "sourceColumn": "date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdMarketAnalysis",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_market_analysis",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "region",
        "sourceColumn": "region"
      },
      {
        "property": "share",
        "sourceColumn": "share"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdPricing",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_pricing",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "price",
        "sourceColumn": "price"
      },
      {
        "property": "currency",
        "sourceColumn": "currency"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdProductFeature",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_product_feature",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdProductRoadmap",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_product_roadmap",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "quarter",
        "sourceColumn": "quarter"
      },
      {
        "property": "goal",
        "sourceColumn": "goal"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdProductSpec",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_product_spec",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "spec_name",
        "sourceColumn": "spec_name"
      },
      {
        "property": "spec_value",
        "sourceColumn": "spec_value"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdProductVersion",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_product_version",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "version",
        "sourceColumn": "version"
      },
      {
        "property": "release_date",
        "sourceColumn": "release_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdRelease",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_release",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "release_no",
        "sourceColumn": "release_no"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "date",
        "sourceColumn": "date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdReleaseNote",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_release_note",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "release_no",
        "sourceColumn": "release_no"
      },
      {
        "property": "content",
        "sourceColumn": "content"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdRequirement",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_requirement",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "req_no",
        "sourceColumn": "req_no"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "priority",
        "sourceColumn": "priority"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdReview",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_review",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "reviewer",
        "sourceColumn": "reviewer"
      },
      {
        "property": "result",
        "sourceColumn": "result"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PdUserStory",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pd_user_story",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "req_no",
        "sourceColumn": "req_no"
      },
      {
        "property": "story",
        "sourceColumn": "story"
      },
      {
        "property": "points",
        "sourceColumn": "points"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmBacklog",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_backlog",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "priority",
        "sourceColumn": "priority"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmBudget",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_budget",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmChangeRequest",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_change_request",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cr_no",
        "sourceColumn": "cr_no"
      },
      {
        "property": "reason",
        "sourceColumn": "reason"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmComment",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_comment",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "task_code",
        "sourceColumn": "task_code"
      },
      {
        "property": "author",
        "sourceColumn": "author"
      },
      {
        "property": "content",
        "sourceColumn": "content"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmDeliverable",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_deliverable",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmDocument",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_document",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "doc_type",
        "sourceColumn": "doc_type"
      },
      {
        "property": "path",
        "sourceColumn": "path"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmEpic",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_epic",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmExpense",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_expense",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "category",
        "sourceColumn": "category"
      },
      {
        "property": "amount",
        "sourceColumn": "amount"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmIssue",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_issue",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "issue_no",
        "sourceColumn": "issue_no"
      },
      {
        "property": "severity",
        "sourceColumn": "severity"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmLessons",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_lessons",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "content",
        "sourceColumn": "content"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmMeeting",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_meeting",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "date",
        "sourceColumn": "date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmMilestone",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_milestone",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "date",
        "sourceColumn": "date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmPortfolio",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_portfolio",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "pf_code",
        "sourceColumn": "pf_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmProjectTask",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_project_task",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "task_code",
        "sourceColumn": "task_code"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmQualityGate",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_quality_gate",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "gate",
        "sourceColumn": "gate"
      },
      {
        "property": "passed",
        "sourceColumn": "passed"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmResource",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_resource",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "res_code",
        "sourceColumn": "res_code"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "cost",
        "sourceColumn": "cost"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmResourceAllocation",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_resource_allocation",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "res_code",
        "sourceColumn": "res_code"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmRisk",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_risk",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "risk_no",
        "sourceColumn": "risk_no"
      },
      {
        "property": "level",
        "sourceColumn": "level"
      },
      {
        "property": "mitigation",
        "sourceColumn": "mitigation"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmSprint",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_sprint",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "start_date",
        "sourceColumn": "start_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmStakeholder",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_stakeholder",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "project_code",
        "sourceColumn": "project_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "role",
        "sourceColumn": "role"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmTaskDependency",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_task_dependency",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "task_code",
        "sourceColumn": "task_code"
      },
      {
        "property": "dep_task",
        "sourceColumn": "dep_task"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "PmTimesheet",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "pm_timesheet",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "emp_code",
        "sourceColumn": "emp_code"
      },
      {
        "property": "task_code",
        "sourceColumn": "task_code"
      },
      {
        "property": "hours",
        "sourceColumn": "hours"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecAccessLog",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_access_log",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "user",
        "sourceColumn": "user"
      },
      {
        "property": "resource",
        "sourceColumn": "resource"
      },
      {
        "property": "ts",
        "sourceColumn": "ts"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecAlert",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_alert",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "alert_no",
        "sourceColumn": "alert_no"
      },
      {
        "property": "rule",
        "sourceColumn": "rule"
      },
      {
        "property": "severity",
        "sourceColumn": "severity"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecAsset",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_asset",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "criticality",
        "sourceColumn": "criticality"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecAudit",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_audit",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "audit_no",
        "sourceColumn": "audit_no"
      },
      {
        "property": "scope",
        "sourceColumn": "scope"
      },
      {
        "property": "result",
        "sourceColumn": "result"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecAuthEvent",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_auth_event",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "acc",
        "sourceColumn": "acc"
      },
      {
        "property": "result",
        "sourceColumn": "result"
      },
      {
        "property": "ts",
        "sourceColumn": "ts"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecBackup",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_backup",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "bk_no",
        "sourceColumn": "bk_no"
      },
      {
        "property": "target",
        "sourceColumn": "target"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecCertificate",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_certificate",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cert_no",
        "sourceColumn": "cert_no"
      },
      {
        "property": "cn",
        "sourceColumn": "cn"
      },
      {
        "property": "expire",
        "sourceColumn": "expire"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecCompliance",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_compliance",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "cmp_code",
        "sourceColumn": "cmp_code"
      },
      {
        "property": "standard",
        "sourceColumn": "standard"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecControl",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_control",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "ctrl_code",
        "sourceColumn": "ctrl_code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecEndpoint",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_endpoint",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ep_code",
        "sourceColumn": "ep_code"
      },
      {
        "property": "os",
        "sourceColumn": "os"
      },
      {
        "property": "compliant",
        "sourceColumn": "compliant"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecFirewallRule",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_firewall_rule",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "fw_no",
        "sourceColumn": "fw_no"
      },
      {
        "property": "src",
        "sourceColumn": "src"
      },
      {
        "property": "dst",
        "sourceColumn": "dst"
      },
      {
        "property": "action",
        "sourceColumn": "action"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecIncident",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_incident",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "inc_no",
        "sourceColumn": "inc_no"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "level",
        "sourceColumn": "level"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecIntrusion",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_intrusion",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ids_no",
        "sourceColumn": "ids_no"
      },
      {
        "property": "src_ip",
        "sourceColumn": "src_ip"
      },
      {
        "property": "dst_ip",
        "sourceColumn": "dst_ip"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecMalware",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_malware",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "mal_no",
        "sourceColumn": "mal_no"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecNetworkDevice",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_network_device",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "dev_code",
        "sourceColumn": "dev_code"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "ip",
        "sourceColumn": "ip"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecPatch",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_patch",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "patch_no",
        "sourceColumn": "patch_no"
      },
      {
        "property": "asset_code",
        "sourceColumn": "asset_code"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecPhishing",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_phishing",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ph_no",
        "sourceColumn": "ph_no"
      },
      {
        "property": "target",
        "sourceColumn": "target"
      },
      {
        "property": "blocked",
        "sourceColumn": "blocked"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecPolicy",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_policy",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "policy_code",
        "sourceColumn": "policy_code"
      },
      {
        "property": "title",
        "sourceColumn": "title"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecScan",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_scan",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "scan_no",
        "sourceColumn": "scan_no"
      },
      {
        "property": "target",
        "sourceColumn": "target"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecThreatIntel",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_threat_intel",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ti_code",
        "sourceColumn": "ti_code"
      },
      {
        "property": "ioc",
        "sourceColumn": "ioc"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecUserAccount",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_user_account",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "acc",
        "sourceColumn": "acc"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "mfa",
        "sourceColumn": "mfa"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "SecVulnerability",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "sec_vulnerability",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "vuln_no",
        "sourceColumn": "vuln_no"
      },
      {
        "property": "severity",
        "sourceColumn": "severity"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsCrossDock",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_cross_dock",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ib_no",
        "sourceColumn": "ib_no"
      },
      {
        "property": "ob_no",
        "sourceColumn": "ob_no"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsCycleCount",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_cycle_count",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "loc_code",
        "sourceColumn": "loc_code"
      },
      {
        "property": "count_date",
        "sourceColumn": "count_date"
      },
      {
        "property": "diff",
        "sourceColumn": "diff"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsInbound",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_inbound",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ib_no",
        "sourceColumn": "ib_no"
      },
      {
        "property": "supplier",
        "sourceColumn": "supplier"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsInboundLine",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_inbound_line",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ib_no",
        "sourceColumn": "ib_no"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsInventoryAdj",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_inventory_adj",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "adj_qty",
        "sourceColumn": "adj_qty"
      },
      {
        "property": "reason",
        "sourceColumn": "reason"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsLocation",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_location",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "zone_code",
        "sourceColumn": "zone_code"
      },
      {
        "property": "loc_code",
        "sourceColumn": "loc_code"
      },
      {
        "property": "capacity",
        "sourceColumn": "capacity"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsLot",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_lot",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "lot_no",
        "sourceColumn": "lot_no"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "prod_date",
        "sourceColumn": "prod_date"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsOutbound",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_outbound",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ob_no",
        "sourceColumn": "ob_no"
      },
      {
        "property": "customer",
        "sourceColumn": "customer"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsOutboundLine",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_outbound_line",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ob_no",
        "sourceColumn": "ob_no"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsPacking",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_packing",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ob_no",
        "sourceColumn": "ob_no"
      },
      {
        "property": "pack_type",
        "sourceColumn": "pack_type"
      },
      {
        "property": "weight",
        "sourceColumn": "weight"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsPickingTask",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_picking_task",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ob_no",
        "sourceColumn": "ob_no"
      },
      {
        "property": "picker",
        "sourceColumn": "picker"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsPutaway",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_putaway",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ib_no",
        "sourceColumn": "ib_no"
      },
      {
        "property": "loc_code",
        "sourceColumn": "loc_code"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsReceiving",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_receiving",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ib_no",
        "sourceColumn": "ib_no"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "damaged",
        "sourceColumn": "damaged"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsReservation",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_reservation",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "expire",
        "sourceColumn": "expire"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsReturn",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_return",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "return_no",
        "sourceColumn": "return_no"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "reason",
        "sourceColumn": "reason"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsSerial",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_serial",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "serial_no",
        "sourceColumn": "serial_no"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsShipping",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_shipping",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "ob_no",
        "sourceColumn": "ob_no"
      },
      {
        "property": "carrier",
        "sourceColumn": "carrier"
      },
      {
        "property": "track_no",
        "sourceColumn": "track_no"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsSku",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_sku",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "uom",
        "sourceColumn": "uom"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsStock",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_stock",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "loc_code",
        "sourceColumn": "loc_code"
      },
      {
        "property": "qty",
        "sourceColumn": "qty"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsStockMove",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_stock_move",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "sku",
        "sourceColumn": "sku"
      },
      {
        "property": "from_loc",
        "sourceColumn": "from_loc"
      },
      {
        "property": "to_loc",
        "sourceColumn": "to_loc"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsWarehouse",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_warehouse",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "wh_code",
        "sourceColumn": "wh_code"
      },
      {
        "property": "location",
        "sourceColumn": "location"
      },
      {
        "property": "type",
        "sourceColumn": "type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  },
  {
    "objectType": "WmsZone",
    "sourceConnectionId": "src_enterprise_biz",
    "sourceTable": "wms_zone",
    "fieldMappings": [
      {
        "property": "id",
        "sourceColumn": "id"
      },
      {
        "property": "code",
        "sourceColumn": "code"
      },
      {
        "property": "name",
        "sourceColumn": "name"
      },
      {
        "property": "wh_code",
        "sourceColumn": "wh_code"
      },
      {
        "property": "zone_code",
        "sourceColumn": "zone_code"
      },
      {
        "property": "zone_type",
        "sourceColumn": "zone_type"
      },
      {
        "property": "status",
        "sourceColumn": "status"
      },
      {
        "property": "created_at",
        "sourceColumn": "created_at"
      },
      {
        "property": "updated_at",
        "sourceColumn": "updated_at"
      }
    ]
  }
];
