'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Client, Session, LifestyleTag } from '@/lib/types';
import { Select } from './Select';
import { TextField } from './TextField';
import { TextArea } from './TextArea';
import { RadioGroup } from './RadioGroup';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';

interface NewSessionFormState {
  clientId: string;
  date: string;
  menu: string;
  hrvBefore: string;
  hrvAfter: string;
  preFatigue: string;
  preStiffness: string;
  preHeadHeaviness: string;
  preStress: string;
  preSleepQualityWeek: string;
  preSleepHoursLastNight: string;
  preBedtime: string;
  preWakeTime: string;
  preLifestyleTags: LifestyleTag[];
  preLifestyleMemo: string;
  mainConcern: string;
  postHeadLightness: string;
  postBodyRelax: string;
  postMentalRelax: string;
  postSatisfaction: string;
  postComment: string;
  postActionNote: string;
}

const sleepQualityOptions = [
  { value: '1', label: '1: かなり悪い' },
  { value: '2', label: '2: 少し悪い' },
  { value: '3', label: '3: どちらともいえない' },
  { value: '4', label: '4: 少し良い' },
  { value: '5', label: '5: かなり良い' },
];

const sleepHoursOptions = [
  '4時間未満',
  '4〜5時間',
  '5〜6時間',
  '6〜7時間',
  '7〜8時間',
  '8時間以上',
].map((label) => ({ value: label, label }));

const bedtimeOptions = [
  '22時以前',
  '22〜24時',
  '24〜1時',
  '1時以降',
].map((label) => ({ value: label, label }));

const wakeTimeOptions = [
  '6時以前',
  '6〜7時',
  '7〜8時',
  '8時以降',
].map((label) => ({ value: label, label }));

const lifestyleItems: { tag: LifestyleTag; label: string }[] = [
  { tag: 'smartphone', label: '寝る前にスマホ・SNSを見る' },
  { tag: 'late_caffeine', label: '15時以降にカフェインをとる' },
  { tag: 'alcohol', label: '就寝前のお酒' },
  { tag: 'late_work', label: '寝る直前まで仕事・家事' },
  { tag: 'bath', label: '湯船につかる習慣がある' },
  { tag: 'stretch', label: 'ストレッチやセルフケアをしている' },
  { tag: 'no_routine', label: '特に決まった過ごし方はない' },
];

function createInitialForm(clientId: string | undefined): NewSessionFormState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    clientId: clientId ?? '',
    date: today,
    menu: '森の深眠スパ90分',
    hrvBefore: '',
    hrvAfter: '',
    preFatigue: '7',
    preStiffness: '6',
    preHeadHeaviness: '5',
    preStress: '6',
    preSleepQualityWeek: '3',
    preSleepHoursLastNight: '5〜6時間',
    preBedtime: '24〜1時',
    preWakeTime: '6〜7時',
    preLifestyleTags: ['smartphone'],
    preLifestyleMemo: '',
    mainConcern: '',
    postHeadLightness: '8',
    postBodyRelax: '8',
    postMentalRelax: '7',
    postSatisfaction: '5',
    postComment: '',
    postActionNote: '',
  };
}

function toNumber(value: string, fallback = 0): number {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

export function NewSessionFlow() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // ❗ 最初から「空のフォーム状態」を持つ（nullを使わない）
  const [form, setForm] = useState<NewSessionFormState>(() =>
    createInitialForm(undefined),
  );

  // 初回ロード時に顧客とセッションを取得
  useEffect(() => {
    async function load() {
      const [cRes, sRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/sessions'),
      ]);
      const cData = (await cRes.json()) as Client[];
      const sData = (await sRes.json()) as Session[];
      setClients(cData);
      setSessions(sData);

      // まだ顧客が入っていなければ、先頭顧客で初期化
      if (!form.clientId && cData[0]?.id) {
        setForm((prev) => createInitialForm(cData[0].id));
      }
    }
    void load();
    // form は依存に入れない（初期化だけを想定）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 型安全な汎用フィールド変更ハンドラ
  const handleChange = <K extends keyof NewSessionFormState>(
    field: K,
    value: NewSessionFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleLifestyleTag = (tag: LifestyleTag) => {
    setForm((prev) => {
      const exists = prev.preLifestyleTags.includes(tag);
      return {
        ...prev,
        preLifestyleTags: exists
          ? prev.preLifestyleTags.filter((t) => t !== tag)
          : [...prev.preLifestyleTags, tag],
      };
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.clientId || !form.menu) {
        alert('顧客とメニューを入力してください。');
        return;
      }
    }
    if (step === 2) {
      if (!form.preSleepQualityWeek) {
        alert('ここ1週間の睡眠の調子を選択してください。');
        return;
      }
    }
    setStep((prev) => (prev === 3 ? prev : (prev + 1) as 1 | 2 | 3));
  };

  const handleBack = () => {
    if (step === 1) {
      router.push('/sessions');
      return;
    }
    setStep((prev) => (prev === 1 ? prev : (prev - 1) as 1 | 2 | 3));
  };

  const handleSubmit = async () => {
    if (!form.clientId) {
      alert('顧客が選択されていません。');
      return;
    }
    setLoading(true);

    try {
      const visitNumber =
        sessions.filter((s) => s.clientId === form.clientId).length + 1;

      const newSession: Session = {
        id: `s-${Date.now()}`,
        clientId: form.clientId,
        date: form.date || new Date().toISOString().slice(0, 10),
        menu: form.menu,
        visitNumber,
        hrvBefore: form.hrvBefore ? toNumber(form.hrvBefore) : undefined,
        hrvAfter: form.hrvAfter ? toNumber(form.hrvAfter) : undefined,
        pre: {
          fatigue: toNumber(form.preFatigue),
          stiffness: toNumber(form.preStiffness),
          headHeaviness: toNumber(form.preHeadHeaviness),
          stress: toNumber(form.preStress),
          sleepQualityWeek: toNumber(form.preSleepQualityWeek, 3),
          sleepHoursLastNight: form.preSleepHoursLastNight,
          usualBedtime: form.preBedtime,
          usualWakeTime: form.preWakeTime,
          lifestyleTags: form.preLifestyleTags,
          lifestyleMemo: form.preLifestyleMemo || undefined,
          mainConcern: form.mainConcern || undefined,
        },
        post: {
          headLightness: toNumber(form.postHeadLightness),
          bodyRelax: toNumber(form.postBodyRelax),
          mentalRelax: toNumber(form.postMentalRelax),
          satisfaction: toNumber(form.postSatisfaction, 4),
          comment: form.postComment || undefined,
          actionNote: form.postActionNote || undefined,
        },
      };

      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      });

      if (!res.ok) {
        throw new Error('保存に失敗しました');
      }

      router.push('/sessions');
    } catch (e) {
      console.error(e);
      alert('セッションの保存中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const clientOptions =
    clients.map((c) => ({
      value: c.id,
      label: `${c.name}（${c.ageLabel}）`,
    })) ?? [];

  const menuOptions = [
    { value: '森の深眠スパ60分', label: '森の深眠スパ60分' },
    { value: '森の深眠スパ90分', label: '森の深眠スパ90分' },
    {
      value: '森の深眠スパ90分＋白髪カラー',
      label: '森の深眠スパ90分＋白髪カラー',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            新規セッション作成
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            施術前の状態と施術後の体感・HRVをセットで記録します。
          </p>
        </div>
        <div className="w-40">
          <ProgressBar label={`ステップ ${step} / 3`} value={step} max={3} />
        </div>
      </div>

      <div className="card p-6 space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-gray-900">
              STEP 1: 基本情報
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="顧客"
                options={clientOptions}
                value={form.clientId}
                onChange={(v) => handleChange('clientId', v)}
                placeholder="顧客を選択"
                required
              />
              <Select
                label="メニュー"
                options={menuOptions}
                value={form.menu}
                onChange={(v) => handleChange('menu', v)}
                placeholder="メニューを選択"
                required
              />
              <TextField
                label="施術日"
                type="text"
                value={form.date}
                onChange={(v) => handleChange('date', v)}
                helperText="例: 2025-01-18 （後で日付ピッカーに差し替え予定）"
              />
              <TextField
                label="今日一番なんとかしたい睡眠の悩み（任意）"
                value={form.mainConcern}
                onChange={(v) => handleChange('mainConcern', v)}
                placeholder="例: 寝つきが悪い / 夜中に目が覚める など"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-gray-900">
              STEP 2: 施術前の体調 &amp; 生活習慣
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-700">
                  今日のからだと頭の状態（0〜10）
                </p>
                <TextField
                  label="全身の疲れ・だるさ"
                  type="number"
                  value={form.preFatigue}
                  onChange={(v) => handleChange('preFatigue', v)}
                  min={0}
                  max={10}
                  helperText="0 = まったく疲れていない / 10 = かなりしんどい"
                />
                <TextField
                  label="肩・首のこり"
                  type="number"
                  value={form.preStiffness}
                  onChange={(v) => handleChange('preStiffness', v)}
                  min={0}
                  max={10}
                  helperText="0 = 気にならない / 10 = とてもつらい"
                />
                <TextField
                  label="頭の重さ・ボーッと感"
                  type="number"
                  value={form.preHeadHeaviness}
                  onChange={(v) => handleChange('preHeadHeaviness', v)}
                  min={0}
                  max={10}
                  helperText="0 = とても軽い / 10 = とても重い"
                />
                <TextField
                  label="メンタルの緊張度"
                  type="number"
                  value={form.preStress}
                  onChange={(v) => handleChange('preStress', v)}
                  min={0}
                  max={10}
                  helperText="0 = とても落ち着いている / 10 = とても緊張している"
                />
              </div>

              <div className="space-y-4">
                <RadioGroup
                  label="ここ1週間の睡眠の調子"
                  options={sleepQualityOptions}
                  value={form.preSleepQualityWeek}
                  onChange={(v) => handleChange('preSleepQualityWeek', v)}
                />
                <Select
                  label="昨晩の睡眠時間"
                  options={sleepHoursOptions}
                  value={form.preSleepHoursLastNight}
                  onChange={(v) => handleChange('preSleepHoursLastNight', v)}
                  placeholder="選択してください"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    label="ふだんの就寝時間"
                    options={bedtimeOptions}
                    value={form.preBedtime}
                    onChange={(v) => handleChange('preBedtime', v)}
                  />
                  <Select
                    label="ふだんの起床時間"
                    options={wakeTimeOptions}
                    value={form.preWakeTime}
                    onChange={(v) => handleChange('preWakeTime', v)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-700">
                寝る前2時間の過ごし方（当てはまるものすべて）
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lifestyleItems.map((item) => (
                  <label
                    key={item.tag}
                    className="flex items-center gap-2 text-xs text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.preLifestyleTags.includes(item.tag)}
                      onChange={() => toggleLifestyleTag(item.tag)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2 focus:ring-offset-0 border-gray-300 rounded"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
              <TextArea
                label="気になる生活習慣・一言メモ（任意）"
                value={form.preLifestyleMemo}
                onChange={(v) => handleChange('preLifestyleMemo', v)}
                rows={3}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-gray-900">
              STEP 3: HRV &amp; 施術後の体感
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-700">
                  HRV測定（Polar H10）
                </p>
                <TextField
                  label="施術前HRV（RMSSD, ms）"
                  type="number"
                  value={form.hrvBefore}
                  onChange={(v) => handleChange('hrvBefore', v)}
                />
                <TextField
                  label="施術後HRV（RMSSD, ms）"
                  type="number"
                  value={form.hrvAfter}
                  onChange={(v) => handleChange('hrvAfter', v)}
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-700">
                  施術を受けたあとの体感
                </p>
                <TextField
                  label="頭の軽さ・スッキリ感（0〜10）"
                  type="number"
                  value={form.postHeadLightness}
                  onChange={(v) => handleChange('postHeadLightness', v)}
                  min={0}
                  max={10}
                />
                <TextField
                  label="からだのラクさ（0〜10）"
                  type="number"
                  value={form.postBodyRelax}
                  onChange={(v) => handleChange('postBodyRelax', v)}
                  min={0}
                  max={10}
                />
                <TextField
                  label="気持ちのリラックス度（0〜10）"
                  type="number"
                  value={form.postMentalRelax}
                  onChange={(v) => handleChange('postMentalRelax', v)}
                  min={0}
                  max={10}
                />
                <RadioGroup
                  label="今回の施術の満足度"
                  options={[
                    { value: '1', label: '1: あまり満足していない' },
                    { value: '2', label: '2: やや物足りない' },
                    { value: '3', label: '3: ふつう' },
                    { value: '4', label: '4: 満足している' },
                    { value: '5', label: '5: とても満足している' },
                  ]}
                  value={form.postSatisfaction}
                  onChange={(v) => handleChange('postSatisfaction', v)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextArea
                label="施術を受けて感じたこと（任意）"
                value={form.postComment}
                onChange={(v) => handleChange('postComment', v)}
                rows={3}
              />
              <TextArea
                label="今日から意識してみたいこと（任意）"
                value={form.postActionNote}
                onChange={(v) => handleChange('postActionNote', v)}
                rows={3}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Button variant="text" size="sm" onClick={handleBack}>
            {step === 1 ? '一覧に戻る' : '戻る'}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/sessions')}
            >
              破棄して一覧に戻る
            </Button>
            {step < 3 ? (
              <Button variant="primary" size="sm" onClick={handleNext}>
                次へ
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                loading={loading}
                onClick={handleSubmit}
              >
                保存してセッションを追加
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
