import { DistributorType } from '@/api/__types__'

export interface CompanyData {
  name: string
  distributorType: DistributorType
  country: string
  postalCode?: string
  city: string
  street: string
  streetNumber?: string
  additionalAddressInfo?: string
  phoneNumber: string
  identificationNumber: string
  invoiceRecipientTitle: string
  invoiceRecipientFullName: string
  invoiceRecipientEmail: string
  invoiceRecipientPhoneOrMobile: string
  useAdditionalInvoiceRecipient: boolean
}
