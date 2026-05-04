import { relations } from 'drizzle-orm'
import {
    boolean,
    integer,
    pgTable,
    primaryKey,
    serial,
    text,
    timestamp,
    uniqueIndex,
} from 'drizzle-orm/pg-core'

// ─── NextAuth tables ──────────────────────────────────────────────────────────

export const users = pgTable('users', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    image: text('image'),
    role: text('role').notNull().default('guest'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const accounts = pgTable(
    'accounts',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('provider_account_id').notNull(),
        // These field names must stay snake_case — @auth/drizzle-adapter
        // accesses them by these exact JS property names.
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (table) => [
        uniqueIndex('accounts_provider_provider_account_id_idx').on(
            table.provider,
            table.providerAccountId
        ),
    ]
)

export const sessions = pgTable('sessions', {
    sessionToken: text('session_token').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
    'verification_tokens',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull().unique(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (table) => [primaryKey({ columns: [table.identifier, table.token] })]
)

// ─── Portfolio tables ─────────────────────────────────────────────────────────

/**
 * Singleton row — one per portfolio.
 * Covers all scalar personal fields plus the learning section scalars.
 */
export const personalInfo = pgTable('personal_info', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    title: text('title').notNull(),
    about: text('about').notNull(),
    status: boolean('status').notNull().default(false),
    statusLabel: text('status_label'),
    cvPath: text('cv_path'),
    devPracticesLabel: text('dev_practices_label'),
    contactPhone: text('contact_phone').notNull(),
    contactEmail: text('contact_email').notNull(),
    learningHeading: text('learning_heading').notNull(),
    learningDescription: text('learning_description').notNull(),
    bootDevEmbedSrc: text('boot_dev_embed_src').notNull(),
    bootDevEmbedAlt: text('boot_dev_embed_alt').notNull(),
    duolingoEmbedSrc: text('duolingo_embed_src').notNull(),
    duolingoEmbedAlt: text('duolingo_embed_alt').notNull(),
    duolingoEmbedUnoptimized: boolean('duolingo_embed_unoptimized')
        .notNull()
        .default(false),
    profileImageUrl: text('profile_image_url'),
    version: integer('version').notNull().default(0),
})

export const heroTypedLines = pgTable('hero_typed_lines', {
    id: serial('id').primaryKey(),
    text: text('text').notNull(),
    sortOrder: integer('sort_order').notNull(),
})

export const ogTechPills = pgTable('og_tech_pills', {
    id: serial('id').primaryKey(),
    label: text('label').notNull(),
    sortOrder: integer('sort_order').notNull(),
})

export const socialLinks = pgTable('social_links', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    icon: text('icon').notNull(),
    url: text('url').notNull(),
    sortOrder: integer('sort_order').notNull(),
})

export const experience = pgTable('experience', {
    id: serial('id').primaryKey(),
    period: text('period').notNull(),
    title: text('title').notNull(),
    company: text('company').notNull(),
    location: text('location').notNull(),
    sortOrder: integer('sort_order').notNull(),
})

export const experiencePoints = pgTable('experience_points', {
    id: serial('id').primaryKey(),
    experienceId: integer('experience_id')
        .notNull()
        .references(() => experience.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    sortOrder: integer('sort_order').notNull(),
})

export const skillCategories = pgTable('skill_categories', {
    id: serial('id').primaryKey(),
    label: text('label').notNull(),
    wide: boolean('wide').notNull().default(false),
    sortOrder: integer('sort_order').notNull(),
})

export const skills = pgTable('skills', {
    id: serial('id').primaryKey(),
    categoryId: integer('category_id')
        .notNull()
        .references(() => skillCategories.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    icon: text('icon'),
    sortOrder: integer('sort_order').notNull(),
})

export const devPractices = pgTable('dev_practices', {
    id: serial('id').primaryKey(),
    text: text('text').notNull(),
    sortOrder: integer('sort_order').notNull(),
})

export const education = pgTable('education', {
    id: serial('id').primaryKey(),
    degree: text('degree').notNull(),
    institution: text('institution').notNull(),
    location: text('location').notNull(),
    year: text('year').notNull(),
    details: text('details').notNull().default(''),
    sortOrder: integer('sort_order').notNull(),
})

export const learningLanguages = pgTable('learning_languages', {
    id: serial('id').primaryKey(),
    label: text('label').notNull(),
    sortOrder: integer('sort_order').notNull(),
})

/**
 * Distributed rate-limit buckets — one row per client key (IP).
 * The in-memory fallback is useless in serverless (fresh process per request);
 * this table provides shared state across all instances/regions.
 */
export const rateLimits = pgTable('rate_limits', {
    key: text('key').primaryKey(),
    count: integer('count').notNull().default(1),
    windowStart: timestamp('window_start', { withTimezone: true })
        .notNull()
        .defaultNow(),
})

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const experienceRelations = relations(experience, ({ many }) => ({
    points: many(experiencePoints),
}))

export const experiencePointsRelations = relations(
    experiencePoints,
    ({ one }) => ({
        experience: one(experience, {
            fields: [experiencePoints.experienceId],
            references: [experience.id],
        }),
    })
)

export const skillCategoriesRelations = relations(
    skillCategories,
    ({ many }) => ({
        skills: many(skills),
    })
)

export const skillsRelations = relations(skills, ({ one }) => ({
    category: one(skillCategories, {
        fields: [skills.categoryId],
        references: [skillCategories.id],
    }),
}))
