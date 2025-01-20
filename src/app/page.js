'use client'
import { useToast } from "./components/toasts/toast-holder";

export default function Home() {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('Success!', 'Your operation was successful.', false, true, 3)}>
        Show Success Toast
      </button>
      <button onClick={() => showToast('Error!', 'Something went wrong.', true)}>
        Show Error Toast
      </button>
    </div>
  );
}
