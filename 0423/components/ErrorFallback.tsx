interface Props {
  message?: string;
  onReset?: () => void;
}

export default function ErrorFallback({ message, onReset }: Props) {
  return (
    <div className="error-boundary-box">
      <p className="error-boundary-title">이 영역에서 문제가 발생했습니다.</p>
      <p className="error-boundary-message">
        {message || '알 수 없는 오류입니다. 잠시 후 다시 시도해 주세요.'}
      </p>
      {onReset && (
        <button className="error-boundary-button" onClick={onReset}>
          다시 시도
        </button>
      )}
    </div>
  );
}
