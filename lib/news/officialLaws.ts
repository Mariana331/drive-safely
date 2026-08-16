import type { NewsArticle } from '@/lib/api/api';
import { defaultRelatedForCategory } from './journey';

const RADA_PDR =
  'https://zakon.rada.gov.ua/laws/show/1306-2001-%D0%BF';
const HSC_EXAM =
  'https://hsc.gov.ua/index/poslugi/vidacha-posvidchennya-vodiya/pitannya-ta-ispit-z-pdr/';
const HSC_NORMS =
  'https://hsc.gov.ua/index/publichna-informatsiya/normativna-baza/';

/** Curated Traffic Laws — official sources only (Verkhovna Rada / HSC MIA). */
export const OFFICIAL_LAWS_NEWS: NewsArticle[] = [
  {
    _id: 'law-pdr-1306',
    title: 'Official Traffic Rules of Ukraine (CMU Resolution №1306)',
    slug: 'official-traffic-rules-cmu-1306',
    excerpt:
      'The current edition of the Rules of the Road approved by Cabinet of Ministers Resolution №1306 of 10.10.2001 is published in the Verkhovna Rada legislation database.',
    body: `The Rules of the Road (Правила дорожнього руху) are approved by **Cabinet of Ministers of Ukraine Resolution №1306 of 10 October 2001**.

The official consolidated text is maintained in the legislation database of Ukraine (zakon.rada.gov.ua). Always rely on the current edition there — not on unofficial reprint sites.

**What to do next**
1. Open the official text and check the section that matches your situation.
2. Review the same topic in DriveSafely Traffic Rules.
3. Practice with exam-style questions from HSC MIA materials.`,
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 5,
    country: 'Ukraine',
    publishedAt: '2026-07-01T00:00:00.000Z',
    isPublished: true,
    sourceType: 'legislation',
    sourceName: 'Verkhovna Rada — zakon.rada.gov.ua',
    sourceUrl: RADA_PDR,
    stream: 'laws',
    relatedLinks: defaultRelatedForCategory('Traffic Laws'),
  },
  {
    _id: 'law-hsc-225',
    title: 'HSC MIA exam questions updated (Order №225 of 29.10.2025)',
    slug: 'hsc-mia-exam-questions-order-225',
    excerpt:
      'Theoretical exam questions and answers for driver licensing are approved by HSC MIA Order №225 of 29.10.2025 and published on the official HSC website.',
    body: `The Main Service Center of the Ministry of Internal Affairs (**ГСЦ МВС**) publishes the current set of theoretical exam questions.

**Order №225 of 29 October 2025** approves changes to the exam tickets used for obtaining a driving licence.

Use only the official HSC pages for the authoritative question bank. DriveSafely Practice Tests are aligned with this public exam material for learning — always verify against HSC if you are preparing for the official exam.`,
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    country: 'Ukraine',
    publishedAt: '2025-10-29T00:00:00.000Z',
    isPublished: true,
    sourceType: 'legislation',
    sourceName: 'HSC MIA (ГСЦ МВС)',
    sourceUrl: HSC_EXAM,
    stream: 'laws',
    relatedLinks: [
      {
        type: 'practice-test',
        href: '/tests',
        label: 'Start Practice Test',
      },
      {
        type: 'traffic-rule',
        href: '/traffic-rules',
        label: 'Review Traffic Rules',
      },
      {
        type: 'ai-assistant',
        href: '/assistant',
        label: 'Ask AI about a question',
      },
    ],
  },
  {
    _id: 'law-fines-reminder',
    title: 'Fines and liability: check the official Code, not social media',
    slug: 'fines-official-code-reminder',
    excerpt:
      'Amounts and procedures for traffic fines change through official amendments. Confirm liability rules in the legislation database before relying on secondary posts.',
    body: `Information about administrative fines for traffic violations must come from **official legal acts** published in the Verkhovna Rada database (and related codes/laws), not from viral posts.

When a rule or fine amount is updated:
1. Open the act on zakon.rada.gov.ua.
2. Note the edition date / basis of the change.
3. Map the topic to DriveSafely Traffic Rules and Practice Tests.

DriveSafely links you to official sources; we do not replace them.`,
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 3,
    country: 'Ukraine',
    publishedAt: '2026-06-15T00:00:00.000Z',
    isPublished: true,
    sourceType: 'legislation',
    sourceName: 'Verkhovna Rada legislation database',
    sourceUrl: 'https://zakon.rada.gov.ua/',
    stream: 'laws',
    relatedLinks: defaultRelatedForCategory('Traffic Laws'),
  },
  {
    _id: 'law-hsc-normative',
    title: 'HSC MIA normative base for drivers and service centers',
    slug: 'hsc-mia-normative-base',
    excerpt:
      'Orders and regulations used by service centers — including exam-related acts — are listed in the HSC MIA public normative base.',
    body: `The **normative base** section on hsc.gov.ua collects official orders relevant to driver services, exams, and related procedures.

Bookmark this page when you need the primary document behind an exam change or administrative procedure. Pair it with the Traffic Rules text on zakon.rada.gov.ua for the underlying road rules.`,
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 3,
    country: 'Ukraine',
    publishedAt: '2026-05-20T00:00:00.000Z',
    isPublished: true,
    sourceType: 'legislation',
    sourceName: 'HSC MIA — normative base',
    sourceUrl: HSC_NORMS,
    stream: 'laws',
    relatedLinks: defaultRelatedForCategory('Traffic Laws'),
  },
  {
    _id: 'law-pedestrian-priority',
    title: 'Pedestrian priority at crossings — official PDR reminder',
    slug: 'pedestrian-priority-official-pdr',
    excerpt:
      'Drivers must give way to pedestrians on marked crosswalks under the official Rules of the Road. Read the primary text, then practice the topic.',
    body: `Under the official **Rules of the Road**, drivers are obliged to yield to pedestrians on pedestrian crossings according to the current edition of Resolution №1306.

This article does not replace the legal text. Open the official source, then:
- study the related rule cards in Traffic Rules;
- take a Priority / Pedestrian practice quiz;
- ask the AI Assistant if a scenario is unclear.`,
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    country: 'Ukraine',
    publishedAt: '2026-04-10T00:00:00.000Z',
    isPublished: true,
    sourceType: 'legislation',
    sourceName: 'Verkhovna Rada — PDR №1306',
    sourceUrl: RADA_PDR,
    stream: 'laws',
    relatedLinks: [
      {
        type: 'traffic-rule',
        href: '/traffic-rules',
        label: 'Rule: yielding to pedestrians',
      },
      {
        type: 'practice-test',
        href: '/tests',
        label: 'Priority practice test',
      },
      {
        type: 'ai-assistant',
        href: '/assistant',
        label: 'Ask AI Assistant',
      },
    ],
  },
];
