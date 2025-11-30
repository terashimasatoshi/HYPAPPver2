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
  // 顧客関連
  clientId: string; // 既存顧客のID（新規のときは一旦空でOK）

  // 新規顧客登録用
  newClientName: string;
  newClientAgeLabel: string;       // 年代（例: 40代）
  newClientGender: string;         // 性別
  newClientFirstVisitDate: string; // 初回来店日
  newClientCustomerNumber: string; // 顧客番号

  // 担当スタッフ
  staffName: string;

  // 基本情報
  date: string;
  menu: string;

  // HRV / HYP 関連
  hypBefore: string;       // 施術前HYP測定結果
  hrvBefore: string;       // 施術前RMSSD
  hrvBeforeBpm: string;    // 施術前bpm
  hrvAfter: string;        // 施術後RMSSD
  hrvAfterBpm: string;     // 施術後bpm

  // 施術前の状態
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

  // 施術後の体感
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

const genderOptions = [
  { value: '女性', label: '女性' },
  { value: '男性', label: '男性' },
  { value: 'その他', label: 'その他' },
];

const staffOptions = [
  { value: '寺島', label: '寺島' },
  { value: 'スタッフA', label: 'スタッフA' },
  { value: 'スタッフB', label: 'スタッフB' },
];

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
    newClientName: '',
    newClientAgeLabel: '',
    newClientGender: '',
    newClientFirstVisitDate: today,
    newClientCustomerNumber: '',

    staffName: staffOptions[0]?.value ?? '',

    date: today,
    menu: '森の深眠スパ90分',

    hypBefore: '',
    hrvBefore: '',
    hrvBeforeBpm: '',
    hrvAfter: '',
    hrvAfterBpm: '',

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

type ClientMode = 'existing' | 'new';

export function NewSessionFlow() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [clientMode, setClientMode] = useState<ClientMode>('existing');

  const [form, setForm] = useState<NewSessionFormState>(() =>
    createInitialForm(undefined),
  );

  // 初回ロード: 顧客とセッションを取得
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

      // 顧客リストがあって、まだclientIdが空なら、先頭顧客をセット
      if (!form.clientId && cData[0]?.id) {
        setForm((prev) => createInitialForm(cData[0].id));
      }
    }
    void load();
    // form を依存に入れると初期化がループするので空配列のまま
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 共通フィールド更新
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
      if (!form.menu) {
        alert('メニューを選択してください。');
        return;
      }
      if (!form.staffName) {
        alert('担当スタッフを選択してください。');
        return;
      }

      if (clientMode === 'existing') {
        if (!form.clientId) {
          alert('顧客を選択してください。');
          return;
        }
      } else {
        // 新規顧客必須項目チェック
        if (
          !form.newClientName ||
          !form.newClientAgeLabel ||
          !form.newClientGender ||
          !form.newClientFirstVisitDate ||
          !form.newClientCustomerNumber
        ) {
          alert(
            '新規顧客の「名前・年代・性別・初回来店日・顧客番号」をすべて入力してください。',
          );
          return;
        }
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
    setLoading(true);

    try {
      let clientId = form.clientId;

      // ▼ 新規顧客モードのときは /api/clients に登録してIDを取得
      if (clientMode === 'new') {
        const resClient = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.newClientName,
            ageLabel: form.newClientAgeLabel,
            gender: form.newClientGender,
            firstVisitDate: form.newClientFirstVisitDate,
            customerNumber: form.newClientCustomerNumber,
          }),
        });

        if (!resClient.ok) {
          throw new Error('新規顧客の保存に失敗しました。');
        }

        const created = (await resClient.json()) as Client;
        clientId = created.id;
      }

      if (!clientId) {
        alert('顧客情報の取得に失敗しました。');
        return;
      }

      const visitNumber =
        sessions.filter((s) => s.clientId === clientId).length + 1;

      const newSession: Session = {
        id: `s-${Date.now()}`,
        clientId,
        date: form.date || new Date().toISOString().slice(0, 10),
        menu: form.menu,
        visitNumber,
        staffName: form.staffName || undefined,

        // HRV / HYP
        hrvBefore: form.hrvBefore ? toNumber(form.hrvBefore) : undefined,
        hrvAfter: form.hrvAfter ? toNumber(form.hrvAfter) : undefined,
        hrBefore: form.hrvBeforeBpm
          ? toNumber(form.hrvBeforeBpm)
          : undefined,
        hrAfter: form.hrvAfterBpm ? toNumber(form.hrvAfterBpm) : undefined,
        hypBefore: form.hypBefore ? toNumber(form.hypBefore) : undefined,

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
        throw new Error('セッションの保存に失敗しました。');
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
            施術前の状態と施術前HYP・HRV、施術後の体感をまとめて記録します。
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
              STEP 1: 基本情報 &amp; 顧客情報
            </h2>

            {/* 顧客の選択モード */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">
                顧客の選択
              </p>
              <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setClientMode('existing')}
                  className={`px-3 py-1 rounded-md ${
                    clientMode === 'existing'
                      ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100'
                      : 'text-gray-500'
                  }`}
                >
                  既存のお客様から選ぶ
                </button>
                <button
                  type="button"
                  onClick={() => setClientMode('new')}
                  className={`px-3 py-1 rounded-md ${
                    clientMode === 'new'
                      ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100'
                      : 'text-gray-500'
                  }`}
                >
                  新規のお客様を登録
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientMode === 'existing' ? (
                <Select
                  label="顧客"
                  options={clientOptions}
                  value={form.clientId}
                  onChange={(v) => handleChange('clientId', v)}
                  placeholder="顧客を選択"
                  required
                />
              ) : (
                <>
                  <TextField
                    label="お客様のお名前"
                    value={form.newClientName}
                    onChange={(v) => handleChange('newClientName', v)}
                    placeholder="例: 田中さん"
                  />
                  <TextField
                    label="年代"
                    value={form.newClientAgeLabel}
                    onChange={(v) => handleChange('newClientAgeLabel', v)}
                    placeholder="例: 40代"
                  />
                  <Select
                    label="性別"
                    options={genderOptions}
                    value={form.newClientGender}
                    onChange={(v) => handleChange('newClientGender', v)}
                    placeholder="性別を選択"
                  />
                  <TextField
                    label="初回来店日"
                    type="text"
                    value={form.newClientFirstVisitDate}
                    onChange={(v) =>
                      handleChange('newClientFirstVisitDate', v)
                    }
                    helperText="例: 2025-01-18"
                  />
                  <TextField
                    label="顧客番号"
                    value={form.newClientCustomerNumber}
                    onChange={(v) =>
                      handleChange('newClientCustomerNumber', v)
                    }
                    placeholder="例: 0001"
                  />
                </>
              )}

              <Select
                label="メニュー"
                options={menuOptions}
                value={form.menu}
                onChange={(v) => handleChange('menu', v)}
                placeholder="メニューを選択"
                required
              />
              <Select
                label="担当スタッフ"
                options={staffOptions}
                value={form.staffName}
                onChange={(v) => handleChange('staffName', v)}
                placeholder="担当スタッフを選択"
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
              STEP 3: HYP / HRV &amp; 施術後の体感
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-700">
                  施術前・施術後の測定
                </p>
                <TextField
                  label="施術前 HYP測定結果"
                  type="number"
                  value={form.hypBefore}
                  onChange={(v) => handleChange('hypBefore', v)}
                  helperText="お使いのHYP測定器の数値をそのまま入力"
                />
                <TextField
                  label="施術前HRV（RMSSD, ms）"
                  type="number"
                  value={form.hrvBefore}
                  onChange={(v) => handleChange('hrvBefore', v)}
                />
                <TextField
                  label="施術前 心拍数（bpm）"
                  type="number"
                  value={form.hrvBeforeBpm}
                  onChange={(v) => handleChange('hrvBeforeBpm', v)}
                />
                <TextField
                  label="施術後HRV（RMSSD, ms）"
                  type="number"
                  value={form.hrvAfter}
                  onChange={(v) => handleChange('hrvAfter', v)}
                />
                <TextField
                  label="施術後 心拍数（bpm）"
                  type="number"
                  value={form.hrvAfterBpm}
                  onChange={(v) => handleChange('hrvAfterBpm', v)}
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
