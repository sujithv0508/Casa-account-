export type AccountStatus = 'Authorized' | 'Pending' | 'Rejected'

export type Account = {
  accountId: string
  accountNo: string
  customerId: string
  customerName: string
  sector: string
  product: string
  currency: string
  branch: string
  status: AccountStatus
  accountType: string
  operatingMode: string
  openingDate: string
  dateOfBirth: string
  mobile: string
  email: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  addressLine4: string
  country: string
  postalCode: string
  statementRequired: boolean
  statementFrequency: string
  statementUnit: string
  statementDay: string
  communicationType: string
  ibanNumber: string
  dormant: boolean
  frozen: boolean
  noDebits: boolean
  noCredits: boolean
  overdraftStartDate: string
  overdraftEndDate: string
  overdraftTransferType: 'Amount' | 'Percentage'
  overdraftTransferValue: string
  overdraftLimitAmount: string
  overdraftUtilizedAmount: string
  overdraftStatus: 'Active' | 'Inactive'
}
