import styles from './Checkbox.module.css';

interface CheckboxProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  error,
}: CheckboxProps) {
  return (
    <div className={styles.wrap}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={styles.input}
        />
        <span className={styles.box} />
        <span className={styles.text}>{label}</span>
      </label>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
