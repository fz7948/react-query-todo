import { TextField } from "@mui/material";

type Props = {
  dataCy?: string;
  onFocus: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void;
  type: string;
  name: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMsg: string;
};

export default function TextInput(props: Props) {
  const { dataCy, onFocus, type, name, label, onChange, errorMsg } = props;

  return (
    <section className="flex flex-col">
      <TextField
        data-cy={dataCy}
        onFocus={(e) => onFocus(e)}
        className="w-[20rem]"
        type={type}
        name={name}
        size="medium"
        label={label}
        onChange={onChange}
      />
      <span className="self-start text-[10px] font-[600] pl-2 pt-1 text-[#B22212]">
        {errorMsg}
      </span>
    </section>
  );
}
