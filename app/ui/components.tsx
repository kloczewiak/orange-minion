type DivProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export function Container({ children, className = '', ...rest }: DivProps) {
  return (
    <div {...rest} className={'rounded-3xl bg-primary/5 p-4 ' + className}>
      {children}
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  children?: React.ReactNode;
};

export function StyledSelect({
  children,
  className = '',
  ...rest
}: SelectProps) {
  return (
    <select
      {...rest}
      className={
        'appearance-none border-0 outline-none border-l-4 border-l-accent bg-primary/10 rounded-lg py-1 px-2 ' +
        className
      }
    >
      {children}
    </select>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  children?: React.ReactNode;
};

export function StyledInput({ children, className = '', ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={
        'appearance-none border-0 outline-none border-l-4 border-l-accent bg-primary/10 rounded-lg py-1 px-2 focus:border-l-[6px] focus:pl-1.5 transition-all ' +
        className
      }
    >
      {children}
    </input>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
};

export function StyledButton({
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={
        // 238 173 133
        'appearance-none bg-primary text-text-900 font-medium rounded-lg py-2 px-3 hover:bg-primary-400 transition-colors ' +
        className
      }
    >
      {children}
    </button>
  );
}

export const shimmerStyles =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent relative overflow-hidden';
