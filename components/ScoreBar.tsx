interface ScoreBarProps {
  score: number;
  maxScore: number;
}

export function ScoreBar({ score, maxScore }: ScoreBarProps) {
  const safeScore = Math.max(0, Math.min(score ?? 0, maxScore));
  const widthPercent = (safeScore / maxScore) * 100;

  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-[width]"
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-gray-500">
        {safeScore} / {maxScore}
      </p>
    </div>
  );
}
