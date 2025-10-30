import { pgEnum } from 'drizzle-orm/pg-core'
import {
  AdoptionStatusValues,
  AnimalStatusValues,
  AppointmentStatusValues,
  ApprovalStatusValues,
  CampaignStatusValues,
  ConsultationTypeValues,
  HealthConditionValues,
  PostStatusValues,
  PostTypeValues,
  ProcedureCategoryValues,
  ProcedureStatusValues,
  ProfileTypeValues,
  SexValues,
  SizeValues,
  SpeciesValues,
  TransactionCategoryValues,
  TransactionStatusValues,
  UrgencyLevelValues,
} from '.'

export const profileTypeEnum = pgEnum('profile_type', ProfileTypeValues)
export const procedureCategoryEnum = pgEnum('procedure_category', ProcedureCategoryValues)
export const transactionCategoryEnum = pgEnum('transaction_category', TransactionCategoryValues)
export const urgencyLevelEnum = pgEnum('urgency_level', UrgencyLevelValues)
export const speciesEnum = pgEnum('species', SpeciesValues)
export const sizeEnum = pgEnum('size', SizeValues)
export const sexEnum = pgEnum('sex', SexValues)
export const healthConditionEnum = pgEnum('health_condition', HealthConditionValues)
export const animalStatusEnum = pgEnum('animal_status', AnimalStatusValues)
export const approvalStatusEnum = pgEnum('approval_status', ApprovalStatusValues)
export const campaignStatusEnum = pgEnum('campaign_status', CampaignStatusValues)
export const consultationTypeEnum = pgEnum('consultation_type', ConsultationTypeValues)
export const appointmentStatusEnum = pgEnum('appointment_status', AppointmentStatusValues)
export const procedureStatusEnum = pgEnum('procedure_status', ProcedureStatusValues)
export const adoptionStatusEnum = pgEnum('adoption_status', AdoptionStatusValues)
export const transactionStatusEnum = pgEnum('transaction_status', TransactionStatusValues)
export const postTypeEnum = pgEnum('post_type', PostTypeValues)
export const postStatusEnum = pgEnum('post_status', PostStatusValues)
