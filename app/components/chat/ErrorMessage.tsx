interface ErrorMessageProps {
  message: string;
  title?: string;
  type?: "error" | "warning";
  actionText?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorMessage({
  message,
  title,
  type = "error",
  actionText = "再試行",
  onRetry,
  onDismiss,
}: ErrorMessageProps) {
  const isError = type === "error";
  const bgColor = isError ? "bg-red-100" : "bg-yellow-100";
  const borderColor = isError ? "border-red-400" : "border-yellow-400";
  const textColor = isError ? "text-red-700" : "text-yellow-700";
  const buttonBg = isError ? "bg-red-600" : "bg-yellow-600";
  const buttonHover = isError ? "hover:bg-red-700" : "hover:bg-yellow-700";

  return (
    <div
      className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded relative`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {title && <strong className="font-bold">{title}: </strong>}
          <span className="block sm:inline">{message}</span>
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`rounded ${buttonBg} px-4 py-2 text-white ${buttonHover} whitespace-nowrap`}
            >
              {actionText}
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-gray-500 hover:text-gray-700"
              aria-label="閉じる"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                role="img"
                aria-labelledby="close-icon-title"
              >
                <title id="close-icon-title">閉じる</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
