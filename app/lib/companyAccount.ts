export function isCompanyAccount(data: any): boolean {
  return (
    data?.accountType === "company" ||
    (typeof data?.companyCode === "string" && data.companyCode.trim().length > 0) ||
    data?.billing?.accountType === "company" ||
    data?.billing?.method === "company_contract" ||
    data?.billing?.method === "company"
  )
}
