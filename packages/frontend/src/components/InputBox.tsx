import { ClassUtils } from "@utils/CommonUtils";

type InputBoxProp = {
  name: string;
  ref?: React.RefObject<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  pattern?: string;
  value: string | number;
  onChange: Function;
  style?: string;
  error?: string;
};

export const InputBox = ({
  name,
  ref,
  placeholder,
  type,
  maxLength,
  pattern,
  value,
  onChange,
  style,
  error,
}: InputBoxProp) => {
  return (
    <>
      <input
        name={name}
        ref={ref}
        placeholder={placeholder}
        type={type}
        maxLength={maxLength}
        pattern={pattern}
        value={value}
        onChange={(e) => onChange(e)}
        className={ClassUtils.concat(
          "px-3 ring-1 focus:outline-none focus:ring-1 appearance-none bg-transparent rounded-md",
          style!,
          error
            ? "ring-red-500 focus:ring-red-500"
            : "ring-gray-200 focus:ring-purple-600"
        )}
      />
    </>
  );
};
