type DivProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export function Container({ children, className = '', ...rest }: DivProps) {
  return (
    <div {...rest} className={'rounded-3xl bg-slate-100 p-4 ' + className}>
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
      className={'border border-orange-400 rounded-lg py-1 px-2 ' + className}
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
      className={'border border-orange-400 rounded-lg py-1 px-2 ' + className}
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
        'bg-orange-400 text-white font-medium rounded-lg py-2 px-3 ' + className
      }
    >
      {children}
    </button>
  );
}

export const shimmerStyles =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent relative overflow-hidden';
