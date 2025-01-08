import styles from "../styles/global.module.css";

const Button = ({ children, className, type, ...rests }) => {
  const buttonClass = type === "danger" ? styles.danger : styles.button;
  return (
    <button
      className={`${buttonClass} ${className || ""} ${styles.button}`.trim()}
      {...rests}
    >
      {children}
    </button>
  );
};

export default Button;
