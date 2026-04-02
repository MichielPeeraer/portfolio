export interface SocialLink {
    name: string
    url: string
    icon?: string
}

export interface ContactInfo {
    phone: string
    email: string
    socialLinks: SocialLink[]
}

export type ContactEmailData = {
    firstName: string
    lastName: string
    email: string
    phone?: string
    company?: string
    linkedIn?: string
    message: string
}

export interface ContactFormValues {
    firstname: string
    lastname: string
    email: string
    phone?: string
    company?: string
    linkedin?: string
    message: string
    website?: string
}
