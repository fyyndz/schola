import styles from "./auth.module.css";

export default function GoogleButton() {
  return (
    <button
      type="button"
      className={styles.googleButton}
    >
      <span aria-hidden="true" className={styles.googleMark}>
        G
      </span>
      Lanjutkan dengan Google
    </button>
  );
}
