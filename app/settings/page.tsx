export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="card p-4 md:p-6 space-y-4">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            設定
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            メニュー名やスコアの目安などは、まずは仮で固定値にしてあります。
            実際の運用に合わせてこの画面から調整していく想定です。
          </p>
        </div>
        <div className="space-y-3 text-xs text-gray-600">
          <p>
            ・メニュー一覧（森の深眠スパ60分 / 90分 / カラー付き など）
          </p>
          <p>
            ・HRVの目安（例: 0〜20: 要ケア / 20〜40: ふつう /
            40以上: 良い状態）
          </p>
          <p>
            ・レポートAI用のテンプレート（Dify / OpenAI API）
          </p>
          <p>
            などを、この画面に追加していくイメージです。
          </p>
        </div>
      </div>
    </div>
  );
}
