interface ErrorInfo {
  title: string;
  message: string;
  actionText: string;
}

export function getErrorMessage(error: Error): ErrorInfo {
  const status = (error as { status?: number }).status;
  const message = error.message || "不明なエラーが発生しました";

  switch (status) {
    case 401:
      return {
        title: "認証エラー",
        message:
          "APIキーが無効または設定されていません。環境変数を確認してください。",
        actionText: "設定を確認",
      };

    case 429:
      return {
        title: "レート制限",
        message:
          "リクエストが多すぎます。しばらく待ってから再試行してください。",
        actionText: "後で再試行",
      };

    case 400:
      return {
        title: "入力エラー",
        message: "入力内容に問題があります。メッセージを確認してください。",
        actionText: "修正して再試行",
      };

    case 500:
      return {
        title: "サーバーエラー",
        message:
          "サーバーで問題が発生しました。しばらく待ってから再試行してください。",
        actionText: "再試行",
      };

    case 502:
      return {
        title: "接続エラー",
        message:
          "AIサービスへの接続に失敗しました。しばらく待ってから再試行してください。",
        actionText: "再試行",
      };

    case 504:
      return {
        title: "タイムアウト",
        message: "リクエストがタイムアウトしました。再試行してください。",
        actionText: "再試行",
      };

    default:
      return {
        title: "エラー",
        message: message,
        actionText: "再試行",
      };
  }
}
