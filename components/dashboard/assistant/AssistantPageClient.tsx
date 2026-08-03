'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import LearningJourney from '@/components/dashboard/news/LearningJourney';
import {
  NEWS_LEARNING_JOURNEY,
  VIDEO_LEARNING_JOURNEY,
} from '@/lib/news/journey';
import {
  QUICK_PROMPTS,
  answerAssistantPrompt,
} from '@/lib/assistant/assistantEngine';
import { analyzeSignPhoto } from '@/lib/assistant/signRecognition';
import {
  clearChatMessages,
  createAssistantMessage,
  createUserMessage,
  loadChatMessages,
  saveChatMessages,
  type ChatMessage,
} from '@/lib/assistant/chatSession';
import { useUserProgress } from '@/lib/progress/useUserProgress';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import { useFavorites, useIsFavorite } from '@/lib/favorites/useFavorites';
import styles from './AssistantPage.module.css';

function renderText(text: string) {
  return text.split('\n').map((line, index) => {
    const html = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return (
      <p
        key={index}
        className={styles.messageLine}
        dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }}
      />
    );
  });
}

function AssistantFavoriteButton({ message }: { message: ChatMessage }) {
  const dict = useDictionary();
  const { toggle } = useFavorites();
  const saved = useIsFavorite('assistant', message.id);
  const preview = message.text.replace(/\*\*/g, '').slice(0, 140);
  const ruleMeta = message.rules?.[0]
    ? `Traffic Rule ${message.rules[0].code}`
    : 'AI tip';

  return (
    <button
      type="button"
      className={`${styles.favMsgBtn} ${saved ? styles.favMsgActive : ''}`}
      aria-label={saved ? dict.favorites.remove : dict.favorites.add}
      aria-pressed={saved}
      onClick={() =>
        toggle({
          kind: 'assistant',
          entityId: message.id,
          title: preview || 'AI assistant answer',
          subtitle: ruleMeta,
          href: '/assistant',
          meta: new Date(message.createdAt).toLocaleDateString(),
        })
      }
    >
      {saved ? '★' : '☆'}
    </button>
  );
}

export default function AssistantPageClient() {
  useUserProgress(); // ensure progress user id is set for chat storage
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [pendingImage, setPendingImage] = useState<{
    dataUrl: string;
    name: string;
  } | null>(null);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(loadChatMessages());
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, typing]);

  const pushExchange = (userMsg: ChatMessage, replyMsg: ChatMessage) => {
    setMessages((prev) => {
      const next = [...prev, userMsg, replyMsg];
      saveChatMessages(next);
      return next;
    });
  };

  const respond = (userText: string, image?: { dataUrl: string; name: string }) => {
    const userMsg = createUserMessage(
      userText || (image ? 'Поясни цей дорожній знак' : ''),
      image,
    );
    setTyping(true);
    window.setTimeout(() => {
      const reply = image
        ? analyzeSignPhoto(image.name, userText)
        : answerAssistantPrompt(userText);
      const assistantMsg = createAssistantMessage(reply);
      pushExchange(userMsg, assistantMsg);
      setTyping(false);
    }, 450);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text && !pendingImage) return;
    respond(text, pendingImage ?? undefined);
    setInput('');
    setPendingImage(null);
  };

  const handleQuick = (prompt: string) => {
    setInput('');
    setPendingImage(null);
    respond(prompt);
  };

  const onPickFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 8 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage({
        dataUrl: String(reader.result),
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    clearChatMessages();
    setMessages([]);
    setPendingImage(null);
    setInput('');
  };

  return (
    <>
      <DashboardHeader
        title="AI Assistant"
        subtitle="Ask about road situations, upload a sign photo, and jump into Traffic Rules."
      />

      <div className={styles.page}>
        <LearningJourney
          variant="news"
          title="Connected learning"
          subtitle="AI Assistant → Traffic Rules → Practice Test · or Video → AI Analysis"
          steps={[
            ...NEWS_LEARNING_JOURNEY.slice(0, 2),
            { type: 'ai-assistant', href: '/assistant', label: 'AI chat' },
          ]}
        />

        <div className={styles.layout}>
          <section className={styles.chatPanel}>
            <div className={styles.chatHeader}>
              <div>
                <h2 className={styles.chatTitle}>Driver chat</h2>
                <p className={styles.chatHint}>
                  Answers always include a Traffic Rule link.
                </p>
              </div>
              <button type="button" className={styles.clearBtn} onClick={handleClear}>
                Clear
              </button>
            </div>

            <div className={styles.messages} ref={listRef}>
              {messages.length === 0 ? (
                <div className={styles.empty}>
                  <p className={styles.emptyTitle}>Спитайте AI-помічника</p>
                  <p className={styles.emptyText}>
                    Наприклад: «Хто має перевагу на цьому перехресті?» або
                    завантажте фото знака.
                  </p>
                </div>
              ) : null}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.bubble} ${
                    msg.role === 'user' ? styles.userBubble : styles.aiBubble
                  }`}
                >
                  {msg.imageDataUrl ? (
                    <div className={styles.preview}>
                      <Image
                        src={msg.imageDataUrl}
                        alt={msg.imageName ?? 'Uploaded sign'}
                        fill
                        className={styles.previewImage}
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <div className={styles.bubbleText}>{renderText(msg.text)}</div>

                  {msg.role === 'assistant' ? (
                    <div className={styles.bubbleActions}>
                      <AssistantFavoriteButton message={msg} />
                    </div>
                  ) : null}

                  {msg.rules && msg.rules.length > 0 ? (
                    <div className={styles.rules}>
                      {msg.rules.map((rule) => (
                        <div key={rule.id} className={styles.ruleCard}>
                          <p className={styles.ruleCode}>Traffic Rule {rule.code}</p>
                          <p className={styles.ruleTitle}>{rule.title}</p>
                          <div className={styles.ruleActions}>
                            <Link href={rule.href} className={styles.ruleLink}>
                              Read official rule →
                            </Link>
                            <a
                              href={rule.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.officialLink}
                            >
                              zakon.rada.gov.ua ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {msg.relatedLinks && msg.relatedLinks.length > 0 ? (
                    <div className={styles.related}>
                      {msg.relatedLinks.map((link) => (
                        <Link
                          key={link.href + link.label}
                          href={link.href}
                          className={styles.relatedChip}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {msg.followUps && msg.followUps.length > 0 ? (
                    <div className={styles.followUps}>
                      {msg.followUps.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={styles.followBtn}
                          onClick={() => handleQuick(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              {typing ? (
                <div className={`${styles.bubble} ${styles.aiBubble}`}>
                  <p className={styles.typing}>AI is thinking…</p>
                </div>
              ) : null}
            </div>

            {pendingImage ? (
              <div className={styles.pending}>
                <div className={styles.pendingThumb}>
                  <Image
                    src={pendingImage.dataUrl}
                    alt=""
                    fill
                    className={styles.previewImage}
                    unoptimized
                  />
                </div>
                <div className={styles.pendingMeta}>
                  <strong>Sign photo ready</strong>
                  <span>{pendingImage.name}</span>
                </div>
                <button
                  type="button"
                  className={styles.pendingRemove}
                  onClick={() => setPendingImage(null)}
                >
                  ✕
                </button>
              </div>
            ) : null}

            <div className={styles.composer}>
              <button
                type="button"
                className={styles.photoBtn}
                onClick={() => fileRef.current?.click()}
                aria-label="Upload road sign photo"
                title="Upload road sign photo"
              >
                📷
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className={styles.hiddenInput}
                onChange={(e) => {
                  onPickFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
              <input
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Хто має перевагу на цьому перехресті?"
                aria-label="Message"
              />
              <button
                type="button"
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={typing || (!input.trim() && !pendingImage)}
              >
                Send
              </button>
            </div>
          </section>

          <aside className={styles.sidebar}>
            <section className={styles.widget}>
              <h2 className={styles.widgetTitle}>Швидкі запити</h2>
              <div className={styles.quickList}>
                {QUICK_PROMPTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.quickBtn}
                    onClick={() => handleQuick(item.prompt)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.widget}>
              <h2 className={styles.widgetTitle}>Фото знака</h2>
              <p className={styles.widgetText}>
                Зробіть фото дорожнього знака, надішліть у чат і отримайте
                пояснення з посиланням на Traffic Rules.
              </p>
              <button
                type="button"
                className={styles.uploadCta}
                onClick={() => fileRef.current?.click()}
              >
                Upload sign photo
              </button>
            </section>

            <section className={styles.widget}>
              <h2 className={styles.widgetTitle}>Працює разом із</h2>
              <ul className={styles.stackList}>
                <li>
                  <Link href="/traffic-rules">📋 Traffic Rules</Link>
                </li>
                <li>
                  <Link href="/tests">✅ Practice Tests</Link>
                </li>
                <li>
                  <Link href="/ai-analysis">🎥 Video Analysis</Link>
                </li>
                <li>
                  <Link href="/news">📰 News</Link>
                </li>
              </ul>
            </section>

            <LearningJourney
              variant="video"
              title="From video"
              subtitle="VIDEO → AI Analysis → Traffic Rules → Practice Test"
              steps={VIDEO_LEARNING_JOURNEY}
            />
          </aside>
        </div>

        <DashboardFooter />
      </div>
    </>
  );
}
