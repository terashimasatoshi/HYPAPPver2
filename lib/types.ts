export interface Client {
  id: string;
  name: string;
  /** 年代 例: "40代" */
  ageLabel: string;
  /** 性別 例: "女性" / "男性" / "その他" など */
  gender?: string;
  /** 初回来店日 (ISO: 2025-01-18 のような形式) */
  firstVisitDate?: string;
  /** ISO: 2025-01-18 みたいな形式を想定（最終来店日） */
  lastVisit: string;
  /** 来店回数 */
  visitCount: number;
  /** 顧客番号（サロン内で使う管理番号） */
  customerNumber?: string;
}

export type LifestyleTag =
  | 'smartphone'
  | 'late_caffeine'
  | 'alcohol'
  | 'late_work'
  | 'bath'
  | 'stretch'
  | 'no_routine';

export interface PreSessionCheck {
  /** 全身の疲れ・だるさ (0–10) */
  fatigue: number;
  /** 肩・首のこり (0–10) */
  stiffness: number;
  /** 頭の重さ・ボーッと感 (0–10) */
  headHeaviness: number;
  /** メンタルの緊張度 (0–10) */
  stress: number;
  /** ここ1週間の睡眠の調子 (1–5) */
  sleepQualityWeek: number;
  /** 昨晩の睡眠時間（ラベルでOK） */
  sleepHoursLastNight: string;
  /** ふだんの就寝時間カテゴリ */
  usualBedtime: string;
  /** ふだんの起床時間カテゴリ */
  usualWakeTime: string;
  lifestyleTags: LifestyleTag[];
  lifestyleMemo?: string;
  /** 今日いちばん何とかしたい悩み */
  mainConcern?: string;
}

export interface PostSessionFeeling {
  /** 頭の軽さ (0–10) */
  headLightness: number;
  /** からだのラクさ (0–10) */
  bodyRelax: number;
  /** 気持ちのリラックス度 (0–10) */
  mentalRelax: number;
  /** 施術の満足度 (1–5) */
  satisfaction: number;
  comment?: string;
  actionNote?: string;
}

export interface Session {
  id: string;
  clientId: string;
  /** 来店日 (ISO文字列) */
  date: string;
  menu: string;
  /** 何回目の来店か */
  visitNumber: number;

  /** 担当スタッフ名（任意） */
  staffName?: string;

  /** 施術前HRV（RMSSD） */
  hrvBefore?: number;
  /** 施術後HRV（RMSSD） */
  hrvAfter?: number;
  /** 施術前の平均心拍数（bpm） */
  hrBefore?: number;
  /** 施術後の平均心拍数（bpm） */
  hrAfter?: number;
  /** 施術前のHYP測定値（必要な場合のみ） */
  hypBefore?: number;

  pre: PreSessionCheck;
  post: PostSessionFeeling;
}
