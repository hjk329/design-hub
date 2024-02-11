/** @jsxImportSource @emotion/react */

import {
  type ElementType,
  forwardRef,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { css } from "@emotion/react";
import {
  type PolymorphicComponentPropsWithRef,
  type PolymorphicRef,
} from "components/polymorphic";

import { InputContext } from "./input-context";
import {
  baseStyle,
  getSizeStyles,
  styleWithAddon,
  styleWithAffix,
} from "./styles";
import { type InputSizeSet, type InputVariant } from "./types";

export interface InputAffixProps {
  suffix?: ReactElement;
  prefix?: ReactElement;
}

export interface InputAddonProps {
  before?: ReactNode;
  after?: ReactNode;
}

type CustomInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  inputSize?: InputSizeSet;
} & { affix?: InputAffixProps } & { addon?: InputAddonProps } & {
  variant?: InputVariant;
};

type InputProps<C extends ElementType = "input"> =
  PolymorphicComponentPropsWithRef<C, CustomInputProps>;

const BaseInput = forwardRef(function BaseInput<
  C extends ElementType = "input",
>(props: InputProps<C>, ref?: PolymorphicRef<C>) {
  const {
    size: inputSize,
    affix,
    addon,
    variant = "outline",
    style,
    ...rest
  } = props;

  const inputContext = useContext(InputContext);

  const styles = useMemo(() => {
    const combiendStyles = [
      baseStyle,
      getSizeStyles(inputSize),
      styleWithAffix(affix),
      styleWithAddon(addon),
    ];
    if (!style) return combiendStyles;
    return [...combiendStyles, css({ ...style })];
  }, [inputSize, style, addon, affix]);

  useEffect(() => {
    inputContext?.setSize(inputSize);
    inputContext?.setVariant(variant);
  }, [inputSize, inputContext, variant]);

  return (
    <>
      {addon?.before && addon.before}
      {affix?.prefix && affix.prefix}
      <input ref={ref} css={styles} {...rest} />
      {affix?.suffix && affix.suffix}
      {addon?.after && addon.after}
    </>
  );
});

export default BaseInput;
