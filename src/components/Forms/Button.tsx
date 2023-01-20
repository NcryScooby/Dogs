import styles from "./Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
};

const Button = ({
  children,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...props} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
