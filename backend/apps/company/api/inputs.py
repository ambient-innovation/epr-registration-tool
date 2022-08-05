import strawberry
from strawberry.django import auto

from company.models import AdditionalInvoiceRecipient, Company, CompanyContactInfo, DistributorType


@strawberry.django.input(Company)
class CompanyInput:
    name: auto
    distributor_type: strawberry.enum(DistributorType)
    identification_number: str


@strawberry.django.input(CompanyContactInfo)
class CompanyContactInfoInput:
    country: auto
    postal_code: auto
    city: auto
    street: auto
    street_number: auto
    additional_address_info: auto
    phone_number: auto


@strawberry.django.input(AdditionalInvoiceRecipient)
class AdditionalInvoiceRecipientInput:
    email: auto
    title: auto
    full_name: auto
    phone_or_mobile: auto
