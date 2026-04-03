import type { ContactEmailData } from '@/types'
import { siteConfig } from '@/lib/site'

const ownerFirstName = siteConfig.name.split(' ')[0]

const escapeHtml = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')

const formatMultilineHtml = (value: string) =>
    escapeHtml(value).replaceAll('\n', '<br/>')

const buildTelHref = (phone?: string) => {
    if (!phone) return null

    const normalized = phone.trim().replaceAll(/[^\d+]/g, '')

    if (!normalized || normalized === '+') {
        return null
    }

    return `tel:${normalized}`
}

export const buildOwnerMessageText = (data: ContactEmailData) => {
    return [
        'New portfolio contact form submission:',
        '',
        `Name: ${data.firstName} ${data.lastName}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || 'Not provided'}`,
        `Company: ${data.company || 'Not provided'}`,
        `LinkedIn: ${data.linkedIn || 'Not provided'}`,
        '',
        'Message:',
        data.message,
    ].join('\n')
}

export const buildOwnerMessageHtml = (data: ContactEmailData) => {
    const senderName = `${data.firstName} ${data.lastName}`.trim()
    const safeSenderName = escapeHtml(senderName)
    const safeSenderEmail = escapeHtml(data.email)
    const safeMailtoHref = `mailto:${safeSenderEmail}`
    const safePhone = escapeHtml(data.phone || 'Not provided')
    const telHref = buildTelHref(data.phone)
    const safeTelHref = telHref ? escapeHtml(telHref) : null
    const safeCompany = escapeHtml(data.company || 'Not provided')
    const safeLinkedIn = escapeHtml(data.linkedIn || 'Not provided')
    const safeLinkedInHref = data.linkedIn
        ? /^https?:\/\//i.test(data.linkedIn)
            ? escapeHtml(data.linkedIn)
            : escapeHtml(`https://${data.linkedIn}`)
        : null
    const safeMessageHtml = formatMultilineHtml(data.message)

    return `
<div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; background:#020403; color:#d1fae5; padding:24px;">
  <h2 style="margin:0 0 16px; color:#86efac; font-size:18px;">New Portfolio Contact Submission</h2>
  <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
    <tr><td style="padding:6px 0; color:#86efac; width:120px;">Name</td><td style="padding:6px 0;">${safeSenderName}</td></tr>
    <tr><td style="padding:6px 0; color:#86efac;">Email</td><td style="padding:6px 0;">${safeMailtoHref ? `<a href="${safeMailtoHref}" style="color:#d1fae5; text-decoration:underline;">${safeSenderEmail}</a>` : safeSenderEmail}</td></tr>
    <tr><td style="padding:6px 0; color:#86efac;">Phone</td><td style="padding:6px 0;">${safeTelHref ? `<a href="${safeTelHref}" style="color:#d1fae5; text-decoration:underline;">${safePhone}</a>` : safePhone}</td></tr>
    <tr><td style="padding:6px 0; color:#86efac;">Company</td><td style="padding:6px 0;">${safeCompany}</td></tr>
    <tr><td style="padding:6px 0; color:#86efac;">LinkedIn</td><td style="padding:6px 0;">${safeLinkedInHref ? `<a href="${safeLinkedInHref}" style="color:#d1fae5; text-decoration:underline;">${safeLinkedIn}</a>` : safeLinkedIn}</td></tr>
  </table>
  <div style="border:1px solid rgba(134,239,172,0.35); border-radius:10px; padding:14px; background:rgba(6,20,12,0.65);">
    <p style="margin:0 0 8px; color:#86efac; font-size:12px; letter-spacing:0.04em; text-transform:uppercase;">Message</p>
    <p style="margin:0; line-height:1.6;">${safeMessageHtml}</p>
  </div>
</div>`.trim()
}

export const buildAutoReplyText = (data: ContactEmailData) => {
    return [
        `Hi ${data.firstName},`,
        '',
        'Thanks for your message. I received it and will get back to you soon.',
        '',
        'Your message:',
        data.message,
        '',
        '- ' + ownerFirstName,
    ].join('\n')
}

export const buildAutoReplyHtml = (data: ContactEmailData) => {
    const safeMessageHtml = formatMultilineHtml(data.message)

    return `
<div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; background:#020403; color:#d1fae5; padding:24px;">
  <h2 style="margin:0 0 10px; color:#86efac; font-size:18px;">Message Received</h2>
  <p style="margin:0 0 12px; line-height:1.6;">Hi ${escapeHtml(data.firstName)},</p>
  <p style="margin:0 0 16px; line-height:1.6;">Thanks for reaching out. I received your message and will get back to you soon.</p>
  <div style="border:1px solid rgba(134,239,172,0.35); border-radius:10px; padding:14px; background:rgba(6,20,12,0.65);">
    <p style="margin:0 0 8px; color:#86efac; font-size:12px; letter-spacing:0.04em; text-transform:uppercase;">Your Message</p>
    <p style="margin:0; line-height:1.6;">${safeMessageHtml}</p>
  </div>
  <p style="margin:16px 0 0; line-height:1.6;">- ${ownerFirstName}</p>
</div>`.trim()
}
